FileReader fr;

Instrument1 instr => dac;
Instrument1 instr2 => dac;

0.5 => instr.gain => instr2.gain;

fr.readNotes("test.txt") @=> string notes[][];
fr.readNotes("test2.txt") @=> string notes2[][];

spork ~ instr2.play(notes2);
instr.play(notes);
