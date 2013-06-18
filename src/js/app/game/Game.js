/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'stats',
'jac/utils/EventUtils',
'app/render/RenderEngine',
'jac/logger/Logger'],
function(EventDispatcher,ObjUtils,Stats,EventUtils,RenderEngine,L){
    return (function(){
        /**
         * Creates a Game object
         * @extends {EventDispatcher}
         * @constructor
         */
        function Game($doc, $window, $gameCanvas, $gameWidth, $gameHeight){
            //super
            EventDispatcher.call(this);

	        var self = this;

	        this.doc = $doc;
	        this.window = $window;
	        this.gameCanvas = $gameCanvas;
	        this.gameContext = $gameCanvas.getContext('2d');
	        this.gameWidth = $gameWidth;
	        this.gameHeight = $gameHeight;
			this.renderEngine = new RenderEngine(this.gameCanvas,this.gameWidth,this.gameHeight);

	        this.updateId = -1;
	        this.stats = new Stats();
	        this.stats.setMode(0);
	        this.doc.getElementById('statsDiv').appendChild(this.stats.domElement);

	        this.updateDelegate = EventUtils.bind(self, self.update);

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(Game,EventDispatcher);

	    Game.prototype.update = function($isManualUpdate){
		    if($isManualUpdate === undefined){$isManualUpdate = false;}
			var self = this;

		    if($isManualUpdate !== true){
			    this.updateId = this.window.requestAnimationFrame(self.updateDelegate);
		    }

		    this.renderEngine.renderFrame();

		    this.stats.update();
	    };

	    Game.prototype.pause = function(){
		    this.window.cancelAnimationFrame(this.updateId);
	    };

        //Return constructor
        return Game;
    })();
});
