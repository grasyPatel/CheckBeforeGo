import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => (
  <footer className="bg-gradient-to-r from-green-700 via-emerald-700 to-green-600 text-white py-8  shadow-inner">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Brand & tagline */}
      <div className="flex flex-col items-center md:items-start">
        <span className="text-2xl font-bold tracking-tight">CheckBeforeGo</span>
        <span className="text-sm mt-1 opacity-80">Your trusted doctor availability platform</span>
      </div>
      {/* Socials */}
      <div className="flex items-center gap-4">
        <a href="mailto:contact@checkbeforego.com" aria-label="Email" className="hover:text-green-200 transition">
          <Mail className="w-5 h-5" />
        </a>
        <a href="https://github.com/your-github" aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="hover:text-green-200 transition">
          <Github className="w-5 h-5" />
        </a>
        <a href="https://linkedin.com/in/your-linkedin" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="hover:text-green-200 transition">
          <Linkedin className="w-5 h-5" />
        </a>
      </div>
    </div>
    <div className="mt-8 text-center text-xs text-green-100 opacity-80">
      &copy; {new Date().getFullYear()} CheckBeforeGo. All rights reserved.
    </div>
  </footer>
);

export default Footer;