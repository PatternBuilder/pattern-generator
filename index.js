"use strict";

// Add the polyfill for ES8 support: http://babeljs.io/docs/usage/polyfill
require( "babel-polyfill" );

// Pull in the prompt builder functions
const buildPrompts = require( "./prompting.js" ),
    yeoman = require( "yeoman-generator" ),
    util = require( "util" ),
    chalk = require( "chalk" ),
    yosay = require( "yosay" );

String.prototype.toUnderscore = function () {
  return this.trim().toLowerCase().replace( /[-| |,|.|/]/g, "_" );
};

String.prototype.toSentenceCase = function () {
  return this.charAt( 0 ).toUpperCase() + this.trim().toLowerCase().slice( 1 ).replace( /[-|_]/g, " " );
};

String.prototype.toLowCase = function () {
  return this.trim().toLowerCase().replace( /[-|_]/g, " " );
};

String.prototype.toDash = function () {
  return this.trim().toLowerCase().replace( /[_| ]/g, "-" );
};

// These are all the options available for use in the JSON schemas
let string_options = [ "type", "format" ],
    number_options = [ "min", "max", "grid" ],
    array_options = [ "refs", "dropdown_items" ],
    boolean_options = [ "hidden", "collapsed", "wysiwyg", "required", "dropdown" ],
    supported_options = string_options.concat( number_options, boolean_options ),
    ref_templates = [ "header", "body", "aside", "footer" ];

const getParentName = function ( child_name, obj ) {
    for ( const [ key, value ] of Object.entries( obj ) ) {
        if ( typeof value.children !== "undefined" ) {
            if ( Object.keys( value.children ).includes( child_name ) ) {
                return value.name;
            }
        }
    }
    return null;
};

const setEmptyValuesByProp = function ( property, objRef ) {
    if ( string_options.includes( property ) ) {
        objRef[ property ] = null;
    } else if ( number_options.includes( property ) ) {
        objRef[ property ] = null;
    } else if ( array_options.includes( property ) ) {
        objRef[ property ] = [];
    } else if ( boolean_options.includes( property ) ) {
        // WYSIWYG is the only boolean value that defaults to true
        objRef[ property ] = ( property === "wysiwyg" );
    }
};

const createObject = function( name, context, obj, element_list ) {
    // Add the element name to the elements object
    obj[ name ] = {
        "name": name,
        "context": context,
        "required_list": [],
        "options": {}
    };
    // Initialize an empty child names array
    obj[ name ][ name + "_elements" ] = [];

    // Add this child's name to the list for the parent object
    element_list.push( name );
};

const setProperties = function ( answers, objectRef ) {
    for( let key in answers ) {
        let keyData = key.split( "_" ),
            name = keyData[ 0 ],
            data_type = keyData.slice( 1 ).join( "_" );
        // Check that the object contains this item
        if ( typeof objectRef[ name ] !== "undefined" ) {
            // Check if option object exists
            if ( typeof objectRef[ name ].options === "undefined" ) {
                objectRef[ name ].options = {};
            }

            // Add the option selections to the parent's option object
            if ( supported_options.includes( data_type ) ) {
                objectRef[ name ].options[ data_type ] = answers[ key ];
            }

            // Add the array values to the parent's object
            if ( array_options.includes( data_type ) ) {
                objectRef[ name ][ data_type ] = answers[ key ];
            }
        }
    }
};

const buildObject = function ( answers, element, required_list ) {
    // Iterate over supported options
    supported_options.forEach( function( opt ) {
        // If they are not defined, give them the appropriate empty value
        if ( typeof element.options[ opt ] === "undefined" ) {
            setEmptyValuesByProp( opt, element.options );
        }
    } );
    // Iterate over supported array values
    array_options.forEach( function( opt ) {
        // If they are not defined, give them the appropriate empty value
        if ( typeof element[ opt ] === "undefined" ) {
            setEmptyValuesByProp( opt, element );
        }
    } );
    // If the property is set to true, add to the required array
    if ( element.options.required) {
        required_list.push( element.name );
    }

    // Initialize an empty children object
    element.children = {};
};

// Start the yeoman generator prompts
module.exports = yeoman.Base.extend( {
    prompting: function() {
        const done = this.async();
        // Have Yeoman greet the user.
        this.log( yosay( "Welcome to the " + chalk.red( "WebRH" ) + " generator!" ) );

        this.prompt( buildPrompts.init(), function( answers ) {
            //-- Set global properties
            this.props = answers;
            // Initialize the custom elements array
            this.props.elements = {};
            // Create a list of the required properties
            this.props.elements.required_list = [];
            let questions = [];

            //-- GET THE REFS for the different sections
            if ( typeof this.props.template_elements !== "undefined" ) {
                if ( [ "layout", "pattern", "pattern_group" ].includes( this.props.template_type ) ) {
                    ref_templates.forEach( function( section, idx ) {
                        if ( this.props.template_elements.includes( section ) ) {
                            questions = questions.concat( buildPrompts.refs( section) );
                        }
                    }.bind( this ) );
                }
            } else {
                // If no template elements exist, initialize an empty array in the properties object
                this.props.template_elements = [];
            }

            if ( this.props.template_type === "page" ) {
                // Page type automatically gets header and body refs, no selection necessary
                [ "header", "body" ].forEach( function( section, idx ) {
                    questions = questions.concat( buildPrompts.refs( section) );
                }.bind( this ) );
            }

            // -- GET THE CUSTOM ELEMENT definitions and settings

            // For the content and custom sections, build the data template out
            [ "content", "custom" ].forEach( function( context, idx ) {
                // Check if the content and custom elements arrays exist, initialize to empty
                if ( typeof this.props.elements[ context + "_elements" ] === "undefined" ) {
                    this.props.elements[ context + "_elements" ] = [];
                    this.props.elements[ "required_" + context + "_list" ] = [];
                }

                // Add any custom elements to the new array along with their context information
                // Iterate over the provided list and build the dataset
                if ( typeof answers[ context + "_elements" ] !== "undefined" ) {
                    answers[ context + "_elements" ].forEach( function( element, idx ) {
                        if ( typeof this.props.elements[ context + "_elements" ] === "undefined" ) {
                            this.props.elements[ context + "_elements" ] = [];
                        }
                        createObject( element, context, this.props.elements, this.props.elements[ context + "_elements" ] );

                        // Set up the prompts for collecting the data types and children elements
                        questions = questions.concat( buildPrompts.custom( element, "", 12, 1 ) );
                    }.bind( this ) );
                }
            }.bind( this ) );

            if ( questions.length > 0 ) {
                this.prompt( questions, function( answers ) {
                    let baseGrid = 12,
                        child_questions = [];
                    for( let key in answers ) {
                        if ( key.endsWith( "_refs" ) ) {
                            this.props[ key ] = answers[ key ];
                        }
                    }

                    // Set the properties for the new elements
                    setProperties( answers, this.props.elements );

                    [ "content", "custom" ].forEach( function( context, idx ) {
                        this.props.elements[ context + "_elements" ].forEach( function( parent_name, idx ) {
                            buildObject( answers, this.props.elements[ parent_name ], this.props.elements[ "required_" + context + "_list" ] );

                            if ( typeof answers[ parent_name + "_children" ] !== "undefined" ) {
                                answers[ parent_name + "_children" ].forEach( function( child_name, c_idx ) {
                                    // Add the child's name to the elements object
                                    if ( typeof this.props.elements[ parent_name ][ parent_name + "_elements" ] === "undefined" ) {
                                        this.props.elements[ parent_name ][ parent_name + "_elements" ] = [];
                                    }
                                    createObject( child_name, parent_name, this.props.elements[ parent_name ].children, this.props.elements[ parent_name ][ parent_name + "_elements" ] );
                                    baseGrid = ( this.props.elements[ parent_name ].options.grid !== null ) ? this.props.elements[ parent_name ].options.grid : 12;
                                    child_questions = child_questions.concat( buildPrompts.custom( child_name, parent_name, baseGrid, 2 ) );
                                }.bind( this ) );
                            }
                        }.bind( this ) );
                    }.bind( this ) );

                    if ( child_questions.length > 0 ) {
                        this.prompt( child_questions, function( child_answers ) {
                            let child = "",
                                parent;
                            for( let key in child_answers ) {
                                let newName = key.split( "_" )[ 0 ];
                                if ( newName !== child ) {
                                    child = newName;
                                    parent = getParentName( child, this.props.elements );

                                    if ( parent !== null ) {
                                        let context = this.props.elements[ parent ].context;
                                        if ( this.props.elements[ parent ][ parent + "_elements" ].includes( child ) ) {
                                            // // Set the properties for the new elements
                                            setProperties( child_answers, this.props.elements[ parent ].children );
                                            buildObject( child_answers, this.props.elements[ parent ].children[ child ], this.props.elements[ parent ].required_list );
                                            // If a child element is required, make the parent object required too (just once though)
                                            if ( this.props.elements[ parent ].required_list.length > 0 && !this.props.elements[ "required_" + context + "_list" ].includes( parent ) ) {
                                                if ( context !== "custom" ) {
                                                    this.props.elements[ "required_" + context + "_list" ].push( parent );
                                                    this.props.elements.required_list.push( context );
                                                } else if ( !this.props.elements.required_list.includes( parent ) ){
                                                    this.props.elements.required_list.push( parent );
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            done();
                        }.bind( this ) );
                    } else {
                        done();
                    }
                }.bind( this ) );
            } else {
                done();
            }
        }.bind( this ) );
    },
    writing: {
        app: function() {
            let path,
                template = this.props.template_type;

            // DEBUG: Write the object to the log
            try {
                this.fs.write( "yeoman.log", util.inspect( this.props, { showHidden: false, depth: 4 } ) );
            } catch ( error ) {
                console.log( error );
            }

            // Concatenate the final custom list required fields with the required list
            this.props.elements.required_list = this.props.elements.required_list.concat( this.props.elements.required_custom_list );
            if ( this.props.elements.required_content_list.length > 0 ) {
                this.props.elements.required_list.push( "content" );
            }

            // Initialize empty arrays for unset settings
            [ "template_elements", "config_options", "background_options", "content_elements", "custom_elements" ].forEach( function( type, idx ) {
                if ( typeof this.props[ type ] === "undefined" ) {
                    this.props[ type ] = [];
                }
            }.bind( this ) );

            // Get the appropriate template and path
            switch ( template ) {
                case "pattern_group":
                    template = "pattern";
                    path = "src/library/pattern_groups/" + this.props.name.toUnderscore();
                    break;
                case "page":
                    template = "full_page";
                    path = "src/library/full_page/" + this.props.name.toUnderscore();
                    break;
                default:
                    path = "src/library/" + template + "s/" + this.props.name.toUnderscore();
                    break;
            }
            // Copy templates and pass in the data from the yeoman tool
            try {
                // Print this template for all element types except atoms that are only twig templates
                if ( template !== "atom" || ( template === "atom" && this.props.template_style.includes( "json/entity" ) ) ) {
                    this.fs.copyTpl( this.templatePath( "element/api/_element.json" ), this.destinationPath( path + "/api/" + this.props.name.toUnderscore() + ".json" ), {
                        props: this.props
                    } );
                }

                // Print this template for all element types except atoms that are only json/entities
                if ( template !== "atom" || ( template === "atom" && this.props.template_style.includes( "twig template" ) ) ) {
                    this.fs.copyTpl( this.templatePath( template + "/api/_" + template + ".twig" ), this.destinationPath( path + "/api/" + this.props.name.toUnderscore() + ".twig" ), {
                        props: this.props
                    } );
                }
                // Print this template for all element types
                this.fs.copyTpl( this.templatePath( "element/docs/_element.docs.md" ), this.destinationPath( path + "/docs/" + this.props.name.toUnderscore() + ".docs.md" ), {
                    props: this.props
                } );
                // Print this template for all element types except atoms that are only twig templates
                if ( template !== "atom" || ( template === "atom" && this.props.template_style.includes( "json/entity" ) ) ) {
                    this.fs.copyTpl( this.templatePath( "element/docs/_element.docs.yaml" ), this.destinationPath( path + "/docs/" + this.props.name.toUnderscore() + ".docs.yaml" ), {
                        props: this.props
                    } );
                }
                // Print this template for components or layouts
                if ( template === "component" || template === "layout" ) {
                    this.fs.copyTpl( this.templatePath( "element/styles/_element.scss" ), this.destinationPath( path + "/styles/_" + this.props.name.toUnderscore() + ".scss" ), {
                        props: this.props
                    } );
                }
                // Print this template for all element types except atoms
                if ( template !== "atom" && template !== "full_page" ) {
                    this.fs.copyTpl( this.templatePath( "element/tests/_element.tests.js" ), this.destinationPath( path + "/tests/" + this.props.name.toUnderscore() + ".tests.js" ), {
                        props: this.props
                    } );
                    this.fs.copyTpl( this.templatePath( "element/tests/_element.tests.json" ), this.destinationPath( path + "/tests/" + this.props.name.toUnderscore() + ".tests.json" ), {
                        props: this.props
                    } );
                }
            } catch ( error ) {
                console.log( error );
                console.log( "//------ Properties set by yeoman:\n" );
                console.log( util.inspect( this.props, { showHidden: false, depth: 4 } ) );
                console.log( "-------------------------------------------//\n" );
            }
        }
    }
} );
