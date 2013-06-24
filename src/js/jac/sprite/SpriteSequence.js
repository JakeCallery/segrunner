/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/geometry/Rectangle',
'jac/sprite/LoopStyle',
'jac/sprite/PlayDirection'],
function(Rectangle,LoopStyle,PlayDirection){
    return (function(){
        /**
         * Creates a SpriteSequence object
         * @constructor
         */
        function SpriteSequence($spriteSheet,$id,$startFrameIndex,$numFrames,$ticksPerFrame,$playDirection,$loopStyle){

	        this.id = $id;
	        this.spriteSheet = $spriteSheet;
	        this.startFrameIndex = $startFrameIndex;
	        this.numFrames = $numFrames;
	        this.ticksPerFrame = $ticksPerFrame;
	        this.playDirection = $playDirection;
	        this.loopStyle = $loopStyle;

	        //Sequence State
	        //Sheet state
	        this.accumulatedTicks = 0;
	        this.currentFrameIndex = 0;
	        this.currentCellRect = new Rectangle(0,0,1,1);
	        this.currentCellRect = this.spriteSheet.getCellRectFromIndex(this.startFrameIndex,this.currentCellRect);

        }

	    SpriteSequence.prototype.update = function($tickDelta){
		    this.accumulatedTicks += $tickDelta;

		    var frames = 0;
		    if(this.accumulatedTicks >= this.ticksPerFrame){

			    if(this.accumulatedTicks > this.ticksPerFrame){
				    //how many frames do we need to advance
				    frames = Math.floor(this.accumulatedTicks/this.ticksPerFrame);
			    } else {
				    frames = 1;
			    }

			    for(var i = 0; i < frames; i++){
				    if(this.playDirection == PlayDirection.FORWARD){
					    this.nextFrame();
				    } else if(this.playDirection == PlayDirection.BACKWARD){
					    this.prevFrame();
				    } else if(this.playDirection == PlayDirection.STOPPED){
					    //DO NOTHING
				    } else {
					    throw new Error('Unknown PlayDirection: ' + this.playDirection);
				    }
			    }

			    //Reset accumulated time
			    this.accumulatedTicks = this.accumulatedTicks - (this.ticksPerFrame * frames);
		    }

		    this.spriteSheet.getCellRectFromIndex(this.startFrameIndex + this.currentFrameIndex, this.currentCellRect);

	    };

	    /**@private*/
	    SpriteSequence.prototype.nextFrame = function(){
			this.currentFrameIndex++;

		    if(this.currentFrameIndex >= this.numFrames){
			    this.handleLoop();
		    }
	    };

	    /**@private*/
		SpriteSequence.prototype.prevFrame = function(){
			this.currentFrameIndex--;
			if(this.currentFrameIndex < 0){
				this.handleLoop();
			}
		};

	    SpriteSequence.prototype.handleLoop = function(){
			if(this.loopStyle === LoopStyle.LOOP){
				if(this.playDirection === PlayDirection.FORWARD){
					this.currentFrameIndex = 0;
				} else if(this.playDirection === PlayDirection.BACKWARD){
					this.currentFrameIndex = this.numFrames - 1;
				}
			} else if(this.loopStyle === LoopStyle.STOP) {
				this.currentFrameIndex = this.numFrames - 1;
				this.playDirection = PlayDirection.STOPPED;
			} else if(this.loopStyle === LoopStyle.RESET){
				this.currentFrameIndex = 0;
				this.playDirection = PlayDirection.STOPPED;
			} else if(this.loopStyle === LoopStyle.BOUNCE){
				if(this.playDirection === PlayDirection.FORWARD){
					if(this.numFrames > 1){
						this.currentFrameIndex = this.numFrames - 2;
					}
					this.playDirection = PlayDirection.BACKWARD;
				} else if(this.playDirection === PlayDirection.BACKWARD){
					this.currentFrameIndex = 0;
					this.playDirection = PlayDirection.FORWARD
				}
			}
	    };

	    SpriteSequence.prototype.reset = function(){
		    this.accumulatedTicks = 0;
		    this.currentFrameIndex = 0;
		    this.playDirection = PlayDirection.FORWARD;
	    };
        
        //Return constructor
        return SpriteSequence;
    })();
});
