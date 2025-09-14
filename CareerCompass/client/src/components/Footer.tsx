import { Facebook, Twitter, Instagram, Link, Youtube } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Link", icon: Link, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ];

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="font-heading font-bold text-xl text-primary">
              CareerPath
            </div>
            <p className="text-muted-foreground max-w-md">
              Empowering students to discover their potential and build successful careers through personalized guidance and proven methodologies.
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`link-footer-${link.name.toLowerCase().replace(" ", "-")}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Section */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Connect With Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid={`link-social-${social.name.toLowerCase()}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} CareerPath. All rights reserved. Built with ❤️ for students everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}