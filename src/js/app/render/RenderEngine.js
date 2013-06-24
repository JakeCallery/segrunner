/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/utils/MathUtils'],
function(EventDispatcher,ObjUtils,MathUtils){
    return (function(){
        /**
         * Creates a RenderEngine object
         * @extends {EventDispatcher}
         * @constructor
         */
        function RenderEngine($gameCanvas,$groundModel,$runner){
            //super
            EventDispatcher.call(this);

	        this.runner = $runner;
	        this.gameCanvas = $gameCanvas;
	        this.groundModel = $groundModel;
	        this.gameCtx = this.gameCanvas.getContext('2d');
	        this.gameWidth = $groundModel.gameWidth;
	        this.gameHeight = $groundModel.gameHeight;
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(RenderEngine,EventDispatcher);

	    RenderEngine.prototype.renderFrame = function(){

		    //overwrite canvas with black
		    this.gameCtx.beginPath();
		    this.gameCtx.fillStyle = '#000000';
		    this.gameCtx.fillRect(0,0,this.gameWidth,this.gameHeight);
		    this.gameCtx.fill();
		    this.gameCtx.closePath();


		    //Render segments
			//TMP
			for(var i = 0, l = this.groundModel.vecList.length; i < l; i++){
				var vec = this.groundModel.vecList[i];

				this.gameCtx.beginPath();
				this.gameCtx.strokeStyle = '#FF0000';
				this.gameCtx.arc(vec.xOffset+vec.x, vec.yOffset+vec.y, 3, 0, 2*Math.PI, false);
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

		    //Render active point
		    this.gameCtx.beginPath();
		    this.gameCtx.strokeStyle = '#0000FF';
		    this.gameCtx.arc(this.groundModel.activePoint.x, this.groundModel.activePoint.y, 8, 0, 2*Math.PI, false);
		    this.gameCtx.stroke();
		    this.gameCtx.closePath();

		    //Render Runner (in this case, just put the render call in the runner, since there is only one of them)
		    //TMP

		    //Left Foot Point
		    this.gameCtx.beginPath();
		    this.gameCtx.strokeStyle = '#FFFF00';
		    this.gameCtx.arc(this.runner.leftPoint.x, this.runner.leftPoint.y, 5, 0, 2*Math.PI, false);
		    this.gameCtx.stroke();
		    this.gameCtx.closePath();

		    //Right Foot Point
		    this.gameCtx.beginPath();
		    this.gameCtx.strokeStyle = '#FFFF00';
		    this.gameCtx.arc(this.runner.rightPoint.x, this.runner.rightPoint.y, 5, 0, 2*Math.PI, false);
		    this.gameCtx.stroke();
		    this.gameCtx.closePath();

		    //Character
		    this.gameCtx.save();
		    this.gameCtx.translate(this.runner.rightPoint.x, this.runner.rightPoint.y);
		    this.gameCtx.rotate(MathUtils.degToRad(this.runner.rotation + 180));
		    //this.gameCtx.translate(-this.runner.charWidth, -this.runner.charHeight); //Hack the right position back in
		    this.runner.renderCharacter(this.gameCtx);
		    this.gameCtx.restore();

		    ////////////////////////////

	    };

        //Return constructor
        return RenderEngine;
    })();
});
