(function(){
	/* ERRORS Numbers
	* 1. Not valid var name
	*/
	var _string    = "string";
	var _object    = "object";
	var _array 	   = "array";
	var _function  = "function";
	var helper={};
	helper.ObjectLength=function(o){
	    var s = 0, k;
	    for (k in o) {
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
	Templater=function (templat,object,context){
		this.Temp=this.render(templat,object); this.raw=t; this.context=context;
		return this;
	}
	Templater.prototype.render=function(t,o){
		var r=new RegExp("<@[\\S\\s]+?(execute\\(\\{\\s{0,}@>[\\S\\s]+?(@>))|<@([\\S\\s]+?(@>))","mg"), HTML=t,t=this;
			HTML=HTML.replace(r,function(s){
				var script=s.replace('<@','').replace('@>','');
				var html=t.execute(script,o);
				return html;
			});
		return HTML;
	}
	Templater.prototype.rerender=function(o){
		this.Temp=this.render(this.raw,o);
		return this;
	}
	Templater.prototype.execute=function(s,o){
		var script="(function(templater_data){ \n\
			var templater_html_text_var=\"\"; \n\
			var each=function(s){ \n\
				templater_html_text_var+=s; \n\
			} \n\
			var execute=function(t,o){ \n\
				return new Templater(t,o); \n\
			} \n\
			console.log(this);\
			";
		var templater_data={};
		for(var k in o){
			script+="var "+k+"=templater_data."+k+";";
			templater_data[k]=o[k];
		}
		script+=s;
		script+=" \n\
		return templater_html_text_var; \n\
		});"
		var result=eval(script).call((this.context!=""?this.context:this),templater_data);
		return result;
	}
	Templater.prototype.toString=function(){
		return this.Temp;
	}
	Templater.prototype.context="";
	Templater.prototype.Temp="";
	Templater.prototype.raw="";
})()
