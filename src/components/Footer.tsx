import { Link } from "react-router-dom";
import { Package, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Package className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-[Sora]">PK Logistics</span>
          </div>
          <p className="text-sm text-secondary-foreground/70 leading-relaxed">
            Your trusted delivery partner between Cameroon and the USA. Fast, reliable, and affordable shipping.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4 font-[Sora]">Quick Links</h4>
          <div className="space-y-2 text-sm text-secondary-foreground/70">
            <Link to="/" className="block hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="block hover:text-primary transition-colors">About Us</Link>
            <Link to="/services" className="block hover:text-primary transition-colors">Services</Link>
            <Link to="/shop" className="block hover:text-primary transition-colors">Shop</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 font-[Sora]">Support</h4>
          <div className="space-y-2 text-sm text-secondary-foreground/70">
            <Link to="/tracking" className="block hover:text-primary transition-colors">Track Package</Link>
            <Link to="/contact" className="block hover:text-primary transition-colors">Contact Us</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 font-[Sora]">Contact Info</h4>
          <div className="space-y-3 text-sm text-secondary-foreground/70">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>info@pklogistics.com</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary mt-0.5" />
              <span>Houston, TX, USA<br />Douala, Cameroon</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-secondary-foreground/10 pt-6 text-center text-sm text-secondary-foreground/50">
        © {new Date().getFullYear()} PK Logistics. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
