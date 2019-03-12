/*

creates a list of hash maps - each hash map represents a text, whereby the keys are pos tags and the values are frequencies of said pos tags. The last hash map in the list represents the corpus (and the cumulative frequencies across all texts.)

*/

import java.util.*; 
import java.io.*;

public class Counter{

    public static void main(String[]args) throws FileNotFoundException, IOException{
    //Read the MediaWiki Output file 	
	File output = new File("./maintenance/output.wiki.xml");
	BufferedReader br = new BufferedReader(new FileReader(output));
	//Read pro line 
	String currentLine = br.readLine();
	//create a list of hash maps - one for each individual text and one for the corpus as a whole
	//the grapic at the ende of text will be created with this hash map 
	List<HashMap<String,Integer>> texts = new ArrayList<HashMap<String,Integer>>();
	HashMap<String, Integer> corpus = new HashMap<>();
	String ddc_tags = "";
	//Read till the end of Output file 
	while(currentLine!=null){
		//Local HashMap for loop 
	    HashMap<String,Integer> someText = new HashMap<>();
	    //while we are on a particular page (and not finished it as signalled by </page>
	    //Read for each page 
	    while(!currentLine.contains("</page>")){
	    	//If it contains pos, it must be saved 
		    if(currentLine.contains("pos:")){
		    //Split:  {{#tip-text: whatever |lemma:whatever,pos:NNP,NE:LOCATION
		    //or {{#tip-text: whatever |lemma:whatever,pos:VBZ
		    //TODO It could cause error, if {{#tip-text: }} |lemma:},pos:}}}}
			String[] currentLineArr = currentLine.split("}} ");
			//For each splited part
			for(int i=0;i<currentLineArr.length;i++){
				//To save pos-Tag
				String currentTag;
				//If the splited part has NE the tag is between "pos:" and ",NE"
				//Else betwenn "pos:" and end of string 
				if(currentLineArr[i].contains("#word")){
					if(currentLineArr[i].contains("NE:")){
						currentTag = currentLineArr[i].substring(currentLineArr[i].indexOf("pos:")+4,currentLineArr[i].indexOf(",NE:"));
	
					}else {
						currentTag = currentLineArr[i].substring(currentLineArr[i].indexOf("pos:")+4,currentLineArr[i].length());
	
					}
				//to save in HashMap for single page
			    if(someText.containsKey(currentTag))
				someText.put(currentTag, someText.get(currentTag) + 1);
			    else 
				someText.put(currentTag, 1);
			    //and summed in Corpus 
			    if(corpus.containsKey(currentTag))
				corpus.put(currentTag, corpus.get(currentTag) + 1);
			    else 
				corpus.put(currentTag, 1);
				}
				if(currentLineArr[i].contains("DDC")){
					if(!ddc_tags.contains(currentLineArr[i].substring(currentLineArr[i].indexOf("DDC:")+4,currentLineArr[i].length()))){
						ddc_tags= ddc_tags +":"+ currentLineArr[i].substring(currentLineArr[i].indexOf("DDC:")+4,currentLineArr[i].length())+",";
					}
				}
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
	fileWrite(output, texts, ddc_tags);

    }
	    
    //rewrites file with freqs from hashmap inbetween <text> </text> tags
    public static void fileWrite(File origFile, List<HashMap<String,Integer>> maps, String ddc_tags) throws FileNotFoundException, IOException{
	//To rewrite output xml file, that got from MediaWikiWriter 
    BufferedReader br = new BufferedReader(new FileReader(origFile));
    //Create new file to copy at the end to original file 
	File tmp = new File("./maintenance/tmp.xml");
	PrintWriter pw = new PrintWriter(new FileWriter(tmp));
	int hashMapCount=0;
	//Processing the actual and next line 
	String currLine = br.readLine();
	String nextLine = br.readLine();
	//String for Locations 
	String locations = "";
	
	while(nextLine!=null){
		//if(currLine.contains("xml:space")) {
		//	currLine=currLine.replaceAll(" & "," and ");
		//}
		if(currLine.contains("textinfo:")){
			String[] currentLineArr2 = currLine.split("}}");
			currLine="";
			for(int i=0;i<currentLineArr2.length;i++){
				String tempo="";
				 if(currentLineArr2[i].contains("#textinfo:")) {
				    	tempo= currentLineArr2[i]+"DDC"+ddc_tags.substring(0, ddc_tags.length() - 1);
				    }
				 currLine=currLine+tempo+"}}";
			}
		}
		//Rewrite the tooltip-Tag 
		// from  ",pos:whatever}}" to  ",pos:whatever|pos_whatever}}" 
		// or from  ",pos:whatever,NE:LOCATION}}" to  ",pos:whatever,NE:Location|pos_whatever}}"
		if(currLine.contains("pos:")){
			//Split again 
			//TODO It could cause error, if {{#tip-text: }} |lemma:},pos:}}}}
		    String[] currentLineArr2 = currLine.split("}} ");
		    //Empty current line to rewrite 
		    currLine="";
		    for(int i=0;i<currentLineArr2.length;i++){
		    	//Temporary file for saving strings for current line 
		    	String tempo="";
		    	//Read pos-Tag but this time for not summing up, but for rewriting for each Token
			    String currentTag2; 
			    if(currentLineArr2[i].contains("#word")) {
			    	
				    if(currentLineArr2[i].contains("NE:")){
				    	currentTag2 = currentLineArr2[i].substring(currentLineArr2[i].indexOf("pos:")+4,currentLineArr2[i].indexOf(",NE:"));
	
					}else {
						currentTag2 = currentLineArr2[i].substring(currentLineArr2[i].indexOf("pos:")+4,currentLineArr2[i].length());
	
					}
				    //Creating the form {{#tip-text: whatever |lemma:whatever,pos:NNP,NE:LOCATION|pos_whatever}}
				    //or {{#tip-text: whatever |lemma:whatever,pos:VBZ|pos_whatever}}
				    tempo= currentLineArr2[i]+"|pos_"+currentTag2+"}}";
				   
			    }else {
			    	tempo= currentLineArr2[i]+"}}";
			    } 
			    
			    //tempo= currentLineArr2[i]+"|pos_"+currentTag2+"}}";
			    currLine=currLine+tempo+" ";
			    //Saving Locations in Array
					if(currentLineArr2[i].contains("LOCATION")) {
						locations=locations+"; "+currentLineArr2[i].substring(currentLineArr2[i].indexOf("#word:")+6,currentLineArr2[i].indexOf(" |l"))+"~"+currentLineArr2[i].substring(currentLineArr2[i].indexOf("#word:")+6,currentLineArr2[i].indexOf(" |l"));
			    	}
					if(currentLineArr2[i].contains("I-LOC")) {
						locations=locations+"; "+currentLineArr2[i].substring(currentLineArr2[i].indexOf("#word:")+6,currentLineArr2[i].indexOf(" |l"))+"~"+currentLineArr2[i].substring(currentLineArr2[i].indexOf("#word:")+6,currentLineArr2[i].indexOf(" |l"));
			    	}
		    	}
		}
		
		//if(nextLine.contains("[[Category:DDC")) {
		//	currLine = nextLine;
		//	while(nextLine.contains("[[Category:DDC")) {
		//		nextLine = br.readLine();
		//	}
		//}
		
		// If the next line is </text> add Graph 
	    if(nextLine.equals("</text>")){
		//if at end of certain text, append info from hashmap
		currLine = currLine + " " + prettyPrint(maps.get(hashMapCount));
		hashMapCount++;
		//Add Map to MediaWiki File if only there is any location in the text
		if(!locations.isEmpty()){
			currLine = currLine + "{{#display_map:" +locations+ "}}";
		}
		//To reset locations for the next text
		locations = "";
	    }
	    //Continue to reading lines in output file 
	    currLine=currLine.replaceAll(" & "," &#38; ");
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
	String jsonReturn = "&lt;br&gt;&lt;graph&gt;{ \"width\": 1000,\"height\": 200,\"padding\": {\"top\": 20, \"left\": 30, \"bottom\": 20, \"right\": 10},\"data\": [{\"name\": \"table\",\"values\": [";
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



