module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            'assets/js/main.min.js': 'assets/js/main.js'
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'assets/css/main.css': 'assets/css/main.scss'
                }
            }
        },
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'assets/css/main.min.css': 'assets/css/main.css'
                }
            }
        }
    });

    // carrega plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'sass', 'cssmin']);
};