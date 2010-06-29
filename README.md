VLC plugin javascript wrapper
-----------------------------

VLCcontrols is a cross browser javascript library to add controls to the VLC plugins (ActiveX and Mozilla). It uses VLCobject.js to detect and instantiate the VLC plugin. (based on [swfobject][3])

recent VLC >= 1.0 new security restrictions disable lots of plugin functionnality (output). now need some serious rewrite so moved to github !

28/06/2010 : just dropped a new jQuery class that works better and with new VLC versions. see jquery.html


**Examples :** 

 - The example are on GitHub pages : [http://revolunet.github.com/VLCcontrols][4]

**API :** 

    // create a  player in div '#vlc1'
    var player = VLCobject.embedPlayer('vlc1', 400, 300, true);
    player.play('http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_surround-fix.avi');
    
    // set a VLC option    
    player.options.set("start-time", 50); 
    // reset all VLC options
    player.options.clear(); 
    // start playing uri
    player.play(uri); 
    // stop playing
    player.stop(); 

**INSTALLATION**

Put all theses files somewhere on your web server :)

  [1]: http://www.revolunet.com/labo/code/VLCcontrols
  [2]: http://wiki.videolan.org/VLC_command-line_help
  [3]: http://blog.deconcept.com/swfobject/
  [4]: http://revolunet.github.com/VLCcontrols