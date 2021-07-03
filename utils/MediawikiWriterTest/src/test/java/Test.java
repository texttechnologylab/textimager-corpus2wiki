import de.tudarmstadt.ukp.dkpro.core.api.metadata.type.DocumentMetaData;
import de.tudarmstadt.ukp.dkpro.core.matetools.MateMorphTagger;
import org.apache.commons.io.FileUtils;
import org.apache.uima.UIMAException;
import org.apache.uima.analysis_engine.AnalysisEngine;
import org.apache.uima.analysis_engine.AnalysisEngineDescription;
import org.apache.uima.cas.impl.XmiCasDeserializer;
import org.apache.uima.fit.factory.AggregateBuilder;
import org.apache.uima.fit.factory.JCasFactory;
import org.apache.uima.fit.util.LifeCycleUtil;
import org.apache.uima.jcas.JCas;
import org.dkpro.core.io.xmi.XmiWriter;
import org.hucompute.textimager.client.TextImagerClient;
import org.hucompute.textimager.uima.io.mediawiki.MediawikiWriter;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.apache.uima.fit.factory.AnalysisEngineFactory.createEngineDescription;
import static org.hucompute.textimager.uima.io.mediawiki.MediawikiWriter.PARAM_TARGET_LOCATION;

class TTLabSimplePipeline {

    public static void runPipeline(final JCas jCas, final AnalysisEngine... engines) throws UIMAException, IOException {

        for (AnalysisEngine engine : engines) {
            engine.process(jCas);
            LifeCycleUtil.destroy(engine);

        }
    }

}

public class Test {
@org.junit.Test
    public void WikiditionTest() throws IOException, UIMAException {

        String sTools = "LanguageToolSegmenter,LanguageToolLemmatizer,CoreNlpPosTagger,FastTextDDCMulLemmaNoPunctPOSNoFunctionwordsWithCategoriesTextImagerService,TagMeLocalAnnotator";
        File tFile = new File("tfile.txt");
        FileUtils.copyURLToFile(new URL("http://service.hucompute.org/urls_v2.xml"), tFile);

        TextImagerClient tic = new TextImagerClient();
        tic.setConfigFile(tFile.getAbsolutePath());

        String sText = new String(Files.readAllBytes(Paths.get("/home/x/Desktop/Verwandlung.txt")));

        JCas cas = JCasFactory.createText(sText, "de");

        DocumentMetaData dmd = DocumentMetaData.create(cas);
        dmd.setDocumentTitle("Die Verwandlung");
        dmd.setDocumentId("Verwaldung-12345");

        AnalysisEngineDescription aed = createEngineDescription(MediawikiWriter.class,PARAM_TARGET_LOCATION,true);

        Path outputXmi = Paths.get("abc.xmi");

        try {
             
            //Run Textimager-Client with given services (sTools)
            //tic.process(cas.getCas(), sTools.split(","));

           // Serialize & save results from the pipeline
           /*try(OutputStream outputStream = Files.newOutputStream(outputXmi)) {
                XMLSerializer xmlSerializer = new XMLSerializer(outputStream, true);
                xmlSerializer.setOutputProperty(OutputKeys.VERSION, "1.0");
                xmlSerializer.setOutputProperty(OutputKeys.ENCODING, StandardCharsets.UTF_8.toString());
                XmiCasSerializer xmiCasSerializer = new XmiCasSerializer(null);
                xmiCasSerializer.serialize(cas.getCas(), xmlSerializer.getContentHandler());
            }*/

            // Read-in serialized CAS from File
            try(InputStream inputStream = Files.newInputStream(outputXmi)) {
                XmiCasDeserializer.deserialize(inputStream, cas.getCas());
            }

            /* List<MorphologicalFeatures> mList = new ArrayList<>(0);

            //Get all morphological features
            JCasUtil.select(cas, MorphologicalFeatures.class).forEach(mf->{
                mList.add(mf);
            });
    
            //Remove all morphological feature annotations in CAS
            mList.forEach(ml->{
                ml.removeFromIndexes();
            }); */
    
            AggregateBuilder builder = new AggregateBuilder();
    
            AnalysisEngineDescription writer = createEngineDescription(MediawikiWriter.class, XmiWriter.PARAM_TARGET_LOCATION,"/tmp/",XmiWriter.PARAM_OVERWRITE,true);
            builder.add(createEngineDescription(MateMorphTagger.class));
            builder.add(writer);
    
            //SimplePipeline.runPipeline(cas, builder.createAggregate());
            TTLabSimplePipeline.runPipeline(cas, builder.createAggregate());


        } catch (UIMAException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();

    }
}
}