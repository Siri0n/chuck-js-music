public class Instrument1 extends Instrument{
    
    20::ms => dur release;
    PRCRev rev => ADSR adsr => outlet;
    0.02 => rev.mix;
    adsr.set(20::ms, 20::ms, 0.7, release);
    
    SinOsc main => Envelope e => rev;
    //1 => main.gain;
    
    SinOsc first => Envelope e1 => rev;
    //1 => first.gain;
    
    fun void play(string notes[])
    {
        Std.atof(notes[0]) * 1::second + start => now;
        if(notes.size() == 1)
        {
            return;
        }
        Std.atof(notes[1]) => float freq;
        Std.atof(notes[2]) * 1::second => dur d;
        Std.atoi(notes[3]) => int mode;
        if(notes.size() == 5){
             Std.atof(notes[4]) * 1::second => dur rel;
             spork ~ playNote(freq, d, mode, rel);
        }else{
            spork ~ playNote(freq, d, mode);
        }
    }

    fun void playNote(float freq, dur duration, int mode){
        return playNote(freq, duration, mode, release);
    }

    fun void playNote(float freq, dur duration, int mode, dur rel){
        adsr.set(20::ms, 20::ms, 0.7, rel);
        if(mode){
            freq*2 => main.freq;
            freq => first.freq;
        }else{
            freq => main.freq;
            freq*2 => first.freq;
        }
        1 => e.value;
        0 => e1.value;
        0 => e.target;
        1 => e1.target;
        duration => e.duration => e1.duration;
        adsr.keyOn();
        duration - rel => now;
        adsr.keyOff();
        rel => now;
    }

    fun void mix(float value){
    	value => rev.mix;
    }
}