var fs = require("fs");
var util = require("../../util/js/util");
var seedrandom = require("seedrandom");
var rng = seedrandom("tits");

function random(min, max){
	if(max === undefined){
		max = min;
		min = 0;
	}
	return Math.floor(rng()*(max - min + 1) + min);
}


const notes = ["c4", "e4", "g4", "c5"];

function createArpGen(notes){
	var last = Infinity;
	return function(){
		var n = random(notes.length - 2);
		(n >= last) && n++;
		last = n;
		return util.getFreq(notes[n]);
	}
}

const bar = 0.1;

var result = [];
var arp = createArpGen(notes);

for(let i = 0; i < 64; i++){
	let row = [];
	row.push(util.round(i*bar, 2));
	row.push(arp());
	row.push(util.round(bar, 2));
	row.push(random(1));
	result.push(row.join(" "));
}

fs.writeFileSync("test.txt", result.join("\r\n"), "utf8");