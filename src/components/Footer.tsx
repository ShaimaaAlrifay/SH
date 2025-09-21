import { motion } from "motion/react";
import { Heart, Github, Linkedin, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export function Footer() {
  const { t, language } = useLanguage();

  const quickLinks = [
    { id: "about", label: t('nav.about') },
    { id: "skills", label: t('nav.skills') },
    { id: "projects", label: t('nav.projects') },
    { id: "experience", label: t('nav.experience') },
    { id: "contact", label: t('nav.contact') },
  ];

  const services = [
    t('footer.services.ui'),
    t('footer.services.mobile'),
    t('footer.services.consulting'),
  ];

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "https://github.com" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-black/95 border-t border-primary/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${language === 'ar' ? '#FFB8B8' : '#FFC973'} 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${language === 'ar' ? '#FFC973' : '#FFB8B8'} 0%, transparent 50%)`
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="mb-6">
                <motion.h3 
                  className="text-2xl md:text-3xl font-bold text-primary mb-4"
                  whileHover={{ scale: 1.05 }}
                >
                  {language === 'ar' ? 'شيماء الرفاعي' : 'Shaimaa Al-Rifay'}
                </motion.h3>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md">
                  {t('footer.description')}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <motion.a
                  href="mailto:shaimaaalrifay@example.com"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300 group"
                  whileHover={{ x: language === 'ar' ? -5 : 5 }}
                >
                  <Mail className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm md:text-base">shaimaaalrifay@gmail.com</span>
                </motion.a>
                
                <motion.a
                  href="tel:+966123456789"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300 group"
                  whileHover={{ x: language === 'ar' ? -5 : 5 }}
                >
                  <Phone className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm md:text-base">+966 54 541 1002</span>
                </motion.a>
                
                <motion.div
                  className="flex items-center gap-3 text-muted-foreground group"
                  whileHover={{ x: language === 'ar' ? -5 : 5 }}
                >
                  <MapPin className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm md:text-base">
                  {language === 'ar' ? 'مكة المكرمة، المملكة العربية السعودية' : 'Makkah, Saudi Arabia'}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg md:text-xl font-bold text-foreground mb-6">
                {t('footer.quick')}
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm md:text-base hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg md:text-xl font-bold text-foreground mb-6">
                {t('footer.services')}
              </h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <motion.li
                    key={service}
                    initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-muted-foreground text-sm md:text-base"
                  >
                    {service}
                  </motion.li>
                ))}
              </ul>

              {/* Social Links */}
              <div className="mt-8">
                <h5 className="text-base md:text-lg font-semibold text-foreground mb-4">
                  {t('footer.social')}
                </h5>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-card/30 backdrop-blur-sm border border-primary/20 text-muted-foreground hover:text-white hover:bg-primary hover:border-primary transition-all duration-300"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-primary/20 py-6 md:py-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-muted-foreground text-sm md:text-base text-center md:text-right">
              © {new Date().getFullYear()} {language === 'ar' ? 'شيماء الرفاعي' : 'Shaimaa Al-Rifay'}. {t('footer.rights')}.
            </div>
            
            <motion.div 
              className="flex items-center gap-2 text-muted-foreground text-sm md:text-base"
              whileHover={{ scale: 1.05 }}
            >
              <span>{t('footer.made')}</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <Heart className="h-4 w-4 text-primary fill-current" />
              </motion.div>
              <span>{t('footer.love')}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}