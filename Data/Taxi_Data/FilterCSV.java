/**
 * @author "Yiwen Dong"
 */
import java.io.*;
import java.util.*;

public class FilterCSV{
  public static void main(String args[]) throws FileNotFoundException, IOException{
    BufferedReader in = new BufferedReader(new FileReader(args[0]));
    PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter(args[1])));
    
    String line = in.readLine();
    out.println(line);
    line = in.readLine();
    
    int i = 0;
    int t = 0;
    int w = 0;
    while(line != null){
      if(i == Integer.valueOf(args[2])){
        out.println(line);
        i = 0;
        w++;
      }
      line = in.readLine();
      t++;
      i++;
    }
    
    in.close();
    out.flush();
    out.close();
    System.out.println("Read: " + t + " lines");
    System.out.println("Writen: " + w + " lines");
  }
}