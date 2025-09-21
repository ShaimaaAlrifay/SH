import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Code2, Database, Settings, Brain } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export function Skills() {
  const { t, language } = useLanguage();

  const skillCategories = [
    {
      title: t('skills.Applications&Web'),
      icon: Code2,
      skills: [
        { name: "React Native", level: 60 },
        { name: "JavaScript", level: 50 },
        { name: "TypeScript", level: 10 },
        { name: "HTML/CSS", level: 98 },
      ],
    },
    {
      title: t('skills.tools'),
      icon: Settings,
      skills: [
        { name: "Figma", level: 100 },
        { name: "Canva", level: 95 },
        { name: "Git/GitHub", level: 75 },
        { name: "MS Office", level: 70 },
      ],
    },
    {
      title: t('skills.soft'),
      icon: Brain,
      skills: [
        { name: language === 'ar' ? "التواصل" : "Communication", level: 90 },
        { name: language === 'ar' ? "حل المشكلات" : "Problem Solving", level: 80 },
        { name: language === 'ar' ? "قيادة الفريق" : "Team Leadership", level: 85 },
        { name: language === 'ar' ? "إدارة المشاريع" : "Project Management", level: 80 },
        { name: language === 'ar' ? "التوجيه" : "Mentoring", level: 85 },
      ],
    },
  ];

  const technologies = [
    "React Native", "TypeScript", "JavaScript", "HTML/CSS", "Prototyping", 
     "Motion", "Figma", "Figma Make", "Git", "Responsive Design", "UI/UX Design"
  ];

  return (
    <section id="skills" className="py-12 md:py-20 lg:py-24 relative">
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
            {t('skills.title')}
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {t('skills.subtitle')}
          </motion.p>
        </motion.div>

        {/* Skill Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 mb-12 md:mb-16 lg:mb-20">
          {skillCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="w-full"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-500 card-blur border-primary/20 hover:border-primary/40">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 flex-wrap">
                      <motion.div
                        className="p-3 rounded-xl bg-primary shadow-lg flex-shrink-0"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </motion.div>
                      <span className="text-lg sm:text-xl font-bold text-foreground">{category.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: categoryIndex * 0.1 + skillIndex * 0.1 
                        }}
                        viewport={{ once: true }}
                        className="space-y-2 md:space-y-3"
                      >
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-semibold text-foreground text-sm sm:text-base">{skill.name}</span>
                          <motion.span 
                            className="text-xs sm:text-sm font-bold text-white bg-primary px-2 py-1 rounded-full flex-shrink-0"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.1 + 0.3 }}
                            viewport={{ once: true }}
                          >
                            {skill.level}%
                          </motion.span>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-secondary/50 rounded-full h-2 md:h-3 overflow-hidden">
                            <motion.div
                              className="h-full bg-primary rounded-full relative"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              transition={{ 
                                duration: 1.2, 
                                delay: categoryIndex * 0.1 + skillIndex * 0.1 + 0.5,
                                ease: "easeOut"
                              }}
                              viewport={{ once: true }}
                            >
                              <motion.div
                                className="absolute left-0 top-0 bottom-0 w-1 md:w-2 bg-white/30 rounded-full"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Technology Tags */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.h3 
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 lg:mb-10 text-accent"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('skills.technologies')}
          </motion.h3>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-5">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 200
                }}
                viewport={{ once: true }}
              >
                <Badge 
                  variant="outline" 
                  className="px-3 sm:px-4 md:px-6 py-2 md:py-3 text-xs sm:text-sm md:text-base font-semibold hover:bg-accent hover:text-white hover:border-transparent transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl card-blur border-primary/30 text-foreground"
                >
                  {tech}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}