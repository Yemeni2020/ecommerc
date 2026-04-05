import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Shop: ["All Products", "Interior", "Exterior", "Performance", "Technology", "New Arrivals", "Gift Cards"],
  Company: ["About Us", "Our Story", "Careers", "Press", "Blog"],
  Support: ["Contact Us", "FAQ", "Shipping Info", "Returns", "Warranty", "Installation", "Track Order"],
};

export default function Footer() {
  return (
    <footer id="contact" className="bg-card border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">D</span>
              </div>
              <span className="font-display text-xl font-bold text-foreground tracking-tight">
                Drive<span className="text-primary">Luxe</span>
              </span>
            </a>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
              Saudi Arabia's premier destination for curated automotive accessories.
              Elevate every journey with premium quality.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                Riyadh, Saudi Arabia
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                +966 50 000 0000
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                info@driveluxe.sa
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    {link === "Track Order" ? (
                      <Link to="/track" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link}
                      </Link>
                    ) : link === "Gift Cards" ? (
                      <Link to="/gift-card" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link}
                      </Link>
                    ) : (
                      <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 DriveLuxe. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}