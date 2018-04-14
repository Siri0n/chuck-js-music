public class Instrument extends Chubgraph
{
    time start;
    
    fun void play(string notes[][])
    {
        now => start;
        for(0 => int i; i < notes.size(); i++)
        {
            play(notes[i]);
        }
    }
    
    fun void play(string notes[])
    {
    }
    
}