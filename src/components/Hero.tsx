import { motion } from "motion/react";
import { ArrowDown, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "./LanguageProvider";

export function Hero() {
  const { t } = useLanguage();
  // Scroll to section function
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Open CV
  const openCV = () => {
    window.open("https://linktr.ee/shaimaaalrifay", "_blank");
  };
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-bl from-primary/10 via-accent/5 to-background" />

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full opacity-20 blur-xl"
      />
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 left-10 w-32 h-32 bg-gradient-to-r from-accent to-primary rounded-full opacity-15 blur-2xl"
      />
      <motion.div
        animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-lg"
      />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h4 className="text-base font-medium text-foreground">
              {t("hero.greeting")}
            </h4>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold">
              <span
                className="block bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse"
                style={{
                  backgroundSize: "200% 100%",
                  animation: "gradient-x 3s ease infinite",
                  padding:"29px",
                }}
              >
                {t("hero.name")}
              </span>
            </h1>
          </motion.div>


          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {t("hero.description")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            onClick={() => scrollToSection("projects")}
          >
            <Button size="lg" 
              className="group bg-gradient-to-l from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-6 flex items-center gap-2">
              {t("hero.cta.portfolio")}
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowDown className="h-5 w-5" />
              </motion.span>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2 border-primary/20 hover:border-primary/50" onClick={openCV}>
              {t("hero.cta.contact")}
            </Button>
          </motion.div>

          {/* Social Links */}
          <motion.div className="flex justify-center gap-6 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {[Github, Linkedin, Mail].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                className="p-4 rounded-2xl bg-gradient-to-r from-secondary to-muted hover:from-primary/10 hover:to-accent/10 shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="h-6 w-6 text-foreground" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-sm font-medium"> {t("hero.scrollIndicator")} </span>
        <motion.div
          className="p-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.div>

      {/* Gradient Animation */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}