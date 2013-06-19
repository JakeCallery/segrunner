/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        var BrowserUtils = {};

	    /**
	     * Return a key/val obj containing the query string params
	     * @param {window} [$window = window]
	     * @returns {Array}
	     */
	    BrowserUtils.getURLParams = function($window){
		    var win = $window || window;

		    var paramList = [];
		    var query = win.location.search.substring(1);
		    var params = query.split('&');

		    for (var i=0; i<params.length; i++)
		    {//each key/value pair
			    var pos = params[i].indexOf('=');

			    if (pos > 0)
			    {//get key/val
				    var key = params[i].substring(0,pos);
				    var val = params[i].substring(pos+1);
				    paramList[key] = val;
			    }//get key/val
		    }//each key/value pair

		    return paramList;
	    };

	    /**
	     * Returns the window size and location
	     * @param {window} [$window = window]
	     * @param {document} [$document = document]
	     * @returns {{x: Number, y: Number, width: Number, height: Number}}
	     */
	    BrowserUtils.getViewportSize = function($window,$document){
		    var win = $window || window;
			var doc = $document || document;

		    var e = win;
		    var a = 'inner';
		    if ( !( 'innerWidth' in e ) )
		    {
			    a = 'client';
			    e = doc.documentElement || doc.body;
		    }

		    var xPos = ('screenLeft' in win)?win.screenLeft:win.screenX;
		    var yPos = ('screenTop' in win)?win.screenTop:win.screenY;

		    return { x:xPos, y:yPos, width : e[ a+'Width' ] , height : e[ a+'Height' ] }
	    };

        //Return constructor
        return BrowserUtils;
    })();
});
