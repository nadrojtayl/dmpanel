
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
	//upon page load, populates document with buttons to play music
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
		"Sustained music for eerie investigation":"fireworkshungergames.mp3",
		"Music for sudden danger":"trinitydream.mp3",
		"Music for emotional payoff":"luxaeterna.mp3",
		"Tavern music":"ConanTheology.mp3"
	}

//plays music of filename attached to button
	dmpanelfunctionsandvalues.playmusic = function(filename){
		return function(){
			var songfile = new Audio(filename);
			songfile.play();
			console.log("Now playing " + filename);
		}
	}

//creates an NPC based on user input and rules of DND 3.5
//outputs NPC stats to block on page
//NOTE: Utilizes several functions comprising a DND stat calculator, all at bottom of this page

	function makecharacter(){
		//gets character inputs from user,defining level,class,name,etc
		var level = document.getElementById("level").value;
		var charclass = document.getElementById("charclass").value;
		var name = document.getElementById("charname").value;
		if (!name) {var name = "Nameless, the Mysterious";}
		var equipmentquality=document.getElementById("equipment").value;
		
		//uses inputs to calculate character statblock (see functions that handle calculations below)
		//for now assumes all ability scores are 16
		var charstats = createcharacter(name.toString(),charclass,level,{Str:16,Dex:16,Con:16,Int:16,Wis:16,Cha:16},equipmentquality);

		//helper function that turns an object into a string representing its contents: allowing us to print stat block to screen
		function printobject(myobject){
		var toreturn = "";
		for (var i in myobject){
			toreturn += i;
			toreturn += " : "
			toreturn += myobject[i];
			toreturn += " ";
			toreturn += "\n"
		}
		return toreturn;
	}
		
		//appends character stat block to DOM
		var newtextarea = document.createElement("textarea");
		newtextarea.value = printobject(charstats);
		document.getElementById("charactertext").appendChild(newtextarea);
		
	}




















/*


//FUNCTIONS THAT HANDLE DND CHARACTER STATS CREATION



*/

/*Goal: Generates a stat block for a DND character (e.g. hp, melee attack, saves, initiative, AC, skill points)
based on inputted name,character class,character level, and attributes
*/


//generate ability score modifier
	function abilityscoremodcalc(score){
		return Math.floor((score-10)/2);
	}


//calculate base numbers for character HP, BAB, Saves and skills based on class and level
	function characterbasecalculator(charclass,level){
		//object defining key char stats to return
		var characterbasestats = {};
		
		//object defining base stats based on level and class quality (E.g. each class has some level, from bad to mediocre, in each stat)
		var baseattributeclasslevellookup = {
			HP: {
				Bad: 4,
				Mediocre: 6,
				Okay: 8,
				Good: 10,
				Great: 12
			},
			BAB: {
				Bad:function(x){return Math.floor(x/2)},
				Medium: function(x){return Math.floor(x*3/4)},
				Good: function (x){return x;}

			},
			Saves:{
				Bad:function(x){return Math.floor(x*.3);},
				Good:function(x){return Math.ceil(x*.6);}
			},
			Skillpoints:{
				Bad: function(level){return (level+3)*4;},
				Mediocre: function(level){return (level+3)*6;},
				Okay: function(level){return (level+3)*8;},
				Good: function(level){return (level+3)*10;},
				Great: function(level){return (level+3)*12;}
			}
		}
		
		//object defining quality level of each stat for each class 
		var classqualities = {
			Bard: {HP:'Mediocre',Skillpoints:'Mediocre',BAB:'Medium',Fort:'Bad',Ref:'Good',Will:'Good'},
			Barbarian:{HP:'Great',Skillpoints:'Bad',BAB:'Good',Fort:'Good',Ref:'Good',Will:'Bad'},
			Cleric:{HP:'Okay',Skillpoints:'Bad',BAB:'Medium',Fort:'Good',Ref:'Bad',Will:'Good'},
			Druid:{HP:'Okay',Skillpoints:'Bad',BAB:'Medium',Fort:'Good',Ref:'Bad',Will:'Good'},
			Rogue: {HP:'Okay',Skillpoints:'Okay',BAB:'Medium',Fort:'Bad',Ref:'Good',Will:'Bad'},
			Ranger:{HP:'Okay',Skillpoints:'Mediocre',BAB:'Good',Fort:'Good',Ref:'Good',Will:'Bad'},
			Wizard:{HP:'Bad',Skillpoints:'Mediocre',BAB:'Good',Fort:'Good',Ref:'Good',Will:'Bad'},
			Sorcerer:{HP:'Okay',Skillpoints:'Bad',BAB:'Bad',Fort:'Bad',Ref:'Bad',Will:'Good'},
			Fighter:{HP:'Good',Skillpoints:'Bad',BAB:'Good',Fort:'Good',Ref:'Bad',Will:'Bad'},
			Monk:{HP:'Okay',Skillpoints:'Mediocre',BAB:'Medium',Fort:'Good',Ref:'Good',Will:'Good'},
			Paladin:{HP:'Good',Skillpoints:'Bad',BAB:'Good',Fort:'Good',Ref:'Bad',Will:'Bad'}
		}
		
		//function that calculates a characters stat if the stat is gradated (like HP)
		function calculatenongradatedskill(statname,charclass,level){
			return baseattributeclasslevellookup[statname][classqualities[charclass][statname]] * level;
		}

		//function that calculates a characters stat if the stat is not gradated (like Skills)
		function calculategradatedskill(statname,charclass,level){
			if (['Fort','Ref','Will'].indexOf(statname) !== -1) {savename =statname; statname =  "Saves";} else {savename = statname;	}
			return baseattributeclasslevellookup[statname][classqualities[charclass][savename]](level);
		}
		
		//defines which starts are gradated and which not
		var gradatedornotgradated = {HP:'nongradated',BAB: 'gradated',Saves: 'gradated',Skillpoints: 'gradated'}
		var tocalculate = ['HP','BAB','Fort','Ref','Will','Skillpoints'];
		
		//calculates stats
		for (var i in tocalculate){
			var statname = tocalculate[i];
			if (gradatedornotgradated[statname] === "nongradated"){
				characterbasestats[statname] = calculatenongradatedskill(statname,charclass,level);
			} else {
				characterbasestats[statname] = calculategradatedskill(statname,charclass,level);
			}
		}
		//returns class base scores object with character stats
		return characterbasestats;
	}
	
//helper function that takes an object and returns a new object after applying a function func to values
	function valuestransform(originalobject,func){
		var newobj = {};
		for (var i in originalobject){
			newobj[i] = func(originalobject[i]);
		}
		return newobj;
	}
	
//takes a characterstatblock and an attribute block and returns a new stat block with stats adjusted based on attribute score
	function addatrributeeffects(characterstats,attributescores){
		
		attributemodifiers = valuestransform(attributescores,abilityscoremodcalc);
		
		var transformedcharacterstats = {};
		
		//maps stat to ability score that modifies it
		var stattoabilitythatchangesit = 
		{ HP: 'Con',
			Skillpoints: 'Int',
			Fort: 'Con',
			Ref: 'Dex',
			Will:'Wis',
			BAB:'Str'
		};
		
		//returns new stat score based on ability score
		function modifystatbasedonattr(oldstatscores,statname){
			return oldstatscores[statname] + attributemodifiers[stattoabilitythatchangesit[statname]];
		}
		
		
		//loop runs modify stat based on ability score on all stats in old stat block, saves to new stat block to return
		for (var stat in characterstats){
			transformedcharacterstats[stat] = modifystatbasedonattr(characterstats,stat)
		}
		
		//adds Ac based on dex
		transformedcharacterstats.AC = 10 + attributemodifiers['Dex'];
		
		//adds melee and ranged ABs based on STR and DEX, respectively
		transformedcharacterstats.MeleeAB = transformedcharacterstats.BAB + attributemodifiers['Str'];
		transformedcharacterstats.RangedAb = transformedcharacterstats.BAB + attributemodifiers['Dex'];
		
		return transformedcharacterstats;
	}
	
//adds equipment effects to character stats, based on inputted descriptor of equipment quality
	function addequipment(equipmentquality,statswithoutequipment){
		var statswithequipment = statswithoutequipment;
		if (equipmentquality==="Good"){
			statswithequipment.AC += 4;
			statswithequipment.RangedWeapon = "Longbow";
			statswithequipment.RangedDamage = "1d8";
			statswithequipment.MeleeWeapon = "Longsword";
			statswithequipment.RangedDamage = "1d8";
		} else if (equipmentquality=="Bad") {
			statswithequipment.AC += 2;
			statswithequipment.RangedWeapon = "Shortbow";
			statswithequipment.RangedDamage = "1d6";
			statswithequipment.RangedWeapon = "Shortsword";
			statswithequipment.RangedDamage = "1d6";
		}
		return statswithequipment;
	}
	
//returns character based on inputted class, level, attributes and equipment quality
	function createcharacter(name,charclass,level,attributes,equipmentquality){
		var characterbasestats = characterbasecalculator(charclass,level);
		
		var statsmodifiedbasedonattributes = addatrributeeffects(characterbasestats,attributes);
		
		var finalstats = addequipment(equipmentquality,statsmodifiedbasedonattributes)
		
		finalstats.Name = name;
		
		return finalstats;
	}
