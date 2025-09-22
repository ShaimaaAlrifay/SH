import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Menu, X, Globe } from "lucide-react";
import { useLanguage } from "./LanguageProvider";


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { language, setLanguage, t, dir } = useLanguage();

  const navItems = [
    { id: "about", label: t('nav.about') },
    { id: "skills", label: t('nav.skills') },
    { id: "projects", label: t('nav.projects') },
    { id: "experience", label: t('nav.experience') },
    { id: "contact", label: t('nav.contact') },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    setActiveSection(sectionId);
    
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };
  useEffect(() => {
    const ids = navItems.map((i) => i.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    // Prefer IntersectionObserver for accuracy and performance
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          // pick the most visible / intersecting entry
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          root: null,
          // trigger when the section crosses roughly the middle of the viewport
          rootMargin: "-40% 0px -40% 0px",
          threshold: 0,
        }
      );

      sections.forEach((s) => observer.observe(s));
      return () => observer.disconnect();
    }

    // Fallback for browsers without IntersectionObserver
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let foundId: string | null = null;
      for (const s of sections) {
        const top = s.offsetTop;
        const bottom = top + s.offsetHeight;
        if (mid >= top && mid < bottom) {
          foundId = s.id;
          break;
        }
      }
      if (foundId) setActiveSection(foundId);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // run once to initialize
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [navItems]);
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 backdrop-blur-xl bg-gradient-to-br from-background/80 via-background/60 to-background/40 border-b border-primary/10 shadow-lg"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <button
              onClick={() => scrollToSection("hero")}
              className="text-2xl lg:text-3xl font-bold text-primary hover:text-accent transition-colors duration-300"
            >
              <Heart className="h-8 w-8 text-primary fill-current" />
            </button>
          </motion.div>

          {/* Desktop Navigation - Centered with modern design */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <nav className="bg-card/30 backdrop-blur-md rounded-full border border-primary/20 px-2 py-2">
              <ul className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <motion.button
                      onClick={() => scrollToSection(item.id)}
                      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeSection === item.id
                          ? "text-white"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {activeSection === item.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-primary rounded-full"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <motion.button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-card/30 backdrop-blur-md border border-primary/20 text-sm font-medium text-foreground hover:text-primary transition-all duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{language === 'ar' ? 'EN' : 'عر'}</span>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-card/30 backdrop-blur-md border border-primary/20 text-foreground hover:text-primary transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <nav className="py-4">
                <ul className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-right px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                          activeSection === item.id
                            ? "bg-primary text-white"
                            : "text-muted-foreground hover:text-primary hover:bg-card/50"
                        }`}
                      >
                        {item.label}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}