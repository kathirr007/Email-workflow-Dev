const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
    lazy: true
});
const pug = require('gulp-pug');
// const sass = require('gulp-sass');
// const replace = require('gulp-replace');
// const inlineCss = require('gulp-inline-css');
// const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

// browserSync base directory
// this will be the base directory of files for web preview
// since we are building `index.pug` templates (located in src/emails) to `dist` folder.
const baseDir = "./dist";

let resources = {
    watch : ['src/**/*scss', 'src/**/*pug' ,'!src/**/*.css']
}

// reload task
gulp.task('reload', done => {
    browserSync.reload();
    done();
});

// compile sass to css
gulp.task('compileSass', () => {
    return gulp
        // import all email .scss files from src/scss folder
        // ** means any sub or deep-sub files or foders
        .src('./src/sass/**/*.scss')

        // on error, do not break the process
        .pipe($.sass().on('error', $.sass.logError))

        // output to `src/css` folder
        .pipe(gulp.dest('./src/css'));
});

// build complete HTML email template
// compile sass (compileSass task) before running build
gulp.task('build', gulp.series('compileSass', () => {
    return gulp
        // import all email template (name ending with .template.pug) files from src/emails folder
        .src('src/emails/one/one.template.pug')

        // replace `.scss` file paths from template with compiled file paths
        .pipe($.replace(new RegExp('\/sass\/(.+)\.scss', 'ig'), '/css/$1.css'))

        // do not generate sub-folders inside dist folder
        .pipe($.rename({dirname: ''}))

        // compile using Pug
        .pipe(pug({
            doctype: 'html',
            pretty: true
        }))

        // // inline CSS
        .pipe($.inlineCss())

        // put compiled HTML email templates inside dist folder
        .pipe(gulp.dest('dist'))
    })
);

// browserSync task to launch preview server
gulp.task('browserSync', () => {
    return browserSync.init({
        reloadDelay: 2000, // reload after 2s, compilation is finished (hopefully)
        server: { baseDir: baseDir }
    });
});

// task to reload browserSync
gulp.task('reloadBrowserSync', () => {
    return browserSync.reload();
});

// watch source files for changes
// run `build` task when anything inside `src` folder changes (except .css)
// and reload browserSync
gulp.task(
    'watch',
    gulp.parallel('browserSync', () => {
        // html changes
        // gulp.watch(b2bhtml.watch, gulp.series('b2bhtml'));
        // gulp.watch(html.watch, gulp.series('html', 'reload'));
        gulp.watch(resources.watch, gulp.series('build', 'reload'));
        // gulp.watch('src/**/*.pug', gulp.series('build', 'reload'));
    })
);

// gulp.task('watch', gulp.series('build', 'browserSync', () => {
//         return gulp.watch(['src/**/*', '!src/**/*.css',], gulp.series('build', 'reloadBrowserSync'));
//     })
// );

// default task
gulp.task('default', gulp.series('watch'));