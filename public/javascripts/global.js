
//object to hold values of needed functions and variables so we don't pollute the namespace
var dmpanelfunctionsandvalues = {};

//DOM Ready
$(document).ready(function() {
	
	each(dmpanelfunctionsandvalues.musicfiles,(function(key){
		var newbutton = document.createElement("button");
		newbutton.value = key;
		newbutton.id = key;
		newbutton.appendChild(document.createTextNode(key))
		var buttoncontainer = document.getElementById("button-container");
		buttoncontainer.appendChild(newbutton);
		document.getElementById(key).onclick = dmpanelfunctionsandvalues.playmusic(dmpanelfunctionsandvalues.musicfiles[key]);
		buttoncontainer.appendChild(document.createElement("br"));
		buttoncontainer.appendChild(document.createElement("br"));
		})
	);

});

//Alternate implementation: could create all buttons agnostically in jade, then rename all the buttons and assign music here
//so have all button names live here and use the script to create them, do that, could also take a higher order function
//and you can use map to create the buttons
//and that way just adding to this list of buttons will add to it


//** FUNCTIONS AND VARIABLES


//helper function each
function each(collection,func){
	if (Array.isArray(collection)){
		for (var i =0;i<collection.length;i++){
				func(collection[i]);
		}
	}
	for (var i in collection){
		func(i);
	}
}

//object holding names of tracks and tracks; new button will be created for each key value pair
dmpanelfunctionsandvalues.musicfiles = {
	"Sustained music for cheery progress or ongoing activity":"fathersandsons.mp3",
	"Sustained music for eerie investigation":"fathersandsons.mp3",
	"Music for sudden danger":"fathersandsons.mp3",
	"Music for emotional payoff":"luxaeterna.mp3"
}

//plays music of filename attached to button
dmpanelfunctionsandvalues.playmusic = function(filename){
	return function(){
		var songfile = new Audio(filename);
		songfile.play();
		console.log("Now playing " + filename);
	}
}





8