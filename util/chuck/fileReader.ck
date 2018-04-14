public class FileReader
{
    FileIO fio;
    StringTokenizer tokenizer;
    
    fun string[][] readNotes(string filename)
    {   
        string result[0][0];
        
        fio.open( filename, FileIO.READ );
        if( !fio.good() )
        {
            cherr <= "can't open file: " <= filename <= " for reading..."
                  <= IO.newline();
        }
        
        string row[];
        
        while( fio.more() )
        {
            new string[0] @=> row;
            tokenizer.set(fio.readLine());
            while(tokenizer.more())
            {
                
                row << tokenizer.next();
            }
            if(row.size() > 0)
            {
                result << row;
            }
        }
        
        fio.close();
        
        return result;
    }
}