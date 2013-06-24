/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/runner/FootPoint',
'app/runner/RunnerRenderSource',
'jac/math/Vec2D',
'jac/math/Vec2DObj',
'jac/utils/MathUtils',
'jac/logger/Logger',
'jac/geometry/Rectangle',
'jac/sprite/PlayDirection',
'jac/sprite/LoopStyle',
'jac/sprite/SpriteSheet',
'jac/sprite/SpriteSequence'],
function(EventDispatcher,ObjUtils,FootPoint,RunnerRenderSource,
         Vec2D,Vec2DObj,MathUtils,L,Rectangle,PlayDirection,LoopStyle,
		 SpriteSheet,SpriteSequence){
    return (function(){
        /**
         * Creates a Runner object
         * @extends {EventDispatcher}
         * @constructor
         */
        function Runner($groundModel,$sheetImg){
            //super
            EventDispatcher.call(this);

	        this.charWidth = 64;
	        this.charHeight = 64;
	        this.groundModel = $groundModel;
	        this.leftPoint = new FootPoint(0,0);
	        this.rightPoint = new FootPoint(0,0);
	        this.footVec = new Vec2DObj(0,0,0,0);
	        this.flippedFootVec = new Vec2DObj(0,0,0,0);
	        this.footVecLength = 0;
	        this.footVecDist = this.charWidth/2;
	        this.footDistThreshold = 2;
			this.rotation = -10;
			this.gameCenterX = Math.round(this.groundModel.gameWidth/2);

	        this.sheetImg = $sheetImg;
	        //this.renderSource = new RunnerRenderSource(this.charWidth, this.charHeight, this.sheetImg);
	        //this.renderSource.init();

	        this.spriteSheet = new SpriteSheet(this.sheetImg,64,64,16,16,'runner');
	        this.runSequence = new SpriteSequence(this.spriteSheet,'run',0,10,3,PlayDirection.FORWARD,LoopStyle.LOOP);

	        this.renderImg = this.sheetImg;
	        this.renderFrameRect = new Rectangle(0,0,this.charWidth,this.charHeight);

	        this.currentSeq = this.runSequence;

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(Runner,EventDispatcher);

	    Runner.prototype.moveTo = function($x,$y){
			this.leftPoint.x = $x;
		    this.leftPoint.y = $y;
		    this.rightPoint.x = $x + this.footVecDist;
		    this.rightPoint.y = $y;
		    this.updateFootVec();
	    };

	    Runner.prototype.updateFootVec = function(){
			Vec2D.vecFromLineSeg(this.footVec, this.rightPoint.x, this.rightPoint.y, this.leftPoint.x, this.leftPoint.y);
		    this.footVecLength = Vec2D.lengthOf(this.footVec);
	    };

	    Runner.prototype.renderCharacter = function($ctx){
		    var rect = this.currentSeq.currentCellRect;
		    $ctx.drawImage(this.renderImg, rect.x,rect.y,
			    rect.width, rect.height,-this.charWidth,-this.charHeight,this.charWidth,this.charHeight);
	    };

	    Runner.prototype.update = function($tickDelta){
			//Walk the segments backwards and see if each point is within the segment
			var i = -1;
		    var pt = this.rightPoint;
			var vec = null;
			var rightSegIndex = -1;

		    //Foot/Character angles
		    Vec2D.vecFromLineSeg(this.flippedFootVec, this.leftPoint.x, this.leftPoint.y, this.rightPoint.x, this.rightPoint.y);
			var footVecAngle = Vec2D.getAngle(this.flippedFootVec);
		    footVecAngle = MathUtils.radToDeg(footVecAngle);

		    //Take last foot vector angle, and adjust forward/backward speed based on that
		    var speedPercent = footVecAngle / 90 * 0.7;
		    var pixAdjustPerAngle = (this.groundModel.pixPerTick * speedPercent);
		    this.leftPoint.x += pixAdjustPerAngle;
		    this.rightPoint.x += pixAdjustPerAngle;
		    //L.log('Adjustment: ' + footVecAngle + '/' + pixAdjustPerAngle,'@runner');

		    //Run faster/slower on flat to catch up to center
		    if(Math.abs(footVecAngle) < 5){
			    //adjust to head towards center
			    var distToCenter = this.gameCenterX - this.rightPoint.x;
			    var maxAdjust = 5;
			    var pixAdjustForCatchUp = maxAdjust * (distToCenter/this.gameCenterX);
			    if(this.rightPoint.x < this.gameCenterX){
				    this.rightPoint.x += pixAdjustForCatchUp;
				    this.leftPoint.x += pixAdjustForCatchUp;
			    }
		    }


		    //Right point
			for(i = this.groundModel.vecList.length-1; i >= 0; --i){
				vec = this.groundModel.vecList[i];
				if(pt.x >= vec.xOffset && pt.x <= (vec.xOffset + vec.x)){
					//Calc the new 'y' position for the 'foot'
					this.rightPoint.y = vec.getYOnSegment(this.rightPoint.x);
					rightSegIndex = i;
					break;
				}
			}

		    //Left point
		    pt = this.leftPoint;
			var safeCount = 100;
		    var done = false;
		    var overCount = 0;
		    var underCount = 0;
		    var biggestDiff = 0;
			var smallestDiff = 0;

		    do{
			    for(i = rightSegIndex; i >= 0; --i){
				    vec = this.groundModel.vecList[i];
				    if(pt.x >= vec.xOffset && pt.x <= (vec.xOffset + vec.x)){

					    if(this.leftPoint.lastGroundVec !== null && this.leftPoint.lastGroundVec !== vec){
						    this.leftPoint.lastGroundVec.hasBeenLeft = true;
					    }

					    this.leftPoint.lastGroundVec = vec;

					    //Calc the new 'y' position for the 'foot'
					    this.leftPoint.y = vec.getYOnSegment(this.leftPoint.x);
					    break;
				    }
			    }

			    //Calc/Cache new foot vector
			    this.updateFootVec();

			    //brute force along segments until we are back to the right length between right and left points
				var diff = this.footVecLength - this.footVecDist;

			    if(diff > this.footDistThreshold){
				    //move x to the right by 1 and start over
				    pt.x++;
				    overCount++;
				    if(diff > biggestDiff){biggestDiff = diff;}//tmp
			    } else if(diff < 0){
				    if(Math.abs(diff) < this.footDistThreshold){
					    done = true;
				    } else {
					    //move x to the left by 1 and start over
					    pt.x--;
					    underCount++;
					    if(diff < smallestDiff){smallestDiff = diff;}//tmp
				    }
			    } else {
				    done = true;
			    }

			    //Prevent any issues with fractional oscillation
			    safeCount--;

			    /*
			    if(safeCount <= 0){
				    L.warn('HIT SAFE COUNT: ' + overCount + '/' + underCount + '----' + biggestDiff + '/' + smallestDiff );
			    }
			    */
		    } while(!done && rightSegIndex != -1 && safeCount >=0);

		    //Once both points are on segments, determine rotation for the character
		    this.rotation = MathUtils.radToDeg(Vec2D.getAngle(this.footVec));

		    //Update the sprite sequence here:
		    this.currentSeq.update($tickDelta);
	    };

        //Return constructor
        return Runner;
    })();
});
