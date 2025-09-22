import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, MessageCircle } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export function Contact() {
  const { t, dir } = useLanguage();

  const contactInfo = [
    {
      icon: <Mail className="h-4 w-4 sm:h-5 sm:w-5" />,
      label: t('contact.email'),
      value: "shaimaaalrifay@gmail.com",
      href: "mailto:shaimaaalrifay@gmail.com",
    },
    {
      icon: <Phone className="h-4 w-4 sm:h-5 sm:w-5" />,
      label: t('contact.phone'),
      value: "+966 54 541 1002",
      href: "tel:+966123456789",
    },
    {
      icon: <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />,
      label: t('contact.location'),
      value: t('contact.location.me'),
      href: "#",
    },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5 sm:h-6 sm:w-6" />,
      href: "https://github.com/ShaimaaAlrifay",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />,
      href: "https://www.linkedin.com/in/shaimalrifay/",
    },
    {
      name: "X or Twitter",
      icon: <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />,
      href: "https://x.com/I1sh1",
    },
  ];

  return (
    <section id="contact" className="py-12 md:py-20 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-primary"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('contact.title')}
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {t('contact.subtitle')}
          </motion.p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8 mb-12 md:mb-16"
          >
            <div className="text-center mb-8 md:mb-12">
              <motion.h3 
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 flex items-center justify-center gap-3 flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                <span className="text-[rgba(255,255,255,1)]">{t('contact.lets')}</span>
              </motion.h3>
              <motion.p 
                className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed whitespace-pre-line"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {t('contact.description')}
              </motion.p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 card-blur border-primary/20 hover:border-primary/40 overflow-hidden group">
                    <CardContent className="p-6 md:p-8 text-center">
                      <a
                        href={info.href}
                        className="flex flex-col items-center gap-4 group-hover:gap-6 transition-all duration-300"
                      >
                        <motion.div 
                          className="p-4 md:p-6 rounded-2xl bg-primary shadow-lg group-hover:scale-110 transition-transform duration-300"
                          whileHover={{ rotate: 10 }}
                        >
                          <div className="text-white">
                            {info.icon}
                          </div>
                        </motion.div>
                        <div>
                          <p className="font-bold text-lg md:text-xl mb-2 text-foreground">{info.label}</p>
                          <p className="text-muted-foreground group-hover:text-primary transition-colors duration-300 text-sm md:text-base break-words">
                            {info.value}
                          </p>
                        </div>
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h4 className="font-bold text-xl sm:text-2xl md:text-3xl mb-6 md:mb-8 text-foreground">
              {t('contact.follow')}
            </h4>
            <div className="flex justify-center gap-4 sm:gap-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  viewport={{ once: true }}
                  className="p-4 sm:p-5 rounded-2xl bg-accent text-white shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}