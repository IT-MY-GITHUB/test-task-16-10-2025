// const gulp = require("gulp");
import gulp from "gulp";
// const less = require("gulp-less");
// import less from "gulp-less";

// import gulpStylus from "gulp-stylus";

// import galpSass from "gulp-sass";
// gulpSass.require("sass");
import gulpSass from "gulp-sass";
import dartSass from "sass";
const sass = gulpSass(dartSass);
// const del = require("del");
import del from "del";
// const rename = require("gulp-rename");
import rename from "gulp-rename";
// const cleanCss = require("gulp-clean-css");
import cleanCss from "gulp-clean-css";
// const babel = require("gulp-babel");
import babel from "gulp-babel";
// const uglify = require("gulp-uglify");
import uglify from "gulp-uglify";
// const concat = require("gulp-concat");
import concat from "gulp-concat";
// const sourcemaps = require("gulp-sourcemaps");
import sourcemaps from "gulp-sourcemaps";
// const autoprefixer = require("gulp-autoprefixer");
import autoprefixer from "gulp-autoprefixer";
// const imagemin = require("gulp-imagemin");
import imagemin from "gulp-imagemin";

import htmlmin from "gulp-htmlmin";

import gulpsize from "gulp-size";

import gulpnewer from "gulp-newer";

import gulpTypescript from "gulp-typescript";

import panini from "panini";

import browserSync from "browser-sync";
browserSync.create();

import gulpPug from "gulp-pug";

// const { series, parallel, watch, src, dest, task } = gulp;

const path = {
    pug: {
        src: "src/*.pug",
        dest: "dist",
    },
    html: {
        src: "src/*.html",
        dest: "dist",
    },
    // styles: {
    //   src: ["src/styles/**/*.less"],
    //   dest: "dist/css",
    // },
    // styles: {
    //   src: ["src/styles/**/*.less", "src/styles/**/*.styl"],
    //   dest: "dist/css",
    // },
    styles: {
        src: "src/assets/styles/*.scss",
        dest: "dist/assets/css",
    },
    scripts: {
        src: ["src/assets/scripts/**/*.js", "src/assets/scripts/**/*.ts"],
        dest: "dist/assets/js",
    },
    images: {
        src: "src/assets/images/**/*.{jpg,jpeg,png,gif,svg,ico,webp}",
        dest: "dist/assets/images",
    },
    fonts: {
        src: "src/assets/fonts/**/*.{eot,ttf,woff,woff2,svg}",
        dest: "dist/assets/fonts",
    },
    watch: {
        html: "src/**/*.html",
        scripts: ["src/assets/scripts/**/*.js", "src/assets/scripts/**/*.ts"],
        styles: "src/assets/styles/**/*.scss",
        images: "src/assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
        fonts: "src/assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
    },
};

function clean() {
    return del(["dist/*", "!dist/assets/images"]);
}

function html() {
    panini.refresh();
    return gulp
        .src(path.html.src)
        .pipe(
            panini({
                root: "src/",
                layouts: "src/layouts/",
                partials: "src/partials/",
                helpers: "src/helpers/",
                data: "src/data/",
            })
        )
        .pipe(htmlmin({ collapseWhitespace: false }))
        .pipe(gulpsize({ showFiles: true }))
        .pipe(gulp.dest(path.html.dest))
        .pipe(browserSync.stream());
}

// function pug() {
//   return gulp
//     .src(path.html.src)
//     .pipe(gulpPug())
//     .pipe(gulpsize({ showFiles: true }))
//     .pipe(gulp.dest(path.html.dest))
//     .pipe(browserSync.stream());
// }

function styles() {
    return (
        gulp
            .src(path.styles.src)
            .pipe(sourcemaps.init())
            // .pipe(less())
            // .pipe(gulpStylus())
            .pipe(sass().on("error", sass.logError))
            .pipe(
                autoprefixer({
                    cascade: false,
                    overrideBrowserslist: ["last 5 versions"],
                    grid: true,
                })
            )
            .pipe(
                cleanCss({
                    level: 2,
                })
            )
            .pipe(
                rename({
                    suffix: ".min",
                    extname: ".css",
                })
            )
            .pipe(sourcemaps.write("."))
            .pipe(gulpsize({ showFiles: true }))
            .pipe(gulp.dest(path.styles.dest))
            .pipe(browserSync.stream())
    );
}

function scripts() {
    return (
        gulp
            .src(path.scripts.src)
            .pipe(sourcemaps.init())
            // .pipe(
            //     gulpTypescript({
            //         noImplicitAny: true,
            //         outFile: "main.min.js",
            //     })
            // )
            .pipe(babel({ presets: ["@babel/env"] }))
            .pipe(uglify())
            .pipe(concat("main.min.js"))
            .pipe(sourcemaps.write("."))
            .pipe(gulpsize({ showFiles: true }))
            .pipe(gulp.dest(path.scripts.dest))
            .pipe(browserSync.stream())
    );
}

function images() {
    return gulp
        .src(path.images.src)
        .pipe(gulpnewer(path.images.dest))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3,
            })
        )
        .pipe(gulpsize({ showFiles: true }))
        .pipe(gulp.dest(path.images.dest))
        .pipe(browserSync.stream());
}

function fonts() {
    return gulp
        .src(path.fonts.src)
        .pipe(gulp.dest(path.fonts.dest))
        .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./dist",
        },
        // open: false,
        browser: "chrome",
    });
    gulp.watch(path.watch.html, html);
    // gulp.watch(path.pug.src, pug);
    gulp.watch(path.watch.styles, styles);
    gulp.watch(path.watch.scripts, scripts);
    gulp.watch(path.watch.images, images);
    gulp.watch(path.watch.fonts, fonts);
}

// for run need use command - gulp build
export const build = gulp.series(
    clean,
    html,
    // pug,
    gulp.parallel(styles, scripts, images, fonts),
    watch
);

// exports.clean = clean;
// exports.styles = styles;
// exports.scripts = scripts;
// exports.images = images;
// exports.watch = watch;
// exports.build = build;
// exports.default = build;
