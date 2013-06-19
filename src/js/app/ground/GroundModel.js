/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/logger/Logger',
'jac/pool/Pool',
'app/ground/GroundVec',
'jac/math/Vec2D',
'jac/math/Point'],
function(EventDispatcher,ObjUtils,L,Pool,GroundVec,Vec2D,Point){
    return (function(){
        /**
         * Creates a GroundModel object
         * @extends {EventDispatcher}
         * @constructor
         */
        function GroundModel($gameWidth,$gameHeight){
            //super
            EventDispatcher.call(this);

	        this.gameWidth = $gameWidth;
	        this.gameHeight = $gameHeight;
	        this.vecPool = new Pool(GroundVec);
	        this.vecList = [];

	        this.activePoint = new Point(0,0);

	        this.addNextPoint(100,this.gameHeight-100);
	        this.addNextPoint(200,this.gameHeight-100);
	        this.addNextPoint(300,this.gameHeight-100);
	        this.addNextPoint(400,this.gameHeight-100);

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(GroundModel,EventDispatcher);

	    GroundModel.prototype.addNextPoint = function($x,$y){
		    var prevVec;

		    if(this.vecList.length > 0){
			    prevVec = this.vecList[this.vecList.length-1];
		    } else {
			    prevVec = new GroundVec();
			    prevVec.init(0,0,0,this.gameHeight-100);
		    }

		    var vec = this.vecPool.getObject(0,0,0,0);
		    Vec2D.vecFromLineSeg(vec, prevVec.x+prevVec.xOffset, prevVec.y+prevVec.yOffset, $x, $y);
		    this.vecList.push(vec);

		    L.log('Added new point: ' + this.vecList.length, '@ground');
	    };

	    GroundModel.prototype.shiftOldPoint = function(){
		    var vec = this.vecList.shift();
		    this.vecPool.recycle(vec);
		    L.log('Shifting Old Point: ' + this.vecList.length, '@ground');
	    };

        //Return constructor
        return GroundModel;
    })();
});
