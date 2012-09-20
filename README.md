VLC plugin javascript wrapper
-----------------------------

VLCcontrols is a Jquery class that embeds and controls VLC in your webpage.

**NB: DEPRECATED, LAST UPDATE : OCT, 2010**

Detection and embedding is based on [swfobject][3]

recent VLC >= 1.0 new security restrictions disable lots of plugin functionnality (output). now need some serious rewrite so moved to github !

28/06/2010 : just dropped a new jQuery class that works better and with new VLC versions. see jquery.html


**Examples :** 

 - The example are on GitHub pages : [http://revolunet.github.com/VLCcontrols][4]

**API :** 

    // create a  player in div '#vlc1'
    var player = VLCobject.embedPlayer('vlc1', 400, 300, true);
    player.play('http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_surround-fix.avi');
    
    // set a [VLC option][2]
    player.options.set("start-time", 50); 
    // reset all VLC options
    player.options.clear(); 
    // start playing uri
    player.play(uri); 
    // stop playing
    player.stop(); 

    
**INSTALLATION**

You can directly use our hosting and google jQuery CDN for js+images+css :

    <script language="javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
    <script language="javascript" src="http://revolunet.github.com/VLCcontrols/src/jquery-vlc.js"></script>
    <link rel="stylesheet" type="text/css" href="http://revolunet.github.com/VLCcontrols/src/styles.css" />

    
    
  [1]: http://www.revolunet.com/labo/code/VLCcontrols
  [2]: http://wiki.videolan.org/VLC_command-line_help
  [3]: http://blog.deconcept.com/swfobject/
  [4]: http://revolunet.github.com/VLCcontrols