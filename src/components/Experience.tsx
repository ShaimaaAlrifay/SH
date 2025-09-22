import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export function Experience() {
  const { t, language, dir } = useLanguage();

  const experiences = [
    {
      id: 1,
      title: t("experience.work.1.title"),
      company: t("experience.work.1.company"),
      location: t("experience.work.1.location"),
      period: t("experience.work.1.period"),
      type: t("experience.work.1.type"),
      description: [
        t("experience.work.1.description.1"),
        t("experience.work.1.description.2"),
        t("experience.work.1.description.3"),
      ],
      technologies: ["Figma", "UI/UX", "React"],
      current: true,
    },
    {
      id: 2,
      title: t("experience.work.2.title"),
      company: t("experience.work.2.company"),
      location: t("experience.work.2.location"),
      period: t("experience.work.2.period"),
      type: t("experience.work.2.type"),
      description: [
        t("experience.work.2.description.1"),
        t("experience.work.2.description.2"),
        t("experience.work.2.description.3"),
      ],
      technologies: ["Figma", "UI/UX", "Prototyping"],
      current: false,
    },
    {
      id: 3,
      title: t("experience.work.3.title"),
      company: t("experience.work.3.company"),
      location: t("experience.work.3.location"),
      period: t("experience.work.3.period"),
      type: t("experience.work.3.type"),
      description: [
        t("experience.work.3.description.1"),
        t("experience.work.3.description.2"),
        t("experience.work.3.description.3"),
        t("experience.work.3.description.4"),
      ],
      technologies: ["React", "Figma", "React Native CLI"],
      current: false,
    },
  ];

  const education = [
    {
      degree: t("education.school.1.degree"),
      school: t("education.school.1.school"),
      period: t("education.school.1.period"),
      location: t("education.school.1.location"),
      achievements: [
        t("education.school.1.project"),
        t("education.school.1.description.1"),
        t("education.school.1.description.2"),
        t("education.school.1.description.3"),
      ],
    },
  ];

  const certifications = [
    t("certifications.1"),
    t("certifications.2"),
    t("certifications.3"),
    t("certifications.4"),
  ];
  const Honors = [
    t("honors.1"),
    t("honors.2"),
  ];
  return (
    <section
      id="experience"
      className="py-12 md:py-20 lg:py-24 relative"
    >
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
            {t("experience.title")}
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {t("experience.subtitle")}
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Work Experience */}
          <motion.div
            initial={{
              opacity: 0,
              x: dir === "rtl" ? 50 : -50,
            }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 flex items-center gap-3 text-foreground">
              <span className="text-2xl">💼</span>
              {language === "ar"
                ? "الخبرة المهنية"
                : "Work Experience"}
            </h3>

            <div className="space-y-6 md:space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true }}
                >
                  <Card
                    className={`hover:shadow-2xl transition-all duration-500 card-blur border-primary/20 hover:border-primary/40 ${
                      exp.current
                        ? "ring-2 ring-primary/30 bg-primary/5"
                        : ""
                    } ${dir === "rtl" ? "text-right" : "text-left"}`}
                  >
                    <CardHeader className="pb-4">
                      <div
                        className={`${dir === "rtl" ? "text-right" : "text-left"}`}
                      >
                        <div
                          className={`flex items-center gap-2 flex-wrap mb-2 ${dir === "rtl" ? "flex-row justify-start" : ""}`}
                        >
                          <CardTitle className="text-lg md:text-xl text-foreground">
                            {exp.title}
                          </CardTitle>
                          {exp.current && (
                            <Badge
                              className="bg-primary text-white border-0"
                              variant="default"
                            >
                              {language === "ar"
                                ? "حالياً"
                                : "Current"}
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className="border-primary/30 text-foreground bg-card/50"
                          >
                            {exp.type}
                          </Badge>
                        </div>
                        <p
                          className={`text-primary font-semibold ${dir === "rtl" ? "text-right" : "text-left"}`}
                        >
                          {exp.company}
                        </p>
                      </div>

                      <div
                        className={`flex flex-wrap gap-4 text-sm text-muted-foreground mt-3 ${dir === "rtl" ? "flex-row-reverse justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex items-center gap-2 ${dir === "rtl" ? "flex-row" : ""}`}
                        >
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{exp.period}</span>
                        </div>
                        <div
                          className={`flex items-center gap-2 ${dir === "rtl" ? "flex-row" : ""}`}
                        >
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent
                      className={`space-y-4 md:space-y-6 ${dir === "rtl" ? "text-right" : "text-left"}`}
                    >
                      <ul className="space-y-3 text-right">
                        {exp.description.map(
                          (item, itemIndex) => (
                            <motion.li
                              key={itemIndex}
                              initial={{
                                opacity: 0,
                                x: dir === "rtl" ? 20 : -20,
                              }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: itemIndex * 0.05,
                              }}
                              viewport={{ once: true }}
                              className={`text-sm md:text-base text-muted-foreground flex items-start gap-3 ${dir === "rtl" ? "flex-row text-left" : "text-right"}`}
                            >
                              <span className="text-primary mt-1 flex-shrink-0 text-lg">
                                •
                              </span>
                              <span
                                className={`leading-relaxed ${dir === "rtl" ? "text-right" : "text-left"}`}
                              >
                                {item}
                              </span>
                            </motion.li>
                          ),
                        )}
                      </ul>

                      <div
                        className={`flex flex-wrap gap-2 md:gap-3 ${dir === "rtl" ? "justify-start" : "justify-start"}`}
                      >
                        {exp.technologies.map(
                          (tech, techIndex) => (
                            <motion.div
                              key={tech}
                              initial={{
                                opacity: 0,
                                scale: 0.8,
                              }}
                              whileInView={{
                                opacity: 1,
                                scale: 1,
                              }}
                              transition={{
                                duration: 0.3,
                                delay: techIndex * 0.05,
                              }}
                              viewport={{ once: true }}
                            >
                              <Badge
                                variant="secondary"
                                className="text-xs md:text-sm bg-secondary text-foreground border-primary/20"
                              >
                                {tech}
                              </Badge>
                            </motion.div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{
              opacity: 0,
              x: dir === "rtl" ? -50 : 50,
            }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 flex items-center gap-3 text-foreground">
              <span className="text-2xl">🎓</span>
              {language === "ar" ? "التعليم" : "Education"}
            </h3>

            <div className="space-y-6 md:space-y-8">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true }}
                >
                  <Card className="hover:shadow-2xl transition-all duration-500 card-blur border-primary/20 hover:border-primary/40">
                    <CardHeader className="pb-4">
                      <CardTitle
                        className={`text-lg md:text-xl text-foreground ${dir === "rtl" ? "text-right" : "text-left"}`}
                      >
                        {edu.degree}
                      </CardTitle>
                      <p
                        className={`text-primary font-semibold ${dir === "rtl" ? "text-right" : "text-left"}`}
                      >
                        {edu.school}
                      </p>
                      <div
                        className={`flex flex-wrap gap-2 text-sm text-muted-foreground ${dir === "rtl" ? "flex-row" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{edu.period}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{edu.location}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <ul className="space-y-3">
                        {edu.achievements.map(
                          (achievement, achievementIndex) => (
                            <motion.li
                              key={achievementIndex}
                              initial={{
                                opacity: 0,
                                x: dir === "rtl" ? 20 : -20,
                              }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: achievementIndex * 0.05,
                              }}
                              viewport={{ once: true }}
                              className={`text-sm md:text-base text-muted-foreground flex items-start gap-3 ${dir === "rtl" ? "flex-row text-right" : ""}`}
                            >
                              <span className="text-primary mt-1 flex-shrink-0 text-lg">
                                •
                              </span>
                              <span className="leading-relaxed">
                                {achievement}
                              </span>
                            </motion.li>
                          ),
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8 md:mt-12"
            >
              <h4 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-3 text-foreground">
                <span className="text-xl">🏆</span>
                {language === "ar"
                  ? "الشهادات"
                  : "Certifications"}
              </h4>
              <div className="space-y-3 md:space-y-4">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert}
                    initial={{
                      opacity: 0,
                      x: dir === "rtl" ? 20 : -20,
                    }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                    }}
                    viewport={{ once: true }}
                    className={`flex items-center gap-3 text-sm md:text-base text-foreground ${dir === "rtl" ? "flex-row" : ""}`}
                  >
                    <span className="text-primary text-lg">
                      ✓
                    </span>
                    <span>{cert}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Honors */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8 md:mt-12"
            >
              <h4 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-3 text-foreground">
                <span className="text-xl">🏆</span>
                {t("honors.title")}
              </h4>
              <div className="space-y-3 md:space-y-4">
                {Honors.map((cert, index) => (
                  <motion.div
                    key={cert}
                    initial={{
                      opacity: 0,
                      x: dir === "rtl" ? 20 : -20,
                    }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                    }}
                    viewport={{ once: true }}
                    className={`flex items-center gap-3 text-sm md:text-base text-foreground ${dir === "rtl" ? "flex-row" : ""}`}
                  >
                    <span className="text-primary text-lg">
                      ✓
                    </span>
                    <span>{cert}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}