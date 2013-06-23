/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/logger/Logger',
'preloadjs',
'jac/utils/EventUtils',
'jac/events/JacEvent',
'jac/events/EventDispatcher',
'jac/utils/ObjUtils'],
function(L,preloadjs,EventUtils,JacEvent,EventDispatcher,ObjUtils){
    return (function(){
        /**
         * Creates a Resources Singleton object
         * to use ALWAYS new it up mySingleton = new Resources()
         * @constructor
         */
        function Resources(){
	        if(Resources.prototype._singletonInstance){
		        return Resources.prototype._singletonInstance;
	        }

	        EventDispatcher.call(this);

	        var self = this;

	        var handleFileLoad = function($e){
		        L.log('Resources caught fileLoad event', '@resource');
		        self.addResource($e.item.id, $e.item.result);

		        self.dispatchEvent(new JacEvent('fileLoaded',$e.item.id));
	        };

	        this.loadQueue = new createjs.LoadQueue();
	        this.loadQueue.addEventListener('fileload', handleFileLoad);
	        this.resourceMap = {};

	        this.loadResource = function($id, $path){
		        self.loadQueue.loadFile({id:$id,src:$path});
	        };

	        this.addResource = function($id,$data){
		        self.resourceMap[$id] = $data;
		        L.log('Added Resource: ' + $id, '@resource');
	        };

	        this.removeResource = function($id){
		        if(self.resourceMap.hasOwnProperty($id)){
			        delete self.resourceMap[$id];
		        }
	        };

	        this.getResource = function($id){
		        if(self.resourceMap.hasOwnProperty($id)){
					return self.resourceMap[$id];
		        } else {
			        return null;
		        }
	        };

	        //Set first instance
	        Resources.prototype._singletonInstance = this;
        }

	    //Inherit / Extend
	    ObjUtils.inheritPrototype(Resources,EventDispatcher);

        //Return constructor
        return Resources;
    })();
});
