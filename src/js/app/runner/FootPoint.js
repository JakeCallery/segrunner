/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['jac/math/Point','jac/utils/ObjUtils'],
function(Point,ObjUtils){
    return (function(){
        /**
         * Creates a FootPoint object
         * @extends {Point}
         * @constructor
         */
        function FootPoint($x,$y){
            //super
            Point.call(this,$x,$y);

	        this.lastGroundVec = null;

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(FootPoint,Point);
        
        //Return constructor
        return FootPoint;
    })();
});
