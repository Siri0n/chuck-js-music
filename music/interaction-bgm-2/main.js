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

function createArpGen(notes){
	return function(){
		return util.getFreq(notes[random(notes.length - 1)]);
	}
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

const bar = 1.6;
const length = 64;

(function(){
	const n = 8;
	const arp = createArpGen(["c2", "e2", "g2"]);
	var result = [];
	for(let i = 0; i < length; i++){
		for(let j = 0; j < n; j++){
			result.push(createRow(
				(i + j/n)*bar,
				arp(),
				bar/n,
				random(1) 
			));
		}
	}

	result.push((length + 1)*bar);

	fs.writeFileSync("1.score", result.join("\r\n"), "utf8");
})();

(function(){
	const n = 4;
	const arp = createArpGen(["a2", "c3", "e3"]);
	var result = [];
	for(let i = 2; i < length + 2; i++){
		for(let j = 0; j < n; j++){
			result.push(createRow(
				(i + j/n)*bar,
				arp(),
				bar/n,
				random(1) 
			));
		}
	}

	result.push((length + 3)*bar);

	fs.writeFileSync("2.score", result.join("\r\n"), "utf8");
})();

function playRhythm(time, rhythm, bar, gen){
	var result = [];
	for(let dur of rhythm){
		if(dur > 0){
			result.push(createRow(
				time, 
				gen(), 
				dur*bar, 
				random(1)
			));
			time += dur*bar;
		}else{
			time -= dur*bar;
		}
	}
	return [time, result];
}

(function(){
	const rhythms = [
		[1. -1],
		[1],
		[1],
		[0.75, 0.25],
		[0.5, -0.5],
		[0.5, 0.5],
		[0.5, 0.5],
		[0.25, 0.75],
		[0.25, 0.25, 0.5]
	];
	var result = [];
	var arp = createArpGen(["c4", "d4", "e4", "g4", "a4", "c5", "d5"]);
	const startTime = 4*bar;
	const endTime = (length + 2)*bar;
	var time = startTime;
	var melody;
	while(time < endTime){
		let rhythm = rhythms[random(rhythms.length - 1)];
		[time, melody] = playRhythm(time, rhythm, bar*2, arp);
		result = result.concat(melody);
	}

	result.push(time + bar);

	fs.writeFileSync("3.score", result.join("\r\n"), "utf8");
})();