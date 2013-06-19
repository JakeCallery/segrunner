/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['jac/math/Vec2DObj','jac/utils/ObjUtils'],
function(Vec2DObj,ObjUtils){
    return (function(){
        /**
         * Creates a GroundVec object
         * @extends {Vec2DObj}
         * @implements {IPoolable}
         * @constructor
         */
        function GroundVec(){
            //super
            Vec2DObj.call(this,0,0,0,0);

	        this.hasBeenLeft = false;   //set this to true when the left point of the character has moved past this segment

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(GroundVec,Vec2DObj);

	    GroundVec.prototype.init = function($args){
			this.x = arguments[0];
		    this.y = arguments[1];
		    this.xOffset = arguments[2];
		    this.yOffset = arguments[3];
	    };

	    GroundVec.prototype.recycle = function(){
		    this.x = 0;
		    this.y = 0;
		    this.xOffset = 0;
		    this.yOffset = 0;
	    };

        //Return constructor
        return GroundVec;
    })();
});
