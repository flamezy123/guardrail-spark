import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Plus, Trash2, LogOut, Loader2, ImagePlus, ShoppingBag, Truck } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  weight: string;
  is_active: boolean;
  product_images: { id: string; image_url: string; display_order: number }[];
}

interface Order {
  id: string;
  tracking_number: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  destination_country: string;
  total: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({ name: "", description: "", price: "", category: "general", weight: "" });

  useEffect(() => {
    if (!authLoading && !user) navigate("/admin");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchOrders();
    }
  }, [user]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*, product_images(id, image_url, display_order)")
      .order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders(data || []);
  };

  const handleAddProduct = async () => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    const { error } = await supabase.from("products").insert({
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      weight: form.weight,
    });
    if (error) {
      toast.error("Failed to add product");
      return;
    }
    toast.success("Product added!");
    setForm({ name: "", description: "", price: "", category: "general", weight: "" });
    setAddOpen(false);
    fetchProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    toast.success("Product deleted");
    fetchProducts();
  };

  const handleImageUpload = async (productId: string, file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${productId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file);
    if (uploadError) {
      toast.error("Failed to upload image");
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);

    const existingImages = products.find(p => p.id === productId)?.product_images || [];

    await supabase.from("product_images").insert({
      product_id: productId,
      image_url: publicUrl,
      display_order: existingImages.length,
    });

    toast.success("Image uploaded!");
    setUploading(false);
    fetchProducts();
  };

  const handleDeleteImage = async (imageId: string) => {
    await supabase.from("product_images").delete().eq("id", imageId);
    toast.success("Image removed");
    fetchProducts();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    toast.success("Order status updated");
    fetchOrders();
  };

  const handleUpdatePaymentStatus = async (orderId: string, status: string) => {
    await supabase.from("orders").update({ payment_status: status }).eq("id", orderId);
    toast.success("Payment status updated");
    fetchOrders();
  };

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <span className="font-bold font-[Sora]">PK Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/admin"); }}>
            <LogOut className="w-4 h-4 mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products" className="gap-2"><ShoppingBag className="w-4 h-4" /> Products</TabsTrigger>
            <TabsTrigger value="orders" className="gap-2"><Truck className="w-4 h-4" /> Orders</TabsTrigger>
          </TabsList>

          {/* PRODUCTS TAB */}
          <TabsContent value="products">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-[Sora]">Products ({products.length})</h2>
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-1" /> Add Product</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle className="font-[Sora]">Add Product</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div><Label>Product Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                    <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Price (USD) *</Label><Input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
                      <div><Label>Weight</Label><Input value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} placeholder="e.g. 2kg" /></div>
                    </div>
                    <div><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div>
                    <Button className="w-full" onClick={handleAddProduct}>Add Product</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : products.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">No products yet. Click "Add Product" to get started.</CardContent></Card>
            ) : (
              <div className="space-y-4">
                {products.map(p => (
                  <Card key={p.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Images */}
                        <div className="flex gap-2 flex-wrap md:w-48 flex-shrink-0">
                          {p.product_images?.sort((a, b) => a.display_order - b.display_order).map(img => (
                            <div key={img.id} className="relative w-16 h-16 rounded overflow-hidden group">
                              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                              <button
                                onClick={() => handleDeleteImage(img.id)}
                                className="absolute inset-0 bg-destructive/70 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <label className="w-16 h-16 rounded border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4 text-muted-foreground" />}
                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(p.id, file);
                              e.target.value = "";
                            }} />
                          </label>
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold font-[Sora]">{p.name}</h3>
                              <p className="text-sm text-muted-foreground">{p.description || "No description"}</p>
                              <div className="flex gap-3 mt-2 text-sm">
                                <span className="font-medium text-primary">${p.price.toFixed(2)}</span>
                                <span className="text-muted-foreground">{p.category}</span>
                                {p.weight && <span className="text-muted-foreground">{p.weight}</span>}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteProduct(p.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders">
            <h2 className="text-xl font-bold font-[Sora] mb-6">Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">No orders yet.</CardContent></Card>
            ) : (
              <div className="space-y-4">
                {orders.map(o => (
                  <Card key={o.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-1">
                          <p className="font-semibold font-[Sora] text-sm">{o.tracking_number}</p>
                          <p className="text-sm">{o.customer_name} · {o.customer_phone}</p>
                          <p className="text-sm text-muted-foreground">{o.shipping_address}</p>
                          <p className="text-xs text-muted-foreground">
                            {o.destination_country === "CM" ? "🇨🇲 Cameroon" : "🇺🇸 USA"} · {o.payment_method} · ${o.total.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col gap-2 md:items-end">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Status:</span>
                            <Select value={o.status} onValueChange={v => handleUpdateOrderStatus(o.id, v)}>
                              <SelectTrigger className="w-36 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {["pending", "confirmed", "processing", "shipped", "in_transit", "delivered"].map(s => (
                                  <SelectItem key={s} value={s} className="text-xs capitalize">{s.replace("_", " ")}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Payment:</span>
                            <Select value={o.payment_status} onValueChange={v => handleUpdatePaymentStatus(o.id, v)}>
                              <SelectTrigger className="w-36 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {["pending", "paid", "failed", "refunded"].map(s => (
                                  <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
