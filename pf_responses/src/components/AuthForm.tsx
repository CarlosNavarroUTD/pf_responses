'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface AuthFormProps {
  type: 'login' | 'register';
}

interface FormError {
  field?: string;
  message: string;
}

export default function AuthForm({ type }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState<FormError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (type === 'login') {
        await login(formData.email, formData.password);
        router.push('/app');
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
        });
        router.push('/app');
      }
    } catch (err: any) {
      console.error('Error en autenticación:', err);
      let errorMessage = 'Ha ocurrido un error inesperado';
      
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (typeof data === 'object') {
          const firstErrorKey = Object.keys(data)[0];
          const firstError = data[firstErrorKey];
          errorMessage = Array.isArray(firstError) 
            ? firstError[0] 
            : firstError.toString();
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError({ message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error?.field === name) {
      setError(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:opacity-50"
          />
        </div>

        {type === 'register' && (
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>{type === 'login' ? 'Iniciando sesión...' : 'Registrando...'}</span>
            </div>
          ) : (
            type === 'login' ? 'Iniciar sesión' : 'Registrarse'
          )}
        </button>
      </form>
    </div>
  );
}