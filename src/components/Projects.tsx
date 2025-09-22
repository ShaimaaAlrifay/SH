import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Github, Star, Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "./LanguageProvider";
import drconsultancy from "../assets/drconsultancy.png";
import shomokhalmasah from "../assets/shomokhalmasah.png";
import sedrah from "../assets/sedrah.png";
import rifq from "../assets/rifq.png";
import coach from "../assets/coach.png";
import rawweq from "../assets/rawweq.png";
import Tatammman from "../assets/Tatamman.png";

export function Projects() {
  const { t } = useLanguage();
  const images = [
     drconsultancy,
     shomokhalmasah,
     sedrah,
     rifq,
     rawweq,
     coach,
     Tatammman,
  ];
  const liveUrl = [
     "https://www.figma.com/proto/ofSpFsma3x45aLOSzVnixM?node-id=0-1&t=PXkoVuzp65DFZWls-6",
     "https://shmokh-almasa.sa/",
     "https://www.figma.com/proto/5SS9Q2KN29q4210eXsLe8w/Sedrah-Study-case?page-id=0%3A1&node-id=1-2&node-type=canvas&viewport=376%2C320%2C0.27&t=BwWT1zPU8NX5YfE9-1&scaling=min-zoom&content-scaling=fixed",
     "https://www.figma.com/proto/UF8K9Je2hpXeuF61ukqs1q/%D8%B1%D9%90%D9%81%D9%82?page-id=0%3A1&node-id=1-773&node-type=canvas&viewport=-2400%2C1656%2C0.6&t=HxenCHZZCplELYWo-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A773",
     "https://www.figma.com/proto/D16CyAri2k81CSmXNgXbSS/rawweq?page-id=12%3A178&node-id=12-547&node-type=canvas&viewport=1628%2C-283%2C0.4&t=anVriJV8GSLvkMu0-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=13%3A5601",
     "https://www.figma.com/proto/1Kco7C1UYys7lFTFLGyvtH/coach?page-id=0%3A1&node-id=7-452&p=f&viewport=-131%2C-561%2C0.11&t=8ldQZRXiyx9biMWP-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=15%3A507",
     "https://www.figma.com/proto/MoiMna5njnIw6dRnAMMUI7/%D8%AA%D8%B7%D9%85%D9%91%D9%86?page-id=0%3A1&node-id=1-2&p=f&viewport=38%2C165%2C0.46&t=aMFKyP708qxu1Xxo-1&scaling=contain&content-scaling=fixed",
  ]
  const projectIds = [1, 2, 3, 4, 5, 6, 7];
  const projects = projectIds.map(id => {
    const technologies = t(`projects.${id}.technologies`);
    const featured = t(`projects.${id}.featured`);
    return {
      id,
      title: t(`projects.${id}.title`),
      description: t(`projects.${id}.description`),
      image: images[id - 1], 
      technologies: Array.isArray(technologies) ? technologies : typeof technologies === "string" ? technologies.split(",").map(s => s.trim()) : [],
      featured,
      liveUrl: liveUrl[id - 1], 
      category: t(`projects.${id}.category`),
    };
  });

  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);
  return (
    <section id="projects" className="py-20 bg-gradient-to-br from-secondary/10 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t("projects.title")}
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {t("projects.subtitle")}
          </motion.p>
        </motion.div>

        {/* Featured Projects */}
        <div className="space-y-20 mb-24">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative group overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-primary/5 to-accent/5 p-2"
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-100 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <motion.div
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      viewport={{ once: true }}
                    >
                      <Star className="h-5 w-5 text-primary fill-primary" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              <div className={`space-y-8 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-4"
                  >
                    <Badge variant="outline" className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 font-semibold">
                      {project.category}
                    </Badge>
                    <Zap className="h-4 w-4 text-primary" />
                  </motion.div>
                  <motion.h3 
                    className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
                    initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    {project.title}
                  </motion.h3>
                  <motion.p 
                    className="text-muted-foreground text-lg leading-relaxed"
                    initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {project.description}
                  </motion.p>
                </div>

                <motion.div 
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  {project.technologies.map((tech: string, techIndex: number) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: 0.5 + techIndex * 0.05,
                        type: "spring",
                        stiffness: 200
                      }}
                      viewport={{ once: true }}
                    >
                      <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 text-foreground hover:from-primary/30 hover:to-accent/30 transition-colors border-primary/20 font-medium">
                        {tech}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div 
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button asChild className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t("projects.view")}
                      </a>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other Projects */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h3 
            className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t("projects.more")}
          </motion.h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-500 group bg-card/80 backdrop-blur-sm border-primary/10 hover:border-primary/30 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 left-3 bg-white/90 text-[rgba(0,0,0,1)] font-semibold"
                    >
                      {project.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
        
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tech: string) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="text-xs hover:bg-primary/10 transition-colors"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                          +{project.technologies.length - 4} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button size="sm" asChild className="flex-1">
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          {t("projects.view")}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}