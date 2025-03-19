// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { LayoutDashboard, Settings, Users, CheckSquare } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
      </div>
      <nav className="mt-4">
        <Link
          href="/app"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <LayoutDashboard className="w-5 h-5 mr-2" />
          Panel Principal
        </Link>
        <Link
          href="/app/teams"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <Users className="w-5 h-5 mr-2" />
          Equipos
        </Link>
        <Link
          href="/app/tasks"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <CheckSquare className="w-5 h-5 mr-2" />
          Tareas
        </Link>
        <Link
          href="/app/settings"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <Settings className="w-5 h-5 mr-2" />
          Configuración
        </Link>
      </nav>
    </aside>
  );
}
