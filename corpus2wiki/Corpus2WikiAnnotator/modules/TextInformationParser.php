<?php

/**
 * Corpus2WikiAnnotator Document Information
 *
 * @file
 * @ingroup Extensions
 */
class TextInformationParser {

    /**
     * Parser function handler for {{#textinfo: foo:bar,foox:barx}}
     *
     * @param Parser $parser
     * @param string $arg
     *
     * @return string: HTML to insert in the page.
     */
   public static function parseTextInfo( $parser, $value) {

        $args = array_slice( func_get_args(), 1 );
        $info = $args[0];

        //////////////////////////////////////////
        // BUILD WIKITEXT                       //
        //////////////////////////////////////////

        $info = htmlspecialchars(Sanitizer::removeHTMLtags($info));
        $info = addslashes($info);

		// create wiki cells
		$info = str_replace("&amp;", "&", $info);
		$info = str_replace(":", "</b>\n|", $info);
		$info = str_replace(";", "\n|-\n|<b>", $info);
		$info = str_replace("<b></b>", "", $info);
		// create wiki links from DDC entries
        $info = preg_replace("/^\|DDC(\d{3})( .+)$/im", "|[[:Category:DDC$1|$1$2]]", $info);

		// create a wiki table
		$wiki = "{| class=\"textinformation\"
			!colspan=\"2\"|Text Information
			|-
			|<b>" . $info . "
			|}";

        return array(
            $wiki,
            'noparse' => false,
            'isHTML' => false,
            "markerType" => 'nowiki'
        );
    }

}
