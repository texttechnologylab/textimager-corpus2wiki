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
			{"name": "Word Level", "content": "./Tooltip:Lemma_' . html_entity_decode($title) . '_' . $pos . '?action=render"}
		]';

		$html = "";
		if ($pos != null) {
			$html = '<span class="tooltip" title=\'' . $tooltip_content . '\'>' . $value . '</span>';
		} else {
			$html = $value;
		}

		return $html;
	 }
}
