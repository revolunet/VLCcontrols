 

var loaded_libs = new Array();

function ExternalLibLoader() {
	this.libs = loaded_libs;
	
	
}

ExternalLibLoader.prototype.addLib = function(uri, callback) {
	var idx = this.libs.length;
	this.libs[idx] = new Array();
	this.libs[idx].uri = uri;
	this.libs[idx].callback = callback;
	this.libs[idx].loaded = false;
}

CheckExternalLibs = function() {
	for (var i=0; i<loaded_libs.length; i++) {
		if (!loaded_libs[i].loaded) {
			setTimeout("CheckExternalLibs", 250);
			return;
		}
	}
	// all libs loaded, execute all
	for (var i=0; i<loaded_libs.length; i++) {
		if (loaded_libs[i].callback) {
			loaded_libs[i].callback();
		}	
	}
}


ExternalLibLoader.prototype.LoadLibs = function() {
	for (var i=0; i<this.libs.length; i++) {
		this.LoadLib(this.libs[i]);
	}
	setTimeout("CheckExternalLibs", 250);
}

ExternalLibLoader.prototype.LoadLib = function(lib) {
	   var head= document.getElementsByTagName('head')[0];
	   var script= document.createElement('script');
	   script.type= 'text/javascript';
	   script.callback = lib.callback;
	   script.loaded = false;
	   script.onreadystatechange= function () {
	      if (this.readyState == 'complete' || this.readyState == 'loaded') {
			this.loaded = true;
			this.callback(this);
			}
	   };
	   script.onload=function() { 
			this.loaded = true;
			this.callback(this);
		};
	   script.src=lib.uri;
	   head.appendChild(script);
}
