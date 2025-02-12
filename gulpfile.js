const { src, dest, watch, task, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss' );
const csscomb = require('gulp-csscomb');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker' );
const sortCSSmq = require('sort-css-media-queries' );

const PATH = {
  scssRootFolder: 'assets/scss/',
  scssRoot: 'assets/scss/style.scss',
  scssAllFiles: 'assets/scss/**/*.scss',
  cssRootFolder: 'assets/css/',
  htmlAllFiles: './**/*.html',
  jsAllFiles: './**/*.js'
}

const PLUGINS = [
  autoprefixer({
    overrideBrowserslist : ['last 5 versions '],
    cascade: true
  }),
  mqpacker({ sort: sortCSSmq })
]
function scss() {
  return src(PATH.scssRoot)
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss(PLUGINS))
  .pipe(dest(PATH.cssRootFolder))
  .pipe(browserSync.stream());
}

function scssMin() {
  const pluginsForMin = [...PLUGINS, cssnano()];

  return src(PATH.scssRoot)
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss(pluginsForMin))
  .pipe(rename({suffix: '.min'}))
  .pipe(dest(PATH.cssRootFolder))
}

function scssDev() {
  const pluginsForDev = [...PLUGINS]
  pluginsForDev.splice(0, 1);

  return src(PATH.scssRoot, {sourcemaps: true})
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss(pluginsForDev))
  .pipe(dest(PATH.cssRootFolder, {sourcemaps: true}))
  .pipe(browserSync.stream());
}
function comb() {
  return src(PATH.scssAllFiles)
  .pipe(csscomb())
  .pipe(dest(PATH.scssRootFolder))
}
function browserSyncInit() {

  browserSync.init({
      server: "./"
  });
};

async function reload(){
  await browserSync.reload();
}
function watchFiles() {
  browserSyncInit();
  watch(PATH.scssAllFiles, series(scss, scssMin));
  watch(PATH.htmlAllFiles,reload);
  watch(PATH.jsAllFiles, reload);
}

task('scss', series(scss, scssMin));
task('scssDev', scssDev);
task('watch', watchFiles);
task('comb', comb);