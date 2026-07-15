import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    
    // Helper to determine if a link should be styled as active
    const isActive = (path) => location.pathname === path;

    return (
        <footer className="w-full py-unit-lg bg-surface-container-lowest dark:bg-surface-container-low border-t border-outline-variant">
            <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-unit-lg max-w-container-max mx-auto gap-unit-md">
                <div className="flex flex-col items-center md:items-start gap-1">
                    <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">Quizzin</span>
                    <p className="text-on-surface-variant dark:text-on-surface-variant font-label-sm">© 2026 Quizzin. All rights reserved.</p>
                </div>
                <div className="flex gap-8 items-center">
                    <a 
                        className="text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors font-label-sm font-medium" 
                        href="/#features"
                    >
                        Features
                    </a>
                    <a 
                        className="text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors font-label-sm font-medium" 
                        href="/#about"
                    >
                        About
                    </a>
                    <Link 
                        to="/privacy-policy" 
                        className={`${isActive('/privacy-policy') ? 'text-primary' : 'text-on-surface-variant dark:text-on-surface-variant'} font-bold hover:text-primary transition-colors font-label-sm`}
                    >
                        Privacy Policy
                    </Link>
                </div>
                <div className="flex gap-4">
                    <a className="p-2 rounded-full hover:bg-primary/5 transition-colors" href="#">
                        <img className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwDALCMpdEij1MmSL_iZnSuP_o90l0mnfHnBzh1n8NYrYHPnvYqHDPDNT7ufmdn1Q2nsF7bIzeCpVtKWNAX6gYiFx8eoYguacpPJDJM9L5S0Wf_-goj3tbeH8LVsoOgVIFkA_PB9QGC-37qQUfU6_8x_Hjz7nKCuiO7i7xwlcyIXD4_GIqKWxT7AOk4X3tZfViwEVh_1VKovkWQos6-0QcjhWUSeGhuIyua3bHt-I_9J-iWvnuUqzHDUHx-ALSTSC-nmiaxvIQ700" alt="Twitter" />
                    </a>
                    <a className="p-2 rounded-full hover:bg-primary/5 transition-colors" href="#">
                        <img className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxqmVTsjUoJUKL10vJu5DpmWsXxa0ajww9iCZdVB31MPOezI2SmPo9ovemCIWCb1ob8JNzCFB-3I2Jlr-r9sy_F8M3vhzTYIPJSOjcfbxQFf8xC2Tsi_o3FaDevxu8Za21A3zFnsxyrkFNkPVHwcqwGBx7d4iuKnzo1FjQxM3WvqA_DRg3AuKKoqX0Y3f9L87BX4NcG6TwDQ6-2ZhiM25X4gTl31qt8Jrk4FYJ_rc5bA0L9Fh3N8WLU4nh5PuqlVfFk7qNus7FQwc" alt="Instagram" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
