Recorder r;
"" => r.folder;

FileReader fr;

Instrument1 instr => Dyno d => r => dac;
Instrument1 instr2 => d;
Instrument1 instr3 => d;

0.3 => instr.gain; 
0.3 => instr2.gain;
0.3 => instr3.gain;

0.1 => instr3.mix;

1 => d.slopeAbove;
0.5 => d.slopeBelow;
0.5 => d.thresh;
0.005::second => d.attackTime;
0.3::second => d.releaseTime;

fr.readNotes("1.score") @=> string notes[][];
fr.readNotes("2.score") @=> string notes2[][];
fr.readNotes("3.score") @=> string notes3[][];

r.rec();
0.2::second => now;
spork ~ instr.play(notes);
spork ~ instr2.play(notes2);
instr3.play(notes3);
r.stop();