module.exports = function(grunt) {

  grunt.config('browserify', {
    home: {
      src: [grunt.config.get('meta.dirs.js') + '/home.js'],
      dest: grunt.config.get('meta.dirs.public') + '/dist/home.js'
    },
    submit: {
      src: [grunt.config.get('meta.dirs.js') + '/submit.js'],
      dest: grunt.config.get('meta.dirs.public') + '/dist/submit.js'
    },
    entry: {
      src: [grunt.config.get('meta.dirs.js') + '/entry.js'],
      dest: grunt.config.get('meta.dirs.public') + '/dist/entry.js'
    }
  });

  grunt.loadNpmTasks('grunt-browserify');

};
