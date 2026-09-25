import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                CG<span className="text-emerald-400">Tourist</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering local communities and connecting travelers with certified, local tourist guides across Chhattisgarh—India's untamed green heart.
            </p>
            <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Raipur &bull; Bastar &bull; Surguja &bull; Sirpur
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/destinations" className="hover:text-emerald-400 transition">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link to="/guides" className="hover:text-emerald-400 transition">
                  Find Local Guides
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition">
                  About Chhattisgarh
                </Link>
              </li>
              <li>
                <Link to="/register?role=guide" className="hover:text-emerald-400 transition">
                  Register as a Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Regions */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Key Districts
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/destinations?district=Bastar" className="hover:text-emerald-400 transition">
                  Bastar (Chitrakote & Tirathgarh)
                </Link>
              </li>
              <li>
                <Link to="/destinations?district=Mahasamund" className="hover:text-emerald-400 transition">
                  Mahasamund (Sirpur Heritage)
                </Link>
              </li>
              <li>
                <Link to="/destinations?district=Kabirdham" className="hover:text-emerald-400 transition">
                  Kabirdham (Bhoramdeo Temple)
                </Link>
              </li>
              <li>
                <Link to="/destinations?district=Surguja" className="hover:text-emerald-400 transition">
                  Surguja (Mainpat Hill Station)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Mini-Project Info */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Student Project
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              B.Tech 5th-Semester Full Stack Mini-Project. Built with MongoDB, Express, React & Node.js.
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@cgtourist.local</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+91 771 241 0000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Chhattisgarh Tourist Guide Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Chhattisgarh Tourism
          </p>
        </div>
      </div>
    </footer>
  );
}
