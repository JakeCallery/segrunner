/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

//TODO: NEXT
// Cull dead segments
// SpriteSheet management
//  - Implement sequence chaining (for old seq -> transition out -> transition in -> new looping seq)
//  - Implement Sequence Queue, or manager or something like that
// Parallax backgrounds
// Final Art style


define([
'jac/logger/Logger',
'jac/logger/ConsoleTarget',
'jac/polyfills/RequestAnimationFrame',
'app/game/Game',
'jac/utils/EventUtils',
'preloadjs',
'app/resources/Resources'],
function(L,ConsoleTarget,RequestAnimationFrame,Game,EventUtils,preloadjs,Resources){
	L.addLogTarget(new ConsoleTarget());
	L.log('New Main!', '@main');

	var game,gameCanvas;

	var handleResourceLoadComplete = function($e){
		L.log('Resource Load Complete: ', '@resource');
		var sheet = resources.getResource($e.data);

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
	resources.loadResource('runnerSheet','resources/runnerSheet.png');

});
