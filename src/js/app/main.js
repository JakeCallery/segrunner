/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

//TODO: NEXT
// Jumping (REMOVED, maybe try again later)
// Parallax backgrounds
// Final Character Art


define([
'jac/logger/Logger',
'jac/logger/ConsoleTarget',
'jac/polyfills/RequestAnimationFrame',
'app/game/Game',
'jac/utils/EventUtils',
'preloadjs',
'app/resources/Resources',
'app/config/AppConfig',
'jac/utils/BrowserUtils'],
function(L,ConsoleTarget,RequestAnimationFrame,Game,EventUtils,preloadjs,Resources,AppConfig,BrowserUtils){
	L.addLogTarget(new ConsoleTarget());
	L.log('New Main!', '@main');

	var game,gameCanvas;

	var appConfig = new AppConfig();

	//Grab params
	var params = BrowserUtils.getURLParams(window);

	if(params.hasOwnProperty('debug')){
		appConfig.isDebugging = !!(params['debug'] === 'true');
	}

	L.log('App Debug: ' + appConfig.isDebugging, '@main');

	var handleResourceLoadComplete = function($e){
		L.log('Resource Load Complete: ', '@resource');

		//set up game bits
		gameCanvas = document.getElementById('gameCanvas');
		game = new Game(document, window, gameCanvas,gameCanvas.width,gameCanvas.height);

		//Kick off game:
		game.update();
	};
	//game.update();

	var stepButtonEl = document.getElementById('stepButton');
	EventUtils.addDomListener(stepButtonEl, 'click', function(e){
		game.update(true);
	});

	var startButtonEl = document.getElementById('startButton');
	EventUtils.addDomListener(startButtonEl, 'click', function(e){
		game.update();
	});

	var stopButtonEl = document.getElementById('stopButton');
	EventUtils.addDomListener(stopButtonEl, 'click', function(e){
		game.pause();
	});


	//Load up resources
	var resources = new Resources();
	resources.addHandler('fileLoaded',handleResourceLoadComplete);
	//resources.loadResource('runnerSheet','resources/runnerSheet.png');
	resources.loadResource('runnerSheet','resources/runnerSheet_black.png');

});
