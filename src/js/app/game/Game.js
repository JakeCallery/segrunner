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
'jac/logger/Logger',
'app/ground/Ground',
'app/input/InputManager'],
function(EventDispatcher,ObjUtils,Stats,EventUtils,RenderEngine,L,Ground,InputManager){
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

	        this.updateId = -1;
	        this.stats = new Stats();
	        this.stats.setMode(0);
	        this.doc.getElementById('statsDiv').appendChild(this.stats.domElement);

	        this.ground = new Ground(5,this.gameWidth, this.gameHeight);
	        this.inputManager = new InputManager(this.doc, this.ground.groundModel, 60);
	        this.renderEngine = new RenderEngine(this.gameCanvas,this.ground.groundModel,this.gameWidth,this.gameHeight);

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

		    this.inputManager.update(1);
		    this.ground.update(1);
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
