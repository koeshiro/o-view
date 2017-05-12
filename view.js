(function(window){
	/* Just some new templater */
	var _string    = "string";
	var _object    = "object";
	var _array 	   = "array";
	var _function  = "function";
	//This code taken from microtemplate created by Paul Miller
	var entityRe = new RegExp('[&<>"\']', 'g');
	var escapeExpr = function(string) {
		if (string == null) return '';
		return ('' + string).replace(entityRe, function(match) {
			return htmlEntities[match];
		});
	};
	var settings = {
		evaluate    : /<%([\s\S]+?)%>/g,
		interpolate : /<%=([\s\S]+?)%>/g,
		escape      : /<%-([\s\S]+?)%>/g
	};
	var matcher = new RegExp([
		(settings.escape || noMatch).source,
		(settings.interpolate || noMatch).source,
		(settings.evaluate || noMatch).source
	].join('|') + '|$', 'g');
	var noMatch = /(.)^/;
	var escapes = {
		"'":      "'",
		'\\':     '\\',
		'\r':     'r',
		'\n':     'n',
		'\t':     't',
		'\u2028': 'u2028',
		'\u2029': 'u2029'
	};

	var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
	var htmlEntities = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;'
	};
	//End
	var helper={};
	helper.ObjectLength=function(o){
	    var s = 0, k;
	    for(k in o){
	        if (o.hasOwnProperty(k)) s++;
	    }
	    return s;
	};
	helper.ObjectType=function(e){
		var t=Object.prototype.toString.call(e),r='';
		if(/\[object HTML([a-zA-Z]+)Element\]/.test(t)) r=t.match(/\[object HTML([a-zA-Z]+)Element\]/)[1].toLowerCase();
		else if(/\[object ([a-zA-Z]+)\]/.test(t)) r=t.match(/\[object ([a-zA-Z]+)\]/)[1].toLowerCase();
	   else if(r=='') {
	      if('toString' in e && 'length' in e && 'join' in e && 'splice' in e && 'pop' in e) r='array';
	      else r=typeof(e);
	   }
	   return r;
	}
	helper.isHTML=function (e){
		var t=Object.prototype.toString.call(e);
		if(/\[object HTML([a-zA-Z]+)\]/.test(t)) return true;
		else return false;
	}
	//Templater
	/*
	* var context - used when calling the generated template function
	* var CacheTemp - last rendered code
	* var RAWTEMP - RAW template code
	* var DataCache - last used data
	*/
	Templater=function(template,object,context){
		this.DataCache=object||{},this.RAWTEMP=template||''; this.context=context||this;
		return this;
	}

	Templater.prototype.Render=function(){

			this.CacheTemp=this.Execute(this.RAWTEMP,this.DataCache);
			return this.CacheTemp;

	}

	Templater.prototype.Execute=function(tmp,obj){
		var HTML=tmp,t=this,templater_data={},index = 0,script = "(function(__templater_data){ \n\
			var __templater_html_text_var=\"\"; \n\
			var __t,echo=function(){ \n\
				__templater_html_text_var+=Array.prototype.join.call(arguments,''); \n\
			} \n\
			var execute=function(t,o){ \n\
				return new Templater(t,o); \n\
			} \n";
		//Add data to array for executing
		for(var k in obj){
			script+="var "+k+"=__templater_data."+k+";";
			templater_data[k]=obj[k];
		}
		//end
		script+="__templater_html_text_var+='";
		//Render script.
		HTML.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
			script+=HTML.slice(index, offset).replace(escaper, function(match) { return '\\' + escapes[match]; });
			if(escape){
				script+="'+\n((__t=(" + escape + "))==null?'':escapeExpr(__t))+\n'";
			}
			if(interpolate){
				script+="'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
			}
			if(evaluate){
				script+="';\n" + evaluate + "\n__templater_html_text_var+='";
			}
			index = offset + match.length;
				return match;
		});
		script += "';\n\
			return __templater_html_text_var; \n\
		});"
		var result=eval(script).call((this.context!=""?this.context:this),templater_data);
		return result;
	}

	Templater.prototype.ReRender=function(o){
		this.CacheTemp=this.Render(this.RAWTEMP,o);
		return this.CacheTemp;
	}
	Templater.prototype.SetData=function(o){
		this.DataCache=o;
		return this;
	}
	Templater.prototype.SetTemp=function(s){
		this.RAWTEMP=s;
		return this;
	}
	Templater.prototype.SetContext=function(c){
		this.context=c;
		return this;
	}
	Templater.prototype.toString=function(){
		return this.CacheTemp;
	}
	Templater.prototype.context="";
	Templater.prototype.CacheTemp="";
	Templater.prototype.RAWTEMP="";
	Templater.prototype.DataCache={};
})(window);
