var gulp = require('gulp')
var childProcess = require('child_process')
var electron = require('electron-prebuilt')

gulp.task('run', function () {
  childProcess.spawn(electron, ['--debug=5858', '.'], {stdio: 'inherit'})
})
