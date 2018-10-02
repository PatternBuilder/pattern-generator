//--- Webdriver doc: http://webdriver.io/api.html

// -- Mocha, expect assertion library doc: https://github.com/Automattic/expect.js
// var expect = require("chai").expect;

describe( "<%= props.name.toSentenceCase() %> <%= props.template_type.replace( /_/g, "" ) %>", function() {
    // Get the test URL
    before( function() {
        return browser.url( "/tests/<%= props.name.toUnderscore() %>" );
    } );

    //-- Keep visual shots to a minimum, they slow down the test suite significantly
    it( "should look like baseline", function() {
        return browser.compareScreen( "<%= props.name.toUnderscore() %>", {
            name: "<%= props.template_type %>",
            elem: ".rh-<% if ( props.template_type === 'component' || props.template_type === 'layout' ) { %><%= props.name.toDash() %>--<%= props.template_type %><% } else if ( props.template_type === 'sub_pattern' ) { %>card--layout<% } else { %>band--layout<% }%>",
            screenWidth: [ <% if ( props.template_type === "component" ) { %>600<% } else if ( props.template_type === "sub_pattern" ) { %>960<% } else if ( props.template_type === "layout" || props.template_type === "pattern" ) { %>320, 960, 1200<% } else { %>1200<% } %> ]
        } );
    } );
    <%

    if ( props.template_type === "layout" ) { %>
    it( "should have custom class, id and uniqueId", function () {
        return browser
            .getAttribute( ".rh-<%= props.name.toDash() %>--<%= props.template_type %>", "class" ).then( function ( attr ) {
                expect( attr ).to.include( "foo bar baz" );
            } )
            .getAttribute( ".rh-<%= props.name.toDash() %>--<%= props.template_type %>", "id" ).then( function ( attr ) {
                expect( attr ).to.include( "customID" );
            } )
            .getAttribute( ".rh-<%= props.name.toDash() %>--<%= props.template_type %>", "data-rh-unique-id" ).then( function ( attr ) {
                expect( attr ).to.include( "1234" );
            } );
    } );
    <% }

    %>
    //-- Example test, more query options here: http://webdriver.io/api.html
    <% if ( props.template_type === "component" ) { %> // Focus on testing the styles and markup<% }
    else if ( props.template_type === "layout" ) { %> // Focus on testing the markup and the way components/subpatterns render inside the layout<% }
    else if ( props.template_type.startsWith( "pattern" ) ) { %> // Focus on testing the pattern to ensure the right content is rendering inside the expected components and that layouts are correct<% } %>
    // it( "should have correct styling for header elements", function () {
    //     return browser
    //         .getTagName( ".rh-<%= props.name.toDash() %>-title" ).then( function ( tagName ) {
    //             expect( tagName ).to.equal( "h1" );
    //         } )
    //         .getCssProperty( ".rh-<%= props.name.toDash() %>-title", "font-size" ).then( function ( fontSize ) {
    //             expect( fontSize.parsed.value ).to.equal( 22 );
    //         } )
    //         .getCssProperty( ".rh-<%= props.name.toDash() %>-title", "color" ).then( function ( color ) {
    //             expect( color.parsed.hex ).to.equal( "#cc0000" );
    //         } )
    //         .getCssProperty( ".rh-<%= props.name.toDash() %>-title", "font-weight" ).then( function ( fontWeight ) {
    //             expect( fontWeight.parsed.value ).to.equal( 800 );
    //         } )
    //         .getCssProperty( ".rh-<%= props.name.toDash() %>-title", "text-transform" ).then( function ( textTransform ) {
    //             expect( textTransform.value ).to.equal( "uppercase" );
    //         } );
    // } );
} );
