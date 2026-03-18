import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Package, Truck, Globe, Shield, Clock, HeadphonesIcon, ChevronRight, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] }
  })
};

const features = [
  { icon: Truck, title: "Express Delivery", desc: "Fast and secure shipping between the USA and Cameroon with real-time tracking." },
  { icon: Globe, title: "International Reach", desc: "Connecting two continents — we handle customs, documentation, and door-to-door delivery." },
  { icon: Shield, title: "Insured Packages", desc: "Every shipment is fully insured. Your goods are protected from pickup to delivery." },
  { icon: Clock, title: "On-Time Guarantee", desc: "We pride ourselves on punctuality. Track your delivery every step of the way." },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Our team is available around the clock via phone, email, or WhatsApp." },
  { icon: Package, title: "Shop & Ship", desc: "Browse our shop, purchase products, and have them delivered right to your doorstep." },
];

const Home = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="pt-24 pb-20 px-4 bg-gradient-to-br from-secondary via-secondary to-secondary/90 text-secondary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-primary blur-3xl" />
      </div>
      <div className="container mx-auto max-w-5xl text-center relative z-10 pt-12">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <MapPin className="w-4 h-4" /> USA ↔ Cameroon Delivery
          </span>
        </motion.div>
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 font-[Sora]"
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
        >
          We deliver your goods,{" "}
          <span className="text-primary">anywhere.</span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-secondary-foreground/70 max-w-2xl mx-auto mb-10"
          initial="hidden" animate="visible" variants={fadeUp} custom={2}
        >
          PK Logistics is your trusted partner for fast, reliable, and affordable delivery between the United States and Cameroon.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial="hidden" animate="visible" variants={fadeUp} custom={3}
        >
          <Button size="lg" className="text-base px-8" asChild>
            <Link to="/shop">Shop Now <ChevronRight className="w-4 h-4 ml-1" /></Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base px-8 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10" asChild>
            <Link to="/tracking">Track Package</Link>
          </Button>
        </motion.div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-12 px-4 border-b">
      <div className="container mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { value: "5K+", label: "Packages Delivered" },
          { value: "2", label: "Countries Served" },
          { value: "99%", label: "On-Time Rate" },
          { value: "24/7", label: "Customer Support" },
        ].map((s, i) => (
          <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
            <div className="text-3xl md:text-4xl font-bold text-primary font-[Sora]">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-[Sora]">Why Choose PK Logistics?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We make international shipping simple, safe, and affordable.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <Card className="h-full hover:shadow-lg transition-shadow border-border/60">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 font-[Sora]">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-4 bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-[Sora]">
          Ready to ship?
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-8">
          Browse our shop or contact us to get started with your delivery today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="text-base px-8" asChild>
            <Link to="/shop">Visit Shop</Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Home;
