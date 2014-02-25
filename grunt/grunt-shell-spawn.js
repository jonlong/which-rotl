module.exports = function(grunt) {

  grunt.config('shell', {
    // Install Bower components
    nodemon: {
      command: 'nodemon app.js',

    },
    options: {
      stdout: true
    }
  });

  grunt.loadNpmTasks('grunt-shell-spawn');

};
