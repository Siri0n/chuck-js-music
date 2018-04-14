FileReader fr;

Instrument1 instr => dac;

fr.readNotes("test.txt") @=> string notes[][];

instr.play(notes);