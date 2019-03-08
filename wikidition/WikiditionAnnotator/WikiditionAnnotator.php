<?php
/**
 * WikiditionAnnotator Extension
 * Provides basic tooltips, and highlighting of word groups.
 *
 *
 * @file
 * @ingroup Extensions
 * @package MediaWiki
 *
 * @links https://github.com/texttechnologylab/textimager-wikidition Source code
 *
 * Based on work of Simon Heimler (Fannon), 2015 (SimpleTooltip)
 * @author Alex Hunziker and Hasanagha Mammadov, 2018
 * @license http://opensource.org/licenses/mit-license.php The MIT License (MIT)
 */

//////////////////////////////////////////
// VARIABLES                            //
//////////////////////////////////////////

$dir         = dirname( __FILE__ );
$dirbasename = basename( $dir );


//////////////////////////////////////////
// CONFIGURATION                        //
//////////////////////////////////////////

$wgWikiditionAnnotatorSubmitText = 'NEW';


//////////////////////////////////////////
// CREDITS                              //
//////////////////////////////////////////

$wgExtensionCredits['other'][] = array(
   'path'           => __FILE__,
   'name'           => 'WikiditionAnnotator',
   'author'         => array( 'Alex Hunziker', 'Hasanagha Mammadov', 'Text Technology Lab, University of Frankfurt' ),
   'version'        => '0.1',
   'url'            => 'https://www.texttechnologylab.org',
   'descriptionmsg' => 'wikiditionAnnotator-desc',
   'license-name'   => 'MIT'
);


//////////////////////////////////////////
// RESOURCE LOADER                      //
//////////////////////////////////////////

$wgResourceModules['ext.WikiditionAnnotator'] = array(
   'scripts' => array(
      'lib/jquery.tooltipster.js',
      'lib/SimpleTooltip.js',
      'lib/posMarker.js',
   ),
   'styles' => array(
      'lib/tooltipster.css',
      'lib/SimpleTooltip.css',
      'lib/infobox.css'
   ),
   'dependencies' => array(
      // No dependencies
   ),
   'localBasePath' => __DIR__,
   'remoteExtPath' => 'WikiditionAnnotator',
);


//////////////////////////////////////////
// LOAD FILES                           //
//////////////////////////////////////////

// Register i18n
$wgMessagesDirs['WikiditionAnnotator'] = $dir . '/i18n';
$wgExtensionMessagesFiles['WikiditionAnnotator'] = $dir . '/WikiditionAnnotator.i18n.php';
$wgExtensionMessagesFiles['WikiditionAnnotatorMagic'] = $dir . '/WikiditionAnnotator.i18n.magic.php';

// Register files
$wgAutoloadClasses['WikiditionAnnotatorParserFunction'] = $dir . '/modules/WikiditionAnnotatorParserFunction.php';
$wgAutoloadClasses['TextInformationParser'] = $dir . '/modules/TextInformationParser.php';
$wgAutoloadClasses['ParagraphInformationParser'] = $dir . '/modules/ParagraphInformationParser.php';
$wgAutoloadClasses['SentenceInformationParser'] = $dir . '/modules/SentenceInformationParser.php';
$wgAutoloadClasses['WordInformationParser'] = $dir . '/modules/WordInformationParser.php';
$wgAutoloadClasses['TooltipParser'] = $dir . '/modules/TooltipParser.php';

// Register hooks
$wgHooks['BeforePageDisplay'][] = 'WikiditionAnnotatorOnBeforePageDisplay';
$wgHooks['ParserFirstCallInit'][] = 'WikiditionAnnotatorOnParserFirstCallInit';



//////////////////////////////////////////
// HOOK CALLBACKS                       //
//////////////////////////////////////////

/**
* Add libraries to resource loader
*/
function WikiditionAnnotatorOnBeforePageDisplay( OutputPage &$out, Skin &$skin ) {

  // Add as ResourceLoader Module
  $out->addModules('ext.WikiditionAnnotator');

  return true;
}

/**
* Register parser hooks
*
* See also http://www.mediawiki.org/wiki/Manual:Parser_functions
*/
function WikiditionAnnotatorOnParserFirstCallInit( &$parser ) {

  // Register parser functions
  $parser->setFunctionHook('textinfo', 'TextInformationParser::parseTextInfo');
  $parser->setFunctionHook('paragraph', 'ParagraphInformationParser::parseParagraphInfo');
  $parser->setFunctionHook('sentence', 'SentenceInformationParser::parseSentenceInfo');
  $parser->setFunctionHook('word', 'WordInformationParser::parseWordInfo');

  return true;
}
