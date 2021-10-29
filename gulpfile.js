const path = require("path");
const gulp = require("gulp");
// const gulp = require('gulp-param')(require('gulp'), process.argv);
const $ = require("gulp-load-plugins")({
  lazy: true,
});
const gulpSass = require("gulp-sass")(require("sass"));
// const pug = require('gulp-pug');
const pkg = require("./package.json");
const { crush } = require("html-crush");
const { comb } = require("email-comb");
const wrapper = require("text-wrapper").wrapper;
const del = require("del");
const uncss = require("uncss");
const postuncss = require("postcss-uncss");
const whitelist = [
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
  ".fb-font",
  ".p-o-10",
  ".px-o-10",
  ".py-o-15",
  ".d-o-block",
  ".mcn*",
];
// const sass = require('gulp-sass');
// const replace = require('gulp-replace');
// const inlineCss = require('gulp-inline-css');
// const rename = require('gulp-rename');
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
const pathOptions = {
  ext: {
    template: ["html"],
  },
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

const devBuild =
  (process.env.NODE_ENV || "development").trim().toLowerCase() !== "production";

const source = "./";
const dest = devBuild ? "builds/development/" : "dist/";
const baseDir = dest;

// in: source + 'src/emails/**/*.(jpg|jpeg|png|svg|gif)',
let images = {
  in: [
    "src/**/*.{png,gif,jpg,jpeg,svg}",
    "!src/landingPages/**/*.{png,gif,jpg,jpeg,svg}",
  ],
  out: dest,
};

let html = {
  in: ["src/*.html"],
  watch: ["src/*.html", "src/_partials/*.html"],
  out: `${dest}`,
};

let resources = {
  watch: [
    "src/**/*.pug",
    "src/**/*.html",
    "!src/*.html",
    "!src/_partials/*.html",
    "!**/landingPages/**/*",
    "!src/**/*.css",
  ],
};

let landingPages = {
  assets: {
    in: [
      "src/landingPages/**/*",
      "!src/landingPages/**/*.{css,html,js,scss,png,gif,jpg,jpeg,svg}",
    ],
    watch: [],
  },
  images: {
    in: ["src/landingPages/**/*.{png,gif,jpg,jpeg,svg}"],
  },
  css: {
    in: ["src/landingPages/**/*.{css,scss}"],
    watch: ["src/landingPages/**/*.{scss,css}"],
    sassOpts: {
      outputStyle: devBuild ? "compressed" : "compressed",
      imagePath: "../assets/img",
      precision: 3,
      errLogToConsole: true,
      sourceMap: true,
    },
  },
  html: {
    in: ["src/landingPages/**/*.html", "!src/landingPages/**/_partials/*.html"],
    watch: [
      "src/landingPages/**/*.html",
      "src/landingPages/**/_partials/*.html",
    ],
  },
  js: {
    in: ["src/landingPages/**/*.js"],
    watch: ["src/landingPages/**/*.js"],
  },
  watch: ["src/landingPages/**/*.html", "src/landingPages/**/_partials/*.html"],
  out: `${dest}/landingPages`,
};

let fonts = {
  in: source + "src/fonts/**/*",
  out: dest + "emails/fonts/",
};

// Clean tasks
gulp.task("clean", function (done) {
  del([dest + "*"]);
  done();
});

gulp.task("clean-images", function (done) {
  del([dest + "**/images/**/*"]);
  done();
});

gulp.task("clean-css", function (done) {
  del(["./src/css/**/*"]);
  done();
});

gulp.task("clean-fonts", function (done) {
  del([dest + "./emails/fonts/**/*"]);
  done();
});

gulp.task("clean-html", (cb) => {
  del([dest + "**/*.html"]);
  cb();
});

gulp.task("clean-landingpages", function (done) {
  del([dest + "/landingPages/**/*"]);
  done();
});

// show build type
console.log(
  pkg.name +
    " " +
    pkg.version +
    ", " +
    (devBuild ? "development" : "production") +
    " build"
);

// reload task
gulp.task("reload", (done) => {
  browserSync.reload();
  done();
});

// manage images
gulp.task("images", function () {
  return (
    gulp
      .src(images.in)
      .pipe(
        $.size({
          title: "images in ",
        })
      )
      .pipe($.newer(images.out))
      .pipe($.plumber())
      .pipe(
        $.image({
          jpegRecompress: [
            "--strip",
            "--quality",
            "medium",
            "--min",
            40,
            "--max",
            80,
          ],
          // mozjpeg: ['-optimize', '-progressive'],
          // guetzli: ['--quality', 85],
          quiet: true,
        })
      )
      // .pipe($.rename({dirname: ''}))
      .pipe(
        $.size({
          title: "images out ",
        })
      )
      .pipe(gulp.dest(images.out))
  );
});

// copy fonts
gulp.task("fonts", () => {
  return gulp.src(fonts.in).pipe($.newer(fonts.out)).pipe(gulp.dest(fonts.out));
});

// landingPages
gulp.task("html", function () {
  return (
    gulp
      .src(["src/*.html"])
      .pipe($.plumber())
      // .pipe(htmlFilter)
      .pipe(
        $.preprocess({
          context: {
            devBuild: devBuild,
            author: pkg.author,
            version: pkg.version,
          },
        })
      )
      // .pipe(htmlFilter.restore)
      .pipe(gulp.dest(dest))
  );
});

// copy fonts
gulp.task("landingAssets", () => {
  return gulp
    .src(landingPages.assets.in)
    .pipe($.newer(landingPages.out))
    .pipe(gulp.dest(landingPages.out));
});

// manage landing page images
gulp.task("landingImages", function () {
  return gulp
    .src(landingPages.images.in)
    .pipe(
      $.size({
        title: "images in ",
      })
    )
    .pipe($.newer(landingPages.out))
    .pipe($.plumber())
    .pipe(
      $.image({
        jpegRecompress: [
          "--strip",
          "--quality",
          "medium",
          "--min",
          40,
          "--max",
          80,
        ],
        quiet: true,
      })
    )
    .pipe(
      $.size({
        title: "images out ",
      })
    )
    .pipe(gulp.dest(landingPages.out));
});

// landingPages
gulp.task(
  "landingPages",
  gulp.parallel(() => {
    return (
      gulp
        .src(landingPages.html.in)
        .pipe($.plumber())
        // .pipe(htmlFilter)
        .pipe(
          $.preprocess({
            context: {
              devBuild: devBuild,
              author: pkg.author,
              version: pkg.version,
            },
          })
        )
        // .pipe(htmlFilter.restore)
        .pipe(gulp.dest(landingPages.out))
    );
  })
);

// copy landingpage js
gulp.task("landingJs", () => {
  return gulp
    .src(landingPages.js.in)
    .pipe($.newer(landingPages.out))
    .pipe(gulp.dest(landingPages.out));
});

// compile sass to css
gulp.task(
  "landingSass",
  gulp.series(() => {
    let cssFilter = $.filter(["**/*.css"], { restore: true });
    return (
      gulp
        .src(landingPages.css.in)
        .pipe(
          $.size({
            title: "SCSS in ",
          })
        )
        .pipe(cssFilter)
        .pipe(
          $.rename(function (path) {
            path.extname = ".scss";
          })
        )
        .pipe($.plumber())
        .pipe(gulpSass(landingPages.css.sassOpts))
        .pipe(cssFilter.restore)
        .pipe($.sourcemaps.init({ largeFile: true }))
        .pipe($.plumber())
        .pipe(gulpSass(landingPages.css.sassOpts))
        //.pipe($.purifyCss(['./builds/**/*.js', './builds/**/*.html']))
        /* .pipe($.plumber())
            .pipe($.cssnano())
            .pipe($.csso())
            .pipe($.cleanCss({level: {2: {all: true}}})) */
        // .pipe($.crass())
        /* .pipe($.cleanCss({level: {1: {all: true}, 2: {all: true}}}))
            .pipe($.cleanCss({level: {1: {all: true}, 2: {all: true}}}))
            .pipe($.cssnano()) */
        .pipe(
          $.size({
            title: "SCSS out ",
          })
        )
        .pipe($.sourcemaps.write("./maps"))
        .pipe(gulp.dest(landingPages.out))
        // .pipe(browserSync.stream({match: ['**/*.map', '**/*.css']}));
        .pipe(browserSync.stream())
    );
    // .pipe(reload({stream: true}));
  })
);

// compile landingpage sass to css
gulp.task("compileSass", () => {
  let plugins = [postuncss()];
  return (
    gulp
      // import all email .scss files from src/scss folder
      // ** means any sub or deep-sub files or foders
      .src("./src/sass/**/*.scss")

      // on error, do not break the process
      .pipe(gulpSass().on("error", gulpSass.logError))
      .pipe($.extractMediaQueries())
      // .pipe($.rename({dirname: ''}))
      // output to `src/css` folder
      .pipe(gulp.dest("./src/css"))
  );
});

// build complete HTML email template
// compile sass (compileSass task) before running build
gulp.task(
  "buildHTML",
  gulp.series("fonts", () => {
    var htmlFilter = $.filter(["**/*.html", "!**/*.pug"], { restore: true }),
      htmlFilter2 = $.filter(
        ["**/*.html", "!src/404.html", "!src/index.html"],
        { restore: true }
      ),
      lengthyHTMLFilter = $.filter(["**/*template-one.html"], {
        restore: true,
      }),
      mailChimpFilter = $.filter(
        [
          "**/gmailIssues/**/*Updated.html",
          "**/gmailIssues/**/*Updated-2.html",
        ],
        { restore: true }
      ),
      pugFilter = $.filter(["**/*.pug"], { restore: true });
    function cleanUnUsedCss(
      file,
      t,
      uglify = false,
      rmvHTMLCmnts = false,
      rmvCSSCmnts = false,
      rmvIndent = false
    ) {
      const cleanedUnusedCss = comb(file.contents.toString(), {
        whitelist,
        uglify: uglify,
        removeHTMLComments: rmvHTMLCmnts,
        removeCSSComments: rmvCSSCmnts,
        removeIndentations: rmvIndent,
      });
      return (file.contents = Buffer.from(cleanedUnusedCss.result));
    }
    function replaceImagePath(file, input) {
      return input.replace(
        /(src=")(images\/)/g,
        `$1https://kathirr007.github.io/Email-workflow-Dev/${path
          .parse(file.path)
          .dir.split("\\")
          .pop()}/$2`
      );
    }
    return (
      gulp
        // import all email template (name ending with .template.pug) files from src/emails folder
        .src([
          "!src/*.html",
          "src/emails/**/*.html",
          "src/emails/**/*.pug",
          "!**/landingPages/**/*",
          "!**/_*",
          "!**/_partials/**/*",
        ])
        .pipe($.newer(dest + "emails/**/*.html"))

        // replace `.scss` file paths from template with compiled file paths
        .pipe($.replace(new RegExp("/sass/(.+).scss", "ig"), "/css/$1.css"))

        // do not generate sub-folders inside dist folder
        // .pipe($.rename({dirname: ''}))

        .pipe(htmlFilter)
        .pipe(
          $.preprocess({
            context: {
              devBuild: devBuild,
              author: pkg.author,
              version: pkg.version,
            },
          })
        )
        .pipe(htmlFilter.restore)
        // compile using Pug
        .pipe(pugFilter)
        /* .pipe($.fileInclude({
            prefix: '@@',
            basepath: '@file'
          })) */
        .pipe(
          $.pug({
            doctype: "html",
            pretty: true,
          })
        )
        /* .pipe($.preprocess({
            context: {
                devBuild: devBuild,
                author: pkg.author,
                version: pkg.version
            },
        })) */
        .pipe(pugFilter.restore)
        // .pipe($.if(!devBuild, $.replace(/(images\/)/g, `https://kathirr007.github.io/Email-workflow-Dev/${path.parse(file.path).name}$1`)))
        .pipe(
          $.if(
            !devBuild,
            $.tap(function (file, t) {
              // console.log(path.parse(file.path).dir.split('\\').pop())
              file.contents = Buffer.from(
                replaceImagePath(file, file.contents.toString())
              );
            })
          )
        )
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
        .pipe(
          $.inlineCss({
            applyStyleTags: false,
            removeStyleTags: false,
            preserveMediaQueries: false,
          })
        )
        // remove unused css
        .pipe(
          $.tap(function (file, t) {
            cleanUnUsedCss(file, t);
          })
        )
        .pipe(htmlFilter2.restore)
        // Production html minification start
        .pipe($.if(devBuild, $.beautify.html({ indent_size: 2 })))
        .pipe(lengthyHTMLFilter)
        .pipe(
          $.if(
            !devBuild,
            $.tap(function (file, t) {
              cleanUnUsedCss(file, t, true, true, true);
            })
          )
        )
        .pipe(
          $.if(
            !devBuild,
            $.tap(function (file, t) {
              // console.log(path.parse(file.path).dir.split('\\').pop())
              const cleanedHtmlResult = crush(file.contents.toString(), {
                removeLineBreaks: false,
                removeIndentations: true,
                lineLengthLimit: 500,
              });
              // const wrappedText = wrapper(cleanedHtmlResult.result, {wrapOn: 400})
              file.contents = Buffer.from(cleanedHtmlResult.result);
            })
          )
        )
        .pipe(lengthyHTMLFilter.restore)
        .pipe(mailChimpFilter)
        .pipe(
          $.if(
            !devBuild,
            $.tap(function (file, t) {
              cleanUnUsedCss(file, t, false, false, false, true);
            })
          )
        )
        // .pipe($.if(!devBuild, $.htmlmin({collapseWhitespace: true, maxLineLength: 500})))
        .pipe(
          $.if(
            !devBuild,
            $.tap(function (file, t) {
              // console.log(path.parse(file.path).dir.split('\\').pop())
              const cleanedHtmlResult = crush(file.contents.toString(), {
                removeLineBreaks: false,
                removeIndentations: true,
                removeHTMLComments: false,
                removeCSSComments: false,
                lineLengthLimit: 500,
              });
              // const wrappedText = wrapper(cleanedHtmlResult.result, {wrapOn: 400})
              file.contents = Buffer.from(cleanedHtmlResult.result);
            })
          )
        )
        .pipe(mailChimpFilter.restore)
        // Production html minification end
        // .pipe($.beautify.html({ indent_size: 2 }))

        // put compiled HTML email templates inside dist folder
        .pipe(gulp.dest(dest + "emails"))
    );
  })
);

// browserSync task to launch preview server
gulp.task("browserSync", () => {
  return browserSync.init({
    server: { baseDir: baseDir },
    open: false,
    port: 3030,
    injectChanges: true,
    reloadDelay: 2000, // reload after 2s, compilation is finished (hopefully)
    // reloadDelay: 0,
    notify: true,
  });
});

// task to reload browserSync
gulp.task("reloadBrowserSync", () => {
  return browserSync.reload();
});

// watch source files for changes
// run `build` task when anything inside `src` folder changes (except .css)
// and reload browserSync
gulp.task(
  "watch",
  gulp.parallel("browserSync", () => {
    // html changes
    // gulp.watch(b2bhtml.watch, gulp.series('b2bhtml'));
    // gulp.watch(html.watch, gulp.series('html', 'reload'));
    gulp.watch(resources.watch, gulp.series("buildHTML", "reload"));
    gulp.watch(html.watch, gulp.series("html", "reload"));
    gulp.watch(landingPages.html.watch, gulp.series("landingPages", "reload"));
    gulp.watch(landingPages.css.watch, gulp.series("landingSass"));
    gulp.watch(landingPages.js.watch, gulp.series("landingJs", "reload"));
    gulp.watch("./src/sass/**/*.scss", gulp.series("compileSass", "reload"));

    // landingPages assets
    gulp.watch(landingPages.assets.in, gulp.series("landingAssets", "reload"));

    // image changes
    gulp.watch(images.in, gulp.series("images"));
    gulp.watch(landingPages.images.in, gulp.series("landingImages"));
  })
);

// gulp.task('watch', gulp.series('build', 'browserSync', () => {
//         return gulp.watch(['src/**/*', '!src/**/*.css',], gulp.series('build', 'reloadBrowserSync'));
//     })
// );

// default task
gulp.task(
  "default",
  gulp.parallel(
    "buildHTML",
    "images",
    "landingPages",
    "landingAssets",
    "landingImages",
    "landingJs",
    "landingSass",
    "watch"
  )
);

// build task
gulp.task("build", gulp.parallel("html", "buildHTML", "images"));
