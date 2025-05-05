'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

const LoginPage = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values) => {
    console.log("hagan algo con esto ", values);

  };

  return (
    <div className='bg-gray-700 min-h-screen flex items-center justify-center'>
      <div className="w-full max-w-md p-4">
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="bg-gray-100 p-8 rounded-lg shadow-md space-y-6"
          >
            <h1 className='text-black text-center text-2xl font-bold'>Iniciar Sesión</h1>
            <hr className='my-4 border-gray-300' />
            
            {/* vvvv Campo Email vvvv  */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="tu@email.com" 
                      {...field} 
                      className="bg-white text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* vvvv Campo Contraseña vvvv */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Contraseña</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••" 
                      {...field} 
                      className="bg-white text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Botones */}
            <div className='flex space-x-4'>
              <Button 
                type="submit"
                className='bg-gray-800 hover:bg-gray-600 flex-1'
              >
                Iniciar sesión
              </Button>
              <Button 
                type="button"
                variant="outline"
                className='bg-gray-800 text-white hover:bg-gray-600 flex-1'
                onClick={() => router.push('/register')}
              >
                Registrarse
              </Button>
            </div>
            
            {/* Enlace olvidé contraseña pa despues*/}
            <div className="text-center">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 text-sm"
                onClick={() => router.push('/forgot-password')}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;