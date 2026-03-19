import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const }
  })
};

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error("Please fill in your name and message");
      return;
    }
    // Open WhatsApp or email
    const text = `Hello PK Logistics!\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage: ${form.message}`;
    window.open(`https://wa.me/237671929005?text=${encodeURIComponent(text)}`, "_blank");
    toast.success("Opening WhatsApp to send your message!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-16 px-4 bg-secondary text-secondary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h1 className="text-4xl md:text-5xl font-bold font-[Sora] mb-4" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            Contact Us
          </motion.h1>
          <motion.p className="text-lg text-secondary-foreground/70" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            Have questions? We'd love to hear from you. Reach out anytime.
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-5 gap-10">
            {/* Contact Info */}
            <div className="md:col-span-2 space-y-6">
              {[
                { icon: Phone, title: "Phone / WhatsApp", info: "+1 (781) 720-9466", sub: "+237 671 929 005" },
                { icon: Mail, title: "Email", info: "pklogistics884@gmail.com", sub: "" },
                { icon: MapPin, title: "Locations", info: "Douala, Cameroon", sub: "Bamenda, Cameroon" },
                { icon: Clock, title: "Business Hours", info: "Mon–Sat: 8AM – 8PM", sub: "Sunday: 10AM – 4PM" },
              ].map((item, i) => (
                <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                  <Card>
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm font-[Sora]">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.info}</p>
                        <p className="text-sm text-muted-foreground">{item.sub}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Contact Form */}
            <motion.div className="md:col-span-3" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <Card>
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-6 font-[Sora] flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" /> Send us a message
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name *</Label>
                        <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" />
                      </div>
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555 123 4567" />
                    </div>
                    <div>
                      <Label>Message *</Label>
                      <Textarea rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="How can we help you?" />
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      Send via WhatsApp
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Or email us directly at info@pklogistics.com
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
