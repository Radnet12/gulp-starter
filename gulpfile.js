// Обьявление переменных ---------------------------------------------------
const { src, dest, series, watch } = require("gulp");

// HTML
const htmlmin = require("gulp-htmlmin"),
  typograf = require("gulp-typograf"),
  fileInclude = require("gulp-file-include");
// HTML

// CSS
const autoprefixer = require("gulp-autoprefixer"),
  cleanCSS = require("gulp-clean-css"),
  sass = require("sass"),
  gulpSass = require("gulp-sass"),
  groupmedia = require("gulp-group-css-media-queries"),
  mainSass = gulpSass(sass);
// CSS

// JS
const webpackStream = require("webpack-stream");
// JS

// FONTS
const ttf2woff2 = require("gulp-ttf2woff2");
// FONTS

// IMAGES
const svgSprite = require("gulp-svg-sprite"),
  svgmin = require("gulp-svgmin"),
  cheerio = require("gulp-cheerio"),
  replace = require("gulp-replace"),
  webp = require("gulp-webp"),
  avif = require("gulp-avif"),
  imagemin = require("gulp-imagemin");
// IMAGES

// UTILS
const del = require("del"),
  browserSync = require("browser-sync").create(),
  gulpif = require("gulp-if"),
  notify = require("gulp-notify"),
  plumber = require("gulp-plumber"),
  path = require("path"),
  fs = require("fs"),
  zip = require("gulp-zip"),
  rootFolder = path.basename(path.resolve());
// UTILS

// Конец обьявление переменных ---------------------------------------------------

// Pathes
const srcFolder = "./src";
const buildFolder = "./dist";
const paths = {
  srcFontsConnect: `${srcFolder}/scss/settings/_fonts.scss`,
  srcSvg: `${srcFolder}/img/svg/**.svg`,
  srcImgFolder: `${srcFolder}/img`,
  buildImgFolder: `${buildFolder}/img`,
  srcScss: `${srcFolder}/scss/**/*.scss`,
  srcFonts: `${srcFolder}/fonts/**.ttf`,
  buildCssFolder: `${buildFolder}/css`,
  srcFullJs: `${srcFolder}/js/**/*.js`,
  srcMainJs: `${srcFolder}/js/script.js`,
  buildJsFolder: `${buildFolder}/js`,
  srcHtmlFolder: `${srcFolder}/html`,
  resourcesFolder: `${srcFolder}/resources`,
};

let isProduction = false; // dev by default

// Удаление dist
const clean = () => {
  return del([buildFolder]);
};

// HTML==============================================

// Функция обрабатывающая HTML
const htmlInclude = () => {
  return (
    src([`${srcFolder}/*.html`])
      // Плагин позволяющий делать импорт html файлов
      .pipe(
        fileInclude({
          prefix: "@",
          basepath: "@file",
        })
      )

      // Типограф
      .pipe(
        typograf({
          locale: ["ru", "en-US"],
        })
      )
      .pipe(dest(buildFolder))
      .pipe(browserSync.stream())
  );
};

// Функция обрабатывающая HTML (минификация)
const htmlMinify = () => {
  return (
    src(`${buildFolder}/**/*.html`)
      // Сжатие html
      .pipe(
        htmlmin({
          collapseWhitespace: true,
        })
      )
      .pipe(dest(buildFolder))
  );
};

// HTML==============================================

// CSS===============================================

// Функция работающая со стилями
const css = () => {
  return (
    src(paths.srcScss, { sourcemaps: !isProduction })
      // Оработка ошибок
      .pipe(
        plumber(
          notify.onError({
            title: "SCSS",
            message: "Error: <%= error.message %>",
          })
        )
      )

      // Обработка scss
      .pipe(mainSass())

      // Группировкам медиа запросов в низ файла
      .pipe(groupmedia())

      // Добавление префиксов для браузера
      .pipe(
        autoprefixer({
          cascade: false,
          overrideBrowserslist: [">1%", "not ie 11"],
        })
      )

      // Минификация css если продакшен
      .pipe(
        gulpif(
          isProduction,
          cleanCSS({
            level: 2,
          })
        )
      )

      // Выгрзука в папку dist
      .pipe(dest(paths.buildCssFolder, { sourcemaps: "." }))

      // Слежение за файлом
      .pipe(browserSync.stream())
  );
};

// Функция работающая со стилями (не сжимает итоговый файл)
const cssBackend = () => {
  return (
    src(paths.srcScss)
      // Оработка ошибок
      .pipe(
        plumber(
          notify.onError({
            title: "SCSS",
            message: "Error: <%= error.message %>",
          })
        )
      )

      // Обработка scss
      .pipe(mainSass())

      // Группировкам медиа запросов в низ файла
      .pipe(groupmedia())

      // Добавление префиксов для браузера
      .pipe(
        autoprefixer({
          cascade: false,
          grid: true,
          overrideBrowserslist: [">1%", "not ie 11"],
        })
      )

      // Выгрзука в папку dist
      .pipe(dest(paths.buildCssFolder))

      // Слежение за файлом
      .pipe(browserSync.stream())
  );
};

// CSS===============================================

// JS================================================

// Функция работающая со скриптами

const scripts = () => {
  return (
    src(paths.srcMainJs)
      // Оработка ошибок
      .pipe(
        plumber(
          notify.onError({
            title: "JS",
            message: "Error: <%= error.message %>",
          })
        )
      )

      // Настройки webpack
      .pipe(
        webpackStream({
          mode: isProduction ? "production" : "development",
          output: {
            filename: "script.js",
          },
          module: {
            rules: [
              {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: [
                      [
                        "@babel/preset-env",
                        {
                          targets: [">1%", "not ie 11"],
                        },
                      ],
                    ],
                  },
                },
              },
            ],
          },
          devtool: !isProduction ? "source-map" : false,
        })
      )
      .on("error", function (err) {
        console.error("WEBPACK ERROR", err);
        this.emit("end");
      })

      // Выгрзука в папку dist
      .pipe(dest(paths.buildJsFolder))

      // Слежение за файлом
      .pipe(browserSync.stream())
  );
};

// Функция работающая со скриптами (не сжимая итоговый файл, за счёт dev режима у webpack)
const scriptsBackend = () => {
  return (
    src(paths.srcMainJs)
      // Оработка ошибок
      .pipe(
        plumber(
          notify.onError({
            title: "JS",
            message: "Error: <%= error.message %>",
          })
        )
      )

      // Настройки webpack
      .pipe(
        webpackStream({
          mode: "development",
          output: {
            filename: "script.js",
          },
          module: {
            rules: [
              {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: [
                      [
                        "@babel/preset-env",
                        {
                          targets: [">1%", "not ie 11"],
                        },
                      ],
                    ],
                  },
                },
              },
            ],
          },
          devtool: false,
        })
      )
      .on("error", function (err) {
        console.error("WEBPACK ERROR", err);
        this.emit("end");
      })

      // Выгрзука в папку dist
      .pipe(dest(paths.buildJsFolder))

      // Слежение за файлом
      .pipe(browserSync.stream())
  );
};

// JS================================================

// FONTS=============================================

// Функция работающая со шрифтами (конвертация ttf в woff2)
const fonts = () => {
  src(`${srcFolder}/fonts/**.woff2`).pipe(dest("./dist/fonts/"));
  return src(`${paths.srcFonts}`)
    .pipe(ttf2woff2())
    .pipe(dest(`${buildFolder}/fonts/`))
    .pipe(browserSync.stream());
};

// Функция, которая проверяет жирность шрифта
const checkWeight = (fontname) => {
  let weight = 400;
  switch (true) {
    case /Thin/.test(fontname):
      weight = 100;
      break;
    case /ExtraLight/.test(fontname):
      weight = 200;
      break;
    case /Light/.test(fontname):
      weight = 300;
      break;
    case /Regular/.test(fontname):
      weight = 400;
      break;
    case /Medium/.test(fontname):
      weight = 500;
      break;
    case /SemiBold/.test(fontname):
      weight = 600;
      break;
    case /Semi/.test(fontname):
      weight = 600;
      break;
    case /Bold/.test(fontname):
      weight = 700;
      break;
    case /ExtraBold/.test(fontname):
      weight = 800;
      break;
    case /Heavy/.test(fontname):
      weight = 700;
      break;
    case /Black/.test(fontname):
      weight = 900;
      break;
    default:
      weight = 400;
  }
  return weight;
};

// Функция подключающая шрифт в файл fonts.scss
const fontsStyle = (done) => {
  const cb = () => {};
  // Очищаем файл scss для шрифтов
  fs.writeFile(paths.srcFontsConnect, "", cb);

  // Читаем папку со шрифтами
  fs.readdir(`${buildFolder}/fonts/`, function (err, items) {
    if (items) {
      let c_fontname;

      for (let i = 0; i < items.length; i++) {
        // Разбиваем файл по точке
        let fontname = items[i].split(".");

        // Получаем полное название шрифта (название + жирность + начертание)
        fontname = fontname[0];

        // Получаем название шрифта
        let font = fontname.split("-")[0];

        // Получаем жирность шрифта
        let weight = checkWeight(fontname);

        // Получаем начертание шрифта
        let fontStyle = /(Italic|italic)/g.test(fontname) ? "italic" : "normal";

        // Вставляем миксин для подключения шрифта через font-face
        if (c_fontname != fontname) {
          fs.appendFile(
            paths.srcFontsConnect,
            `@include font-face(${font}, ${fontname}, ${weight}, ${fontStyle});\r\n`,
            cb
          );
        }

        c_fontname = fontname;
      }
    }
  });

  done();
};

// FONTS=============================================

// IMAGES============================================

// Функция работающая с картинками
const images = () => {
  return (
    src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`])
      // Сжатие картинок
      .pipe(
        gulpif(
          isProduction,
          imagemin([
            imagemin.mozjpeg({
              quality: 80,
              progressive: true,
            }),
            imagemin.optipng({
              optimizationLevel: 2,
            }),
          ])
        )
      )
      .pipe(dest(paths.buildImgFolder))
  );
};

// Конвертация картинок в webp
const webpImages = () => {
  return src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`])
    .pipe(webp())
    .pipe(dest(paths.buildImgFolder));
};

// Конвертация картинок в avif
const avifImages = () => {
  return src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`])
    .pipe(avif())
    .pipe(dest(paths.buildImgFolder));
};

// Спрайты
const svgSprites = () => {
  return src(paths.srcSvg)
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          $("[fill]").removeAttr("fill");
          $("[stroke]").removeAttr("stroke");
          $("[style]").removeAttr("style");
        },
        parserOptions: {
          xmlMode: true,
        },
      })
    )
    .pipe(replace("&gt;", ">"))
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
          },
        },
      })
    )
    .pipe(dest(paths.buildImgFolder));
};

// IMAGES============================================

// Функция работающая с папкой resources (перенос файлов и пакой из папки resources в корень dist)
const resources = () => {
  return src(`${paths.resourcesFolder}/**`).pipe(dest(buildFolder));
};

// Наблюдение за изменениями в файлах
const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: `${buildFolder}`,
    },
  });

  watch(paths.srcScss, css);
  watch(paths.srcFonts, fonts);
  watch(paths.srcFonts, fontsStyle);
  watch(paths.srcFullJs, scripts);
  watch(`${paths.srcHtmlFolder}/**/*.html`, htmlInclude);
  watch(`${srcFolder}/*.html`, htmlInclude);
  watch(`${paths.resourcesFolder}/**`, resources);
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`, images);
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`, webpImages);
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`, avifImages);
  watch(paths.srcSvg, svgSprites);
};

const zipFiles = (done) => {
  del.sync([`${buildFolder}/*.zip`]);
  return (
    src(`${buildFolder}/**/*.*`, {})
      // Оработка ошибок
      .pipe(
        plumber(
          notify.onError({
            title: "ZIP",
            message: "Error: <%= error.message %>",
          })
        )
      )

      // Архивирование
      .pipe(zip(`${rootFolder}.zip`))
      .pipe(dest(buildFolder))
  );
};

// Прод
const toProd = (done) => {
  isProduction = true;
  done();
};

// СКРИПТЫ

exports.default = series(
  clean,
  htmlInclude,
  css,
  fonts,
  fontsStyle,
  scripts,
  resources,
  images,
  webpImages,
  avifImages,
  svgSprites,
  watchFiles
);

exports.backend = series(
  clean,
  htmlInclude,
  cssBackend,
  fonts,
  fontsStyle,
  scriptsBackend,
  resources,
  images,
  webpImages,
  avifImages,
  svgSprites
);

exports.build = series(
  toProd,
  clean,
  htmlInclude,
  css,
  fonts,
  fontsStyle,
  scripts,
  resources,
  images,
  webpImages,
  avifImages,
  svgSprites,
  htmlMinify
);

exports.deploy = series(
  toProd,
  clean,
  htmlInclude,
  css,
  fonts,
  fontsStyle,
  scripts,
  resources,
  images,
  webpImages,
  avifImages,
  svgSprites,
  htmlMinify
);
// СКРИПТЫ

exports.zip = zipFiles;
