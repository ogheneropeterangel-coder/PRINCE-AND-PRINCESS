import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { 
  ChevronRight, Target, ShieldCheck, MapPin, Sparkles, 
  BookOpen, Award, Compass, Mail, Phone, Menu, X, CheckCircle2,
  GraduationCap, Users, Clock, Library, School, Building, Lightbulb, Briefcase, Star
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { navigateTo } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Academics', href: '#academics' },
    { name: 'Vision & Mission', href: '#vision' },
    { name: 'Why Choose Us', href: '#why-us' },
    { name: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white selection:bg-school-royal selection:text-white font-sans text-slate-900 scroll-smooth">
      {/* Navigation Header */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 py-3 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-black text-xl transition-all duration-500 shadow-xl ${scrolled ? 'bg-school-royal text-white' : 'bg-white text-school-royal'}`}>P</div>
            <div className={`${scrolled ? 'text-slate-900' : 'text-white'}`}>
              <h1 className="text-sm md:text-lg font-black uppercase tracking-tighter leading-none">Prince & Princess</h1>
              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] opacity-80">International School</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-school-gold ${scrolled ? 'text-slate-600' : 'text-white/90'}`}
              >
                {link.name}
              </a>
            ))}
            <button 
              onClick={() => navigateTo('auth', 'signup')}
              className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-500 hover:scale-105 active:scale-95 flex items-center gap-2 ${scrolled ? 'bg-school-royal text-white hover:bg-black shadow-lg shadow-school-royal/20' : 'bg-white text-school-royal shadow-2xl hover:bg-school-gold hover:text-school-royal'}`}
            >
              <Users size={14} /> Access Portal
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className={scrolled ? 'text-slate-900' : 'text-white'} /> : <Menu className={scrolled ? 'text-slate-900' : 'text-white'} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 space-y-6 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="block text-sm font-black uppercase tracking-widest text-slate-600 hover:text-school-royal">
                {link.name}
              </a>
            ))}
            <button onClick={() => navigateTo('auth', 'signup')} className="w-full py-4 bg-school-royal text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
              <Users size={18} /> Access Portal
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section - Inspired by the sample image */}
      <section id="home" className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[85%] bg-school-royal rounded-b-[4rem] md:rounded-b-[8rem] z-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-school-royal via-school-royal/80 to-blue-900/50 opacity-50" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-school-gold/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em]">
                <Sparkles size={14} className="text-school-gold" />
                Online & Physical Learning
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                SCHOOL FOR <br />
                <span className="text-school-gold">LEADERS</span> <br />
                <span className="text-3xl md:text-5xl opacity-90">OF TOMORROW</span>
              </h2>
              <div className="flex flex-col md:flex-row gap-8 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-school-gold flex items-center justify-center text-school-royal font-bold text-xs">+</div>
                  <p className="text-white/80 text-sm font-bold leading-tight">Nurturing your child's <br /> potential from day one</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-school-gold flex items-center justify-center text-school-royal font-bold text-xs">+</div>
                  <p className="text-white/80 text-sm font-bold leading-tight">Small class sizes for <br /> personalized attention</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigateTo('auth', 'signup')}
                className="group px-10 py-5 bg-school-gold text-school-royal rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-white hover:scale-105 transition-all duration-500 shadow-2xl flex items-center justify-center gap-3"
              >
                JOIN OUR ACADEMY <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-12 duration-1000">
            <div className="relative z-10 rounded-[4rem] overflow-hidden border-[12px] border-white/10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000" 
                alt="Happy Student" 
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute top-10 right-10 bg-white p-6 rounded-3xl shadow-2xl animate-bounce duration-[3000ms]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-school-gold rounded-full flex items-center justify-center text-school-royal">
                    <Star size={20} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 leading-none">Top Rated</p>
                    <p className="text-sm font-black text-school-royal">Excellence</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-school-gold rounded-full z-0" />
          </div>
        </div>
      </section>

      {/* Motto Bar */}
      <div className="bg-school-gold py-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <h3 className="text-school-royal font-black text-xl uppercase tracking-tighter opacity-60">School Motto:</h3>
            <p className="text-school-royal font-black text-3xl md:text-5xl italic tracking-tighter leading-none">Character, Skill and Career</p>
          </div>
          <div className="h-12 w-[1px] bg-school-royal/20 hidden md:block" />
          <p className="text-school-royal font-black uppercase tracking-[0.3em] text-[10px] bg-white/30 px-6 py-2 rounded-full border border-school-royal/10">
            Nigeria Educational Excellence
          </p>
        </div>
      </div>

      {/* Features Section - 4 Cards as in sample */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Our Core Values</h3>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">Developing Students From All Sides</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 1, title: "Academic Excellence", desc: "We provide a rigorous curriculum that prepares students for global challenges.", icon: BookOpen, color: "bg-blue-50 text-blue-600" },
              { id: 2, title: "Moral Integrity", desc: "Instilling strong values and character in every student through guidance.", icon: ShieldCheck, color: "bg-purple-50 text-purple-600" },
              { id: 3, title: "Skill Acquisition", desc: "Practical skills in technology, arts, and crafts to prepare for the future.", icon: Lightbulb, color: "bg-emerald-50 text-emerald-600" },
              { id: 4, title: "Career Guidance", desc: "Helping students discover their passions and path to professional success.", icon: Briefcase, color: "bg-amber-50 text-amber-600" }
            ].map((feature) => (
              <div key={feature.id} className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-slate-300">{feature.id}</div>
                  <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <feature.icon size={28} />
                  </div>
                </div>
                <h4 className="text-lg font-black uppercase tracking-tight text-slate-800 mb-4">{feature.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-school-royal rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-school-gold rounded-2xl flex items-center justify-center text-school-royal shadow-lg">
                <Award size={32} />
              </div>
              <div>
                <h4 className="text-xl font-black text-white uppercase tracking-tighter">A Promising Future Awaits</h4>
                <p className="text-white/60 text-sm font-medium">Education is the first step to a successful life. We help you take it.</p>
              </div>
            </div>
            <button onClick={() => navigateTo('auth', 'signup')} className="px-8 py-4 bg-white text-school-royal rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-school-gold transition-colors">
              Start Learning Now
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Success Rate", value: "100%", icon: Award, color: "text-blue-600" },
              { label: "Qualified Teachers", value: "50+", icon: Users, color: "text-orange-500" },
              { label: "Active Students", value: "1000+", icon: GraduationCap, color: "text-emerald-600" },
              { label: "Years Experience", value: "15+", icon: Clock, color: "text-purple-600" }
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-2 group">
                <div className={`w-12 h-12 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission & Motto Details */}
      <section id="vision" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Vision */}
            <div className="p-12 bg-school-royal rounded-[4rem] text-white space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110">
                <Target size={120} />
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-school-gold shadow-xl">
                <Target size={32} />
              </div>
              <div className="space-y-4 relative z-10">
                <h3 className="text-3xl font-black uppercase tracking-tighter">Our Vision</h3>
                <p className="text-lg text-white/80 leading-relaxed font-medium">
                  To be a leading secondary school in Taraba State, recognized for academic excellence, strong moral values, and the production of confident, skilled, and responsible future leaders.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="p-12 bg-slate-50 border border-slate-100 rounded-[4rem] space-y-8 shadow-sm group">
              <div className="w-16 h-16 bg-school-royal rounded-2xl flex items-center justify-center text-school-gold shadow-xl">
                <Compass size={32} />
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Our Mission</h3>
                <ul className="space-y-4">
                  {[
                    "Provide high-quality education meeting global standards",
                    "Instill discipline and integrity in every student",
                    "Equip students with practical critical thinking skills",
                    "Prepare learners for future higher education",
                    "Encourage creativity and leadership confidence"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 font-bold text-sm uppercase tracking-tight">
                      <div className="mt-1 w-2 h-2 rounded-full bg-school-gold shrink-0 shadow-sm" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Motto Detail */}
            <div className="p-12 bg-school-gold rounded-[4rem] space-y-8 shadow-xl group">
              <div className="w-16 h-16 bg-school-royal rounded-2xl flex items-center justify-center text-white shadow-xl">
                <Award size={32} />
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl font-black uppercase tracking-tighter text-school-royal">Our Motto</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Character', icon: ShieldCheck, desc: 'Building morally upright, disciplined, and responsible students' },
                    { label: 'Skill', icon: Lightbulb, desc: 'Developing academic, practical, and life skills' },
                    { label: 'Career', icon: Briefcase, desc: 'Preparing students for professions and leadership roles' }
                  ].map((m, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-2 text-school-royal font-black uppercase tracking-widest text-xs">
                        <m.icon size={16} /> {m.label}
                      </div>
                      <p className="text-sm text-school-royal/80 font-semibold leading-snug">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section - Colorful cards as in sample */}
      <section id="academics" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Academic Pathways</h3>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">Choose the Right Program</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "JUNIOR MIDDLE", age: "10-12 YEARS", duration: "3 YEARS", color: "bg-blue-600", desc: "Foundation years focusing on core subjects and character building.", price: "JSS 1-3" },
              { title: "SENIOR HIGH", age: "13-15 YEARS", duration: "3 YEARS", color: "bg-orange-500", desc: "Specialized streams in Sciences, Arts, and Commercial subjects.", price: "SSS 1-3" },
              { title: "TECH SUPER", age: "10-15 YEARS", duration: "CONTINUOUS", color: "bg-emerald-600", desc: "Advanced computer studies, coding, and digital literacy programs.", price: "EXTRAS" },
              { title: "LEAD EXPERT", age: "12-15 YEARS", duration: "ANNUAL", color: "bg-purple-600", desc: "Leadership training, public speaking, and community service projects.", price: "LEADERS" }
            ].map((program, i) => (
              <div key={i} className={`${program.color} p-8 rounded-[3rem] text-white space-y-6 shadow-xl hover:scale-[1.05] transition-all duration-500 flex flex-col`}>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest">{program.age}</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest">{program.duration}</span>
                </div>
                <div className="flex-1 space-y-4">
                  <h4 className="text-2xl font-black tracking-tighter uppercase">{program.title}</h4>
                  <p className="text-white/80 text-sm font-medium leading-relaxed">{program.desc}</p>
                </div>
                <div className="pt-6 border-t border-white/20 flex items-center justify-between">
                  <span className="text-lg font-black">{program.price}</span>
                  <button onClick={() => navigateTo('auth', 'signup')} className="text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                    Details <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-school-royal/5 rounded-full text-school-royal text-[10px] font-black uppercase tracking-widest">
                  <Award size={14} /> Our Unique Strengths
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-slate-900">Why Every Leader Starts Here</h2>
                <p className="text-slate-600 font-medium text-xl leading-relaxed">
                  We believe every child is a leader in the making. Our environment is engineered to bring out the absolute best in every learner.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { title: "Excellent Academic Performance", icon: Award, color: 'text-school-gold' },
                  { title: "Strong Moral & Character Training", icon: ShieldCheck, color: 'text-emerald-500' },
                  { title: "Qualified & Caring Teachers", icon: Users, color: 'text-blue-500' },
                  { title: "Safe & Disciplined School Environment", icon: Clock, color: 'text-purple-500' },
                  { title: "Focus on Academics & Personal Growth", icon: Lightbulb, color: 'text-amber-500' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:scale-[1.02] group">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 group-hover:bg-school-royal group-hover:text-white transition-all">
                      <item.icon size={28} className={item.color} />
                    </div>
                    <span className="text-lg font-black uppercase tracking-tight text-slate-800">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6 pt-12">
                     <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" className="rounded-[3rem] shadow-2xl border-4 border-slate-100" alt="Nigerian Student portrait" />
                     <div className="bg-school-gold p-8 rounded-[3rem] text-school-royal shadow-xl">
                        <Users size={40} className="mb-4" />
                        <h4 className="text-2xl font-black tracking-tighter">Supportive Community</h4>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-70 mt-2">Nurturing potential together</p>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div className="bg-school-royal p-8 rounded-[3rem] text-white shadow-xl">
                        <CheckCircle2 size={40} className="mb-4 text-school-gold" />
                        <h4 className="text-2xl font-black tracking-tighter">Academic Success</h4>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-50 mt-2">Excellence in every step</p>
                     </div>
                     <img src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=800" className="rounded-[3rem] shadow-2xl border-4 border-slate-100" alt="Nigerian Student Reading" />
                  </div>
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-school-gold rounded-full opacity-20 blur-[80px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Access Portal CTA */}
      <section className="py-24 bg-school-royal relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200" 
            alt="Collaborative Learning" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-10">
           <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">Ready to Begin Your <br /> Academic <span className="text-school-gold italic">Journey?</span></h2>
           <p className="text-xl text-white/70 font-medium">Access your results, manage enrollments, and connect with the school registry through our modern management portal.</p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigateTo('auth', 'signup')}
                className="w-full sm:w-auto px-12 py-5 bg-white text-school-royal rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-school-gold hover:scale-105 transition-all duration-500 shadow-2xl flex items-center justify-center gap-3"
              >
                Access Student Portal <ChevronRight size={18} />
              </button>
              <button 
                onClick={() => navigateTo('auth', 'login')}
                className="w-full sm:w-auto px-12 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all duration-500"
              >
                Staff Registry Login
              </button>
           </div>
        </div>
      </section>

      {/* Contact/Footer Section - Inspired by the sample footer */}
      <section id="contact" className="py-24 bg-school-royal relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase">
                DON'T UNDERSTAND <br />
                <span className="text-school-gold">SOMETHING?</span>
              </h2>
              <p className="text-white/70 text-lg font-medium max-w-md">
                Leave a request for a free consultation. We will help you understand our programs and enrollment process.
              </p>
              <div className="flex items-center gap-4 text-white/50 text-xs font-black uppercase tracking-widest">
                <Clock size={16} className="text-school-gold" />
                <span>Response time: 15 minutes</span>
              </div>
              
              <div className="pt-8 border-t border-white/10 flex gap-6">
                <div className="space-y-1">
                  <p className="text-school-gold text-[9px] font-black uppercase tracking-widest">Email Us</p>
                  <p className="text-white font-bold text-sm">info@ppisms.edu.ng</p>
                </div>
                <div className="space-y-1">
                  <p className="text-school-gold text-[9px] font-black uppercase tracking-widest">Visit Us</p>
                  <p className="text-white font-bold text-sm">Wukari, Taraba State</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[4rem] border border-white/10 shadow-2xl space-y-6">
              <div className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full p-5 bg-white rounded-2xl text-slate-900 font-bold outline-none focus:ring-4 focus:ring-school-gold/30 transition-all" />
                <input type="tel" placeholder="Phone Number" className="w-full p-5 bg-white rounded-2xl text-slate-900 font-bold outline-none focus:ring-4 focus:ring-school-gold/30 transition-all" />
              </div>
              <button className="w-full py-5 bg-school-gold text-school-royal rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl">
                SUBMIT REQUEST
              </button>
              <p className="text-[9px] text-white/40 text-center uppercase tracking-widest font-bold">
                By clicking, you agree to our privacy policy
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-school-royal py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white text-school-royal rounded-xl flex items-center justify-center font-black text-2xl shadow-xl">P</div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-white leading-none">Prince & Princess</h3>
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">International School</p>
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
            &copy; {new Date().getFullYear()} PPISMS. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            {navLinks.slice(0, 3).map(l => (
              <a key={l.name} href={l.href} onClick={(e) => handleNavClick(e, l.href)} className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-school-gold transition-colors">{l.name}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;