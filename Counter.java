/*

creates a list of hash maps - each hash map represents a text, whereby the keys are pos tags and the values are frequencies of said pos tags. The last hash map in the list represents the corpus (and the cumulative frequencies across all texts.)

*/

import java.util.*;
import java.io.*;

public class Counter{

    public static void main(String[]args) throws FileNotFoundException, IOException{
	File output = new File("./maintenance/output.wiki.xml");
	BufferedReader br = new BufferedReader(new FileReader(output));
	String currentLine = br.readLine();
	//create a list of hash maps - one for each individual text and one for the corpus as a whole
	List<HashMap<String,Integer>> texts = new ArrayList<HashMap<String,Integer>>();
	HashMap<String, Integer> corpus = new HashMap<>();

	while(currentLine!=null){
	    HashMap<String,Integer> someText = new HashMap<>();
	    //while we are on a particular page (and not finished it as signalled by </page>
	    while(!currentLine.contains("</page>")){
		    if(currentLine.contains("pos:")){
			String[] currentLineArr = currentLine.split("} ");
			for(int i=0;i<currentLineArr.length;i++){
			    String currentTag = currentLineArr[i].substring(currentLineArr[i].indexOf("pos:")+4,currentLineArr[i].indexOf("}"));
			    if(someText.containsKey(currentTag))
				someText.put(currentTag, someText.get(currentTag) + 1);
			    else 
				someText.put(currentTag, 1);
			    if(corpus.containsKey(currentTag))
				corpus.put(currentTag, corpus.get(currentTag) + 1);
			    else 
				corpus.put(currentTag, 1);
			}//end for
			currentLine = br.readLine();
		    }//end if
		    else{//doesn't contain pos
			currentLine = br.readLine();
		    }
		    if(currentLine==null)
			break;
	    }//end nested while - pages
	   
	    if(currentLine==null)
		break;
	    texts.add(someText);
	    currentLine = br.readLine();
	   
	}//end outer while - lines
	//remove the last page entry
	texts.remove(texts.size()-1);
	//add the last page entry with data
	texts.add(corpus);
	//rewrite xml file
	fileWrite(output, texts);

    }
	    
    //rewrites file with freqs from hashmap inbetween <text> </text> tags
    public static void fileWrite(File origFile, List<HashMap<String,Integer>> maps) throws FileNotFoundException, IOException{
	BufferedReader br = new BufferedReader(new FileReader(origFile));
	File tmp = new File("./maintenance/tmp.xml");
	PrintWriter pw = new PrintWriter(new FileWriter(tmp));
	int hashMapCount=0;
	String currLine = br.readLine();
	String nextLine = br.readLine();

	while(nextLine!=null){
	    if(nextLine.equals("</text>")){
		//if at end of certain text, append info from hashmap
		currLine = currLine + " " + prettyPrint(maps.get(hashMapCount));
		hashMapCount++;
	    }
	    pw.println(currLine);
	    currLine = nextLine;
	    nextLine = br.readLine();
	    
	}

	//print the final line
	pw.println(currLine);

	//close the streams
	pw.close();
	br.close();

	//delete original file and rename tmp file to original file name
	origFile.delete();
	tmp.renameTo(origFile);

    }

    /*outputs frequency info in json format for use by graph extension: 
    template from taken from https://github.com/vega/vega/wiki/Tutorial*/

    public static String prettyPrint(HashMap<String, Integer> map){
	List<String> keys = new ArrayList<>(map.keySet());
	String jsonReturn = "&lt;graph&gt;{ \"width\": 1000,\"height\": 200,\"padding\": {\"top\": 20, \"left\": 30, \"bottom\": 20, \"right\": 10},\"data\": [{\"name\": \"table\",\"values\": [";
	for(int i=0;i<keys.size();i++){
	    if(i==0)
		jsonReturn+= "{\"category\":\"" + keys.get(i) + "\",\"amount\":" + map.get(keys.get(i)) + "}";
	    else
		jsonReturn+= ",{\"category\":\"" + keys.get(i) + "\",\"amount\":" + map.get(keys.get(i)) + "}";
		
	}
	jsonReturn+="]}],\"signals\": [{\"name\": \"tooltip\",\"init\": {},\"streams\": [{\"type\": \"rect:mouseover\", \"expr\": \"datum\"},{\"type\": \"rect:mouseout\", \"expr\": \"{}\"}]}],\"predicates\": [{\"name\": \"tooltip\", \"type\": \"==\", \"operands\": [{\"signal\": \"tooltip._id\"}, {\"arg\": \"id\"}]}],\"scales\": [{ \"name\": \"xscale\", \"type\": \"ordinal\", \"range\": \"width\",\"domain\": {\"data\": \"table\", \"field\": \"category\"} },{ \"name\": \"yscale\", \"range\": \"height\", \"nice\": true,\"domain\": {\"data\": \"table\", \"field\": \"amount\"} }],\"axes\": [{ \"type\": \"x\", \"scale\": \"xscale\" },{ \"type\": \"y\", \"scale\": \"yscale\" }],\"marks\":[{\"type\": \"rect\",\"from\": {\"data\":\"table\"},\"properties\": {\"enter\": { \"x\": {\"scale\": \"xscale\", \"field\": \"category\"},\"width\": {\"scale\": \"xscale\", \"band\": true, \"offset\": -1},\"y\": {\"scale\": \"yscale\", \"field\": \"amount\"},\"y2\": {\"scale\": \"yscale\", \"value\":0}},\"update\": { \"fill\": {\"value\": \"steelblue\"} },\"hover\": { \"fill\": {\"value\": \"red\"} }}},{\"type\": \"text\",\"properties\": {\"enter\": {\"align\": {\"value\": \"center\"},\"fill\": {\"value\": \"#333\"}},\"update\": {\"x\": {\"scale\": \"xscale\", \"signal\": \"tooltip.category\"},\"dx\": {\"scale\": \"xscale\", \"band\": true, \"mult\": 0.5},\"y\": {\"scale\": \"yscale\", \"signal\": \"tooltip.amount\", \"offset\": -5},\"text\": {\"signal\": \"tooltip.amount\"},\"fillOpacity\": {\"rule\":[ {\"predicate\": {\"name\": \"tooltip\", \"id\": {\"value\": null}},\"value\": 0},{\"value\": 1}]}}}}]}&lt;/graph&gt;";

	return jsonReturn;

    }

}

