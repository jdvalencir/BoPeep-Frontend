"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";

const FormSchema = z.object({
  operator: z.string().min(1, { message: "Por favor selecciona un operador" }),
});

export default function TransferPage() {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      operator: "",
    },
  });

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        console.log()
        const response = await fetch("https://api.marcianos.me/v1/adapter/operators", {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",            
          },
          credentials: 'include' // esto deberia de agregar las cookies que tengan en http only, tratelo por este lado no quite el httponly 
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setOperators(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching operators:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOperators();
  }, []);

  function onSubmit(data) {
    console.log("Operador seleccionado:", data);
    // Aquí puedes agregar la lógica para manejar el operador seleccionado
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="mt-4">Cargando operadores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[80vh]">
        <p className="text-red-500">Error al cargar operadores: {error}</p>
        <Button 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[80vh] p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Selección de Operador</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="operator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operador</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={operators.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={
                          operators.length === 0 
                            ? "No hay operadores disponibles" 
                            : "Selecciona un operador"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {operators.map((operator) => (
                        <SelectItem 
                          key={operator.id} 
                          value={operator.id}
                        >
                          {operator.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={!form.formState.isDirty || form.formState.isSubmitting || operators.length === 0}
            >
              {form.formState.isSubmitting ? "Enviando..." : "Continuar"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}