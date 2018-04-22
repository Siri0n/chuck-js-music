var fs = require("fs");
var util = require("../../util/js/util");
var seedrandom = require("seedrandom");
var rng = seedrandom("elephant");

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


function createRow(time, freq, dur, mode, fade){
	let row = [];
	row.push(time);
	row.push(freq);
	row.push(dur);
	row.push(mode);
	fade && row.push(dur/2);
	return row.join(" ");
}

const bar = 1.6;
const length = 62;

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

function playMelody(time, melody, bar, gen){
	var result = [];
	for(let note of melody){
		let dur = note.dur*bar;
		if(note.type){
			let freq = gen[note.type]();
			result.push(createRow(
				time,
				freq,
				dur,
				random(1),
				note.fade
			));
		}
		time += dur;
	}
	return [time, result];
}

(function(){
	const melodies = [
		[
			{dur: 1, type: "t"},
			{dur: 0.5, type: "d"},
			{dur: 0.5, type: "s"},
			{dur: 1, type: "t", fade: true},
			{dur: 1}
		]
	];
	var result = [];
	var gen = {
		t: createArpGen(["c4", "e4", "g4", "c5"]),
		d: createArpGen(["g4", "b4", "d5", "g5"]),
		s: createArpGen(["f4", "a4", "c5", "f5"])
	}
	const startTime = 4*bar;
	const endTime = (length + 3)*bar;
	var time = startTime;
	var fragment;
	while(time < endTime){
		let melody = melodies[random(melodies.length - 1)];
		[time, fragment] = playMelody(time, melody, bar*2, gen);
		result = result.concat(fragment);
	}

	result.push(time + bar);

	fs.writeFileSync("3.score", result.join("\r\n"), "utf8");
})();