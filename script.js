document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(9, 9, 11, 0.85)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
            navbar.style.backdropFilter = 'blur(16px)';
        } else {
            navbar.style.background = 'rgba(9, 9, 11, 0.7)';
            navbar.style.boxShadow = 'none';
            navbar.style.backdropFilter = 'blur(12px)';
        }
    });

    // Pricing Toggle
    const pricingToggle = document.querySelector('.pricing-toggle');
    const toggleSwitch = document.querySelector('.toggle-switch');
    const prices = document.querySelectorAll('.amount');
    
    // Monthly prices vs Annual prices (monthly equivalent)
    const monthlyPrices = ['0', '12', '29'];
    const annualPrices = ['0', '9', '23']; // ~20% discount
    
    let isAnnual = false;
    
    if (toggleSwitch) {
        toggleSwitch.addEventListener('click', () => {
            isAnnual = !isAnnual;
            
            // Animation for switch
            if (isAnnual) {
                pricingToggle.classList.add('annual');
                pricingToggle.children[0].classList.remove('active');
                pricingToggle.children[2].classList.add('active');
            } else {
                pricingToggle.classList.remove('annual');
                pricingToggle.children[0].classList.add('active');
                pricingToggle.children[2].classList.remove('active');
            }
            
            // Update prices with slight fade effect
            prices.forEach((priceEl, index) => {
                priceEl.style.opacity = 0;
                
                setTimeout(() => {
                    priceEl.textContent = isAnnual ? annualPrices[index] : monthlyPrices[index];
                    priceEl.style.opacity = 1;
                }, 200);
            });
            
            // Allow CSS transition to handle opacity
            prices.forEach(p => {
                p.style.transition = 'opacity 0.2s ease';
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open (implementation for future expansion)
                // if (mobileMenu.classList.contains('active')) ...
                
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Bento Hover Parallax (Subtle)
    const bentoItems = document.querySelectorAll('.bento-item');
    bentoItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            item.style.transform = `translateY(-5px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });

    // Simple Form Submission Prevent Default
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Added to Waitlist! <i data-lucide="check"></i>';
            btn.style.background = '#10b981'; // success green
            // Re-render icon
            lucide.createIcons();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                e.target.reset();
                lucide.createIcons();
            }, 3000);
        });
    }
});

