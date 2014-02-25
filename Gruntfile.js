module.exports = function(grunt) {

  // Initialize config.
  grunt.initConfig({
    meta: {
      port: '3000',
      dirs: {
        root: '.',
        public: './public',
        css: './public/custom/css',
        images: './public/custom/images',
        js: './public/custom/js',
        sass: './sass',
      }
    }
  });

  // Load per-task config from separate files.
  grunt.loadTasks('./grunt');

  // When Sails is lifted in development
  grunt.registerTask('dev',
    'Start a live-reloading dev webserver on localhost.', ['concurrent']);
};
