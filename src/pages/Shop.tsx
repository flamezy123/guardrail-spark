import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, Package, Loader2 } from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const }
  })
};

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  weight: string;
  product_images: { image_url: string; display_order: number }[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", country: "CM", payment: "paypal"
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*, product_images(image_url, display_order)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const categories = ["all", ...new Set(products.map(p => p.category))];
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

  const handleCheckout = async () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const { data: order, error } = await supabase.from("orders").insert({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        shipping_address: form.address,
        destination_country: form.country,
        total,
        payment_method: form.payment,
        status: "pending",
        payment_status: "pending",
      }).select().single();

      if (error) throw error;

      await supabase.from("order_items").insert(
        cart.map(i => ({
          order_id: order.id,
          product_id: i.product.id,
          quantity: i.quantity,
          price: i.product.price,
        }))
      );

      toast.success(`Order placed! Tracking: ${order.tracking_number}`);
      setCart([]);
      setCheckoutOpen(false);
      setForm({ name: "", email: "", phone: "", address: "", country: "CM", payment: "paypal" });
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
    }
    setSubmitting(false);
  };

  const getProductImage = (p: Product) => {
    const imgs = p.product_images?.sort((a, b) => a.display_order - b.display_order);
    return imgs?.[0]?.image_url || "/placeholder.svg";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-16 px-4 bg-secondary text-secondary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h1 className="text-4xl md:text-5xl font-bold font-[Sora] mb-4" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            Shop
          </motion.h1>
          <motion.p className="text-lg text-secondary-foreground/70" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            Browse our products and have them delivered to your door.
          </motion.p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Filters & Cart */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c === "all" ? "All Categories" : c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="relative"
              onClick={() => cart.length > 0 && setCheckoutOpen(true)}
              disabled={cart.length === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({cart.length}) — ${total.toFixed(2)}
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No products available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((p, i) => (
                <motion.div key={p.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i % 4}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-muted overflow-hidden">
                      <img src={getProductImage(p)} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{p.category}</span>
                      <h3 className="font-semibold mt-1 font-[Sora]">{p.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{p.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-bold text-primary">${p.price.toFixed(2)}</span>
                        <Button size="sm" onClick={() => addToCart(p)}>Add to Cart</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-[Sora]">Checkout</DialogTitle>
          </DialogHeader>

          {/* Cart Items */}
          <div className="space-y-3 mb-4">
            {cart.map(i => (
              <div key={i.product.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{i.product.name}</span>
                  <span className="text-muted-foreground ml-2">× {i.quantity}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">${(i.product.price * i.quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(i.product.id)} className="text-destructive text-xs hover:underline">Remove</button>
                </div>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-3">
            <div>
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555 123 4567" />
            </div>
            <div>
              <Label>Delivery Address *</Label>
              <Textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Full delivery address" />
            </div>
            <div>
              <Label>Destination Country</Label>
              <Select value={form.country} onValueChange={v => setForm(f => ({ ...f, country: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CM">Cameroon</SelectItem>
                  <SelectItem value="US">United States</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select value={form.payment} onValueChange={v => setForm(f => ({ ...f, payment: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mtn_momo">MTN Mobile Money</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="visa">Visa / Mastercard</SelectItem>
                  <SelectItem value="cashapp">CashApp</SelectItem>
                  <SelectItem value="venmo">Venmo</SelectItem>
                  <SelectItem value="zelle">Zelle</SelectItem>
                  <SelectItem value="chime">Chime</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                After placing your order, we'll contact you with payment instructions for your selected method.
              </p>
            </div>
          </div>

          <Button className="w-full mt-4" onClick={handleCheckout} disabled={submitting}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Place Order — ${total.toFixed(2)}
          </Button>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Shop;
