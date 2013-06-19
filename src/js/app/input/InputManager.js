/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/logger/Logger',
'jac/utils/EventUtils',
'jac/utils/BrowserUtils'],
function(EventDispatcher,ObjUtils,L,EventUtils,BrowserUtils){
    return (function(){
        /**
         * Creates a InputManager object
         * @extends {EventDispatcher}
         * @constructor
         */
        function InputManager($window, $doc,$groundModel,$ticksPerInput){
            //super
            EventDispatcher.call(this);

	        var self = this;

	        this.window = $window;
	        this.doc = $doc;
	        this.groundModel = $groundModel;
	        this.ticksPerInput = $ticksPerInput;
	        this.tickCount = 0;

			EventUtils.addDomListener(this.window, 'mousemove', EventUtils.bind(self, self.handleMouseMove));

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(InputManager,EventDispatcher);

	    InputManager.prototype.update = function($tickDelta){
			this.tickCount += $tickDelta;

		    if(this.tickCount >= this.ticksPerInput){
			    L.log('InputManager count reset', '@input');

				this.groundModel.addNextPoint(this.groundModel.activePoint.x, this.groundModel.activePoint.y);

			    this.tickCount = 0;
		    }
	    };

	    InputManager.prototype.handleMouseMove = function($e){
            //TRACK X/Y
		    var viewportRect = BrowserUtils.getViewportSize(this.window, this.doc);
		    var mouseX = $e.clientX;
		    var mouseY = $e.clientY;

		    //L.log('MouseXY: ' + $e.clientX,$e.clientY, '@mouse');
		    //L.log('Viewport: ' + viewportRect.x + ',' + viewportRect.y + ',' + viewportRect.width + ',' + viewportRect.height, '@mouse');

		    //var canvasX = this.groundModel.gameWidth * (mouseX / viewportRect.width);
		    var canvasX = this.groundModel.gameWidth * 0.8;
		    var canvasY = this.groundModel.gameHeight * (mouseY / viewportRect.height);
		    this.groundModel.activePoint.x = canvasX;
		    this.groundModel.activePoint.y = canvasY;

	    };

        //Return constructor
        return InputManager;
    })();
});
