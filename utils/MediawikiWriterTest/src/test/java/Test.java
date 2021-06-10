
import de.tudarmstadt.ukp.dkpro.core.api.metadata.type.DocumentMetaData;
import org.apache.uima.UIMAException;
import org.apache.uima.analysis_engine.AnalysisEngineDescription;
import org.apache.uima.fit.factory.JCasFactory;
import org.apache.uima.fit.pipeline.SimplePipeline;
import org.apache.uima.jcas.JCas;
import org.dkpro.core.io.xmi.XmiWriter;
import org.hucompute.textimager.client.TextImagerClient;
import org.hucompute.textimager.uima.io.mediawiki.MediawikiWriter;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;

import static org.apache.uima.fit.factory.AnalysisEngineFactory.createEngineDescription;
import org.apache.commons.io.FileUtils;
public class Test {
@org.junit.Test
    public void WikiditionTest() throws IOException, UIMAException {

        String sTools = "LanguageToolSegmenter,LanguageToolLemmatizer,CoreNlpPosTagger,CoreNlpNamedEntityRecognizer,FastTextDDCMulLemmaNoPunctPOSNoFunctionwordsWithCategoriesTextImagerService,TagMeAPIAnnotator";
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

        try {
            // Der TextImager wird angeworfen
            tic.process(cas.getCas(), sTools.split(","));


//            MediawikiWriter
            SimplePipeline.runPipeline(cas, aed);


        } catch (UIMAException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
