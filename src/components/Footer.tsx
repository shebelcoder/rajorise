import Link from "next/link";
import Image from "next/image";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.png" alt="RajoRise" width={36} height={36} className="rounded-lg" />
              <span className="font-bold text-xl text-white">
                Rajo<span className="text-green-400">Rise</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Hope Into Life. Connecting donors worldwide with communities in need through transparency and real human stories.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span>Worldwide Impact</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/donate", label: "Donate Now" },
                { href: "/projects", label: "Projects" },
                { href: "/students", label: "Students" },
                { href: "/families", label: "Families" },
                { href: "/impact", label: "Impact Reports" },
                { href: "/stories", label: "Success Stories" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-green-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organization */}
          <div>
            <h3 className="font-semibold text-white mb-4">Organization</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/transparency", label: "Transparency" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Use" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-green-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-400" />
                <a href="mailto:hello@rajorise.org" className="hover:text-green-400 transition-colors">
                  hello@rajorise.org
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-400" />
                <span>hello@rajorise.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2">Payments secured by</p>
              <div className="flex items-center gap-2">
                <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">stripe</span>
                <span className="text-xs text-gray-500">SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 RajoRise. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for humanity
          </p>
        </div>
      </div>
    </footer>
  );
}
