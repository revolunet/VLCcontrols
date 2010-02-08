VLC plugin javascript wrapper
-----------------------------

VLCcontrols is a cross browser javascript library to add controls to the VLC plugins (ActiveX and Mozilla). It uses VLCobject.js to detect and instantiate the VLC plugin. (based on [swfobject][3])

recent VLC >= 1.0 new security restrictions disable lots of plugin functionnality (output). now need some serious rewrite so moved to github !

Some docs here : [http://www.revolunet.com/labo/code/VLCcontrols][1]

**Examples :** 

 - simple : [http://vlc.revolunet.com/git/example.html][4]
 - advanced : [http://vlc.revolunet.com/git/advanced.html][5]

**API :** 

    // create a VLCobject in div#mymovie
    var vlcobject = new VLCObject("mymovie", "600", "350");
    vlcobject.write("vlccontent");
    // create controls and bind to an existing VLCobject
    var controls = new VLCcontrols(vlcobject);     
    // set a VLC option; here the media will start at 50secs. see http://wiki.videolan.org/VLC_command-line_help for all options (some restricted in the plugins)
    controls.options.set("start-time", 50); 
    // reset all VLC options
    controls.options.clear(); 
    // start playing uri
    controls.play(uri); 
    // stop playing
    controls.stop(); 

**INSTALLATION**

Put all theses files somewhere on your web server :)

  [1]: http://www.revolunet.com/labo/code/VLCcontrols
  [2]: http://wiki.videolan.org/VLC_command-line_help
  [3]: http://blog.deconcept.com/swfobject/
  [4]: http://vlc.revolunet.com/git/example.html
  [5]: http://vlc.revolunet.com/git/advanced.html