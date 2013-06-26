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
'app/input/InputManager',
'app/runner/Runner',
'app/resources/Resources',
'app/config/AppConfig'],
function(EventDispatcher,ObjUtils,Stats,EventUtils,RenderEngine,L,Ground,InputManager,Runner,Resources,AppConfig){
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

	        var res = new Resources();
			var appConfig = new AppConfig();

	        this.doc = $doc;
	        this.window = $window;
	        this.gameCanvas = $gameCanvas;
	        this.gameContext = $gameCanvas.getContext('2d');
	        this.gameWidth = $gameWidth;
	        this.gameHeight = $gameHeight;
			this.isRunning = false;

	        this.updateId = -1;
	        this.stats = new Stats();
	        this.stats.setMode(0);
	        this.doc.getElementById('statsDiv').appendChild(this.stats.domElement);

	        if(appConfig.isDebugging === true){
		        this.doc.getElementById('statsDiv').className = 'statsDiv';
	        }

	        this.ground = new Ground(400,this.gameWidth, this.gameHeight);
	        this.inputManager = new InputManager(this.window, this.doc, this.ground.groundModel, 3);
			this.runner = new Runner(this.ground.groundModel, res.getResource('runnerSheet'));
	        this.renderEngine = new RenderEngine(this.gameCanvas,this.ground.groundModel,this.runner);
	        this.runner.moveTo(400,100);

	        this.updateDelegate = EventUtils.bind(self, self.update);

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(Game,EventDispatcher);

	    Game.prototype.update = function($isManualUpdate){
		    if($isManualUpdate === undefined){$isManualUpdate = false;}
			var self = this;

		    if($isManualUpdate !== true){
			    this.updateId = this.window.requestAnimationFrame(self.updateDelegate);
			    this.isRunning = true;
		    }

		    this.inputManager.update(1);
		    this.ground.update(1);
		    this.runner.update(1);
		    this.renderEngine.renderFrame();

		    this.stats.update();
	    };

	    Game.prototype.pause = function(){
		    this.window.cancelAnimationFrame(this.updateId);
		    this.isRunning = false;
	    };

        //Return constructor
        return Game;
    })();
});
