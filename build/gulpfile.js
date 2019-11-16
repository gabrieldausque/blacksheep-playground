const gulp = require('gulp');
const debug = require('gulp-debug');
const concatenate = require('gulp-concat');
const fs = require('fs');

const finalfileName = 'blacksheepgameengine-build.js';

gulp.task('create-file', function() {
    return gulp.src([
        'src/coreengine/Helpers/*.js',
        'src/coreengine/Components/Component.js',
        'src/coreengine/Components/*.js',
        'src/coreengine/Behaviors/Behavior.js',
        'src/coreengine/Behaviors/*.js',
        'src/coreengine/Entities/Entity.js',
        'src/coreengine/Entities/*.js',
        'src/coreengine/Engines/*.js'
        ]).pipe(debug({title: "concat-file"}))
        .pipe(concatenate(finalfileName))
        .pipe(gulp.dest('dist/'))
});

gulp.task('remove-import', function(cb) {
   let concatScript = fs.readFileSync('dist/' + finalfileName, 'utf8');
   concatScript = concatScript.replace(/import.*;\n/g, '');
   concatScript = concatScript.replace(/export default/g,'export ');
   //concatScript = concatScript.replace(/export /g,'');
   fs.writeFileSync('dist/' + finalfileName, concatScript);
   cb();
});

gulp.task('copy-to-demos', function() {
    return gulp.src(['dist/*.js'])
    .pipe(gulp.dest('demo/BouncingBall/js'))
    .pipe(gulp.dest('demo/Deformations/js'))
})

gulp.task('default', gulp.series('create-file', 'remove-import', 'copy-to-demos'));