import java.lang.ProcessBuilder;
import java.util.*;
import java.io.*;
public class dumpCreator{
    
    public static void main (String[] args) throws IOException,InterruptedException{
	System.out.println("Working Directory =  " + System.getProperty("user.dir"));

	//textimager preprocessing - create the dump
	ProcessBuilder buildDump = new ProcessBuilder("./dumper.sh");
	buildDump.directory(new File(System.getProperty("user.dir")));
	Process textimager = buildDump.start();
	textimager.waitFor();
	System.out.println("Dump created");

	//calls the import.sh script - preprocessing of dump + importation of dump, extensions 	
	ProcessBuilder buildImport = new ProcessBuilder("./importer.sh");
	buildImport.directory(new File(System.getProperty("user.dir")));
	Process importer = buildImport.start();
	importer.waitFor();
	System.out.println("Importer finished");
    }
    
}

