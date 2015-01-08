function tunecloud() {

    $(document).ready(function() {
        $(".start").css("color", "white");        
        $(".start").css("background", "#2a89c8");
        $(".start").text('Explore Songpipe');
        $(".spinner").css("display", "none");
        //alert("document loaded")
    });
    
    //close lightbox 
    $(".start").on("touchend click", function() {
        $("#intro").toggle();
        $("#lightbox").fadeToggle(1000);
    });
    
    //animate background
    $(document).on("touchend click", function() {
    colors = ['#c6ccdf', '#e6ccdf'] 
    var i = 0;
    animate_loop = function() {
            $('.nowplaying').animate({backgroundColor:colors[(i++)%colors.length]
            }, 50, function(){
                        animate_loop();
            });
    }
    animate_loop();
    });
    
    //close current audio item when "x" clicked
    $(document).on("touchend click", ".close", function() {
        $(this).parent().remove();
    });
    
    //pause current audio when pause button is clicked 
    $(document).on("touchend click", ".pause", function() {
        $(".audioplayer").trigger("pause");
        $(".pause").switchClass("pause","play", 50);        
        $(".nowplaying").stop(true, true);
        $(".item").css("background-color", "#ddd");        
        $(".nowplaying").css("background-color", "#ddd");        
        $(this).parent().removeClass("nowplaying");
      });

    //play current audio, pause all others, when a play button is clicked 
    $(document).on("touchend click", ".play", function() {
        //stop all audio, if any    
        $(".audioplayer").trigger("pause");
        //stop np animation  
        $(".nowplaying").stop(true, false);
        //remove np class 
        $(".nowplaying").removeClass("nowplaying");
        $(".item").css("background-color", "#ddd");        
        //switch any open pause buttons to play for all items
        $(".pause").switchClass("pause","play", 50);
        //start np function
        $(".nowplaying").animate(true, false);
        //add np class to selected item
        $(this).parent().addClass("nowplaying");
        //play audio for selected item
        $(this).next("audio").trigger("play");
        //change play button to pause
        $(this).switchClass("play","pause", 50);
      });
    
    //facebook
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.0";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    
    //twitter
    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs')}

function nextTrack(name,artist) {
        _gaq.push(['_trackEvent', 'ended-song', name, artist]);
        $(".nowplaying").addClass("target");
        $(".pause").switchClass("pause","play", 50); 
        $(".audioplayer").parent().removeClass("nowplaying");
        $(".target").next(".item").children(".audioplayer").trigger("play");
        $(".target").next(".item").addClass("nowplaying");
        $(".target").removeClass("target");
        //$(".nowplaying").stop(true, false);
}

function appendAudio (name, artist, mp3_url) {
        $(".audioplayer").trigger("pause");
        $(".nowplaying").stop(true, true);
        $(".nowplaying").css("background-color", "#ddd");        
        $(".nowplaying").removeClass("nowplaying");
        $(".item").css("background-color", "#ddd");        
        item = $("<span class=\"item nowplaying\"><span class=\"pause\"></span>&nbsp;&nbsp;")
        audio = $("<audio onabort=\"stalledAudio('" + name + "','" + artist + "')\" onerror=\"stalledAudio('" + name + "','" + artist + "')\" oncanplay=\"playAudio('" + name + "','" + artist + "')\" onended=\"nextTrack('" + name + "','" + artist + "')\" id=\"audioplayer\" class=\"audioplayer\" controls><source src=\"" + mp3_url + "\"></audio>&nbsp;&nbsp;<a target=\"_blank\" href=\"https://www.google.com/search?q=" + name + " by " + artist + "\">"  + name + "</a> by <a target=\"_blank\" href=\"https://www.google.com/search?q=" + artist + "\">" + artist + "</a></span>&nbsp;&nbsp;<span class=\"close\">x</span>")
        //audio.attr('autoplay','autoplay');
        item.append(audio);
        $(".nowplaying").trigger("play");
        $(".pause").switchClass("pause","play");
        $("#playerbar").prepend(item);
        //$(".playtitle").css("display", "block");
}

function appendAudioIpad (name, artist, mp3_url) {
        //$(".audioplayer").trigger("pause");
        //$(".nowplaying").stop(true, true);
        $(".nowplaying").css("background-color", "#ddd");        
        $(".nowplaying").removeClass("nowplaying");
        $(".item").css("background-color", "#ddd");        
        item = $("<span class=\"item\"><span class=\"play\"></span>&nbsp;&nbsp;")
        audio = $("<audio onabort=\"stalledAudio('" + name + "','" + artist + "')\" onerror=\"stalledAudio('" + name + "','" + artist + "')\" oncanplay=\"playAudio('" + name + "','" + artist + "')\" onended=\"nextTrack('" + name + "','" + artist + "')\" id=\"audioplayer\" class=\"audioplayer\" controls><source src=\"" + mp3_url + "\"></audio>&nbsp;&nbsp;<a target=\"_blank\" href=\"https://www.google.com/search?q=" + name + " by " + artist + "\">"  + name + "</a> by <a target=\"_blank\" href=\"https://www.google.com/search?q=" + artist + "\">" + artist + "</a></span>&nbsp;&nbsp;<span class=\"close\">x</span>")
        //audio.attr('autoplay','autoplay');
        item.append(audio);
        $(".play").switchClass("pause","play");
        $("#playerbar").prepend(item);
        //$(".playtitle").css("display", "block");
}

function playAudio (name, artist) {
        _gaq.push(['_trackEvent', 'song play', name, artist ]);
        $(".nowplaying").addClass("newplay");
        $(".newplay").children(".audioplayer").trigger("play");
        $(".nowplaying").removeClass("newplay");
}

function stalledAudio (name, artist) {
         _gaq.push(['_trackEvent', 'stalled-link', name, artist]);
         $(".nowplaying").addClass("broken");
         $(".broken").removeClass("nowplaying");         
         $(".broken").css("background","#FF0000");
         $(".broken").css("color","#FF9999");
         $(".broken a").css("color","#FF9999");
         alert("There's something wrong with this file. An alert has been sent to the team to repair this.");
         $(".broken").remove();
}

function brokenAudio (name, artist) {
         _gaq.push(['_trackEvent', 'broken-link', name, artist]);
         alert("This file has gone missing. An alert has been sent to the team to repair this.");
}

