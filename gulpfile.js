const GulpClient = require("gulp");
const autoPrefixer = require("gulp-autoprefixer");
const less = require("gulp-less");
const minifyCSS = require("gulp-minify-css");
const rename = require("gulp-rename");
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const GulpUglify = require("gulp-uglify");
// const imagemin = require("gulp-imagemin");
const runsequence = require('gulp-run-sequence');
const connect = require('gulp-connect');

// 编译less文件
GulpClient.task('less',() => {
    return GulpClient.src('./css/**/*.less')
    .pipe(less())//编译less
    .pipe(minifyCSS())//简化css
    .pipe(autoPrefixer({
        overrideBrowserslist: ['last 2 version'], // 兼容最新的两个版本
        cascade: false
    }))
    .pipe(rename({
        suffix: '.min' // 将压缩后的css文件名添加上.min
    }))
    .pipe(GulpClient.dest('dist/css'))
})


GulpClient.task('js',() => {
    return GulpClient.src('./js/**/*.js')
    .pipe(concat('vender.js'))//合并
    .pipe(GulpUglify())//丑化
    .pipe(GulpClient.dest('./dist/js'))//目标文件
})

GulpClient.task('copy-index',() => {
    return GulpClient.src('index.html')
    .pipe(GulpClient.dest('./dist/'))
})

GulpClient.task('data',() => {
    return GulpClient.src('./data/**/*.{json,xml}')
    .pipe(GulpClient.dest('./dist/data'))
})

// GulpClient.task('images',() => {
//     return GulpClient.src('./img/**/*.{jpg,png,gif}')
//     .pipe(imagemin())//压缩图片
//     .pipe(GulpClient.dest('./dist/img'))
// })

GulpClient.task('css',() => {
    return GulpClient.src('./css**/*.css')
    .pipe(minifyCSS())
    .pipe(rename({
        suffix:'.min'
    }))
    .pipe(GulpClient.dest('dist/css'))
})

GulpClient.task('html', () =>{
    return GulpClient.src('./html/**/*.html')
    .pipe(GulpClient.dest('dist/html'))
})

// GulpClient.task('sass',() => {
//     return GulpClient.src('./css/**/*.{sass,scss}')
//     .pipe(sass())
//     .pipe(minifyCSS())
//     .pipe(rename({
//         suffix:'.min'
//     }))
//     .pipe(GulpClient.dest('dist/css'))
// })

GulpClient.task('server',async () => {
    connect.server({
        root:'dist',
        livereload:'true'//热加载
    })
})


GulpClient.task('watch',async () => {
    GulpClient.watch('./css/**/*.less',GulpClient.series(['less']))
    // GulpClient.watch('./css/**/*.{sass,scss}',GulpClient.series(['sass']))
    GulpClient.watch('./css**/*.css',GulpClient.series(['css']))
    GulpClient.watch('./js/**/*.js',GulpClient.series(['js']))
    // GulpClient.watch('./img/**/*.{jpg,png,gif}',GulpClient.series(['images']))
    GulpClient.watch('./data/**/*.{json,xml}',GulpClient.series(['data']))
    GulpClient.watch('index.html',GulpClient.series(['copy-index']))
    GulpClient.watch('./html/**/*.html',GulpClient.series(['html']))
})




GulpClient.task('build',GulpClient.series(['less','css','js','data','copy-index','html']),() => {
    runsequence('concat');
    console.log('编译成功');
})


GulpClient.task('default',GulpClient.series('build', 'server'))