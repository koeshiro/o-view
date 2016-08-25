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
	Templater=function (t,o){
		this.Temp=this.render(t,o); this.raw=t;
		return this;
	}
	Templater.prototype.render=function(t,o){
		var r=new RegExp("<@([\\S\\s]+?(@>))","mg"),i=0,n=t.match(r).length, HTML=t,tc='',c,z,zn,t=this;
		do {
			HTML=HTML.replace(r,function(s){
				var script=s.replace('<@','').replace('@>','');
				var html=eval(t.execute(script,o));
				return html;
			});
			i++;
		} while(i<n);
		return HTML;
	}
	Templater.prototype.rerender=function(o){
		this.Temp=this.render(this.raw,o);
		return this;
	}
	Templater.prototype.execute=function(s,o){
		var script="(function(){ \n\
			var templater_html_text_var=\"\"; \n\
			var each=function(s){ \n\
				templater_html_text_var+=s; \n\
			} \n\
			var execute=function(t,o){ \n\
				return new Templater(t,o); \n\
			} \n\
			";
		for(var k in o){
			if(helper.ObjectType(o[k])==_string) script+="var "+k+"='"+o[k]+"';";
			else if(helper.ObjectType(o[k])==_object||helper.ObjectType(o[k])==_array) script+="var "+k+"="+JSON.stringify(o[k])+";";
			else if(helper.ObjectType(o[k])==_function) script+="var "+k+"="+(o[k].call(o,s))+";";
			else if(helper.isHTML(o[k])) script+="var "+k+"="+(o[k].toString())+";";
			else {
				if(helper.ObjectType(this.onerror)==_function){
					this.onerror(1,"not valid var.");
				}
				console.error(k+" in "+o+" is not valid var. Type:"+helper.ObjectType(o[k]));
			}
		}
		script+=s;
		script+=" \n\
		return templater_html_text_var; \n\
		})();"
		return script;
	}
	Templater.prototype.toString=function(){
		return this.Temp;
	}
	Templater.prototype.Temp="";
	Templater.prototype.raw="";
})()