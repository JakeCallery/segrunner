/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['jac/events/EventDispatcher','jac/utils/ObjUtils'],
function(EventDispatcher,ObjUtils){
    return (function(){
        /**
         * Creates a ResourceManager object
         * @extends {EventDispatcher}
         * @constructor
         */
        function ResourceManager($resources){
            //super
            EventDispatcher.call(this);

	        this.resources = $resources;
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ResourceManager,EventDispatcher);

	    ResourceManager.prototype.loadResource = function($resourcePath){

	    };

	    ResourceManager.prototype.getResource = function($resourcePath){

	    };

        //Return constructor
        return ResourceManager;
    })();
});
