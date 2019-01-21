<?php
/**
 * MorphMarker Extension
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

$wgMorphMarkerSubmitText = 'NEW';


//////////////////////////////////////////
// CREDITS                              //
//////////////////////////////////////////

$wgExtensionCredits['other'][] = array(
   'path'           => __FILE__,
   'name'           => 'MorphMarker',
   'author'         => array( 'Alex Hunziker', 'Hasanagha Mammadov', 'Text Technology Lab, University of Frankfurt' ),
   'version'        => '0.1',
   'url'            => 'https://www.texttechnologylab.org',
   'descriptionmsg' => 'morphmarker-desc',
   'license-name'   => 'MIT'
);


//////////////////////////////////////////
// RESOURCE LOADER                      //
//////////////////////////////////////////

$wgResourceModules['ext.MorphMarker'] = array(
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
   'remoteExtPath' => 'MorphMarker',
);


//////////////////////////////////////////
// LOAD FILES                           //
//////////////////////////////////////////

// Register i18n
$wgMessagesDirs['MorphMarker'] = $dir . '/i18n';
$wgExtensionMessagesFiles['MorphMarker'] = $dir . '/MorphMarker.i18n.php';
$wgExtensionMessagesFiles['MorphMarkerMagic'] = $dir . '/MorphMarker.i18n.magic.php';

// Register files
$wgAutoloadClasses['MorphMarkerParserFunction'] = $dir . '/modules/MorphMarkerParserFunction.php';

// Register hooks
$wgHooks['BeforePageDisplay'][] = 'MorphMarkerOnBeforePageDisplay';
$wgHooks['ParserFirstCallInit'][] = 'MorphMarkerOnParserFirstCallInit';



//////////////////////////////////////////
// HOOK CALLBACKS                       //
//////////////////////////////////////////

/**
* Add libraries to resource loader
*/
function MorphMarkerOnBeforePageDisplay( OutputPage &$out, Skin &$skin ) {

  // Add as ResourceLoader Module
  $out->addModules('ext.MorphMarker');

  return true;
}

/**
* Register parser hooks
*
* See also http://www.mediawiki.org/wiki/Manual:Parser_functions
*/
function MorphMarkerOnParserFirstCallInit( &$parser ) {

  // Register parser functions
  $parser->setFunctionHook('morph', 'MorphMarkerParserFunction::morphmarker');
  $parser->setFunctionHook('tip-text', 'MorphMarkerParserFunction::morphmarker');

  return true;
}
