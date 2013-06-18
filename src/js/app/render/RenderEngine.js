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
        function RenderEngine($gameCanvas,$groundModel,$gameWidth,$gameHeight){
            //super
            EventDispatcher.call(this);

	        this.gameCanvas = $gameCanvas;
	        this.groundModel = $groundModel;
	        this.gameCtx = this.gameCanvas.getContext('2d');
	        this.gameWidth = $gameWidth;
	        this.gameHeight = $gameHeight;
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(RenderEngine,EventDispatcher);

	    RenderEngine.prototype.renderFrame = function(){

		    this.gameCtx.beginPath();
		    this.gameCtx.fillStyle = '#000000';
		    this.gameCtx.fillRect(0,0,this.gameWidth,this.gameHeight);
		    this.gameCtx.fill();
		    this.gameCtx.closePath();


			//TMP
			for(var i = 0, l = this.groundModel.vecList.length; i < l; i++){
				var vec = this.groundModel.vecList[i];

				this.gameCtx.beginPath();
				this.gameCtx.strokeStyle = '#FF0000';
				this.gameCtx.arc(vec.xOffset+vec.x, vec.yOffset+vec.y, 5, 0, 2*Math.PI, false);
				this.gameCtx.stroke();
				this.gameCtx.closePath();

				this.gameCtx.beginPath();
				this.gameCtx.strokeStyle = '#00FF00';
				this.gameCtx.moveTo(vec.xOffset, vec.yOffset);
				this.gameCtx.lineTo(vec.xOffset + vec.x, vec.yOffset + vec.y);
				this.gameCtx.stroke();
				this.gameCtx.closePath();
			}
		    //////////////////////////////////////

	    };

        //Return constructor
        return RenderEngine;
    })();
});
