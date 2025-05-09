"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Loader2, AlertCircle, CircleCheckBig, X } from "lucide-react";
import Cookies from "js-cookie";

const FormSchema = z.object({
  operator: z.string().min(1, { message: "Por favor selecciona un operador" }),
});

export default function TransferPage() {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transferStatus, setTransferStatus] = useState(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      operator: "",
    },
  });

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const response = await fetch("/api/operators", {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",            
          },
          credentials: 'include' 
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setOperators(Array.isArray(data.operators) ? data.operators : []);

      } catch (err) {
        setError(err.message);
        console.error("Error fetching operators:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOperators();
  }, []);

  useEffect(() => {
    if (transferStatus) {
      const timer = setTimeout(() => {
        setTransferStatus(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [transferStatus]);

  async function onSubmit(data) {
    try {
      if (!data.operator) {
        throw new Error("No se seleccionó ningún operador");
      }
  
      const selectedOperator = operators.find(op => op._id === data.operator);
      
      if (!selectedOperator) {
        throw new Error("Operador no encontrado en la lista");
      }
    
      const response = await fetch("/api/transfer", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        include: 'credentials',
        body: JSON.stringify({
          operatorId: selectedOperator._id,
          operatorName: selectedOperator.operatorName,
          transferUrl: selectedOperator.transferAPIURL,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setTransferStatus('error');
        throw new Error(errorData.message || "Error en la respuesta del servidor");
      }
  
      const result = await response.json();
      console.log("Respuesta exitosa:", result);
      setTransferStatus('success');
      form.reset();
  
    } catch (error) {
      console.log("Error en onSubmit:", error);
      setTransferStatus('error');
    }
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
      {/* Mostrar alerta SOLO cuando transferStatus tiene valor */}
      {transferStatus && (
          <Alert variant={transferStatus === 'error' ? 'destructive' : 'success'}>
              {transferStatus === 'error' ? (
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              ) : (
                <CircleCheckBig className="h-5 w-5 mt-0.5 flex-shrink-0" />
              )}
              
                <AlertTitle className="text-base font-semibold">
                  {transferStatus === 'error' ? 'Ocurrió un error' : '¡Transferencia exitosa!'}
                </AlertTitle>
                <AlertDescription>
                  {transferStatus === 'error'
                    ? 'No podemos comunicarnos con el operador que solicitaste, verifica que sea transferible. Inténtalo de nuevo en unos instantes.'
                    : 'Serás redirigido en unos instantes a la página de tu nuevo operador.'}
                </AlertDescription>
          </Alert>
      )}
      
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-md">
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
                    disabled={!operators || operators.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={
                          !operators || operators.length === 0 
                            ? "No hay operadores disponibles" 
                            : "Selecciona un operador"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(operators || []).map((operator) => (
                        <SelectItem                          
                          key={operator._id}
                          value={operator._id}
                        >
                          <div className="flex items-center">
                            {operator.operatorName}
                            {!operator.transferAPIURL ? 
                              <span className="text-xs text-gray-500 ml-2">(Sin URL)</span>                          
                              :
                              <span className="text-xs text-green-500 ml-2">(Transferible)</span>  
                            }
                          </div>
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
              disabled={!form.formState.isDirty || form.formState.isSubmitting || !operators || operators.length === 0}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verificar Operador
                </>
              ) : "Verificar Operador"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}