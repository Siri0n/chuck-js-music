var fs = require("fs");
var util = require("../../util/js/util");
var seedrandom = require("seedrandom");
var rng = seedrandom("tits2");

function random(min, max){
	if(max === undefined){
		max = min;
		min = 0;
	}
	return Math.floor(rng()*(max - min + 1) + min);
}


function createNonRepeatingArpGen(notes){
	var last = Infinity;
	return function(){
		var n = random(notes.length - 2);
		(n >= last) && n++;
		last = n;
		return util.getFreq(notes[n]);
	}
}

function createRepeatingArpGen(notes){
	var last = random(notes.length - 1);
	var secondLast = -1;
	return function(){
		var n;
		if(last != secondLast || rng() < 0.6){
			n = last;
		}else{
			n = random(notes.length - 1);
		}
		secondLast = last;
		last = n;
		return util.getFreq(notes[n]);
	}
}

function createRow(time, freq, dur, mode){
	let row = [];
	row.push(time);
	row.push(freq);
	row.push(dur);
	row.push(mode);
	return row.join(" ");
}

// first instrument

const bar = 2.5;
const length = 32;

(function(){
	const C = ["c3", "e3", "g3", "c4"];
	const F = ["f3", "a3", "c4", "f4"];

	var result = [];
	var arp1 = createNonRepeatingArpGen(C);
	var arp2 = createRepeatingArpGen(F);


	for(let i = 0; i < (length - 4)*16; i++){
		let row;
		if((i % 32) < 16){
			row = createRow(i*bar/16, arp1(), bar/16, random(1));
		}else{
			row = createRow(i*bar/16, arp2(), bar/16, random(1));
		}
		result.push(row);
	}

	result.push((length + 1)*bar);

	fs.writeFileSync("test.score", result.join("\r\n"), "utf8");
})();

//second instrument

(function(){

	var result = [];
	var arp1 = createNonRepeatingArpGen(["c4", "d4", "e4", "g4", "b4"]);
	var arp2 = createNonRepeatingArpGen(["c4", "f4", "a4", "c5"]);

	//result.push("0");

	for(let i = 4; i < length; i++){
		if(i % 2){
			result.push(
				createRow(i*bar, arp2(), bar, random(1))
			);
		}else{
			result.push(
				createRow(i*bar, arp1(), bar/2, random(1)),
				createRow(i*bar + bar/2, arp1(), bar/4, random(1)),
				createRow(i*bar + bar/2 + bar/4, arp1(), bar/4, random(1))
			);
		}
	}

	result.push((length + 1)*bar);

	fs.writeFileSync("test2.score", result.join("\r\n"), "utf8");
})();

//third instrument

(function(){

	var result = [];

	var firstHalf = Math.floor(length/2);


	//result.push("0");

	for(let i = 8; i < firstHalf; i++){
		if(i % 2){
			result.push(
				createRow(i*bar, util.getFreq("f2"), bar, random(1))
			);
		}else{
			result.push(
				createRow(i*bar, util.getFreq("c2"), bar, random(1))
			);
		}
	}

	for(let i = firstHalf; i < length - 2; i++){
		let maybe = random(1);
		let note = i % 2 ? "f2" : "c2";
		result.push(
			createRow(i*bar, util.getFreq(note), bar/4, maybe),
			createRow(i*bar + bar/4, util.getFreq(note), 3*bar/4, 1 - maybe)
		);

	}
	result.push((length + 1)*bar);

	fs.writeFileSync("test3.score", result.join("\r\n"), "utf8");
})();