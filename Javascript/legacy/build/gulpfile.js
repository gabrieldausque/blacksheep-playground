const gulp = require('gulp');
const debug = require('gulp-debug');
const concatenate = require('gulp-concat');
const fs = require('fs');
const finalfileName = 'blacksheepgameengine-build.js';

if(! fs.existsSync('src')) {
    console.log('Changing working directory');
    process.chdir('../');
}

gulp.task('create-file', function() {
    return gulp.src([
        'packages/coreengine/Helpers/*.js',
        'packages/coreengine/Components/Component.js',
        'packages/coreengine/Components/*.js',
        'packages/coreengine/Behaviors/Behavior.js',
        'packages/coreengine/Behaviors/*.js',
        'packages/coreengine/Entities/Entity.js',
        'packages/coreengine/Entities/*.js',
        'packages/coreengine/Engines/*.js'
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
    .pipe(gulp.dest('demo/Platformer/js'))
    .pipe(gulp.dest('demo/ActionRpgDemo/js'))
})

gulp.task('default', gulp.series('create-file', 'remove-import', 'copy-to-demos'));