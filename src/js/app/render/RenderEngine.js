/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['jac/events/EventDispatcher','jac/utils/ObjUtils'],
function(EventDispatcher,ObjUtils){
    return (function(){
        /**
         * Creates a RenderEngine object
         * @extends {EventDispatcher}
         * @constructor
         */
        function RenderEngine($gameCanvas,$gameWidth,$gameHeight){
            //super
            EventDispatcher.call(this);

	        this.gameCanvas = $gameCanvas;
	        this.gameCtx = this.gameCanvas.getContext('2d');
	        this.gameWidth = $gameWidth;
	        this.gameHeight = $gameHeight;
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(RenderEngine,EventDispatcher);

	    RenderEngine.prototype.renderFrame = function(){
		    this.gameCtx.fillStyle = 0x000000;
		    this.gameCtx.fillRect(0,0,this.gameWidth,this.gameHeight);
	    };

        //Return constructor
        return RenderEngine;
    })();
});
