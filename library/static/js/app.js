'use strict';

// var library = "http://10.223.49.237:8124/library/";
//var library = "http://localhost:8124/library/";
var library = "/library/";

var keyboard = {
    videoMode : false,
    statusFadeOutHandle : null,

    setVideoMode : function(videoMode) {
        if (this.statusFadeOutHandle != null) {
            clearTimeout(this.statusFadeOutHandle);
            this.statusFadeOutHandle = null;
        }
        this.videoMode = videoMode;
        if (videoMode) {
            delete $("#status")[0].always;
            delete $("#playlist")[0].always;

            $("#browse").finish().fadeOut();
            $("#playlist").finish().fadeOut();
            $("#status").finish().fadeOut();
            $("#videoBox").removeClass("videoBoxSmall");
        } else {
            $("#status")[0].always = true;
            $("#playlist")[0].always = true;

            $("#browse").finish().fadeIn();
            $("#playlist").finish().fadeIn();
            $("#status").finish().fadeIn();
            $("#videoBox").addClass("videoBoxSmall");
        }
    },

	key : function(key) {
		console.log("Key pressed:" + key);

		switch (key) {
		case "t":
		    this.setVideoMode(!this.videoMode);
		    break;
		case "ArrowLeft":
		    if ($("#browse").is(":visible"))
			    browser.left();
			break;
		case "ArrowRight":
			if ($("#browse").is(":visible"))
			    browser.right();
			break;
		case "ArrowUp":
			if ($("#browse").is(":visible"))
			    browser.up();
			break;
		case "ArrowDown":
			if ($("#browse").is(":visible"))
			    browser.down();
			break;
		case "Enter":
			if ($("#browse").is(":visible")) {
                if (browser.list[browser.current].file) browser.play();
                else browser.go();
            }
			break;
		case "p":
    		if ($("#browse").is(":visible"))
	    		browser.play();
			break;
        case "r":
			player.seek(player.currentTime() - 30, 500);
			break;
		case "f":
		    player.seek(player.currentTime() + 30, 500);
			break;
		case "+":
            playlist.playPrev(1000);
			break;
		case "-":
            playlist.playNext(1000);
			break;
		case "i":
			player.stop();
			history.go(0);
			break;
		case "s":
			playlist.stop();
			break;
		case " ":
			player.pause(!player.paused);
			break;
		default:
		    console.log("unhandled");
			return false;
		}
		return true;
	}
};

function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

$(function() {
    keyboard.setVideoMode(false);
    $("#browsePlaceholder").on("click", function() {
        keyboard.setVideoMode(false);
    });
    var device = qs("device");
    console.log("Detected device " + device);
    switch (device) {
    case "SamsungTV":
        InitSamsungTVDevice();
        break;
    default:
        InitDefaultDevice();
        break;
    }
});

function InitSamsungTVDevice() {
    console.log("Init Samsung");

    var keyMap = {};

    $(document).keydown(function(event) {
        var keyCode = event.keyCode;
        console.log("Key pressed: " + keyCode);
        var key = keyMap[keyCode];
        if (key && keyboard.key(key))
            event.preventDefault();
    });

    $.getScript("$MANAGER_WIDGET/Common/API/TVKeyValue.js", function() {
        console.log("$MANAGER_WIDGET/Common/API/TVKeyValue.js loaded");

        var tvKey = new Common.API.TVKeyValue();

        keyMap[tvKey.KEY_LEFT] = "ArrowLeft";
        keyMap[tvKey.KEY_RIGHT] = "ArrowRight";
        keyMap[tvKey.KEY_UP] = "ArrowUp";
        keyMap[tvKey.KEY_DOWN] = "ArrowDown";
        keyMap[tvKey.KEY_ENTER] = "Enter";
        keyMap[tvKey.KEY_PANEL_ENTER] = "Enter";
        keyMap[tvKey.KEY_RW] = "r";
        keyMap[tvKey.KEY_FF] = "f";
        keyMap[tvKey.KEY_CH_UP] = "+";
        keyMap[tvKey.KEY_CH_DOWN] = "-";
        keyMap[tvKey.KEY_INFO] = "i";
        keyMap[tvKey.KEY_PLAY] = "p";
        keyMap[tvKey.KEY_STOP] = "s";
        keyMap[tvKey.KEY_PAUSE] = " ";
        keyMap[tvKey.KEY_GUIDE] = "t";
    });

    $.getScript("$MANAGER_WIDGET/Common/API/Widget.js", function() {
        console.log("$MANAGER_WIDGET/Common/API/Widget.js loaded");

        var widgetAPI = new Common.API.Widget();
        widgetAPI.sendReadyEvent();
    });
};

function InitDefaultDevice() {
    $(document).keydown(function(event) {
        if (keyboard.key(event.key))
            event.preventDefault();
 	});
};
