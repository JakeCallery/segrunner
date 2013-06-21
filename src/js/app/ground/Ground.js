/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/ground/GroundModel'],
function(EventDispatcher,ObjUtils,GroundModel){
    return (function(){
        /**
         * Creates a Ground object
         * @extends {EventDispatcher}
         * @constructor
         */
        function Ground($pixelsPerSec, $gameWidth, $gameHeight){
            //super
            EventDispatcher.call(this);

	        this.gameWidth = $gameWidth;
	        this.gameHeight = $gameHeight;
	        this.groundModel = new GroundModel($gameWidth, $gameHeight, $pixelsPerSec);
	        this.vecList = this.groundModel.vecList;
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(Ground,EventDispatcher);

	    Ground.prototype.update = function($tickDelta){
		    var offset = -($tickDelta * this.groundModel.pixPerTick);
		    var vec = null;

		    for(var i = 0, l = this.vecList.length; i < l; i++){
				vec = this.vecList[i];
			    vec.xOffset += offset;
		    }
	    };

	    Ground.prototype.cullDead = function(){
		    while(this.vecList.length > 0 && this.vecList[0].xOffset < 0){
			    this.groundModel.shiftOldPoint();
		    }
	    };

        //Return constructor
        return Ground;
    })();
});
