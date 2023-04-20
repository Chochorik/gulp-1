const { src, dest, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const img = require('gulp-image');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();


const clean = () => {
  return del([
    'dest',
  ])
}

const resources = () => {
  return src('src/resources/**')
    .pipe(dest('dest'))
}

const styles = () => {
  return src('src/style/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(cleanCss({
      level: 2,
    }))
    .pipe(sourcemaps.write())
    .pipe(dest('dest'))
    .pipe(browserSync.stream())
}

const stylesDev = () => {
  return src('src/style/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(cleanCss({
      level: 2,
    }))
    .pipe(sourcemaps.write())
    .pipe(dest('dest'))
    .pipe(browserSync.stream())
}

const htmlMinify = () => {
  return src('src/pages/**/*.html')
    .pipe(htmlMin({
      collapseWhitespace: true,
    }))
    .pipe(dest('dest'))
    .pipe(browserSync.stream())
}

const htmlMinifyDev = () => {
  return src('src/pages/**/*.html')
    .pipe(dest('dest'))
    .pipe(browserSync.stream())
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dest'
    }
  })
}

const svgSprites = () => {
  return src('src/images/svg/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('dest/images'))
}

const scripts = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/main.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ["@babel/env"]
    }))
    .pipe(concat('app.js'))
    .pipe(uglify({
      toplevel: true
    }).on('error', notify.onError()))
    .pipe(sourcemaps.write())
    .pipe(dest('dest'))
    .pipe(browserSync.stream())
}

const images = () => {
  return src([
    'src/images/**/*.jpg',
    'src/images/**/*.jpeg',
    'src/images/**/*.png',
    'src/images/*.svg',
  ])
    .pipe(img())
    .pipe(dest('dest/images'))
}

watch('src/pages/**/*.html', htmlMinify);
watch('src/style/**/*.css', styles);
watch('src/images/svg/**/*.svg', svgSprites);
watch('src/js/**/*.js', scripts);
watch('src/resources/**', resources);

exports.clean = clean;
exports.styles = styles;
exports.htmlMinify = htmlMinify;
exports.scripts = scripts;
exports.svgSprites = svgSprites;

exports.build = series(clean, resources, htmlMinifyDev, stylesDev, images, svgSprites);

exports.prod = series(clean, resources, htmlMinify, styles, images, svgSprites);

exports.default = series(clean, resources, htmlMinify, styles, images, svgSprites, watchFiles);

