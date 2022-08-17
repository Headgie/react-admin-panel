import gulp from  "gulp";
import webpackStream from "webpack-stream";
import gulpSass from "gulp-sass"
import dartSass from "sass";
import plumber from "gulp-plumber"; // Обработка ошибок
import notify from "gulp-notify"; // Нотификация

const sass = gulpSass(dartSass);

//const dist = "T:\\OpenServer\\domains\\react-admin\\admin"
const dist = "../../OpenServer/domains/react-admin/admin";
gulp.task("copy-html", ()=>{
    return gulp.src("./app/src/index.html")
      .pipe(gulp.dest(dist))
  
});

gulp.task("build-js", ()=>{
  return gulp.src("./app/src/main.js")
            .pipe(webpackStream({
              mode: "development",
              output: {
                filename: "script.js",
              },
              watch: false,
              devtool: "source-map",
              module: {
                rules: [
                  {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                      loader: 'babel-loader',
                      options: {
                        presets: [['@babel/preset-env',{
                          debug: true,
                          corejs: 3,
                          useBuiltIns: "usage" 
                        }],
                        ['@babel/react']]
                      }
                    }
                  }
                ]
              }

            }))
            .pipe(gulp.dest(dist))
})

gulp.task("build-sass", () => {
  return gulp.src("./app/scss/style.scss")
    .pipe(plumber(
      notify.onError({
        title: "SCSS",
        message: "Error <%= error.message %>"
      })
    ))
    .pipe(sass({
      outputStyle: "expanded"
    }))
    .pipe(gulp.dest(dist))
})

gulp.task("copy-api", ()=>{
  return gulp.src("./app/api/**/*.*")
    .pipe(gulp.dest(dist + "/api"))
});

gulp.task("copy-assets", ()=>{
  return gulp.src("./app/assets/**/*.*")
    .pipe(gulp.dest(dist + "/assets"))
});

gulp.task("watch",()=> {
  gulp.watch("./app/src/index.html", gulp.parallel("copy-html"));
  gulp.watch("./app/assets/**/*.*", gulp.parallel("copy-assets"));
  gulp.watch("./app/api/**/*.*", gulp.parallel("copy-api"));
  gulp.watch("./app/scss/**/*.scss", gulp.parallel("build-sass"));
  gulp.watch("./app/src/**/*.js", gulp.parallel("build-js"));
})

gulp.task("build", gulp.parallel("copy-html", "copy-assets","copy-api", "build-sass","build-js"));

gulp.task("default", gulp.parallel("watch", "build"));