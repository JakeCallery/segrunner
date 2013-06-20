/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['app/render/BitmapRenderSource','jac/utils/ObjUtils'],
function(BitmapRenderSource,ObjUtils){
    return (function(){
        /**
         * Creates a RunnerRenderSource object
         * @extends {BitmapRenderSource}
         * @constructor
         */
        function RunnerRenderSource($width,$height,$color){
            //super
            BitmapRenderSource.call(this,$width,$height,$color);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(RunnerRenderSource,BitmapRenderSource);
        
        //Return constructor
        return RunnerRenderSource;
    })();
});
