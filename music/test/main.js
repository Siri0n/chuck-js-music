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
	row.push(util.round(time, 5));
	row.push(freq);
	row.push(util.round(dur, 5));
	row.push(mode);
	return row.join(" ");
}

// first instrument

const bar = 2;
const length = 16;

(function(){
	const C = ["c4", "e4", "g4", "c5"];
	const F = ["f4", "a4", "c5", "f5"];

	var result = [];
	var arp1 = createNonRepeatingArpGen(C);
	var arp2 = createRepeatingArpGen(F);


	for(let i = 0; i < length*16; i++){
		let row;
		if((i % 32) < 16){
			row = createRow(i*bar/16, arp1(), bar/16, random(1));
		}else{
			row = createRow(i*bar/16, arp2(), bar/16, random(1));
		}
		result.push(row);
	}

	result.push(length*bar);

	fs.writeFileSync("test.txt", result.join("\r\n"), "utf8");
})();

//second instrument

(function(){

	var result = [];
	var arp1 = createNonRepeatingArpGen(["c3", "d3", "e3", "g3", "b3"]);
	var arp2 = createNonRepeatingArpGen(["c3", "f3", "a3"]);

	//result.push("0");

	for(let i = 0; i < length; i++){
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

	result.push(length*bar);

	fs.writeFileSync("test2.txt", result.join("\r\n"), "utf8");
})();