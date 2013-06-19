/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        /**
         * Creates a Point object
         * @constructor
         */
        function Point($x,$y){
	        if($x === undefined){$x = 0;}
	        if($y === undefined){$y = 0;}
	        this.x = $x;
	        this.y = $y;
        }
        
        
        //Return constructor
        return Point;
    })();
});
