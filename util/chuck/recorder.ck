public class Recorder extends Chubgraph{
    inlet => outlet;
    "wav/" => string folder;
    "record" => string filename;
    inlet => Gain g => WvOut w => blackhole;
    
    fun void volume(float v){
        v => g.gain;
    }
    
    fun void rec(dur d){
        rec();
        spork~ closeAfter(d);
    }
    
    fun void closeAfter(dur d){
        d => now;
        w.closeFile();
    }
    
    fun void rec(){
        folder + filename => w.wavFilename;
    }
    
    fun void stop(){
        w.closeFile();
    }
}