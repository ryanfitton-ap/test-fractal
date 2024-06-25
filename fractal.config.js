"use strict";

const path = require("path");
const fractal = (module.exports = require("@frctl/fractal").create());
fractal.set("project.title", "Fractal Test");

/*
 * Custom Twig settings
 */
const twigAdapter = require('@frctl/twig')({
    base: '/', //Require the Twig adapter and apply base location. Base will stop relative paths from being used
});


/*
 * Components
 */
fractal.components.engine(twigAdapter); // Sets template engine adapter used for preview templates
fractal.components.set("ext", ".html.twig"); // Sets file extension used for preview templates
fractal.components.set("path", __dirname + "/components"); // Sets path where components live
fractal.components.set("default.preview", "@styleguide"); // Sets layout template used for rendering previews. Specified by handle
fractal.components.set('exclude', ['**/node_modules/**', '**/tests/**']); //Exclude these files/folders from Fractal when parsing the components directory

/*
 * Setup build directory - For Static
 */
fractal.web.set('builder.dest', __dirname + '/build');

/*
 * Documentation
 */
fractal.docs.set("path", __dirname + "/docs"); // Sets path where documentation lives

/*
 * Assets
 */
fractal.web.set("static.path", __dirname + "/public"); // Sets path where assets live (such as stylesheets)
fractal.web.set('server.syncOptions', {
    open: true // https://browsersync.io/docs/options#option-open
});

/*
 * Theme
 */

const mandelbrot = require("@frctl/mandelbrot");

fractal.web.theme(
    mandelbrot({
        information: [
            {
                label: 'Version',
                value: require('./package.json').version,
            },
            {
                label: 'Built on',
                value: new Date(),
                type: 'time', // Outputs a <time /> HTML tag
                format: (value) => {
                    return value.toLocaleDateString('en');
                }
            }
        ],
        skin: {
            accent: "#213B70", // $blue
            complement: "#FFFFFF", // $white
            links: "#213B70", // $blue
        },
    })
);
