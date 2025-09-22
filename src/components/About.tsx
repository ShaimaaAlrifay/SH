import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Code, Palette, Smartphone, Users } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
// suppress TypeScript missing module error for static asset import
// @ts-ignore
import avatarImage from "../assets/avatarImage.png";

export function About() {
  const { t } = useLanguage();

  const stats = [
    { number: "2+", label: t("about.experience"), icon: Code },
    {
      number: "10+",
      label: t("about.projects"),
      icon: Smartphone,
    },
    { number: "15+", label: t("about.clients"), icon: Users },
    { number: "2", label: t("about.awards"), icon: Palette },
  ];

  return (
    <section
      id="about"
      className="py-12 md:py-20 lg:py-24 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-accent rounded-full blur-3xl" />
      </div>

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
            {t("about.title")}
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {t("about.subtitle")}
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8"
          >
            <div className="space-y-4 md:space-y-6">
              <motion.p
                className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed whitespace-pre-line"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {t("about.description")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-wrap gap-2 md:gap-3"
              >
                {[
                  "React",
                  "TypeScript",
                  "UI/UX",
                  "Figma",
                  "Next.js",
                  "Tailwind",
                ].map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                    }}
                    viewport={{ once: true }}
                  >
                    <Badge
                      variant="outline"
                      className="px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium bg-card/50 border-primary/30 text-foreground hover:bg-primary hover:text-white transition-all duration-300 cursor-default"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative mx-auto max-w-sm lg:max-w-md">
              {/* Decorative Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl transform rotate-6"
                animate={{
                  rotate: [6, -6, 6],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Main Image Container */}
              <motion.div
                className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-4 md:p-6 card-blur border-2 border-primary/20"
                whileHover={{ scale: 1.02, rotate: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  src={avatarImage}
                  alt="شيماء الرفاعي"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0,
                  }}
                />
                <motion.div
                  className="absolute -bottom-3 -left-3 w-4 h-4 bg-accent rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: 0.5,
                  }}
                />
                <motion.div
                  className="absolute top-1/3 -left-4 w-3 h-3 bg-primary/60 rounded-full"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.5, 0.9, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 1,
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-20 lg:mt-24"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center p-4 md:p-6 lg:p-8 hover:shadow-2xl card-blur border-primary/20 hover:border-primary/40 transition-all duration-500 group">
                    <CardContent className="p-0 space-y-3 md:space-y-4">
                      <motion.div
                        className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                      </motion.div>
                      <motion.div
                        className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.1 + 0.3,
                        }}
                        viewport={{ once: true }}
                      >
                        {stat.number}
                      </motion.div>
                      <div className="text-xs md:text-sm lg:text-base text-muted-foreground font-medium">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}