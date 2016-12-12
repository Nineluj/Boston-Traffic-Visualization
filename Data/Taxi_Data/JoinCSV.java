/**
 * @author "Yiwen Dong"
 */
import java.io.*;
import java.util.*;

public class JoinCSV{
  public static String compare(String drop, String pick){
    if(drop.split(",").length < 5){
      return "le";
    } else if (drop.split(",").length < 5){
      return "gr";
    }
    int did = Integer.valueOf(drop.split(",")[0]);
    int pid = Integer.valueOf(pick.split(",")[0]);
    if(did == pid){
      return "eq";
    } else if (did < pid){
      return "le";
    } else {
      return "gr";
    }
  }
  
  public static String arrayToString(List<String> data){
    String re = "";
    for(String s : data){
      re = re + "," + s;
    }
    return re.substring(1);
  }
  
  public static void write(String drop, String pick, PrintWriter w){
    String[] df = drop.split(",");
    String[] pf = pick.split(",");
    List<String> rem = new ArrayList<String>(Arrays.asList(pf));
    rem.remove(0);
    List<String> a = new ArrayList<String>(Arrays.asList(df));
    a.addAll(rem);
    String tow = arrayToString(a);
    w.println(tow);
  }
  
  public static void main(String args[]) throws FileNotFoundException, IOException{
    BufferedReader df = new BufferedReader(new FileReader(args[0]));
    BufferedReader pf = new BufferedReader(new FileReader(args[1]));
    PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter(args[2])));
    
    out.println("\"TRIP_ID\",\"DROPTIME\",\"DROPADDRESS\",\"DROPLONG\",\"DROPLAT\",\"PICKUPTIME\",\"PICKUPADDRESS\",\"PICKUPLONG\",\"PICKUPLAT\"");
  
    String dline = df.readLine();
    String pline = pf.readLine();
    
    dline = df.readLine();
    pline = pf.readLine();
    
    int a = 0;
    int b = 0;
    while(dline != null && pline != null){
      if(a % 100000 == 0){
        System.out.println("Running " + a);
      }
      a++;
      String comp = compare(dline, pline);
      if(comp.equals("eq")){
        write(dline, pline, out);
        dline = df.readLine();
        pline = pf.readLine();
        b++;
      } else if(comp.equals("le")){
        dline = df.readLine();
      } else {
        pline = pf.readLine();
      }
    }
    System.out.println("found " + b + " from " + a + " runs");
    df.close();
    pf.close();
    out.flush();
    out.close();
  }
}