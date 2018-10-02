// buildPrompts.js
const chalk = require( "chalk" );

module.exports = {
    // Define list values globally for shared use
    status: [ "active", "inactive", "private" ],
    custom_types: [ "string", "number", "boolean", "object", "array", "$ref" ],
    string_formats: [ "none", "url", "textarea", "html" ],
    array_formats: [ "none", "tabs", "table" ],
    background_properties: [ "color", "isFixed", "align", "overlay", "images" ],
    // Define the filter function to convert a delineated string
    // to an array and trim each item in the list of whitespace
    stringToArrayAndTrim: function( string, delimiter, dash = true ) {
        let toArray = [];
        string.split( delimiter ).forEach( function( value, index ){
            value = value.replace( /[^a-z,A-Z,0-9,-|_| ]/g, "" ).trim();
            if ( dash ) {
                value = value.replace( /[_| ]/g, "-" );
            }
            if( value !== '' ) {
                // replace underscores with dashes
                toArray.push( value );
            }
        } );
        return toArray;
    },
    findDuplicateValues: function( arr ) {
        let uniq = arr.map( ( item ) => {
            return { count: 1, item: item }
        } ).reduce( ( a, b ) => {
                a[ b.item ] = ( a[ b.item ] || 0 ) + b.count;
                return a;
            }, { } );
        return Object.keys( uniq ).filter( ( a ) => uniq[ a ] > 1 );
    },
    init: function() {
        let _this = this;
        return [ {
            type: "list",
            name: "template_type",
            message: "What would you like to create?",
            choices: [ "atom", "component", "sub_pattern", "layout", "pattern", "pattern_group", "page" ],
            default: "component"
        }, {
            type: "input",
            name: "name",
            message: "What will this be called (i.e. \"Awesome video\")?",
            validate: function( answer ) {
                if ( answer.length < 1 ) {
                    return "I get it, naming is hard; but it must have a name. You can always change it later.";
                }
                return true;
            },
            when: function( answers ) {
                return answers.template_type !== "page";
            }
        }, {
            type: "input",
            name: "description",
            message: function( answers ) {
                return "Describe the " + answers.name.toLowCase() +  " " + answers.template_type + ": ";
            },
            when: function ( answers ) {
                return answers.template_type !== "page";
            }
        }, {
            type: "input",
            name: "name",
            message: "What will this be called (i.e. \"Awesome page\")?",
            validate: function( answer ) {
                if ( answer.length < 1 ) {
                    return "I get it, naming is hard; but it must have a name. You can always change it later.";
                }
                return true;
            },
            when: function( answers ) {
                return answers.template_type === "page";
            },
            filter: function( response ) {
                if ( !response.endsWith( "page" ) ) {
                    response += " page";
                } else if ( response.endsWith( "content type" ) ) {
                    response.replace( "/content type/g", "page" );
                }
                return response;
            }
        }, {
            type: "list",
            name: "status",
            message: "What status would you like for this pattern?",
            choices: _this.status,
            when: function( answers ) {
                return answers.template_type !== "atom" && answers.template_type !== "component" && answers.template_type !== "page";
            }
        }, {
            type: "checkbox",
            name: "template_style",
            message: "What type of atom are you creating (can choose more than 1)?",
            choices: [ "json/entity", "twig template" ],
            when: function( answers ) {
                return answers.template_type === "atom";
            },
            validate: function( answer ) {
                if ( answer.length < 1 ) {
                    return "You must choose at least one template type for an atom.";
                }
                return true;
            }
        }, {
            type: "checkbox",
            name: "template_elements",
            message: "Please select any of the templated elements below you want included:",
            choices: [ "align", "size", "seo", "title", "headline", "summary", "link", "image", "video" ],
            when: function( answers ) {
                return answers.template_type === "component";
            }
        }, {
            type: "checkbox",
            name: "template_elements",
            message: "Please select any of the templated elements below you want included:",
            choices: [ "background", "header", "body", "aside", "footer" ],
            when: function( answers ) {
                return answers.template_type === "pattern";
            }
        }, {
            type: "checkbox",
            name: "template_elements",
            message: "Please select any of the templated elements below you want included:",
            choices: [ "navigation", "background", "header", "body", "aside", "footer" ],
            when: function( answers ) {
                return answers.template_type === "pattern_group";
            }
        }, {
            type: "checkbox",
            name: "template_elements",
            message: "Please select any of the templated elements below you want included:",
            choices: [ "container", "content" ], // [ "config", "container", "content" ],
            when: function( answers ) {
                return answers.template_type === "sub_pattern";
            }
        }, {
            type: "checkbox",
            name: "template_elements",
            message: "Please select any of the templated elements below you want included:",
            choices: [ "config", "background", "header", "body", "aside", "footer" ],
            when: function( answers ) {
                return answers.template_type === "layout";
            }
        }, {
            type: "checkbox",
            name: "config_options",
            message: "Please select any of the templated config options below you want included:",
            choices: [ "align", "breakpoints" ],
            when: function( answers ) {
                // Don't run these for now
                //return answers.template_type === "sub_pattern" && answers.template_elements.includes( "config" );
                return false;
            }
        }, {
            type: "checkbox",
            name: "config_options",
            message: "Please select any of the templated config options below you want included:",
            choices: [ "collapse", "vertical_spacing", "eqpts", "justify" ],
            when: function( answers ) {
                return answers.template_type === "layout" && answers.template_elements.includes( "config" );
            }
        }, {
            type: "checkbox",
            name: "background_options",
            message: "Please select any of the background options you want included:",
            choices: _this.background_properties,
            when: function( answers ) {
                return ( answers.template_type === "pattern" || answers.template_type === "pattern_group" ) && answers.template_elements.includes( "background" );
            }
        }, {
            type: "input",
            name: "content_elements",
            message: "List the name of any custom properties you want included in the content section (i.e. \"my-el, my-other-el\"):",
            validate: function( answer ) {
                let duplicates = _this.findDuplicateValues( answer );
                if ( duplicates.length > 0 ) {
                    return "This list cannot contain duplicate values.";
                } else {
                    return true;
                }
            },
            filter: function( response ) {
                return _this.stringToArrayAndTrim( response, "," );
            },
            when: function( answers ) {
                return answers.template_type === "sub_pattern" && answers.template_elements.includes( "content" );
            }
        }, {
            type: "input",
            name: "custom_elements",
            message: "List any custom properties you would like to include (i.e. \"my-foo, my-other-bar\"):",
            validate: function( answer ) {
                let duplicates =_this.findDuplicateValues( answer );
                if ( duplicates.length > 0 ) {
                    return "This list cannot contain duplicate values.";
                } else {
                    return true;
                }
            },
            filter: function( response ) {
                return _this.stringToArrayAndTrim( response, "," );
            },
            when: function( answers ) {
                return answers.template_type !== "page";
            }
        } ];
    },
    refs: function( section ) {
        // Set context to this parent object to reference array datasets
        let _this = this;
        return [ {
            type: "input",
            name: section + "_refs",
            message: "List the components/subpatterns you would like in the " + section + " (i.e. \"cta, footnote, raw_html\"):",
            validate: function( answer ) {
                let duplicates =_this.findDuplicateValues( answer );
                if ( duplicates.length > 0 ) {
                    return "This list cannot contain duplicate values.";
                } else {
                    return true;
                }
            },
            filter: function( response ) {
                return _this.stringToArrayAndTrim( response, ",", false );
            }
        } ];
    },
    // Dynamically build the custom element prompts
    custom: function( element, parent, grid, nestLevel ) {
        // Set context to this parent object to reference array datasets
        let _this = this;
        // Get just the parent and child names separately
        let child = element;
        if ( parent !== "" ) {
            parent = " in " + chalk.blue( parent );
        }
        // Set up the prompt data.
        let prompts = [ {
            type: "list",
            name: element + "_type",
            message: "Select a data type for " + chalk.red(child) + parent + ":",
            choices: _this.custom_types,
            default: "string"
        } ];
        if ( nestLevel > 1 ) {
            prompts.push( {
                type: "confirm",
                name: element + "_type_confirm",
                message: "Are you sure you want to nest this element as an object? Too much nesting can lead to difficult user interfaces.",
                default: false,
                when: function( answers ) {
                    return answers[ element + "_type" ] === "object";
                }
            }, {
                type: "list",
                name: element + "_type",
                message: "Select a data type for " + chalk.red(child) + parent + ":",
                default: "string",
                choices: function() {
                    // Remove object from the options list
                    _this.custom_types.splice( _this.custom_types.indexOf( "object" ), 1 );
                    return _this.custom_types;
                },
                when: function( answers ) {
                    return answers[ element + "_type_confirm" ] === false;
                }
            } );
        }
        prompts.push( {
            type: "list",
            name: element + "_format",
            message: "Would you like to apply a format to your string?",
            choices: _this.string_formats,
            default: "none",
            when: function( answers ) {
                return answers[ element + "_type" ] === "string";
            },
            filter: function( response ) {
                if ( response === "none" ) {
                    return null;
                } else {
                    return response;
                }
            }
        }, {
            type: "input",
            name: element + "_refs",
            message: "List any references that you would like in this array: (i.e. \"raw_html, generic, cta\")",
            validate: function( answer ) {
                let duplicates =_this.findDuplicateValues( answer );
                if ( duplicates.length > 0 ) {
                    return "This list cannot contain duplicate values.";
                } else {
                    return true;
                }
            },
            filter: function( response ) {
                return _this.stringToArrayAndTrim( response, ",", false );
            },
            when: function( answers ) {
                return answers[ element + "_type" ] === "array";
            }
        }, {
            type: "input",
            name: element + "_refs",
            message: "Please enter the ref details: (i.e. \"band_header.json\" or \"band_header.json#/properties/title\")",
            when: function( answers ) {
                return answers[ element + "_type" ] === "$ref";
            }
        }, {
            type: "confirm",
            name: element + "_minmax_confirm",
            message: "Do you want a min/max for your array?",
            default: false,
            when: function( answers ) {
                return answers[ element + "_type" ] === "array";
            }
        }, {
            type: "input",
            name: element + "_min",
            message: "Min:",
            validate: function( answer ) {
                if ( isNaN( parseInt( answer ) ) || parseInt( answer ) < 1 ) {
                    return "You must enter a valid number.";
                }
                return true;
            },
            filter: function( response ) {
                return parseInt( response );
            },
            when: function( answers ) {
                return answers[ element + "_minmax_confirm" ];
            }
        }, {
            type: "input",
            name: element + "_max",
            message: "Max:",
            validate: function( answer ) {
                if ( isNaN( parseInt( answer ) ) || parseInt( answer ) < 1 ) {
                    return "You must enter a valid number.";
                }
                return true;
            },
            filter: function( response ) {
                return parseInt( response );
            },
            when: function( answers ) {
                return answers[ element + "_minmax_confirm" ];
            }
        }, {
            type: "list",
            name: element + "_format",
            message: "Would you like to apply a display format to your array?",
            choices: _this.array_formats,
            default: "none",
            when: function( answers ) {
                return answers[ element + "_type" ] === "array";
            },
            filter: function( response ) {
                if ( response === "none" ) {
                    return null;
                } else {
                    return response;
                }
            }
        }, {
            type: "confirm",
            name: element + "_hidden",
            message: "Would you like this property to be hidden?",
            default: false,
            when: function( answers ) {
                // Don't ask this question for now, possibly add back later
                //return answers[ element + "_type" ] !== "$ref";
                return false;
            }
        }, {
            type: "confirm",
            name: element + "_collapsed",
            message: "Would you like this property to be collapsed?",
            default: false,
            when: function( answers ) {
                // Don't ask this question for now, possibly add back later
                //return answers[ element + "_type" ] === "object";
                return false;
            }
        }, {
            type: "confirm",
            name: element + "_wysiwyg",
            message: "Would you like the wysiwyg to be available?",
            default: true,
            when: function( answers ) {
                return answers[ element + "_format" ] === "html";
            }
        }, {
            type: "confirm",
            name: element + "_dropdown",
            message: "Is this a multiple choice property?",
            default: false,
            when: function( answers ) {
                return answers[ element + "_type" ] === "string" && answers[ element + "_format" ] === null;
            }
        }, {
            type: "input",
            name: element + "_dropdown_items",
            message: "List your dropdown properties (i.e. \"small, medium, large\"):",
            validate: function( answer ) {
                let duplicates =_this.findDuplicateValues( answer );
                if ( duplicates.length > 0 ) {
                    return "This list cannot contain duplicate values.";
                } else {
                    return true;
                }
            },
            when: function( answers ) {
                return answers[ element + "_dropdown" ];
            },
            filter: function( response ) {
                return _this.stringToArrayAndTrim( response, "," );
            }
        }, {
            type: "confirm",
            name: element + "_required",
            default: false,
            message: "Is this a required field?"
        }, {
            type: "input",
            name: element + "_grid",
            message: "In a " + grid + " column grid, how many columns should this field occupy in the admin interface?:",
            validate: function( answer ) {
                if ( isNaN( parseInt( answer ) ) || parseInt( answer ) < 1 || parseInt( answer ) > grid ) {
                    return "Number should be between 1 and " + grid + ".";
                }
                return true;
            },
            filter: function( response ) {
                return parseInt( response );
            },
            when: function( answers ) {
                // Turn off this question for now, possibly add back later
                //return answers[ element + "_type" ] !== "$ref" && answers[ element + "_hidden" ] === false;
                return false;
            }
        } );
        if ( nestLevel < 2 ) {
            prompts.push( {
                type: "input",
                name: element + "_children",
                message: "List any child elements you want for " + chalk.red(child) + " (i.e. \"my-el, my-other-el\"):",
                validate: function( answer ) {
                    let duplicates =_this.findDuplicateValues( answer );
                    if ( duplicates.length > 0 ) {
                        return "This list cannot contain duplicate values.";
                    } else {
                        return true;
                    }
                },
                filter: function( response ) {
                    return _this.stringToArrayAndTrim( response, "," );
                },
                when: function( answers ) {
                    return answers[ element + "_type" ] === "object";
                }
            } );
        }
        return prompts;
    }
};
