/*Goal: Generates a stat block for a DND character (e.g. hp, melee attack, saves, initiative, AC, skill points)
based on inputted name,character class,character level, and attributes
*/

//load prompt module

	//var prompt = require('prompt');

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
			Bard: {HP:'Mediocre',Skillpoints:'Mediocre',BAB:'Medium',Fort:'Bad',Ref:'Good',Will:'Good'}
			/*Barbarian:{HP:Great,Skillpoints:Bad,BAB:Good,}
			Cleric:{HP:}
			Druid:{}
			Rogue:{}
			Ranger:{}
			Wizard:{}
			Sorcerer:{}
			Fighter:{}
			Monk:{}
			Paladin:{}	*/
		}
		
		//function that calculates a characters stat if the stat is gradated (like HP)
		function calculatenongradatedskill(statname,charclass,level){
			return baseattributeclasslevellookup[statname][classqualities[charclass][statname]] * level;
		}

		//function that calculates a characters stat if the stat is not gradated (like Skills)
		function calculategradatedskill(statname,charclass,level){
			if (['Fort','Ref','Will'].indexOf(statname) !== -1) {savename =statname; statname =  "Saves";} else {savename = statname;	}
			console.log(statname); console.log(baseattributeclasslevellookup[statname][classqualities[charclass][savename]])
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
		
		finalstats.name = name;
		
		return finalstats;
	}

	
//// TESTS (WILL EXPAND THIS)
	var jake = characterbasecalculator('Bard',14);
	console.log(createcharacter('Jake','Bard',14,{Str:16,Dex:26,Con:14,Int:12,Wis:10,Cha:11},"Good"));
	console.log(addatrributeeffects(jake,{Str:16,Dex:26,Con:14,Int:12,Wis:10,Cha:11}));