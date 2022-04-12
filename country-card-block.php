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
