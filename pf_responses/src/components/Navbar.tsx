'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Menu, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y enlaces principales */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Logo
            </Link>
            <div className="hidden sm:flex space-x-6">
              <Link href="/" className="text-gray-900 hover:text-gray-700">
                Inicio
              </Link>
              <Link href="/about" className="text-gray-900 hover:text-gray-700">
                Nosotros
              </Link>
              <Link href="/contact" className="text-gray-900 hover:text-gray-700">
                Contacto
              </Link>
            </div>
          </div>

          {/* Menú de perfil */}
          <div className="hidden sm:flex items-center">
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {user?.avatar ? (
                    <img className="h-8 w-8 rounded-full" src={user.avatar} alt="User avatar" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link href="/app/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Perfil
                      </Link>
                      <Link href="/app" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login" className="text-gray-900 hover:text-gray-700">
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Menú móvil */}
          <div className="sm:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil expandido */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
              Inicio
            </Link>
            <Link href="/about" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
              Nosotros
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
              Contacto
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link href="/app/profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
                  Perfil
                </Link>
                <Link href="/app" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50">
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link href="/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
