/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/logger/Logger',
'jac/logger/ConsoleTarget',
'jac/polyfills/RequestAnimationFrame',
'app/game/Game'],
function(L,ConsoleTarget,RequestAnimationFrame,Game){
	L.addLogTarget(new ConsoleTarget());
	L.log('New Main!', '@main');

	var gameCanvas = document.getElementById('gameCanvas');
	var game = new Game(document, window, gameCanvas,gameCanvas.width,gameCanvas.height);

	game.update();
});
