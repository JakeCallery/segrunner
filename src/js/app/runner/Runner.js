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
'jac/sprite/SpriteSequence',
'jac/sprite/SequenceManager'],
function(EventDispatcher,ObjUtils,FootPoint,RunnerRenderSource,
         Vec2D,Vec2DObj,MathUtils,L,Rectangle,PlayDirection,LoopStyle,
		 SpriteSheet,SpriteSequence,SequenceManager){
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
	        this.tmpVec = new Vec2DObj(0,0,0,0);
	        this.tmpVec2 = new Vec2DObj(0,0,0,0);
	        this.footVecLength = 0;
	        this.footVecDist = this.charWidth/2;
	        this.footDistThreshold = 2;
	        this.footVecAngleHistory = [];
			this.rotation = -10;
			this.gameCenterX = Math.round(this.groundModel.gameWidth/2);

	        this.sheetImg = $sheetImg;
	        //this.renderSource = new RunnerRenderSource(this.charWidth, this.charHeight, this.sheetImg);
	        //this.renderSource.init();

	        this.spriteSheet = new SpriteSheet(this.sheetImg,64,64,16,16,'runner');
	        this.runSequence = new SpriteSequence(this.spriteSheet,'run',0,10,3,PlayDirection.FORWARD,LoopStyle.LOOP);
			this.slideSequence = new SpriteSequence(this.spriteSheet,'slide',10,3,3,PlayDirection.FORWARD,LoopStyle.STOP);
			//this.jumpSequence = new SpriteSequence(this.spriteSheet,'jump',12,8,3,PlayDirection.FORWARD,LoopStyle.ONCE);
			this.respawnSequence = new SpriteSequence(this.spriteSheet,'respawn',21,8,3,PlayDirection.FORWARD,LoopStyle.ONCE);
			this.sequenceManager = new SequenceManager();

	        this.renderImg = this.sheetImg;
	        this.renderFrameRect = new Rectangle(0,0,this.charWidth,this.charHeight);

	        this.sequenceManager.replaceAll(this.runSequence);

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
		    var rect = this.sequenceManager.getCurrentSequence().currentCellRect;
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

		    //set up averages for angles (smooth out sequence changes)
		    this.updateFootVecAngleHistory(footVecAngle);

		    //Update forward speed based on foot angle
		    var speedPercent = footVecAngle / 90;
		    var fineAdjustment = 1;
		    if(this.sequenceManager.getCurrentSequence().id === 'respawn'){
			    speedPercent = 1.0;
			    fineAdjustment = 1.0;
		    } else if(footVecAngle > 0){
			    //downhill
			    fineAdjustment = 0.6;
		    } else if(footVecAngle > 0){
			    //uphill
			    fineAdjustment = 0.7;
		    }

		    var pixAdjustPerAngle = -Math.abs(this.groundModel.pixPerTick * speedPercent);

		    //Final Foot X placement
		    this.leftPoint.x += pixAdjustPerAngle * fineAdjustment;
		    this.rightPoint.x += pixAdjustPerAngle * fineAdjustment;

		    if(this.rightPoint.x < -30){
			    //RESPAWN
			    L.log('Do Respawn', '@runner');
			    this.sequenceManager.replaceAll(this.respawnSequence);
			    this.rightPoint.x = this.groundModel.gameWidth * 0.9;
			    this.rightPoint.y = 0;
			    this.leftPoint.x = this.rightPoint.x - this.footVecDist;
			    this.leftPoint.y = 0;
		    }

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


		    //Plant foot points on the line based on X location
		    //Right point
		    var rightPointSeg = null;
		    var leftPointSeg = null;
			for(i = this.groundModel.vecList.length-1; i >= 0; --i){
				vec = this.groundModel.vecList[i];
				if(pt.x >= vec.xOffset && pt.x <= (vec.xOffset + vec.x)){
					//Calc the new 'y' position for the 'foot'
					rightPointSeg = this.groundModel.vecList[i];
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

		    //Locate the segment this foot point is on, and generate the Y values based on X
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
					    leftPointSeg = this.groundModel.vecList[i];
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
				    if(diff > biggestDiff){biggestDiff = diff;}//tmp (used for debugging)
			    } else if(diff < 0){
				    if(Math.abs(diff) < this.footDistThreshold){
					    done = true;
				    } else {
					    //move x to the left by 1 and start over
					    pt.x--;
					    underCount++;
					    if(diff < smallestDiff){smallestDiff = diff;}//tmp (used for debugging)
				    }
			    } else {
				    done = true;
			    }

			    //Prevent any issues with fractional oscillation
			    safeCount--;

		    } while(!done && rightSegIndex != -1 && safeCount >=0);

		    //Determine if we need to jump or not
		    if(leftPointSeg !== rightPointSeg && leftPointSeg !== null && rightPointSeg !== null && leftPointSeg !== undefined && rightPointSeg !== undefined){
			    //subtract vectors and see if we have an extreme angle
			    var tmpAng = MathUtils.radToDeg(Vec2D.angleBetween(rightPointSeg,leftPointSeg));
			    /*
			    if(tmpAng > 45){
				    //jump
				    if(this.sequenceManager.getCurrentSequence() !== this.jumpSequence){
					    this.sequenceManager.replaceAll(this.jumpSequence);
					    L.log('jump', '@runner');
				    }
			    }
			    */

		    }

		    //Once both points are on segments, determine rotation for the character
		    if(this.sequenceManager.getCurrentSequence().id === 'jump'){
			    this.rotation = 180;
		    } else {
			    this.rotation = MathUtils.radToDeg(Vec2D.getAngle(this.footVec));
		    }


		    //Handle sprite animation sequence selection
		    var sequenceChanged = false;
			var avgAngle = this.getAvgFootVecAngleHistory();
		    if(avgAngle > 25){
			    sequenceChanged = this.changeSequence(this.slideSequence);
		    } else {
			    sequenceChanged = this.changeSequence(this.runSequence);
		    }

		    //Update the sprite sequence here:
		    if(sequenceChanged === false){
			    this.sequenceManager.updateCurrent($tickDelta);
		    }

	    };

	    Runner.prototype.changeSequence = function($newSeq, $doReset){
		    if($doReset === undefined){$doReset = true;}
		    var sequenceChanged = false;
		    var currentSeq = this.sequenceManager.getCurrentSequence();
		    if(currentSeq.id !== $newSeq.id){

			    //update
			    if(currentSeq.id === 'jump' || currentSeq.id === 'respawn'){
				    //wait for jump to finish, then switch
				    this.sequenceManager.replaceNext($newSeq);
				    this.sequenceManager.nextAfterComplete();
				    //L.log('changed next sequence to ' + $newSeq.id)
			    } else {
				    //immediate switch
				    this.sequenceManager.replaceAll($newSeq);
				    if($doReset === true){currentSeq.reset();}
				    sequenceChanged = true;
			    }
		    }
		    return sequenceChanged;
	    };

	    Runner.prototype.updateFootVecAngleHistory = function($newAngle){
		    this.footVecAngleHistory.push($newAngle);
		    if(this.footVecAngleHistory.length > 5){
			    this.footVecAngleHistory.shift();
		    }
	    };

	    Runner.prototype.getAvgFootVecAngleHistory = function(){
		    var avg = 0;
			var len = this.footVecAngleHistory.length;
		    for(var i = 0; i < len; i++){
				avg += this.footVecAngleHistory[i];
		    }

		    return avg / len;
	    };

        //Return constructor
        return Runner;
    })();
});
