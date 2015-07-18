module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			scripts: {
				files: ['js/**/*.js', 'js/*.js'],
				tasks: ['uglify'],
				options: {
					debounceDelay: 500,
					spawn: true
				}
			},
			html: {
				files: ['views/**/*.html', 'views/*.html', 'index.html', 'index.release.html'],
				tasks: ['htmlmin'],
				options: {
					debounceDelay: 500,
					spawn: true
				}
			},
			css: {
				files: ['css/**/*.css', 'css/*.css'],
				tasks: ['cssmin'],
				options: {
					debounceDelay: 500,
					spawn: true
				}
			},
		},
		htmlmin: {
			options: {
				newer: false,
				removeComments: true
			},
			files: {
				options: {
					collapseWhitespace: true,
				},
				files: {
					src: 'views/**/*.html',
					dest: 'release/'
				}
			}
		},
		cssmin: {
			options: {},
			default_target: {
				files: {
					'release/css/app.min.css': ['css/*.css', 'css/**/*.css']
				}
			}
		},
		uglify: {
			options: {
				banner: '/**\n* dv simple patcher tree maker client v0.10.0\n* Roseller Velicaria, Jr. <r.velicaria.jr@gmail.com>\n*/\n\n',
				mangle: true,
				compress: true
			},
			default_target: {
				files: {
					'release/js/app.min.js': [
						'js/app.js',
						'js/**/*.js'
					]
				}
			}
		}
		
	});

	grunt.registerTask('wiring', function() {
		var fs = require('fs'),
			path = require('path');

		fs.symlink(path.resolve(__dirname, 'bower_components'), path.resolve(__dirname, 'release', 'bower_components'), 'dir');
		// fs.symlink(path.resolve(__dirname, 'js', 'packages'), path.resolve(__dirname, 'release', 'js', 'packages'), 'dir');
		fs.symlink(path.resolve(__dirname, 'index.release.html'), path.resolve(__dirname, 'release', 'index.html'));

	});

	grunt.loadNpmTasks('grunt-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['cssmin', 'uglify', 'htmlmin', 'wiring']);
};
