<?php

/**
 * Corpus2WikiAnnotator Parser Functions
 *
 * @file
 * @ingroup Extensions
 */
class TooltipParser {

	/**
	 * generates the tooltip <span> object, including the table with annotations
	 *
	 * @param string $value
	 * @param string $info
	 * @param string $title
	 * @param string $hilite_categories
	 *
	 * @return string: HTML to insert in the page.
	 */
	 public static function parseTooltip( $value, $info, $title, $hilite_categories ) {

		# convert title to unicode
		$title = html_entity_decode($title);
		$title = preg_replace_callback(
			"/(&#[0-9]+;)/",
			function($m) {
				return mb_convert_encoding($m[1], "UTF-8", "HTML-ENTITIES");
			}, $title);

		# extract POS
		$pos = null;
		preg_match("/pos:[A-Z]*/", $info, $pos);
		if (count($pos) > 0) {
			$pos = str_replace("pos:", "", $pos[0]);
		 } else {
			$pos = null;
		}

		# TODO text and sentence level in tooltip
		$tooltip_content = '[
			{"name": "Word Level: Lemma_' . $title . '_' . $pos . '", "content": "./Tooltip:Lemma_' . $title . '_' . $pos . '?action=render"}
		]';

		$html = "";
		if ($pos != null) {
			$html = '<span class="tooltip ' . $hilite_categories . '" title=\'' . $tooltip_content . '\'>' . html_entity_decode($value) . '</span>';
		} else {
			$html = '<span class="' . $hilite_categories . '">' . html_entity_decode($value) . '</span>';
		}
		#$html .= '<pre>' . html_entity_decode($title) . '</pre>';

		return $html;
	 }
}
