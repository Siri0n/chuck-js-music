function round(n, d = 0){
	var m = 10 ** d;
	return Math.round(n*m)/m;
}

const NOTES = {c: -9, d: -7, e: -5, f: -4, g: -2, a: 0, b: 2};

function getFreq(str, shift = 0){
	var match = /([a-g])(#?)([0-9]*)/.exec(str);
	var note = NOTES[match[1].toLowerCase()];
	if(match[2] == "#"){
		note++;
	}
	var octave = match[3] - 0;
	note += (octave - 4)*12;
	note += shift;
	var result = 440 * (2 ** (note/12));
	return round(result, 2);
}





module.exports = {
	round,
	getFreq
}