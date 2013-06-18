/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/logger/Logger'],
function(EventDispatcher,ObjUtils,L){
    return (function(){
        /**
         * Creates a InputManager object
         * @extends {EventDispatcher}
         * @constructor
         */
        function InputManager($doc,$groundModel,$ticksPerInput){
            //super
            EventDispatcher.call(this);

	        this.doc = $doc;
	        this.groundModel = $groundModel;
	        this.ticksPerInput = $ticksPerInput;
	        this.tickCount = 0;
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(InputManager,EventDispatcher);

	    InputManager.prototype.update = function($tickDelta){
			this.tickCount += $tickDelta;

		    if(this.tickCount >= this.ticksPerInput){
			    L.log('InputManager count reset', '@input');
			    //TODO: Add new point from mouse position here

			    this.tickCount = 0;
		    }
	    };

        //Return constructor
        return InputManager;
    })();
});
