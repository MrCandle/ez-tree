var gulp = require('gulp');

gulp.task('copy-images', function () {
  gulp.src('./src/app/ez-tree/img/*.svg')
    .pipe(gulp.dest('./dist/src/app/ez-tree/img'))
});

gulp.task('default', ['copy-images']);


