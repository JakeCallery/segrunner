/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['jac/logger/Logger'],
function(L){
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

	        var self = this;

	        this.resourceMap = {};

	        Resources.prototype.addResource = function($id,$data){
		        self.resourceMap[$id] = $data;
		        L.log('Added Resource: ' + $id, '@resource');
	        };

	        Resources.prototype.removeResource = function($id){
		        if(self.resourceMap.hasOwnProperty($id)){
			        delete self.resourceMap[$id];
		        }
	        };

	        //Set first instance
	        Resources.prototype._singletonInstance = this;
        }
        
        //Return constructor
        return Resources;
    })();
});
