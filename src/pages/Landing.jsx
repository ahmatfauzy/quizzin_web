import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Landing = () => {

    useEffect(() => {
        document.title = "QUIZZIN";
        const html = document.documentElement;
        const wasDark = html.classList.contains('dark');
        html.classList.remove('dark');
        html.style.setProperty('--color-background', '247 249 251');
        html.style.setProperty('--color-surface', '247 249 251');
        html.style.setProperty('--color-on-surface', '25 28 30');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, { threshold: 0.1 });

        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
            observer.observe(section);
        });

        const hero = document.querySelector('section');
        if (hero) {
            hero.classList.remove('opacity-0', 'translate-y-10');
            hero.classList.add('opacity-100', 'translate-y-0');
        }

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
        <div className="bg-white text-on-surface font-body-md selection:bg-primary/20 selection:text-primary min-h-screen">
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="relative pt-4 pb-12 md:pt-12 md:pb-20 bg-gradient-to-br from-white to-[#dde3ff]">
                    <div className="max-w-container-max mx-auto px-margin-mobile md:px-unit-lg">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
                            {/* Text Content */}
                            <div className="md:col-span-6 lg:col-span-7 z-10">
                                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 animate-pulse">
                                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                                    <span className="text-label-sm font-label-sm">COMMING SOON</span>
                                </div>
                                <h1 className="font-display-lg text-display-lg text-on-background mb-6 leading-tight">
                                    Quizzin: Rekan Belajar Cerdas Anda
                                </h1>
                                <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 max-w-xl">
                                    Tingkatkan pengetahuanmu dengan kuis interaktif yang seru. Pantau kemajuan belajarmu dengan sistem XP dan tantangan harian yang menantang.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="relative group">
                                        <button className="bg-surface-variant/50 text-outline px-8 py-4 rounded-full flex items-center gap-3 border border-outline-variant cursor-not-allowed grayscale opacity-70">
                                            <span className="material-symbols-outlined">shop</span>
                                            <div className="text-left">
                                                <p className="text-[10px] leading-none uppercase tracking-wider font-bold">Download di</p>
                                                <p className="font-bold text-headline-md">Play Store</p>
                                            </div>
                                        </button>
                                        <span className="absolute -top-3 -right-2 bg-tertiary text-on-tertiary text-[10px] px-2 py-1 rounded-full font-bold shadow-lg">Segera Hadir</span>
                                    </div>

                                </div>
                            </div>

                            {/* App Mockup */}
                            <div className="md:col-span-6 lg:col-span-5 relative mt-8 md:mt-0">
                                <div className="animate-float relative z-20">
                                    <div className="bg-on-surface h-[450px] w-[225px] md:h-[550px] md:w-[275px] mx-auto rounded-[3rem] border-[8px] border-on-surface overflow-hidden shadow-[0px_30px_60px_rgba(0,69,178,0.15)] relative">
                                        <img loading="lazy" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMzCJrAY8fDr0GLRFhvgfFnaZsDL7S8JJJLi5DNhgzNHZcA8NVCvClwVAcOY9HvZxwZ3NKaqkkahaMziT6j5USen-mmKzRg_XDDxJq-nfF5PzBjjAZCS7B5GbRS6cWuTYwCmMN3S0o1gG90smhj6sr7QZ7MUp-iBZdK6SrqnDjGzbgQ9jnONk4j5VMf-V3iDgHUuDjOytwLqYwYzYIBtr8fMLa0N-6ksZRkegNghu_lBJxv3Qfm5tj7IVkbQx1PGmh7sp-xWdddMs" alt="App Mockup" />
                                        {/* Status Bar Simulation */}
                                        <div className="absolute top-0 left-0 w-full h-8 flex justify-between items-center px-6">
                                            <span className="text-[12px] font-bold text-white">9:41</span>
                                            <div className="flex gap-1 items-center text-white">
                                                <span className="material-symbols-outlined text-[14px]">signal_cellular_4_bar</span>
                                                <span className="material-symbols-outlined text-[14px]">wifi</span>
                                                <span className="material-symbols-outlined text-[14px]">battery_full</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative Elements */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-primary/10 rounded-full blur-3xl -z-10"></div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Bento Grid */}
                <section className="py-section-padding bg-surface-container-lowest" id="features">
                    <div className="max-w-container-max mx-auto px-margin-mobile md:px-unit-lg">
                        <div className="text-center mb-20">
                            <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Fitur Unggulan</h2>
                            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
                                Dirancang untuk memaksimalkan potensi belajarmu dengan cara yang paling menyenangkan.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
                            {/* Feature 1: Streak */}
                            <div className="md:col-span-8 bg-primary rounded-3xl p-10 flex flex-col justify-between overflow-hidden relative group">
                                <div className="z-10">
                                    <span className="material-symbols-outlined text-[48px] text-on-primary mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                                    <h3 className="font-headline-md text-headline-md text-on-primary mb-4">Streak Belajar</h3>
                                    <p className="text-on-primary/80 max-w-sm">
                                        Jaga momentum belajarmu setiap hari. Bangun streak dan dapatkan bonus multiplier untuk setiap kuis yang kamu selesaikan.
                                    </p>
                                </div>
                                <div className="absolute bottom-0 right-0 w-2/3 h-2/3 opacity-20 group-hover:scale-110 transition-transform duration-700">
                                    <div className="bg-cover bg-center w-full h-full" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCXtNxv4iwF2nRCEPobf0eVcC8IhiLm7mDNUDL3IgQpBoyAjEIhnDe2CImOjfV261YKRQjZcuS9hQ1iwiUpCNMUfdc-6yXtQaHbO2EkXFGdC3V3KsXen6LydDPW6k99cjhfBywMhzd4gp9DdyVtFd6i8ynZxjMoY8DO6712EPo9VFvQIeSNbjlC7jXJQKn01xxcYCpO4kp9CkL_cATAI5Q_9GRhgVc9B6AF9FN-XU-K0Z-JsN7r4JMbGMOF3FUVe7-0RF83AgIJSMw')" }}></div>
                                </div>
                            </div>
                            
                            {/* Feature 2: XP System */}
                            <div className="md:col-span-4 bg-secondary-container rounded-3xl p-10 flex flex-col hover:shadow-2xl transition-all duration-500 group">
                                <div className="mb-10">
                                    <span className="material-symbols-outlined text-[48px] text-on-secondary-container mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                                    <h3 className="font-headline-md text-headline-md text-on-secondary-container mb-4">Sistem XP & Level</h3>
                                    <p className="text-on-secondary-container/80">
                                        Jadilah 'Pelajar Tingkat Tinggi'. Kumpulkan XP dari setiap aktivitas dan lihat levelmu naik seiring bertambahnya ilmu.
                                    </p>
                                </div>
                                <div className="mt-auto bg-white/30 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-label-sm text-on-secondary-container">Progress Level 2</span>
                                        <span className="text-[12px] font-bold text-on-secondary-container">79%</span>
                                    </div>
                                    <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full transition-all duration-1000" style={{ width: '79%' }}></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Feature 3: Kuis Baru */}
                            <div className="md:col-span-5 bg-tertiary-fixed rounded-3xl p-10 flex flex-col justify-center items-center text-center group hover:scale-[0.98] transition-all">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 group-hover:rotate-12 transition-transform">
                                    <span className="material-symbols-outlined text-[40px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
                                </div>
                                <h3 className="font-headline-md text-headline-md text-on-tertiary-fixed mb-4">Kuis Baru Setiap Hari</h3>
                                <p className="text-on-tertiary-fixed/70">
                                    Database soal yang terus diperbarui oleh pakar pendidikan untuk memastikan materi tetap relevan.
                                </p>
                            </div>
                            
                            {/* Feature 4: Analitik */}
                            <div className="md:col-span-7 bg-surface-container-highest rounded-3xl p-10 flex items-center gap-10 overflow-hidden group">
                                <div className="flex-1">
                                    <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Aktivitas Mingguan</h3>
                                    <p className="text-on-surface-variant">
                                        Pantau statistik belajarmu melalui grafik interaktif yang mudah dipahami. Ketahui kelemahan dan kekuatanmu secara instan.
                                    </p>
                                </div>
                                <div className="flex-1 flex items-end gap-2 h-32">
                                    <div className="w-full bg-primary/10 rounded-t-lg h-1/4 group-hover:h-3/4 transition-all duration-500"></div>
                                    <div className="w-full bg-primary/20 rounded-t-lg h-2/4 group-hover:h-full transition-all duration-500 delay-75"></div>
                                    <div className="w-full bg-primary/40 rounded-t-lg h-3/4 group-hover:h-2/4 transition-all duration-500 delay-100"></div>
                                    <div className="w-full bg-primary rounded-t-lg h-full group-hover:h-1/3 transition-all duration-500 delay-150"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-primary relative overflow-hidden">
                    <div className="max-w-container-max mx-auto px-margin-mobile md:px-unit-lg text-center relative z-10">
                        <h2 className="font-headline-lg text-headline-lg text-white mb-8">Siap Memulai Petualangan Belajarmu?</h2>
                        <p className="text-body-lg text-white/80 mb-0 max-w-2xl mx-auto">
                            Bergabunglah dengan ribuan pelajar lainnya dan jadilah yang pertama mencoba Quizzin saat resmi diluncurkan.
                        </p>
                    </div>
                    {/* Atmospheric effects */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-[120px]"></div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Landing;
