import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Brain, Shield, BookOpen, Plug, ChevronRight, Sparkles, GraduationCap, BarChart3 } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const }
  })
};

const features = [
  {
    icon: Shield,
    title: "Socratic Guardrails",
    description: "Hard-coded logic prevents the AI from giving direct answers. Students derive solutions from first principles."
  },
  {
    icon: BookOpen,
    title: "Curriculum-Tethered AI",
    description: "Intelligence restricted to uploaded materials. Zero hallucinations, total syllabus alignment."
  },
  {
    icon: Plug,
    title: "LTI 1.3 Ready",
    description: "One-click institutional deployment into Canvas, Blackboard, and any LMS via LTI Advantage."
  },
  {
    icon: Brain,
    title: "Adaptive Reasoning",
    description: "Powered by high-reasoning, low-latency AI models that adapt questioning depth to each student."
  },
  {
    icon: BarChart3,
    title: "Engagement Analytics",
    description: "Teachers track per-student progress, session frequency, and topic mastery in real time."
  },
  {
    icon: Sparkles,
    title: "FERPA & GDPR Compliant",
    description: "AES-256 encryption, zero data retention on AI models, and full compliance out of the box."
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight font-[Space_Grotesk]">Neural Layer</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Demo</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">Teacher Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/demo">Try Demo</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <GraduationCap className="w-4 h-4" />
              AI-Powered Socratic Learning
            </span>
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            AI that <span className="text-primary">teaches</span>,{" "}
            <br className="hidden md:block" />
            not tells.
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            Neural Layer forces students to think from first principles. Teachers upload curriculum, the AI uses it as context — and never gives away the answer.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
          >
            <Button size="lg" className="text-base px-8" asChild>
              <Link to="/demo">
                Try the Demo <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8" asChild>
              <a href="mailto:contact@neurallayer.ai">Request a Demo</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Built for institutional rigor
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every feature is designed to enhance critical thinking — not replace it.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
              >
                <Card className="h-full hover:shadow-md transition-shadow border-border/60">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Simple, institutional pricing
            </h2>
            <p className="text-muted-foreground text-lg">
              Transparent costs. 85%+ projected net margin through vertical integration.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="relative overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Annual License</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">$3–$10</span>
                  <span className="text-muted-foreground">/student/year</span>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> Full Socratic AI access</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> Unlimited curriculum uploads</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> Teacher analytics dashboard</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> FERPA/GDPR compliance</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border-primary">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              <CardContent className="p-8">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Implementation</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">$2,500</span>
                  <span className="text-muted-foreground">one-time</span>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> LTI 1.3 integration setup</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> Custom LMS configuration</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> Staff onboarding & training</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> 30-day support period</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section id="demo" className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Experience it yourself
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Try our Socratic AI with sample curriculum — no login required.
          </p>
          <Button size="lg" className="text-base px-8" asChild>
            <Link to="/demo">
              Launch Demo <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold font-[Space_Grotesk]">Neural Layer</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Neural Layer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
