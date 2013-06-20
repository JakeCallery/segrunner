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
'jac/logger/Logger'],
function(EventDispatcher,ObjUtils,FootPoint,RunnerRenderSource,Vec2D,Vec2DObj,MathUtils,L){
    return (function(){
        /**
         * Creates a Runner object
         * @extends {EventDispatcher}
         * @constructor
         */
        function Runner($groundModel){
            //super
            EventDispatcher.call(this);

	        this.charWidth = 20;
	        this.charHeight = 40;
	        this.groundModel = $groundModel;
	        this.leftPoint = new FootPoint(0,0);
	        this.rightPoint = new FootPoint(0,0);
	        this.footVec = new Vec2DObj(0,0,0,0);
	        this.footVecLength = 0;
	        this.footVecDist = this.charWidth;
	        this.footDistThreshold = 2;
			this.rotation = -10;

	        this.renderSource = new RunnerRenderSource(this.charWidth, this.charHeight, '#FF0000');
	        this.renderSource.init();
	        this.renderImg = this.renderSource.srcImage;


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

	    Runner.prototype.update = function($tickDelta){
			var lpVec = null;
		    var rpVec = null;

			//Walk the segments backwards and see if each point is within the segment
			var i = -1;
		    var pt = this.rightPoint;
			var vec = null;
			var rightSegIndex = -1;

		    //TODO: Refactor this, not very DRY (get it all into 1 loop?)
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

			    safeCount--;

			    if(safeCount <= 0){
				    //L.warn('HIT SAFE COUNT: ' + overCount + '/' + underCount + '----' + biggestDiff + '/' + smallestDiff );
			    }
		    } while(!done && rightSegIndex != -1 && safeCount >=0);

		    //Once both points are on segments, determine rotation for the character
		    this.rotation = MathUtils.radToDeg(Vec2D.getAngle(this.footVec));
	    };

        //Return constructor
        return Runner;
    })();
});
