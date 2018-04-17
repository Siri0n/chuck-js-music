Recorder r;
"" => r.folder;

FileReader fr;

Instrument1 instr => r => dac;
Instrument1 instr2 => r;
Instrument1 instr3 => r;

0.2 => instr.gain; 
0.4 => instr2.gain => instr3.gain;

fr.readNotes("test.score") @=> string notes[][];
fr.readNotes("test2.score") @=> string notes2[][];
fr.readNotes("test3.score") @=> string notes3[][];

r.rec();
spork ~ instr.play(notes);
spork ~ instr2.play(notes2);
instr3.play(notes3);
r.stop();