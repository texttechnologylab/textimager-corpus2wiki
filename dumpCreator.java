import java.lang.ProcessBuilder;
import java.util.*;
import java.io.*;
public class dumpCreator{
    
    public static void main (String[] args) throws IOException,InterruptedException{

	//textimager preprocessing - create the dump
	ProcessBuilder buildDump = new ProcessBuilder("/home/eleanor/WikiExporter/dumper.sh");
	buildDump.directory(new File("/home/eleanor/textimager-client/target"));
	Process textimager = buildDump.start();
	textimager.waitFor();

	//calls the import.sh script - preprocessing of dump + importation of dump, extensions 	
	ProcessBuilder buildImport = new ProcessBuilder("/home/eleanor/WikiExporter/importer.sh");
	buildImport.directory(new File("/home/eleanor/WikiExporter"));
	Process importer = buildImport.start();
    }
    
}

