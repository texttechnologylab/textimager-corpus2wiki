<?php
/**
 * MediaWikiAnnotator Extension
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

$wgMediaWikiAnnotatorSubmitText = 'NEW';


//////////////////////////////////////////
// CREDITS                              //
//////////////////////////////////////////

$wgExtensionCredits['other'][] = array(
   'path'           => __FILE__,
   'name'           => 'MediaWikiAnnotator',
   'author'         => array( 'Alex Hunziker', 'Hasanagha Mammadov', 'Text Technology Lab, University of Frankfurt' ),
   'version'        => '0.1',
   'url'            => 'https://www.texttechnologylab.org',
   'descriptionmsg' => 'mediaWikiAnnotator-desc',
   'license-name'   => 'MIT'
);


//////////////////////////////////////////
// RESOURCE LOADER                      //
//////////////////////////////////////////

$wgResourceModules['ext.MediaWikiAnnotator'] = array(
   'scripts' => array(
      'lib/jquery.tooltipster.js',
      'lib/SimpleTooltip.js',
      'lib/posMarker.js',
   ),
   'styles' => array(
      'lib/tooltipster.css',
      'lib/SimpleTooltip.css',
   ),
   'dependencies' => array(
      // No dependencies
   ),
   'localBasePath' => __DIR__,
   'remoteExtPath' => 'MediaWikiAnnotator',
);


//////////////////////////////////////////
// LOAD FILES                           //
//////////////////////////////////////////

// Register i18n
$wgMessagesDirs['MediaWikiAnnotator'] = $dir . '/i18n';
$wgExtensionMessagesFiles['MediaWikiAnnotator'] = $dir . '/MediaWikiAnnotator.i18n.php';
$wgExtensionMessagesFiles['MediaWikiAnnotatorMagic'] = $dir . '/MediaWikiAnnotator.i18n.magic.php';

// Register files
$wgAutoloadClasses['MediaWikiAnnotatorParserFunction'] = $dir . '/modules/MediaWikiAnnotatorParserFunction.php';

// Register hooks
$wgHooks['BeforePageDisplay'][] = 'MediaWikiAnnotatorOnBeforePageDisplay';
$wgHooks['ParserFirstCallInit'][] = 'MediaWikiAnnotatorOnParserFirstCallInit';



//////////////////////////////////////////
// HOOK CALLBACKS                       //
//////////////////////////////////////////

/**
* Add libraries to resource loader
*/
function MediaWikiAnnotatorOnBeforePageDisplay( OutputPage &$out, Skin &$skin ) {

  // Add as ResourceLoader Module
  $out->addModules('ext.MediaWikiAnnotator');

  return true;
}

/**
* Register parser hooks
*
* See also http://www.mediawiki.org/wiki/Manual:Parser_functions
*/
function MediaWikiAnnotatorOnParserFirstCallInit( &$parser ) {

  // Register parser functions
  $parser->setFunctionHook('morph', 'MediaWikiAnnotatorParserFunction::mediaWikiAnnotator');
  $parser->setFunctionHook('tip-text', 'MediaWikiAnnotatorParserFunction::mediaWikiAnnotator');

  return true;
}
