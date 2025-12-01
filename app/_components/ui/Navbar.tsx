"use client";
import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Articles", href: "#articles" },
    { name: "Contacts", href: "#contacts" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isMenuOpen ? "bg-black" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex justify-start">
            <p className="text-white text-m md:text-sm text-gray-400">
              Adribell Montes
            </p>
          </div>
          {/* Items de navegación - solo visible en desktop */}
          <div className="hidden lg:flex items-center gap-12">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white/80 text-sm hover:text-blue-400 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
          {/* Botón hamburguesa - solo visible en móvil */}
          <div className="lg:hidden flex-1 flex justify-end">
            <button
              onClick={toggleMenu}
              className="text-white p-2 hover:text-blue-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <HiX className="w-6 h-6 transform rotate-0 transition-transform duration-300" />
              ) : (
                <HiMenu className="w-6 h-6 transform rotate-0 transition-transform duration-300" />
              )}
            </button>
          </div>
          <div className="hidden lg:block flex-1"></div>
        </div>
        {/* Menú desplegable - solo visible en móvil */}
        <div
          className={`lg:hidden border-t border-white/10 overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className={`px-4 py-4 space-y-4 transform transition-all duration-300 ease-in-out ${
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0"
            }`}
          >
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className="block text-white/80 text-base hover:text-blue-400 transition-all duration-200 py-2 transform hover:translate-x-2"
                style={{
                  transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
                }}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
