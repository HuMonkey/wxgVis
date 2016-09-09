var gulp = require('gulp'),
    clean = require('gulp-clean'),
    webpack = require('webpack'),
    zip = require('gulp-zip');

gulp.task('clean', function () {
    gulp.src(['./build', './.sass-cache'])
        .pipe(clean({force: true}));
});

function move() {
    gulp.src('dist/**/*.js')
        .pipe(gulp.dest('build/dist/'));
    gulp.src('./*.html')
        .pipe(gulp.dest('build/'));
    gulp.src('static/**/*')
        .pipe(gulp.dest('build/static/'));
}

gulp.task('build', ['clean'], move);

//压缩成.war
gulp.task('zip', function () {
    gulp.src('./build/**')
        .pipe(zip('wxgvis.zip'))
        .pipe(gulp.dest('./'));
});