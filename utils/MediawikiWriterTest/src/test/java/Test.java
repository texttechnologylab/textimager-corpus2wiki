import de.tudarmstadt.ukp.dkpro.core.api.metadata.type.DocumentMetaData;
import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

import org.apache.commons.io.FileUtils;
import org.apache.uima.UIMAException;
import org.apache.uima.analysis_engine.AnalysisEngineDescription;
import org.apache.uima.cas.impl.XmiCasDeserializer;
import org.apache.uima.cas.impl.XmiCasSerializer;
import org.apache.uima.fit.factory.JCasFactory;
import org.apache.uima.fit.pipeline.SimplePipeline;
import org.apache.uima.fit.util.JCasUtil;
import org.apache.uima.jcas.JCas;
import org.dkpro.core.io.xmi.XmiWriter;
import org.hucompute.textimager.client.TextImagerClient;
import org.hucompute.textimager.uima.io.mediawiki.MediawikiWriter;
import de.tudarmstadt.ukp.dkpro.core.api.ner.type.NamedEntity;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Iterator;
import java.nio.charset.StandardCharsets;

import javax.xml.transform.OutputKeys;

import org.apache.uima.util.XMLInputSource;
import org.apache.uima.util.XMLSerializer;

import static org.apache.uima.fit.factory.AnalysisEngineFactory.createEngineDescription;


public class Test {
@org.junit.Test
    public void WikiditionTest() throws IOException, UIMAException {

        String sTools = "LanguageToolLemmatizer,SpaCyMultiTagger,TagMeAPIAnnotator";
        File tFile = new File("tfile.txt");
        FileUtils.copyURLToFile(new URL("http://service.hucompute.org/urls_v2.xml"), tFile);

        TextImagerClient tic = new TextImagerClient();
        tic.setConfigFile(tFile.getAbsolutePath());

        String sText = new String(Files.readAllBytes(Paths.get("/home/x/Desktop/Verwandlung.txt")));

        JCas cas = JCasFactory.createText(sText, "de");

        DocumentMetaData dmd = DocumentMetaData.create(cas);
        dmd.setDocumentTitle("Verwaldlung");
        dmd.setDocumentId("Verwaldung-1");

        AnalysisEngineDescription aed = createEngineDescription(MediawikiWriter.class, XmiWriter.PARAM_TARGET_LOCATION,"/tmp/",XmiWriter.PARAM_OVERWRITE,true);

        Path outputXmi = Paths.get("abc.xmi");
        
        try {
             // Der TextImager wird angeworfen
            tic.process(cas.getCas(), sTools.split(","));

            // Serialize & save results from the pipeline
            /* try(OutputStream outputStream = Files.newOutputStream(outputXmi)) {
                XMLSerializer xmlSerializer = new XMLSerializer(outputStream, true);
                xmlSerializer.setOutputProperty(OutputKeys.VERSION, "1.0");
                xmlSerializer.setOutputProperty(OutputKeys.ENCODING, StandardCharsets.UTF_8.toString());
                XmiCasSerializer xmiCasSerializer = new XmiCasSerializer(null);
                xmiCasSerializer.serialize(cas.getCas(), xmlSerializer.getContentHandler());
            }  */

            // Read-in serialized CAS from File
            try(InputStream inputStream = Files.newInputStream(outputXmi)) {
                XmiCasDeserializer.deserialize(inputStream, cas.getCas());
            }
            HashSet<String> locs = extractLocations(cas);

            String res = buildMapsString(locs);
            System.out.println(res);
//            MediawikiWriter
            SimplePipeline.runPipeline(cas, aed);


        } catch (UIMAException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public static HashSet<String> extractLocations(JCas jCas){
        HashSet<String> loc = new HashSet<String>();
        
        for (NamedEntity ne : JCasUtil.select(jCas, NamedEntity.class)) {
            if (ne.getValue().equals("LOC")) {
                String text = ne.getCoveredText();
                loc.add(text);
            }
        }
return loc;
    }

    public static String buildMapsString(HashSet<String> locs){
        StringBuilder str = new StringBuilder();
        if(locs.isEmpty() == true){
            return null;
        }else{
            str.append("{{#display_map:");
            Iterator<String> it = locs.iterator();
            while(it.hasNext()) {
                str.append(it.next());
                str.append(";");
            }
            str.append("}}");
            return str.toString();
        }
}
}
