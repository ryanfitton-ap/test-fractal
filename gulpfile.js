var environments = require('gulp-environments');
const { dest, series, src, watch } = require("gulp");
const webpack = require('webpack-stream');
const sass = require("gulp-sass")(require("sass"));
sass.compiler = require("sass");
const uglify = require("gulp-terser");
const cssmin = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const log = require("fancy-log");
const fs = require("fs");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

// Build environments
// var development = environments.development;  //Use as `development()`
var production = environments.production;       //Use as `production()`

// Define Development and Production output folders
const productionOutputDir = "build/";
const developmentOutputDir = "public/";

// Build output folders for JS and CSS
const cssOutput = (production() ? productionOutputDir : developmentOutputDir) + "css/";
const jsOutput = (production() ? productionOutputDir : developmentOutputDir) + "js/";
const imageOutput = (production() ? productionOutputDir : developmentOutputDir) + "images/";

// Build input folders
const sassInput = "components/";
const jsInput = "components/";
const imageInput = "public/images/";


// Compiles SCSS into CSS then minifies it - command --> gulp sass
const scss = () => {
    return src(["!_.scss", sassInput + "*.scss"])
        .pipe(sass())
        .pipe(postcss([autoprefixer]))
        .pipe(cssmin())
        .pipe(dest(cssOutput));
};

// Runs JS via Webpack Stream (Minifies js and allows for CSS modules) - command --> webpack --> gulp js
const js = () => {
    return src([jsInput + "**/*.js"])
        .pipe(webpack( require('./webpack.config.js') )) //Use WebPack Stream for JS so scss `:export {}` variables can be used
        .pipe(uglify())
        .pipe(dest(jsOutput));
};

// Minifies css - command --> gulp css
const css = () => {
    return src(sassInput + "**/*.css")
        .pipe(postcss([autoprefixer]))
        .pipe(cssmin())
        .pipe(dest(cssOutput));
};

// Image modifications
const images = () => {
    return src(imageInput + "**/*")
        //.pipe(imagemin()) //Disable Imagemin
        .pipe(dest(imageOutput))
};

/**
 * The build procedure, should be replicable each time.
 */
const build = series(series(series(scss, css), series(js), series(images)));

/**
 * Watches all SCSS, CSS and JS files and runs the scss, css, js tasks on change
 *
 * (gulp watch)
 *
 * It doesn't watch node_modules cos who's running gulp watch when they do an npm install
 */
const watchAll = () => {
    return watch(
        [sassInput + "**/*.scss", sassInput + "**/*.css", imageInput + "**/*", jsInput + "**/*.js"],
        series(build)
    );
};

module.exports = {
    default: series(build),
    build: build,
    sass: scss,
    css: css,
    js: js,
    images: images,
    watch: watchAll,
};
