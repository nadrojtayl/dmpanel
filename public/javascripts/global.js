
//object to hold values of needed functions and variables so we don't pollute the namespace
var dmpanelfunctionsandvalues = {};

/*
DOM READY EVENT: READ HERE

When home page loads, we refer to the musicfiles object contained in this file

musicfiles is a JS object where each key is text referring to a kind of music
you might want to play (ex "Walking through forest") and the value for that is the path to a
music file appropriate for that mood (e.g. "Zelda Kokiri Forest track")

Upon dom loading, the function below refers to the musicfiles object, and creates a new button for 
each key value pair in the object. Each button is labeled with the mood you want to create and plays
the corresponding song

Organizing things this way allows easy update functionality: just add a new mood and song

Currently only songs loaded include a good sustained activity song ("Fathersandsons") and an epic emotional climax song ("Lux Aeterna")

Adding others in future updates

*/
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

//object holding names of tracks and tracks; see readme at top
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