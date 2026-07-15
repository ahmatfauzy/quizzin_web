import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 w-full z-50 shadow-[0px_10px_30px_rgba(29,93,218,0.08)] text-body-md" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex justify-between items-center px-margin-mobile md:px-unit-lg py-4 max-w-container-max mx-auto">
                <div className="flex items-center gap-2">
                    <Link to="/" className="font-headline-md text-headline-md font-bold text-primary">Quizzin</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="hidden sm:inline-flex bg-primary text-on-primary px-8 py-3 rounded-full font-label-sm hover:scale-[1.05] transition-transform shadow-lg shadow-primary/20">
                        Login
                    </Link>
                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors">
                        <span className="material-symbols-outlined text-on-surface">{menuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>
            {menuOpen && (
                <div className="md:hidden border-t border-outline-variant/50 px-margin-mobile py-4" style={{ backgroundColor: '#ffffff' }}>
                    <Link to="/login" className="block text-center bg-primary text-on-primary px-6 py-3 rounded-full font-label-sm" onClick={() => setMenuOpen(false)}>Login</Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
