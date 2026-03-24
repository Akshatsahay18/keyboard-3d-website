<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <!-- Background Effects -->
    <div class="glow-bg"></div>
    <div class="noise-overlay"></div>

    <!-- Navbar -->
    <nav class="navbar">
        <div class="container nav-container">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo">
                <i data-lucide="keyboard" class="logo-icon"></i>
                <span>Nexus</span>
            </a>
            <div class="nav-links">
                <a href="#features">Features</a>
                <a href="#testimonials">Testimonials</a>
                <a href="#pricing">Pricing</a>
            </div>
            <div class="nav-actions">
                <a href="#" class="btn btn-ghost">Log in</a>
                <a href="#signup" class="btn btn-primary">Get Started</a>
            </div>
            <button class="mobile-menu-btn" id="mobile-menu-btn">
                <i data-lucide="menu"></i>
            </button>
        </div>
    </nav>
