/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/runner/FootPoint'],
function(EventDispatcher,ObjUtils,FootPoint){
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
	        this.groundModel = $groundModel;
	        this.leftPoint = new FootPoint(0,0);
	        this.rightPoint = new FootPoint(0,0);

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(Runner,EventDispatcher);

	    Runner.prototype.moveTo = function($x,$y){
			this.leftPoint.x = $x;
		    this.leftPoint.y = $y;
		    this.rightPoint.x = $x + this.charWidth;
		    this.rightPoint.y = $y;
	    };

	    Runner.prototype.update = function($tickDelta){
			var lpVec = null;
		    var rpVec = null;

			//Walk the segments backwards and see if each point is within the segment
			var i = -1;
		    var pt = this.rightPoint;
			var vec = null;

		    //TODO: Refactor this, not very DRY (get it all into 1 loop?)

		    //Right point
			for(i = this.groundModel.vecList.length-1; i >= 0; --i){
				vec = this.groundModel.vecList[i];
				if(pt.x >= vec.xOffset && pt.x <= (vec.xOffset + vec.x)){
					//TODO: Start here
					//Calc the new 'y' position for the 'foot'
				}
			}

		    //Left point
		    pt = this.leftPoint;
		    for(; i >= 0; --i){
			    vec = this.groundModel.vecList[i];
			    if(pt.x >= vec.xOffset && pt.x <= (vec.xOffset + vec.x)){
				    //Calc the new 'y' position for the 'foot'
			    }
		    }

		    //Once we are within a segment, move the point to be 'on' that segment

		    //Once both points are on segments, determine rotation for the character
	    };

        //Return constructor
        return Runner;
    })();
});
