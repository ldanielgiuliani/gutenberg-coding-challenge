<?php
/**
 * Plugin Name:       Country Card Block
 * Description:       Block rendering a card with country information.
 * Requires at least: 5.8
 * Requires PHP:      5.6
 * Version:           1.0.0
 * Author:            XWP
 * Author URI:        https://github.com/xwp
 * Text Domain:       xwp-country-card
 *
 * @package           CountryCard
 */

namespace XWP\CountryCard;

/**
 * Register the block.
 */
function block_init() {
	register_block_type( __DIR__ . '/build' );
}

add_action( 'init', __NAMESPACE__ . '\\block_init' );

/**
 * Remove emoji CDN hostname from DNS prefetching hints.
 *
 * @param array  $urls          URLs to print for resource hints.
 * @param string $relation_type The relation type the URLs are printed for.
 *
 * @return array Difference between the two arrays.
 */
function remove_emoji_dns_prefetch( $urls, $relation_type ) {
	if ( 'dns-prefetch' === $relation_type ) {
		/** This filter is documented in wp-includes/formatting.php */
		$emoji_svg_url = apply_filters( 'emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/' );

		$urls = array_diff( $urls, [ $emoji_svg_url ] );
	}

	return $urls;
}

/**
 * Set custom length for excerpt
 *
 * @return int maximum number of words
 */
function custom_excerpt_length() {
	return 5;
}

add_filter( 'excerpt_length', __NAMESPACE__ . '\\custom_excerpt_length', 10 );

/**
 * Enable admin WP emoji support
 */
add_action( 'admin_print_scripts', 'print_emoji_detection_script', 99 );
