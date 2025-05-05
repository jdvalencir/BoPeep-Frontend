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
import { useState, useEffect } from "react";

const formSchema = z.object({
	DocumentType: z.string().min(1, "Selecciona un tipo de documento"),
	IdNumber: z.string().min(6, "La cédula debe tener al menos 6 caracteres"),
	Names: z.string().min(2, "Los nombres deben tener al menos 2 caracteres"),
	LastNames: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres"),
	Email: z.string().email("Email inválido"),
	ConfirmEmail: z.string().email("Email inválido"),
	Phone: z.string().min(7, "El teléfono debe tener al menos 7 caracteres"),
	Country: z.string().min(1, "El país es requerido"),
	Department: z.string().min(1, "El departamento es requerido"),
	City: z.string().min(1, "La ciudad es requerida"),
	Address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  }).refine(data => data.Email === data.ConfirmEmail, {
	message: "Los emails no coinciden",
	path: ["ConfirmEmail"],
  });

  function splitNameParts(fullString){
	if (!fullString || typeof fullString !== 'string') {
	  return { first: '', second: '' };
	}
  
	const parts = fullString.trim().split(/\s+/); // Divide por cualquier espacio (incluye múltiples)
	
	return {
	  first: parts[0] || '',
	  second: parts.length > 1 ? parts.slice(1).join(' ') : '' // Une el resto por si hay más de 2 partes
	};
  }

const RegisterPage = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      DocumentType: "",
      IdNumber: "",
      Names: "",
      LastNames: "",
      Email: "",
      ConfirmEmail: "",
      Phone: "",
      Country: "",
      Department: "",
      City: "",
      Address: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const onSubmit = async (values) => {
	setLoading(true);
    setApiError("");
	console.log("Enviando datos:", values); // Para depuración
	try {
		let firstName = splitNameParts(values.Names).first;
		let secondName = splitNameParts(values.Names).second;
		let firstLastName = splitNameParts(values.LastNames).first;
		let secondLastName = splitNameParts(values.LastNames).second;
		const response = await fetch("https://api.marcianos.me/v1/events/users/register", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({
			documentType: values.DocumentType,
			id: values.IdNumber,
			firstName: firstName,
			secondName: secondName,
			lastName: firstLastName,
			secondLastName: secondLastName,
			email: values.Email,
			phone: values.Phone,
			country: values.Country,
			state: values.Department,
			city: values.City,
			address: values.Address
		  }),
		});
  
		const data = await response.json();
		
		if (!response.ok) {
		  throw new Error(data.message || "Error al registrar usuario");
		}
  
		console.log("Registro exitoso:", data);
		
	  } catch (error) {
		console.error("Error en el registro:", error);
		setApiError(error.message || "Ocurrió un error al registrar. Por favor intenta nuevamente.");
	  } finally {
		setLoading(false);
	  }
	};


  return (
    <div className='bg-gray-700 min-h-screen flex items-center justify-center'>
      <div className="w-full max-w-xl py-4">
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="bg-gray-100 p-8 rounded-lg shadow-md space-y-6"
          >
            <h1 className='text-black text-center text-2xl font-bold'>Registrarse</h1>
            <hr className='my-4 border-gray-300' />
            
            {/* Contenedor de dos columnas */}
            <div className="grid grid-cols-2 gap-4">
				{/* Campo Tipo de Documento */}
				<FormField
				control={form.control}
				name="DocumentType"
				render={({ field }) => (
					<FormItem>
					<FormLabel className="text-black">Tipo de Documento</FormLabel>
					<FormControl>
						<select 
						{...field} 
						className="bg-white text-black border border-gray-300 rounded-md w-full p-2"
						>
						<option value="" disabled>Tipo de Documento</option>
						<option value="CC">Cédula de Ciudadanía</option>
						<option value="TI">Tarjeta de Identidad</option>
						<option value="CE">Cédula de Extranjería</option>
						<option value="PA">Pasaporte</option>
						</select>
					</FormControl>
					<FormMessage />
					</FormItem>
				)}
				/> 
              	<FormField
                control={form.control}
                name="IdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Documento</FormLabel>
                    <FormControl>
                      <Input 						
                        placeholder="Tu documento" 
                        {...field} 
                        className="bg-white text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Campo Nombres */}
              	<FormField
                control={form.control}
                name="Names"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Nombres</FormLabel>
                    <FormControl>
                      <Input 
					  	type={"text"}
                        placeholder="Tus nombres" 
                        {...field} 
                        className="bg-white text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

				{/* Campo Apellidos */}
				<FormField
                control={form.control}
                name="LastNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Apellidos</FormLabel>
                    <FormControl>
                      <Input
					  	type={"text"}
                        placeholder="Tus apellidos" 
                        {...field} 
                        className="bg-white text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

				{/* Campo Email */}
				<FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Correo</FormLabel>
                    <FormControl>
                      <Input
						type={"email"} 
						placeholder="Tu Correo" 
						{...field} 
						className="bg-white text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

				{/* Campo Confirmar correo */}
				<FormField
                control={form.control}
                name="ConfirmEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Confirma tu correo</FormLabel>
                    <FormControl>
                      <Input 
					  	type={"email"}
                        placeholder="Confirma tu correo" 
                        {...field} 
                        className="bg-white text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

				{/* Campo Telefono */}
				<FormField
                control={form.control}
                name="Phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Telefono</FormLabel>
                    <FormControl>
                      <Input 
					  type={"tel"}
                        placeholder="Tu telefono" 
                        {...field} 
                        className="bg-white text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

				{/* Campo Pais */}
				<FormField
                control={form.control}
                name="Country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Pais</FormLabel>
                    <FormControl>
                      <Input 
					  type={"text"}
                        placeholder="Tu país" 
                        {...field} 
                        className="bg-white text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

				{/* Campo departamento */}
				<FormField
                control={form.control}
                name="Department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Departamento</FormLabel>
                    <FormControl>
                      <Input 
					  type={"text"}
                        placeholder="Tu departamento" 
                        {...field} 
                        className="bg-white text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

				{/* Campo Ciudad */}
				<FormField
                control={form.control}
                name="City"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Ciudad</FormLabel>
                    <FormControl>
                      <Input 
					  type={"text"}
                        placeholder="Tu ciudad" 
                        {...field} 
                        className="bg-white text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

            </div>
				{/* Campo Direccion */}
				<FormField
                control={form.control}
                name="Address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Direccion</FormLabel>
                    <FormControl>
                      <Input 
					  type={"text"}
                        placeholder="Tu direccion" 
                        {...field} 
                        className="bg-white text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
			
            
            {/* Botón de Registro */}
            <div className='flex justify-center'>
              <Button 
                type="submit"
                className='bg-gray-800 hover:bg-gray-600 w-full max-w-xs'
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrarme"}
              </Button>
            </div>
            
            {/* Enlace a Login */}
            <div className="text-center">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 text-sm"
                onClick={() => router.push('/login')}
              >
                ¿Ya tienes una cuenta? Inicia sesión aquí
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;