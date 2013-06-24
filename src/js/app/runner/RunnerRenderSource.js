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
        function RunnerRenderSource($width,$height,$runnerSheetImg){
            //super
            BitmapRenderSource.call(this,$width,$height,'#000000');

	        this.runnerSheetImg = $runnerSheetImg;

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(RunnerRenderSource,BitmapRenderSource);

	    RunnerRenderSource.prototype.init = function(){
			this.srcImage = this.runnerSheetImg;
	    };

        //Return constructor
        return RunnerRenderSource;
    })();
});
