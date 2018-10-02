<%# Get primitive function returns the appropriate value for the dataset and type %><%

const getPrimitive = ( type, format, dropdownList ) => {
    let ret;
    if ( type === "boolean" ) {
        ret = false;
    } else if ( type === "number" ) {
        ret = 0;
    } else {
        let string = "Lorem ipsum";
        if ( format === "html" ) {
            string = "<p>" + string + "</p>";
        }
        if ( dropdownList.length > 0 ) {
            string = dropdownList[ 0 ];
        }
        ret = "\"" + string + "\"";
    }
    return ret;
};

%>## <%= props.name.toSentenceCase() %> <%= props.template_type.replace( /_/g, "" ) %>
<%= props.description %>

### Best practices/usage guidelines
Describe the best practices and usage guidelines for this <%= props.template_type %> here...

### Options
<% if ( props.template_elements.includes( 'align' ) || props.config_options.includes( 'align' ) || props.template_type === 'sub_pattern' ) { %>
#### ALIGNMENT
There are 3 alignment options:
    - `data-rh-align="left"`: aligned left
    - `data-rh-align="center"`: aligned center
    - `data-rh-align="right"`: aligned right
<% }

if ( props.config_options.includes( 'breakpoints' ) ) { %>
#### BREAKPOINTS
Explain how these breakpoints are used in this <%= props.template_type %> and the default behavior if none are selected. There are 5 breakpoint options (one or all can be selected):
    - `xxs`: 0px-479px
    - `xs`: 480px-767px
    - `sm`: 768px-991px
    - `md`: 992px-1199px
    - `lg`: 1200px+
<% }

if ( props.template_elements.includes( 'size' ) ) { %>
#### SIZING
There are 3 sizing options:
    - `data-rh-size="small"`: about this size
    - `data-rh-size="medium"`: about this size
    - `data-rh-size="large"`: about this size
<% }

if ( props.config_options.includes( 'collapse' ) ) { %>
#### COLLAPSE
There are 6 padding options:
    - `data-rh-collapse="full_top"`: Remove all padding from the top
    - `data-rh-collapse="full_bottom"`: Remove all padding from the bottom
    - `data-rh-collapse="full"`: Remove all padding from both top and bottom
    - `data-rh-collapse="top"`: Reduce padding from the top
    - `data-rh-collapse="bottom"`: Reduce padding from the bottom
    - `data-rh-collapse="both"`: Reduce padding from both the top and bottom
<% }

if ( props.config_options.includes( 'eqpts' ) ) { %>
#### EQPTS
All about eqpts...
<% }

if ( props.config_options.includes( 'vertical_spacing' ) ) { %>
#### VERTICAL SPACING
There are 3 vertical spacing options:
    - `data-rh-layout="min-stacked"`: Minimum vertical padding between elements
    - `data-rh-layout="stacked"`: Standard vertical padding between elements
    - `data-rh-layout="tall-stacked"`: Maximum vertical padding between elements
<% }

if ( props.config_options.includes( 'justify' ) ) { %>
#### VERTICAL ALIGNMENT
There are 3 vertical alignment options:
    - `data-rh-justify="center"`: center align children elements
    - `data-rh-justify="top"`: top align children elements
    - `data-rh-justify="justify"`: align children elements evenly inside the space
<% }

if ( props.template_elements.includes( 'background' ) || [ 'layout' ].includes( props.template_type ) ) { %>
#### BACKGROUND
This property has several options for configuring the background styles:<%
    if ( [ 'layout' ].includes( props.template_type ) || props.background_options.includes( 'color' ) ) { %>
  - `color`: Sets the background color (this also serves as the fallback color if no images are able to load).<% }
    if ( [ 'layout' ].includes( props.template_type ) || props.background_options.includes( 'overlay' ) ) { %>
  - `overlay`: Adds an opaque layer over top of the background image to improve legibility.<% }
    if ( [ 'layout' ].includes( props.template_type ) || props.background_options.includes( 'images' ) ) { %>
  - `image_large`: Sets the desktop/tablet background image.
  - `image_small`: Sets the mobile background image.<% }
    if ( [ 'layout' ].includes( props.template_type ) || props.background_options.includes( 'isFixed' ) ) { %>
  - `isFixed`: Allows the background image to be set to static so the image stays in place as the user scrolls.<% }
    if ( [ 'layout' ].includes( props.template_type ) || props.background_options.includes( 'align' ) ) { %>
  - `align`: Allows greater control for setting the alignment of the background images.<% } %>
<% }

if ( props.template_elements.includes( 'navigation' ) ) { %>
#### NAVIGATION
This property is passed a full html object containing the navigation.
<% }

if ( props.template_elements.includes( 'seo' ) ) { %>
#### SEO
This property has several options for configuring the markup that drives SEO:
    - `position`: This defines the context within which this element exists.  If it exists inside a band hero for example, you would select the "primary" position.
    - `priority`: This defines the part of the element that should be emphasized for search engines.  Select the element that contains the most relevant keywords.
<% }

%>
### Example usage
```twig
{% include "<%= props.name.toUnderscore() %>.twig" with {
    "name": "<%= props.name.toUnderscore() %>"<%

    // Template + misc_data available in component and layout only
    if ( props.template_type === "component" || props.template_type === "layout" ) { %>,
    "misc_data": ""<%
    }

    // Metaata available in layout and pattern only
    if ( props.template_type === "layout" || props.template_type.startsWith( "pattern" ) ) { %>,
        "meta": {
            "class": [ "foo" ],
            "id": "bar"
        }<%
    }

    // Specific properties only for the page type
    if ( props.template_type === "page" ) { %>,
        "config": {
            "body_class": "foo",
            "additional_css": [],
            "additional_js": []
        }<%
    }

    if ( props.template_elements.includes( 'align' ) ) { %>,
    "align": "left"<%
    }
    if ( props.template_elements.includes( 'size' ) ) { %>,
    "size": "medium"<%
        }
    if ( props.template_elements.includes( 'seo' ) ) { %>,
    "seo": {
        "position": "secondary",
        "priority": "standard"
    }<%
    }
    if ( props.template_elements.includes( 'title' ) ) { %>,
    "title": "Lorem ipsum"<%
    }
    if ( props.template_elements.includes( 'headline' ) ) { %>,
    "headline": "Vestibulum ac diam sit amet quam"<%
    }
    if ( props.template_elements.includes( 'summary' ) ) { %>,
    "summary": "<p>Nulla quis lorem ut libero malesuada feugiat. <a>Quisque velit nisi, pretium ut lacinia in</a>, elementum id enim. Mauris blandit aliquet elit&reg;, eget tincidunt nibh pulvinar a. Nulla quis lorem ut libero malesuada feugiat.</p>"<%
    }
    if ( props.template_elements.includes( 'link' ) ) { %>,
    "link": {
        "href": "#",
        "title": "Lorem ipsum",
        "text": "Lorem ipsum"
    }<%
    }
    if ( props.template_elements.includes( 'image' ) ) { %>,
    "image": {
        "src": "#",
        "alt": "Lorem ipsum"
    }<%
    }
    if ( props.template_elements.includes( 'video' ) ) { %>,
    "video": {
        "video_src": "#"
    }<% }

    if ( props.template_elements.includes( 'navigation' ) ) { %>,
    "navigation": "<div style='margin: 0 auto; background-image: url(/fixtures/images/utility.png); height: 39px; max-width: 1170px;'></div><div style='max-width: 1170px; margin: 0 auto; background-image: url(/fixtures/images/nav.png); height: 88px; margin-bottom: 25px'></div>"<%
    }

    if ( props.template_elements.includes( 'config' ) ) { %>,
    "config": {<% props.config_options.forEach( function( property, idx ) { if ( idx > 0 ) { %>,<% } if( property == 'collapse' ) { %>
        "collapse": "both"<% } if( property == 'vertical_spacing' ) { %>
        "vertical_spacing": "stacked"<% } if( property == 'eqpts' ) { %>
        "eqpts": "small: 400, medium: 600, large: 900"<% } if( property == 'justify' ) { %>
        "justify": "justify"<% } if( property == 'align' ) { %>
        "align": "left"<% } if ( property == 'breakpoints' ) { %>
        "breakpoints": [ "xxs", "xs", "sm" ]<% } } ); %>
    }<% }

    if ( props.template_elements.includes( 'container' ) ) { %>,
    "container": {
        "background": "gray",
        "align": "left"
    }<% }

    if ( props.template_elements.includes( 'background' ) ) { %>,
    "background": {<%
        if ( props.template_type === "layout" || props.background_options.includes( "color" ) ) { %>
        "color": "white"<%
        }

        if ( props.template_type === "layout" || props.background_options.includes( "overlay" ) ) { %>,
        "overlay": "30%"<%
        }

        if ( props.template_type === "layout" || props.background_options.includes( "images" ) ) { %>,
        "image_large": {
            "src": "/fixtures/images/bg2.jpg"
        },
        "image_small": {
            "src": "/fixtures/images/bg1.jpg"
        }<%
        }

        if ( props.template_type === "layout" || props.background_options.includes( "isFixed" ) ) { %>,
        "isFixed": false<%
        }

        if ( props.template_type === "layout" || props.background_options.includes( "align" ) ) { %>,
        "align": "center-center"<%
        } %>
    }<% }

    // -- HEADER/BODY arrays for page content type
    if ( props.template_type === "page" ) { %>,
    "header": [ <% props.header_refs.forEach( function( ref, idx ) { %>{
        "name": "<%= ref %>"
    }<% if ( ++idx < props.header_refs.length ) { %>,<% } %> <% } ); %>],
    "body": [ <% props.body_refs.forEach( function( ref, idx ) { %>{
        "name": "<%= ref %>"
    }<% if ( ++idx < props.body_refs.length ) { %>,<% } %> <% } ); %>]<%
    }

    if ( props.template_elements.includes( 'header' ) ) { %>,
    "header": {
        "layout": "stacked",
        "sub_patterns": [ <% props.header_refs.forEach( function( ref, idx ) { %>{
            "name": "<%= ref %>"
        }<% if ( ++idx < props.header_refs.length ) { %>,<% } %> <% } ); %>]
    }<% }

    if ( props.template_elements.includes( 'body' ) ) { %>,
    "body": {
        "layout": "gallery2",
        "sub_patterns": [ <% props.body_refs.forEach( function( ref, idx ) { %>{
            "name": "<%= ref %>"
        }<% if ( ++idx < props.body_refs.length ) { %>,<% } %> <% } ); %>]
    }<% }

    if ( props.template_elements.includes( 'aside' ) ) { %>,
    "aside": {
        "layout": "stacked",
        "sub_patterns": [ <% props.aside_refs.forEach( function( ref, idx ) { %>{
            "name": "<%= ref %>"
        }<% if ( ++idx < props.aside_refs.length ) { %>,<% } %> <% } ); %>]
    }<% }

    if ( props.template_elements.includes( 'footer' ) ) { %>,
    "footer": {
        "layout": "stacked",
        "sub_patterns": [ <% props.footer_refs.forEach( function( ref, idx ) { %>{
            "name": "<%= ref %>"
        }<% if ( ++idx < props.footer_refs.length ) { %>,<% } %> <% } ); %>]
    }<% }

    if ( props.template_elements.includes( 'content' ) ) { %>,
    "content": {<%
        // -- CONTENT DATA
        let names_list = props.elements.content_elements,
            count = 1;
        // Iterate over custom objects
        for ( let [ name, element ] of Object.entries( props.elements ) ) {
            // Check that this property is an element
            if ( names_list.includes( name ) ) {
        %>
        "<%=  element.name.toUnderscore() %>": <%
                if ( [ 'string', 'boolean', 'number' ].includes( element.options.type ) ) { %><%- getPrimitive( element.options.type, element.options.format, element.dropdown_items ); %><% }
                else if ( element.options.type === 'array' ) {
            %>[ <% element.refs.forEach( function( ref, r_idx ) { %>{
                "name": "<%= ref.toUnderscore() %>"
            }<% if ( ++r_idx < element.refs.length ) { %>,<% } %> <% } ); %>]<% }
                else if ( element.options.type === '$ref' ) { %>""<% }
                else if ( element.options.type === "object" ) { %>{<%
                    // -- If this object has CHILDREN elements
                    let child_list = element[ element.name + "_elements" ],
                        child_count = 1;
                    // Iterate over children objects
                    for ( let [ child_name, child_element ] of Object.entries( element.children ) ) {
                        // Check that this property is an element
                        if ( child_list.includes( child_name ) ) { %>
            "<%=  child_element.name.toUnderscore() %>": <%
                if ( [ 'string', 'boolean', 'number' ].includes( child_element.options.type ) ) { %><%- getPrimitive( child_element.options.type, child_element.options.format, child_element.dropdown_items ); %><% }
                else if ( child_element.options.type === 'array' ) { %>[ <%
                    child_element.refs.forEach( function( ref, r_idx ) { %>{
                "name": "<%= ref.toUnderscore() %>"
            }<% if ( ++r_idx < child_element.refs.length ) { %>,<% } %> <% } ); %>]<%
                }
                else if ( child_element.options.type === '$ref' ) { %>""<% }
                else if ( child_element.options.type === "object" ) { %>{}<% }
                if ( child_count++ < child_list.length ) { %>,<% }
                        } %><%# End child_list check %><%
                    } %><%# End for loop over children %>
        }<% } %><%# End object if statement %><% if ( count++ < names_list.length ) { %>,<% }

            } //  closing names list check
        } // closing for loop
        %>
    }<% } // end CONTENT section


// -- CUSTOM DATA
if ( props.elements.custom_elements.length > 0 ) { %>,<%
    let names_list = props.elements.custom_elements,
        count = 1;
    // Iterate over custom objects
    for ( let [ name, element ] of Object.entries( props.elements ) ) {
        // Check that this property is an element
        if ( names_list.includes( name ) ) { %>
    "<%=  element.name.toUnderscore() %>": <%
        if ( [ 'string', 'boolean', 'number' ].includes( element.options.type ) ) { %><%- getPrimitive( element.options.type, element.options.format, element.dropdown_items ); %><% }
        else if ( element.options.type === 'array' ) {
    %>[ <% element.refs.forEach( function( ref, r_idx ) { %>{
        "name": "<%= ref.toUnderscore() %>"
    }<% if ( ++r_idx < element.refs.length ) { %>,<% } %> <% } ); %>]<% }
        else if ( element.options.type === '$ref' ) { %>""<% }
        else if ( element.options.type === "object" ) { %>{<%
            // -- If this object has CHILDREN elements
            let child_list = element[ element.name + "_elements" ],
                child_count = 1;
            // Iterate over custom objects
            for ( let [ child_name, child_element ] of Object.entries( element.children ) ) {
                // Check that this property is an element
                if ( child_list.includes( child_name ) ) { %>
        "<%=  child_element.name.toUnderscore() %>": <%
            if ( [ 'string', 'boolean', 'number' ].includes( child_element.options.type ) ) { %><%- getPrimitive( child_element.options.type, child_element.options.format, child_element.dropdown_items ); %><% }
            else if ( child_element.options.type === 'array' ) {
        %>[ <% child_element.refs.forEach( function( ref, r_idx ) { %>{
            "name": "<%= ref.toUnderscore() %>"
        }<% if ( ++r_idx < child_element.refs.length ) { %>,<% } %> <% } ); %>]<%
            }
            else if ( child_element.options.type === '$ref' ) { %>""<% }
            else if ( child_element.options.type === "object" ) { %>{}<% }
            if ( child_count++ < child_list.length ) { %>,<% }
                    } %><%# End child_list check %><%
                } %><%# End for loop over children %>
    }<% } %><%# End object if statement %><% if ( count++ < names_list.length ) { %>,<% }

            } //  closing names list check
        } // closing for loop
    } %>
} only %}
```
