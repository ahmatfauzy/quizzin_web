import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
    useEffect(() => {
        document.title = "QUIZZIN";
        const html = document.documentElement;
        const wasDark = html.classList.contains('dark');
        html.classList.remove('dark');
        html.style.setProperty('--color-background', '247 249 251');
        html.style.setProperty('--color-surface', '247 249 251');
        html.style.setProperty('--color-on-surface', '25 28 30');

        window.scrollTo(0, 0);
        
        const sections = document.querySelectorAll('.group, .relative.p-8');
        const observerOptions = { threshold: 0.1 };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'all 0.6s ease-out';
            observer.observe(section);
        });

        return () => {
            sections.forEach(section => observer.unobserve(section));
            observer.disconnect();
            if (wasDark) html.classList.add('dark');
            html.style.removeProperty('--color-background');
            html.style.removeProperty('--color-surface');
            html.style.removeProperty('--color-on-surface');
        };
    }, []);

    return (
        <div className="font-body-md text-body-md selection:bg-primary-container selection:text-on-primary-container min-h-screen bg-white">
            <Navbar />

            <main className="relative">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-40 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
                </div>

                <section className="max-w-[800px] mx-auto px-margin-mobile md:px-unit-lg py-16 md:py-24">
                    {/* Header Title */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary font-label-sm mb-6">
                            <span className="material-symbols-outlined text-[18px]">verified_user</span>
                            Keamanan & Privasi
                        </div>
                        <h1 className="font-headline-lg text-headline-lg md:text-display-lg text-on-surface mb-6">Kebijakan Privasi</h1>
                        <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto">
                            Terakhir diperbarui: 24 Mei 2024. Privasi Anda adalah prioritas kami. Halaman ini menjelaskan bagaimana Quizzin mengelola informasi Anda.
                        </p>
                    </div>

                    {/* Policy Content Grid */}
                    <div className="space-y-12">
                        {/* Section 1: Informasi yang Kami Kumpulkan */}
                        <div className="group">
                            <div className="flex gap-4 items-start mb-4">
                                <div className="p-3 rounded-xl bg-white shadow-sm text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                    <span className="material-symbols-outlined">database</span>
                                </div>
                                <div>
                                    <h2 className="font-headline-md text-headline-md text-on-surface">1. Informasi yang Kami Kumpulkan</h2>
                                    <p className="mt-4 text-on-surface-variant leading-relaxed">
                                        Kami mengumpulkan informasi untuk memberikan pengalaman belajar yang lebih baik bagi setiap pengguna. Jenis informasi yang kami kumpulkan meliputi:
                                    </p>
                                </div>
                            </div>
                            <div className="ml-16 grid md:grid-cols-2 gap-4 mt-6">
                                <div className="p-6 rounded-xl bg-white border border-outline-variant shadow-sm hover:border-primary/30 transition-colors">
                                    <h3 className="font-bold mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                                        Data Profil
                                    </h3>
                                    <p className="text-sm text-on-surface-variant">Nama, alamat email, dan foto profil saat Anda mendaftar akun Quizzin.</p>
                                </div>
                                <div className="p-6 rounded-xl bg-white border border-outline-variant shadow-sm hover:border-primary/30 transition-colors">
                                    <h3 className="font-bold mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[20px]">insights</span>
                                        Aktivitas Belajar
                                    </h3>
                                    <p className="text-sm text-on-surface-variant">Skor kuis, frekuensi belajar, dan jenis materi yang paling sering Anda akses.</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Penggunaan Data */}
                        <div className="group">
                            <div className="flex gap-4 items-start mb-4">
                                <div className="p-3 rounded-xl bg-white shadow-sm text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                    <span className="material-symbols-outlined">settings_suggest</span>
                                </div>
                                <div>
                                    <h2 className="font-headline-md text-headline-md text-on-surface">2. Penggunaan Data</h2>
                                    <p className="mt-4 text-on-surface-variant leading-relaxed">
                                        Data yang kami kumpulkan digunakan secara eksklusif untuk tujuan pengembangan fungsionalitas aplikasi dan personalisasi konten pendidikan:
                                    </p>
                                    <ul className="mt-4 space-y-3">
                                        <li className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                                            <span>Mengelola akun pengguna dan memberikan dukungan teknis.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                                            <span>Menyediakan rekomendasi kuis berdasarkan tingkat kemampuan pengguna.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                                            <span>Menganalisis tren penggunaan untuk fitur baru di masa depan.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Keamanan Data */}
                        <div className="relative p-8 rounded-3xl overflow-hidden bg-primary text-on-primary shadow-xl">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>encrypted</span>
                            </div>
                            <div className="relative z-10">
                                <h2 className="font-headline-md text-headline-md mb-4 flex items-center gap-3">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                                    3. Keamanan Data
                                </h2>
                                <p className="opacity-90 leading-relaxed mb-6">
                                    Kami berkomitmen untuk melindungi data pribadi Anda dengan standar keamanan industri. Seluruh transmisi data dilakukan melalui protokol terenkripsi (SSL) dan disimpan pada server dengan akses terbatas yang dipantau secara berkala.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm">
                                        <span className="material-symbols-outlined text-[18px]">lock</span>
                                        <span className="text-sm font-label-sm">AES-256 Encryption</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm">
                                        <span className="material-symbols-outlined text-[18px]">privacy_tip</span>
                                        <span className="text-sm font-label-sm">No Third Party Sales</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Back to Landing CTA */}
                    <div className="mt-24 text-center">
                        <Link to="/" className="inline-flex items-center gap-3 text-primary font-bold hover:gap-5 transition-all">
                            <span className="material-symbols-outlined">arrow_back</span>
                            Kembali ke Beranda
                        </Link>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-container-max mx-auto px-margin-mobile md:px-unit-lg mb-24">
                    <div className="p-12 rounded-[40px] bg-surface-container-high relative overflow-hidden text-center">
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                            {/* Pattern Placeholder */}
                        </div>
                        <h3 className="font-headline-lg text-headline-lg mb-4 relative z-10">Siap untuk belajar lebih pintar?</h3>
                        <p className="text-on-surface-variant mb-8 relative z-10">Tingkatkan pengalaman belajarmu bersama Quizzin hari ini.</p>
                        <div className="max-w-md mx-auto relative z-10 flex justify-center">
                            <Link to="/" className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors">
                                Mulai Sekarang
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
