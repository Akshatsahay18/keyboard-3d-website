    <!-- Footer -->
    <footer>
        <div class="container footer-container">
            <div class="footer-brand">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo">
                    <i data-lucide="keyboard" class="logo-icon"></i>
                    <span>Nexus</span>
                </a>
                <p>The intelligent keyboard that adapts to you, everywhere you work.</p>
                <div class="social-links">
                    <a href="#"><i data-lucide="twitter"></i></a>
                    <a href="#"><i data-lucide="github"></i></a>
                    <a href="#"><i data-lucide="linkedin"></i></a>
                </div>
            </div>
            
            <div class="footer-links">
                <div class="link-group">
                    <h4>Product</h4>
                    <a href="#">Download</a>
                    <a href="#">Features</a>
                    <a href="#">Integrations</a>
                    <a href="#">Pricing</a>
                    <a href="#">Changelog</a>
                </div>
                <div class="link-group">
                    <h4>Resources</h4>
                    <a href="#">Documentation</a>
                    <a href="#">Blog</a>
                    <a href="#">Community</a>
                    <a href="#">Help Center</a>
                </div>
                <div class="link-group">
                    <h4>Legal</h4>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Security</a>
                </div>
            </div>
        </div>
        <div class="container footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> Nexus AI Inc. All rights reserved.</p>
        </div>
    </footer>

    <?php wp_footer(); ?>
    
    <!-- Initialize Icons -->
    <script>
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    </script>
</body>
</html>
