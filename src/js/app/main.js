/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

//TODO: NEXT
// vary the speed of the character based on the incline, eg:
// if the incline is -90 (straight up and down) the character is moved left by the amount the ground was moved left for that frame
// if the incline is 0 (flat) the character stays in the same 'x' space
// if the incline is aiming down speed up

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

	var handleResourceLoadComplete = function($e){
		L.log('Resource Loaded: ', '@loading');
		var sheet = loadQueue.getResult('runnerSheet');
		resources.addResource('runnerSheet', sheet);

		//Kick off game:
		//game.update();
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


	var resources = new Resources();
	var loadQueue = new createjs.LoadQueue();
	loadQueue.loadFile({id:'runnerSheet', src:'resources/runnerSheet.png'});
	loadQueue.addEventListener('complete', handleResourceLoadComplete);
	var gameCanvas = document.getElementById('gameCanvas');
	var game = new Game(document, window, gameCanvas,gameCanvas.width,gameCanvas.height);

});
