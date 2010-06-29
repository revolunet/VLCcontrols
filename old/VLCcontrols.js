/*
<OWNER> = revolunet
<ORGANIZATION> = revolunet - Julien Bouquillon
<YEAR> = 2008

Copyright (c) 2008, revolunet
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met :


 Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer. 
 Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution. 
 Neither the name of the <ORGANIZATION> nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES ; LOSS OF USE, DATA, OR PROFITS ; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


*/

//var SimpleSlider_Lib_Uri = "SimpleSlider.js";

var VLC_controller= null;


// theses image are in the subfolder 'images' of your VLCjs lib
var VLC_controller_icon_play = "player_play.png";
var VLC_controller_icon_stop = "player_stop.png";
var VLC_controller_icon_voldown = "moins.gif";
var VLC_controller_icon_volup = "plus.gif";
var VLC_controller_icon_pause = "player_pause.png";
var VLC_controller_icon_sound = "sound.png";
var VLC_controller_icon_soundoff = "sound_mute.png";
var VLC_controller_icon_options = "options.png";
var VLC_controller_icon_infos = "info.png";
var VLC_controller_icon_fullscreen = "fullscreen.gif";

var VLC_status = new Array("standby", "ouverture", "buffering", "lecture", "pause", "stop", "erreur");
	
var VLC_controller_default_buffersize = "5";
var VLC_controller_log_verbosity = -1;



// function SimpleSliderLibReceived() {
	// VLC_controller.slider = new Slider(VLC_controller.id+"_slider", VLC_controller.width, "10");
	// VLC_controller.slider.onNewPosition = VLC_controller.slider_position_changed;
// }
 
 

function toolbar_icon(icon, alt, onclick, id) {
	return "<img id='" + id + "' width='16' height='16' src='" + icon + "' style='vertical-align:middle;cursor:pointer;margin:3px' onclick='" + onclick + "'/>";
}

function changeImageSrc(imgID, newSrc) {
	var tgt = document.getElementById(imgID);
	cursrc = tgt.src.substring(tgt.src.length - newSrc.length);
	if (cursrc != newSrc) tgt.src=newSrc;
}

// HTML FUNCTIONS
 
// function injectJS(uri) {
	// var s = document.createElement('script');
	// s.src = uri;
	// s.type = 'text/javascript';
	// document.body.appendChild(s);
// }

function addHTMLtoObj(obj, html, position) {
	if(self.Node&&self.Node.prototype){
		// mozilla
		var range = document.createRange();
		range.selectNode(obj);
		var htmlnode = range.createContextualFragment(html);
		var parent = obj.parentNode;
		
		position = position.toLowerCase();
		if (position=="beforebegin") parent.insertBefore(htmlnode, obj);
		else if(position=="afterend") parent.insertBefore(htmlnode, obj.nextSibling);
		else if(position=="afterbegin") obj.insertBefore(htmlnode, obj.childNodes[0]);
		else if(position=="beforeend") obj.appendChild(htmlnode);
		}
	else {
		//ie 
		obj.insertAdjacentHTML(position, html);
	}
}

function SimpleSlider_received() {
	//VLC_controller.target = new VLCobject(VLC_controller.id, VLC_controller.with, VLC_controller.height);
	//alert(VLC_controller);
	VLC_controller.libsReady();
}

function VLCcontrols(VLCobject, dodebug) {
	this.id = VLCobject.getAttribute('id');
	this.idleimage = null;
	this.isVideoVisible = true;
	this.target = document.getElementById(this.id);
	//this.updateTarget();
	this.root = ""
	
	this.options = new VLC_options(this);
	//this.options.VLCcontrol = this;
    
	this.loaded = false;
	this.onready = null;
	this.libloader = new ExternalLibLoader();
	//this.libloader.addLib("VLCobject.js", VLCobject_received);
	this.libloader.addLib("SimpleSlider.js", SimpleSlider_received);
	this.libloader.LoadLibs();
	
	//this.options.set("http-caching", parseInt(VLC_controller_default_buffersize) * 1000);
//	this.options.set("udp-caching", parseInt(VLC_controller_default_buffersize) * 1000);
	//this.options.set("http-reconnect", "true");
  
	
	VLC_controller = this;
	
	this.dodebug = false;
	
	this.width = VLCobject.getAttribute("width");
	//this.target.width;
	this.height = VLCobject.getAttribute("height");
	if (dodebug) this.dodebug = dodebug;
	
	// detect lib path (dirty)
	var sc = document.getElementsByTagName("SCRIPT");
	for (var i=0;i<sc.length;i++) {
		if(sc[i].src.indexOf("VLCcontrols.js")>-1) {
			this.root = sc[i].src.replace("VLCcontrols.js","");
			}
	}
 
	// if(!this.target) {
		// var errorinfo = "<span class='VLC_controller_notdetected'><b>Plugin VLC non détécté !</b> --> telechargez le sur <a href='http://www.videolan.org/vlc/' target='_blank'>http://www.videolan.org/vlc/</a></span>";
		// document.body.innerHTML = errorinfo + document.body.innerHTML;
	////	return;
	// }
	
	
}

VLCcontrols.prototype.libsReady = function() {
	//alert(1);
	//alert(Slider);
	
	var bg_img = '<img style="display:" src="#" width="1" height="1" id="' + this.target.id +'_idleimage">';
 
	addHTMLtoObj(this.target, bg_img, "beforebegin");
	
	var toolbar = "";

	toolbar += '<div style="display:block;width:'+this.width +'px" id="'+this.id+'_slider"></div>';
	toolbar += "<div id='" + this.target.id + "_toolbar' class='VLC_toolbar' style='background:lightgrey;width:" + this.width + "px'>";
	toolbar += "<table border=0 cellpading=0 cellspacing=0 width='100%'><tr><td >";
	toolbar += toolbar_icon(this.root + "images/" + VLC_controller_icon_play, "Play/Pause", "VLC_controller.btn_play_clicked()", this.id + "_btn_play");
	toolbar += toolbar_icon(this.root + "images/" + VLC_controller_icon_stop, "Stop", "VLC_controller.btn_stop_clicked()", this.id + "_btn_stop");
//	toolbar += toolbar_icon("/vlcjs/images/player_prev.png", "Prev", "", this.id + "_btn_prev");
	//toolbar += toolbar_icon("/vlcjs/images/player_next.png", "Next", "", this.id + "_btn_next");
	toolbar += toolbar_icon(this.root + "images/" + VLC_controller_icon_sound, "Volume", "VLC_controller.btn_mute_clicked()", this.id + "_btn_mute");
	toolbar += toolbar_icon(this.root + "images/" + VLC_controller_icon_voldown, "Volume down", "VLC_controller.btn_voldown_clicked()", this.id + "_btn_voldown");
	toolbar += "<span style='font-size:10px'><span id='" + this.target.id + "_vollabel'>100</span>%</span>";
	
	toolbar += toolbar_icon(this.root + "images/" + VLC_controller_icon_volup, "Volume up", "VLC_controller.btn_volup_clicked()", this.id + "_btn_volup");
	
	toolbar += toolbar_icon(this.root + "images/" + VLC_controller_icon_fullscreen, "FullScreen", "VLC_controller.btn_fullscreen_clicked()", this.id + "_btn_fullscreen");
	
	toolbar += "</td><td align=center width=60>";
	
	toolbar += '<span style="vertical-align:middle;position:relative;" id="infosPosition">00:00/00:00</span>';
	toolbar += "</td><td align=center width=65>";
	toolbar += '&nbsp;&nbsp;<span style="vertical-align:middle;" id="infosStatus">stopped</span>';
	toolbar += "</td><td align=center width=45>";
	toolbar += toolbar_icon(this.root + "images/" + VLC_controller_icon_options, "Options", "VLC_controller.btn_options_clicked()", this.id + "_btn_options");
	toolbar += toolbar_icon(this.root + "images/" + VLC_controller_icon_infos, "About", "VLC_controller.btn_infos_clicked()", this.id + "_btn_infos");
	toolbar += "</td></tr></table>";
	toolbar += '<div style="display:none" id="VLC_controller_options">';
	toolbar += '&nbsp;buffer : <input   size=1 style="vertical-align:middle;"  id="VLC_controller_options_http-caching" value="' + VLC_controller_default_buffersize + '" /> sec.';
	toolbar += '&nbsp;&nbsp;<input type="checkbox" ' + (this.dodebug && 'checked=1' || '') + '" style="vertical-align:middle;" onclick="VLC_controller.setdebug(this.checked)" id="VLC_controller_dodebugcheckbox"/><label for="VLC_controller_dodebugcheckbox">debug</label>';
//	toolbar += '<span style="display:none">&nbsp;&nbsp;<input type="checkbox" ' + (this.dodebugvlc && 'checked=1' || 'checked=1') + '" style="vertical-align:middle;" onclick="VLC_controller.setdebugvlc(this.checked)" id="VLC_controller_dodebugvlccheckbox"/><label for="VLC_controller_dodebugvlccheckbox">debug VLC</label></span>';
	toolbar += '&nbsp;&nbsp;<input type="checkbox" style="vertical-align:middle;"  id="VLC_controller_DesktopOutputcheckbox"/><label for="VLC_controller_DesktopOutputcheckbox">set as wallpaper</label>';
	toolbar += '<span style="display:none">&nbsp;&nbsp;<input type="checkbox" style="vertical-align:middle;"  id="VLC_controller_FreeplayerModecheckbox"/><label for="VLC_controller_FreeplayerModecheckbox">FreePlayer</label></span>';
	
	toolbar += '&nbsp;&nbsp;&nbsp;&nbsp;<button style="vertical-align:middle;"  onclick="VLC_controller.saveOptions()">ok</button></div>';
	
	toolbar += "<div id='VLC_controller_debug_div' style='display:block'><textarea id='VLC_controller_debug' style='display:block;width:" + this.width + "px;height:200px'></textarea>";
	toolbar += "</div>";
	
	toolbar += '<div style="display:none" id="VLC_controller_infos">';
	toolbar += '<br>This VLC widget has been created by the <a href="http://www.revolunet.com">revolunet</a> team.<br>Comments welcome on <a href="mailto:contact@revolunet.com?subject=VLCcontrols">contact@revolunet.com</a> !<br><br>';
	toolbar += "</div>";
		
	//this.target.insertAdjacentHTML("afterEnd", toolbar);
	
	addHTMLtoObj(this.target, toolbar, "afterEnd");
	
	//alert(this.width);
	this.slider = new Slider(this.id+"_slider", this.width, "10");
	this.slider.onNewPosition = this.slider_position_changed;
	
	
	//this.slider = null;
	
	// trick to load external JS file
	//injectJS(this.root + SimpleSlider_Lib_Uri);
			
	this.load();
	
	setInterval("VLC_controller.updateStatus()", 1000 );
	
	this.loaded = true;
	
	if (this.onready) this.onready();
	//this.debug("plugin loaded v." + this.target.versionInfo);
}


VLCcontrols.prototype.changeVolume = function(newVolume) {
	// prends une valeur entre 0 et 100
	document.getElementById(this.id + "_vollabel").innerHTML = newVolume;
//var vlc_volume = parseInt(newVolume)
	this.target.audio.volume = newVolume;
	if (newVolume > 0) changeImageSrc(this.id + "_btn_mute", this.root + "images/" + VLC_controller_icon_sound);
	else changeImageSrc(this.id + "_btn_mute", this.root + "images/" + VLC_controller_icon_soundoff);
}

VLCcontrols.prototype.btn_voldown_clicked = function() {
	if (!this.target.audio) return;
	var curvolume = this.target.audio.volume;
	curvolume -= 10;
	if (curvolume <= 0) this.changeVolume(0);
	else if (curvolume >= 200) this.changeVolume(200);
	else this.changeVolume(curvolume);
	
}

VLCcontrols.prototype.btn_fullscreen_clicked = function() {
	this.target.video.toggleFullscreen();
//	= true;
}


VLCcontrols.prototype.btn_volup_clicked = function() {
	if (!this.target.audio) return;
	var curvolume = this.target.audio.volume;
	curvolume += 10;
	if (curvolume <= 0) this.changeVolume(0);
	else if (curvolume >= 200) this.changeVolume(200);
	else this.changeVolume(curvolume);
	
}

VLCcontrols.prototype.setFreeplayerMode = function(checked) {
}

VLCcontrols.prototype.updateTarget = function() {
	
	this.target = document.getElementById(this.id);
	if (!document.all) {
		
		this.target.innerHTML += '<embed type="application/x-vlc-plugin" pluginspage="http://www.videolan.org" version="VideoLAN.VLCPlugin.2" id="' + this.id + '_moz"/>';
	
		this.target = document.getElementById(this.id + "_moz");
		
		}
 }

VLCcontrols.prototype.setIdleImage = function(imgSrc) {
	this.idleimage = imgSrc;
	document.getElementById(this.id +"_idleimage").src = imgSrc;
	this.hideVideo();
	
}

VLCcontrols.prototype.hideVideo = function() {
	if (!this.isVideoVisible) return;
	if (!this.idleimage) return;
	this.target.style.width=0;
	this.target.style.height=0;
	
	var tgt = document.getElementById(this.id +"_idleimage");
	tgt.style.width = this.width;
	tgt.style.height = this.height;
		
	this.isVideoVisible = false;
}

VLCcontrols.prototype.showVideo = function() {
	if (this.isVideoVisible) return;
	var tgt = document.getElementById(this.id +"_idleimage");
	tgt.style.width = 0;
	tgt.style.height = 0;
	this.target.style.width=this.width;
	this.target.style.height=this.height;
	this.isVideoVisible = true;
}

VLCcontrols.prototype.setdebug = function(checked) {
	this.dodebug = checked
    //if (this.target && this.target.log) this.target.log.verbosity = VLC_controller_log_verbosity;
	this.debug("debug changed");

}
 
VLCcontrols.prototype.debug = function(astr) {
	var tgt = document.getElementById("VLC_controller_debug_div");
   // alert("debug "+astr);
	if (tgt &&  this.dodebug) {
		document.getElementById("VLC_controller_debug_div").style.display="block";
		document.getElementById("VLC_controller_debug").value+=astr + "\n";
		document.getElementById("VLC_controller_debug").scrollTop=document.getElementById("VLC_controller_debug").scrollHeight;
        
		}
	else {
	 	if (tgt) tgt.style.display="none";
	}
}
 


VLCcontrols.prototype.btn_options_clicked = function() {
	var tgt = document.getElementById("VLC_controller_options");
	if (tgt.style.display=="block") {
		tgt.style.display="none";
	}
	else {
		tgt.style.display="block";
	}
}


VLCcontrols.prototype.btn_infos_clicked = function() {
	var tgt = document.getElementById("VLC_controller_infos");
	if (tgt.style.display=="block") {
		tgt.style.display="none";
	}
	else {
		tgt.style.display="block";
	}
}
 
VLCcontrols.prototype.setBufferSize = function(seconds) {
	document.getElementById("VLC_controller_options_http-caching").value = seconds;
	this.options.set("http-caching", parseInt(seconds) * 1000); 
	this.options.set("udp-caching", parseInt(seconds) * 1000); 
}
VLCcontrols.prototype.saveOptions = function() {
	this.setBufferSize(document.getElementById("VLC_controller_options_http-caching").value);

	document.getElementById("VLC_controller_options").style.display="none";
	if (this.target.playlist.isPlaying == true && this.target.input) {
		var sure = confirm("Voulez vous relancer votre flux avec ces parametres ?");
		if (sure) this.restart();
		}
	this.debug("Options saved");
	//TODO : cookie ?
}

function formatTime(timeVal)
{
    var timeHour = Math.round(timeVal / 1000);
    var timeSec = timeHour % 60;
    if( timeSec < 10 )
        timeSec = '0'+timeSec;
    timeHour = (timeHour - timeSec)/60;
    var timeMin = timeHour % 60;
    if( timeMin < 10 )
        timeMin = '0'+timeMin;
    timeHour = (timeHour - timeMin)/60;
    if( timeHour > 0 )
        return timeHour+":"+timeMin+":"+timeSec;
    else
        return timeMin+":"+timeSec;
};

function format_time2( s )
{
    var hours = Math.floor(s/3600);
    var minutes = Math.floor((s/60)%60);
    var seconds = Math.floor(s%60);
    if( hours < 10 ) hours = "0"+hours;
    if( minutes < 10 ) minutes = "0"+minutes;
    if( seconds < 10 ) seconds = "0"+seconds;
    return hours+":"+minutes+":"+seconds;
}



var inputTrackerIgnoreChange = false;
var VLC_controller_paused = false;

VLCcontrols.prototype.btn_stop_clicked = function() {
	if (!this.check_playlist()) {
				//alert("Aucune playlist !");
	//			return;
	}
	try {
		this.target.playlist.stop();
		VLC_controller_paused = false;
		changeImageSrc(this.id + "_btn_play", this.root + "images/" + VLC_controller_icon_play );
		//document.getElementById(this.id + "_btn_play").src=VLC_controller_icon_play;
		this.setSliderPos(0);
		//this.slider.setPosition(0);
		this.hideVideo();
		
		}
		catch(e) {//do noting
		}
		if (VLC_controller.onStopCallback) VLC_controller.onStopCallback();
}

var lastvolume = 0;
VLCcontrols.prototype.btn_mute_clicked = function() {
	
	var cursrc = document.getElementById(this.id + "_btn_mute").src;
	cursrc = cursrc.substring(cursrc.length - VLC_controller_icon_sound.length);
	if (cursrc==this.root + "images/" + VLC_controller_icon_sound) {
		lastvolume = this.target.audio.volume;
		this.changeVolume(0);
		}
	else {
		this.changeVolume(lastvolume);		
	}
}


VLCcontrols.prototype.check_playlist = function() {
	return (this.target.playlist && this.target.playlist.items.count > 0);
}

VLCcontrols.prototype.btn_play_clicked = function() {
	this.debug("btn_play_clicked");
	var cursrc = document.getElementById(this.id + "_btn_play").src;
	cursrc = cursrc.substring(cursrc.length - (this.root + "images/" + VLC_controller_icon_play).length);

	if (cursrc==this.root + "images/" + VLC_controller_icon_play) {
		
		// start
		if (VLC_controller_paused) {
			this.target.playlist.togglePause();
		}
		else {
			VLC_controller_paused = false;
			if (!this.check_playlist()) {
				alert("nothing in playlist !");
				return;
			}
			else {
				
				this.target.playlist.play();
				}
		}
		changeImageSrc(this.id + "_btn_play", this.root + "images/" + VLC_controller_icon_pause);
	}
	else {
		changeImageSrc(this.id + "_btn_play", this.root + "images/" + VLC_controller_icon_play);

		// pause
		this.target.playlist.togglePause();
		VLC_controller_paused = true;	
	}
}


VLCcontrols.prototype.slider_position_changed = function() {
    //this.debug("slider_position_changed");
	if (VLC_controller.target && VLC_controller.target.input ) {

		if (parseInt(VLC_controller.target.input.length) == 0) {
			// flux non seekable
			if (VLC_controller.onSliderChangedCallback) {
				VLC_controller.onSliderChangedCallback(this.position);
			}
			else {
				VLC_controller.setSliderPos(this.position);
			}
			return;
			}
		else {
			// flux seekable
			try {VLC_controller.target.input.position = this.position;}
			catch(e) {}
		}
	}	
}
 
var VLC_controller_last_status = null;

VLCcontrols.prototype.updateStatusFromExternalData = function() {
	this.debug("default updateStatusFromExternalData");
}

 
VLCcontrols.prototype.setSliderPos = function(pos) {
    //this.debug("setSliderPos");
	if (this.slider) this.slider.setPosition(pos);
 
}

VLCcontrols.prototype.updateStatus = function() {
 //       this.debug("default updateStatus "+ this.target.input.hasVout);
 
        var play_status = document.getElementById("play_status");

					try {
                            if (this.target.playlist && (this.target.playlist.isPlaying == true) && this.target.input)
                            {	
                                    var h = formatTime(this.target.input.time);
                                    if (parseInt(h) < 1000)  {
                                        changeImageSrc(this.id + "_btn_play", this.root + "images/" + VLC_controller_icon_pause);
                                        if (parseInt(this.target.input.length) == 0)  {
                                            this.updateStatusFromExternalData();
                                        }
                                        else {
                                            document.getElementById("infosPosition").innerHTML = h+"/"+formatTime(this.target.input.length);								
                                            VLC_controller.position = this.target.input.position;
                                            this.setSliderPos(this.target.input.position);
                                            }
                                         }
                                     if (this.target.input && this.target.input.hasVout) this.showVideo();
                                     else  this.hideVideo();
                                     
                                        }
                            else
                            {
                                document.getElementById("infosPosition").innerHTML = "00:00/00:00";
                                changeImageSrc(this.id + "_btn_play", this.root + "images/" + VLC_controller_icon_play);
                                this.hideVideo();
                                this.setSliderPos(0);
                            }
                            
						}
					catch(e) {}
		     
				this.updateStatusText();
				this.updateVlcMessages();
    }

	
VLCcontrols.prototype.updateVlcMessages = function() {
    //this.debug("updateVlcMessages");
    //return;
    if (!this.target.log) return;
    
	if (!this.dodebug) {
		if (this.target.log) this.target.log.messages.clear();
		return;
		}
	
    
    
    if (!this.target.log) return
	var msgs=this.target.log.messages;
   
	var iter = msgs.iterator();
		while (iter.hasNext) {
            console.log(1);
			var msg = iter.next();
			if (msg) {
				var contents = msg.message;
				if (msg.type!="private" && !(contents.substring(0,19)=="backward_pts != dts")  && !(contents.substring(0,28)=="backward_pts != standard_pts") && !(contents.substring(0,20)=="late picture skipped") && !(contents.substring(0,19)=="PTS is out of range")) {
					this.debug("VLC: " + msg.name + " " + msg.type + " : " + contents);
					}
				}
		}
		if (this.target.log) this.target.log.messages.clear();
}

VLCcontrols.prototype.updateStatusText = function() {
    
	var status = VLC_status[0];
    try {
        if (this.target.input) status = VLC_status[this.target.input.state];
    }
    catch (e){
        //
    }
        
        
        
        
	if (status) {
		document.getElementById("infosStatus").innerHTML = status;
		if (VLC_controller_last_status != status) this.debug("status : " + status);
		VLC_controller_last_status = status;
		}
	if (VLC_controller.onStatusChangedCallback) VLC_controller.onStatusChangedCallback(status);
}
	
VLCcontrols.prototype.load = function() {
	this.target.width = this.width ;
	this.target.style.width = this.width ;
	this.target.height = this.height;
	this.target.style.height = this.height ;
	this.updateStatusText();
}

VLCcontrols.prototype.stop = function() {
	this.debug("stop");
	this.target.playlist.stop();
}

VLCcontrols.prototype.restart = function() {
	this.debug("restart");
	if (this.target.playlist.isPlaying) this.target.playlist.stop();
	this.target.playlist.play();
}

 

VLCcontrols.prototype.waitForPlaylistToEmpty = function() {
	this.debug("waitForPlaylistToEmpty");
 
        var options = this.options.format_for_vlc();
        this.debug("addplaylist: " +uri_to_play);
        this.debug("options passed: " +options);
		var id = this.target.playlist.add(uri_to_play, uri_to_play, options);
	    this.target.playlist.playItem(id);
 
}


var uri_to_play = "";
VLCcontrols.prototype.doPlay = function(uri) {
	// INTERNAL ONLY
		   if (this.target.audio) this.target.audio.volume = parseInt(document.getElementById(this.id + "_vollabel").innerHTML);
        try {this.target.playlist.stop();} catch(e) {}
		uri_to_play = uri;
		//this.waitForPlaylistToEmpty();
        //var options = new Array();
        var options = this.options.format_for_vlc();
        var id = this.target.playlist.add(uri_to_play, uri_to_play, options);
	    this.target.playlist.playItem(id);
}

VLCcontrols.prototype.play = function(uri) {
	//if (this.target.log) this.target.log.verbosity = VLC_controller_log_verbosity;
	this.debug("play " + uri);
    try {this.target.playlist.stop();} catch(e) {}
	setTimeout("VLC_controller.doPlay('" + uri + "')", 250);
}




function VLC_options(VLCcontroller) {
	// better options management
	this.VLCcontroller = VLCcontroller;
	this.options = new Array();
	
	this.set = function(name, value) {
        if (this.VLCcontroller) this.VLCcontroller.debug("set option "+name+"="+value);
        //.debug("io");
		this.options[name] = value || null;
	}
	
	this.del = function(name) {
		delete this.options[name];
		 
	}
	
	this.get = function(name) {
		return this.options[name];
	}
	
	this.clear = function() {
		this.options = new Array();
	}
	
	this.format_for_vlc = function() {
		var tmp_array = new Array();
		var debug_str = "";
		var idx = 0;
		for (var i in this.options)
		{
			var option_str = ":" + i;
			if (this.options[i]) option_str += "=" + this.options[i];
			tmp_array[idx] = option_str;
			debug_str += option_str + " ";
			idx += 1;
		}
        if (this.VLCcontroller) this.VLCcontroller.debug(debug_str);
		return debug_str;
	}
}

 

 
