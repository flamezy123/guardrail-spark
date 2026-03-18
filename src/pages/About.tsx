import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Target, Eye, Users, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] }
  })
};

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="pt-28 pb-16 px-4 bg-secondary text-secondary-foreground">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.h1 className="text-4xl md:text-5xl font-bold font-[Sora] mb-4" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          About PK Logistics
        </motion.h1>
        <motion.p className="text-lg text-secondary-foreground/70 max-w-2xl mx-auto" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          Bridging the gap between the USA and Cameroon with reliable, affordable delivery services.
        </motion.p>
      </div>
    </section>

    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl font-bold font-[Sora] mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              PK Logistics was founded with a simple mission: make it easy and affordable for people in Cameroon and the USA to send and receive goods across the Atlantic.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              What started as a small family operation has grown into a trusted logistics company serving thousands of customers. We understand the unique challenges of shipping between these two countries, and we've built our entire operation around solving them.
            </p>
          </motion.div>
          <motion.div
            className="bg-accent rounded-2xl p-8 text-center"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          >
            <div className="text-5xl font-bold text-primary font-[Sora] mb-2">5,000+</div>
            <p className="text-accent-foreground font-medium">Packages successfully delivered</p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { icon: Target, title: "Our Mission", desc: "To provide fast, secure, and affordable delivery services connecting Cameroon and the United States." },
            { icon: Eye, title: "Our Vision", desc: "To become the leading logistics provider for the African diaspora, making global commerce accessible to everyone." },
            { icon: Users, title: "Our Team", desc: "A dedicated group of logistics professionals across two continents, committed to getting your packages there safely." },
            { icon: Award, title: "Our Values", desc: "Integrity, reliability, transparency, and customer satisfaction drive every decision we make." },
          ].map((item, i) => (
            <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 font-[Sora]">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
