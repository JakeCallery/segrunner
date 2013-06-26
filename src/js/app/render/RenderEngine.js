/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/utils/MathUtils',
'jac/math/Vec2D'],
function(EventDispatcher,ObjUtils,MathUtils,Vec2D){
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
		    var gradient = this.gameCtx.createLinearGradient(0,0,0,this.gameHeight);
		    //gradient.addColorStop(0.0,'#03001c');
		    gradient.addColorStop(0.1,'#06003f');
		    gradient.addColorStop(0.7,'#ab4400');
		    this.gameCtx.beginPath();
		    this.gameCtx.fillStyle = gradient;
		    this.gameCtx.fillRect(0,0,this.gameWidth,this.gameHeight);
		    this.gameCtx.fill();
		    this.gameCtx.closePath();

		    //Render segments / ground fill
		    this.gameCtx.beginPath();
		    //this.gameCtx.strokeStyle = '#111111';
		    this.gameCtx.fillStyle = '#000000';

		    var leftVec = this.groundModel.getFirstVisibleSeg();
		    var leftVisibleY = leftVec.getYOnSegment(0);
		    this.gameCtx.moveTo(0, leftVisibleY);

			for(var i = 0, l = this.groundModel.vecList.length; i < l; i++){
				var vec = this.groundModel.vecList[i];

//				this.gameCtx.beginPath();
//				this.gameCtx.strokeStyle = '#FF0000';
//				this.gameCtx.arc(vec.xOffset+vec.x, vec.yOffset+vec.y, 3, 0, 2*Math.PI, false);
//				this.gameCtx.stroke();
//				this.gameCtx.closePath();
				this.gameCtx.lineTo(vec.xOffset + vec.x, vec.yOffset + vec.y);
			}

		    //Close path
		    this.gameCtx.lineTo(this.gameWidth, this.gameHeight);
		    this.gameCtx.lineTo(0,this.gameHeight);
		    this.gameCtx.lineTo(0,leftVisibleY);

		    this.gameCtx.fill();
		    //this.gameCtx.stroke();
		    this.gameCtx.closePath();

		    //Render active point
		    this.gameCtx.beginPath();
		    //this.gameCtx.strokeStyle = '#41A2ED';
		    this.gameCtx.strokeStyle = '#222222';
		    this.gameCtx.arc(this.groundModel.activePoint.x, this.groundModel.activePoint.y, 8, 0, 2*Math.PI, false);
		    this.gameCtx.stroke();
		    this.gameCtx.closePath();

		    //Render Runner (in this case, just put the render call in the runner, since there is only one of them)
		    //TMP

		    //Left Foot Point
//		    this.gameCtx.beginPath();
//		    this.gameCtx.strokeStyle = '#FFFF00';
//		    this.gameCtx.arc(this.runner.leftPoint.x, this.runner.leftPoint.y, 5, 0, 2*Math.PI, false);
//		    this.gameCtx.stroke();
//		    this.gameCtx.closePath();

		    //Right Foot Point
//		    this.gameCtx.beginPath();
//		    this.gameCtx.strokeStyle = '#FFFF00';
//		    this.gameCtx.arc(this.runner.rightPoint.x, this.runner.rightPoint.y, 5, 0, 2*Math.PI, false);
//		    this.gameCtx.stroke();
//		    this.gameCtx.closePath();
		    ////////////////////////////

		    //Character

		    //'sink' character into ground further
		    Vec2D.calcRightNormal(this.runner.tmpVec2, this.runner.flippedFootVec);
		    Vec2D.normalize(this.runner.tmpVec2);
		    Vec2D.multScalar(this.runner.tmpVec2,2);
		    var rightRenderX = this.runner.rightPoint.x + this.runner.tmpVec2.x;
		    var rightRenderY = this.runner.rightPoint.y += this.runner.tmpVec2.y;

		    this.gameCtx.save();
		    this.gameCtx.translate(rightRenderX, rightRenderY);
		    this.gameCtx.rotate(MathUtils.degToRad(this.runner.rotation + 180));
		    //this.gameCtx.translate(-this.runner.charWidth, -this.runner.charHeight); //Hack the right position back in
		    this.runner.renderCharacter(this.gameCtx);
		    this.gameCtx.restore();

	    };

        //Return constructor
        return RenderEngine;
    })();
});
