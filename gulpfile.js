const path = require('path');
const gulp = require('gulp');
// const gulp = require('gulp-param')(require('gulp'), process.argv);
const $ = require('gulp-load-plugins')({
    lazy: true
});
// const pug = require('gulp-pug');
const pkg = require('./package.json');
const { crush } = require("html-crush");
const comb = require('email-comb');
const wrapper = require('text-wrapper').wrapper;
const del = require('del');
const uncss = require('uncss');
const postuncss = require('postcss-uncss');
// const sass = require('gulp-sass');
// const replace = require('gulp-replace');
// const inlineCss = require('gulp-inline-css');
// const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const pathOptions = {
    ext: {
        template: ['html']
    }
    /*
     root: process.cwd(),
     ext: {
     template: ['html'],
     script: ['js'],
     style: ['css', 'less', 'sass']
     }
     */
};

// browserSync base directory
// this will be the base directory of files for web preview
// since we are building `index.pug` templates (located in src/emails) to `dist` folder.

const devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production');

const source = './';
const dest = devBuild ? 'builds/development/' : 'builds/production/';
const baseDir = dest + 'emails/';

// in: source + 'src/emails/**/*.(jpg|jpeg|png|svg|gif)',
let images = {
    in: 'src/**/*.{png,gif,jpg,jpeg,svg}',
    out: dest
};

let resources = {
    watch : ['src/**/*.scss', 'src/**/*.pug', 'src/*.html' , 'src/**/*.html' ,'!src/**/*.css']
}

// Clean tasks
gulp.task('clean', function (done) {
    del([
        dest + '*'
    ]);
    done();
});

gulp.task('clean-images', function (done) {
    del([
        dest + '**/images/**/*'
    ]);
    done();
});

gulp.task('clean-css', function (done) {
    del([
        './src/css/**/*'
    ]);
    done();
});

gulp.task('clean-html', (cb) => {
    del([
        dest + '**/*.html'
    ]);
    cb();
});

// show build type
console.log(pkg.name + ' ' + pkg.version + ', ' + (devBuild ? 'development' : 'production') + ' build');

// reload task
gulp.task('reload', done => {
    browserSync.reload();
    done();
});

// manage images
gulp.task('images', function () {
    return gulp.src(images.in)
        .pipe($.size({
            title: 'images in '
        }))
        .pipe($.newer(images.out))
        .pipe($.plumber())
        .pipe($.image({
            jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
            // mozjpeg: ['-optimize', '-progressive'],
            // guetzli: ['--quality', 85],
            quiet: true
        }))
        // .pipe($.rename({dirname: ''}))
        .pipe($.size({
            title: 'images out '
        }))
        .pipe(gulp.dest(images.out));
});

// compile sass to css
gulp.task('compileSass', () => {
    let plugins = [
        postuncss()
    ];
    return gulp
        // import all email .scss files from src/scss folder
        // ** means any sub or deep-sub files or foders
        .src('./src/sass/**/*.scss')

        // on error, do not break the process
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.extractMediaQueries())
        // .pipe($.rename({dirname: ''}))
        // output to `src/css` folder
        .pipe(gulp.dest('./src/css'));
});

// build complete HTML email template
// compile sass (compileSass task) before running build
gulp.task('buildHTML', gulp.series('compileSass', () => {
    var htmlFilter = $.filter(['**/*.html', '!**/*.pug'], { restore: true }),
        htmlFilter2 = $.filter(['**/*.html', '!src/404.html', '!src/index.html'], { restore: true }),
        pugFilter = $.filter(['**/*.pug'], { restore: true });
    function replaceImagePath(file, input) {
        return input.replace(/(images\/)/g, `https://kathirr007.github.io/Email-workflow-Dev/${path.parse(file.path).dir.split('\\').pop()}/$1`)
        }
    return gulp
        // import all email template (name ending with .template.pug) files from src/emails folder
        .src(['src/*.html', 'src/emails/**/*.html', 'src/emails/**/*.pug', '!**/_*', '!**/_partials/**/*'])

        // replace `.scss` file paths from template with compiled file paths
        .pipe($.replace(new RegExp('\/sass\/(.+)\.scss', 'ig'), '/css/$1.css'))

        // do not generate sub-folders inside dist folder
        // .pipe($.rename({dirname: ''}))

        .pipe(htmlFilter)
        .pipe($.preprocess({
            context: {
                devBuild: devBuild,
                author: pkg.author,
                version: pkg.version
            },
        }))
        .pipe(htmlFilter.restore)
        // compile using Pug
        .pipe(pugFilter)
        /* .pipe($.fileInclude({
            prefix: '@@',
            basepath: '@file'
          })) */
        .pipe($.pug({
            doctype: 'html',
            pretty: true
        }))
        /* .pipe($.preprocess({
            context: {
                devBuild: devBuild,
                author: pkg.author,
                version: pkg.version
            },
        })) */
        .pipe(pugFilter.restore)
        // .pipe($.if(!devBuild, $.replace(/(images\/)/g, `https://kathirr007.github.io/Email-workflow-Dev/${path.parse(file.path).name}$1`)))
        .pipe($.if(!devBuild, $.tap(function(file, t) {
            // console.log(path.parse(file.path).dir.split('\\').pop())
            file.contents = Buffer.from(replaceImagePath(file, file.contents.toString()))
        })))
        // function inline() {
        //     return gulp.src('dist/**/*.html')
        //       .pipe($.if(PRODUCTION, $.foreach(function(stream, file) {
        //          var name = path.parse(file.path).name;
        //          return stream.pipe(inliner('dist/css/' + name + '.css'));
        //        })))
        //       .pipe(gulp.dest('dist'));
        //   }
        // .pipe($.if(!devBuild, $.resolvePath()))
        .pipe(htmlFilter2)
        // inline CSS
        .pipe($.inlineCss({
            applyStyleTags: false,
            removeStyleTags: false,
            preserveMediaQueries: false
        }))
        // remove unused css
        .pipe($.emailRemoveUnusedCss({
            whitelist: [
                ".ExternalClass",
                ".ReadMsgBody",
                ".yshortcuts",
                ".Mso*",
                ".maxwidth-apple-mail-fix",
                "#outlook",
                ".module-*",
                ".height_01",
                "span.MsoHyperlink",
                ".fallback-font",
                ".fb-font"
            ],
            removeHTMLComments: devBuild ? false : true
        }))
        .pipe(htmlFilter2.restore)
        .pipe($.if(devBuild, $.beautify.html({ indent_size: 2 })))
        .pipe($.if(!devBuild, $.tap(function(file, t) {
            // console.log(path.parse(file.path).dir.split('\\').pop())
            const cleanedHtmlResult = crush(file.contents.toString(), { removeLineBreaks: false, removeIndentations: true, lineLengthLimit: 500 })
            // const wrappedText = wrapper(cleanedHtmlResult.result, {wrapOn: 400})
            file.contents = Buffer.from(cleanedHtmlResult.result)
        })))
        // .pipe($.beautify.html({ indent_size: 2 }))

        // put compiled HTML email templates inside dist folder
        .pipe(gulp.dest(dest + 'emails'))
    })
);

// browserSync task to launch preview server
gulp.task('browserSync', () => {
    return browserSync.init({
        server: { baseDir: baseDir },
        open: false,
        port: 3030,
        injectChanges: true,
        reloadDelay: 2000, // reload after 2s, compilation is finished (hopefully)
        // reloadDelay: 0,
        notify: true
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
        gulp.watch(resources.watch, gulp.series('buildHTML', 'reload'));
        // gulp.watch('src/**/*.pug', gulp.series('build', 'reload'));
        
        // image changes
        gulp.watch(images.in, gulp.series('images'));
    })
);

// gulp.task('watch', gulp.series('build', 'browserSync', () => {
//         return gulp.watch(['src/**/*', '!src/**/*.css',], gulp.series('build', 'reloadBrowserSync'));
//     })
// );

// default task
gulp.task('default', gulp.parallel('buildHTML', 'images', 'watch'));

// build task
gulp.task('build', gulp.parallel('buildHTML', 'images'));