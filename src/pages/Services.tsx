import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Truck, Ship, Package, FileText, Warehouse, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const }
  })
};

const services = [
  { icon: Truck, title: "Door-to-Door Delivery", desc: "We pick up from your location in the USA and deliver right to your doorstep in Cameroon — or vice versa. No middlemen, no hassle.", price: "From $15/kg" },
  { icon: Ship, title: "Sea Freight", desc: "Affordable shipping for large and heavy items via sea cargo. Ideal for bulk orders, furniture, and appliances.", price: "From $5/kg" },
  { icon: Package, title: "Express Air Shipping", desc: "Need it fast? Our air freight service delivers within 5-7 business days. Perfect for urgent packages and documents.", price: "From $25/kg" },
  { icon: FileText, title: "Customs Clearance", desc: "We handle all customs documentation, duties, and clearance for both US and Cameroonian imports/exports.", price: "Included" },
  { icon: Warehouse, title: "Warehouse Storage", desc: "Store your goods in our secure warehouses in Houston or Douala until you're ready for delivery.", price: "From $50/month" },
  { icon: Package, title: "Shop & Ship", desc: "Purchase products from our online shop and have them shipped directly. We handle everything from checkout to delivery.", price: "Varies" },
];

const Services = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="pt-28 pb-16 px-4 bg-secondary text-secondary-foreground">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.h1 className="text-4xl md:text-5xl font-bold font-[Sora] mb-4" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          Our Services
        </motion.h1>
        <motion.p className="text-lg text-secondary-foreground/70 max-w-2xl mx-auto" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          Comprehensive logistics solutions tailored for USA–Cameroon shipping.
        </motion.p>
      </div>
    </section>

    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                    <s.icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 font-[Sora]">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">{s.desc}</p>
                  <div className="text-sm font-semibold text-primary">{s.price}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button size="lg" asChild>
            <Link to="/contact">Get a Quote <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Services;
