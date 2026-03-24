<?php
/**
 * Nexus AI Theme Functions
 */

if ( ! function_exists( 'nexus_ai_setup' ) ) :
    function nexus_ai_setup() {
        // Add default posts and comments RSS feed links to head.
        add_theme_support( 'automatic-feed-links' );

        // Let WordPress manage the document title.
        add_theme_support( 'title-tag' );

        // Enable support for Post Thumbnails on posts and pages.
        add_theme_support( 'post-thumbnails' );

        // Switch default core markup for search form, comment form, and comments
        // to output valid HTML5.
        add_theme_support( 'html5', array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
        ) );

        // This theme uses wp_nav_menu() in one location.
        register_nav_menus( array(
            'menu-1' => esc_html__( 'Primary', 'nexus-ai' ),
        ) );
    }
endif;
add_action( 'after_setup_theme', 'nexus_ai_setup' );

/**
 * Enqueue scripts and styles.
 */
function nexus_ai_scripts() {
    // Main Style
    wp_enqueue_style( 'nexus-ai-style', get_stylesheet_uri(), array(), '1.0.0' );
    wp_enqueue_style( 'nexus-ai-main-css', get_template_directory_uri() . '/assets/css/main.css', array(), '1.0.0' );

    // Enqueue Google Fonts
    wp_enqueue_style( 'nexus-ai-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap', array(), null );

    // Enqueue Lucide Icons
    wp_enqueue_script( 'lucide-icons', 'https://unpkg.com/lucide@latest', array(), null, false );

    // Theme JS
    wp_enqueue_script( 'nexus-ai-main-js', get_template_directory_uri() . '/assets/js/main.js', array('lucide-icons'), '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'nexus_ai_scripts' );

/**
 * Helper to get active menu item
 */
function nexus_nav_menu_items() {
    // This is where you'd typically handle dynamic nav menus or custom links.
    // For this landing page, we'll keep hardcoded IDs as requested.
}
?>
