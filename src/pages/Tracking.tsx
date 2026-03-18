import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Search, Package, Loader2, CheckCircle2, Clock, Truck, MapPin } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const }
  })
};

const statusSteps = ["pending", "confirmed", "processing", "shipped", "in_transit", "delivered"];
const statusLabels: Record<string, string> = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  in_transit: "In Transit",
  delivered: "Delivered",
};
const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  confirmed: CheckCircle2,
  processing: Package,
  shipped: Truck,
  in_transit: MapPin,
  delivered: CheckCircle2,
};

const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!trackingNumber.trim()) return;
    setLoading(true);
    setSearched(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("tracking_number", trackingNumber.trim().toUpperCase())
      .maybeSingle();
    setOrder(data);
    setLoading(false);
  };

  const currentStep = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-16 px-4 bg-secondary text-secondary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h1 className="text-4xl md:text-5xl font-bold font-[Sora] mb-4" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            Track Your Package
          </motion.h1>
          <motion.p className="text-lg text-secondary-foreground/70" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            Enter your tracking number to see the status of your delivery.
          </motion.p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex gap-3 mb-12">
            <Input
              placeholder="Enter tracking number (e.g., PK20260318-A1B2C3D4)"
              value={trackingNumber}
              onChange={e => setTrackingNumber(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="text-base"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {!loading && searched && !order && (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No order found with that tracking number. Please check and try again.</p>
              </CardContent>
            </Card>
          )}

          {!loading && order && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-bold text-lg font-[Sora]">{order.tracking_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-medium">{order.destination_country === "CM" ? "Cameroon" : "United States"}</p>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="space-y-4">
                    {statusSteps.map((step, i) => {
                      const Icon = statusIcons[step];
                      const isActive = i <= currentStep;
                      const isCurrent = i === currentStep;
                      return (
                        <div key={step} className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCurrent ? "bg-primary text-primary-foreground" :
                            isActive ? "bg-primary/20 text-primary" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                              {statusLabels[step]}
                            </p>
                          </div>
                          {isCurrent && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Current</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 pt-6 border-t grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Customer</p>
                      <p className="font-medium">{order.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Status</p>
                      <p className="font-medium capitalize">{order.payment_status}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-muted-foreground">Shipping Address</p>
                      <p className="font-medium">{order.shipping_address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tracking;
