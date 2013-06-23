({
    baseUrl: '../src/js',
    mainConfigFile: '../src/js/app/main.js',
    name: 'app/main',
    out: '../src/js/compiled/compiled.js',
    preserveLicenseComments: false,
    generateSourceMaps: false,
    optimize: 'uglify2',
    paths: {
        requireLib: 'libs/require',
	    json2: 'libs/json2',
	    stats: 'libs/stats',
	    preloadjs:'libs/preloadjs-0.3.1.min'
    },
	shim: {
		json2: {
			exports: 'JSON'
		},
		stats: {
			exports: 'Stats'
		},
		'preloadjs': {
			exports: 'createjs.PreloadJS'
		}
	},
    include: 'requireLib'
})