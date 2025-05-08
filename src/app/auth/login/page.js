"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Cookies from "js-cookie";

const formSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    setApiError("");
    try {
      const response = await fetch("https://api.marcianos.me/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      
      if (!response.ok)
        throw new Error(data.message || "Error al iniciar sesión");
      
      document.cookie = `accessToken=${data.accessToken}; path=/; secure; samesite=strict; max-age=3600`;
      document.cookie = `refreshToken=${data.refreshToken}; path=/; secure; samesite=strict; max-age=604800`;

      
      console.log(data);
      router.push("/home");
    } catch (error) {
      setApiError(error.message || "Error desconocido al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-700 min-h-screen flex items-center justify-center">
      <Button
        type="button"
        variant="ghost"
        className="absolute top-4 left-4 p-0 hover:bg-gray-600"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="text-white" />
      </Button>
      <div className="w-full max-w-md p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-gray-100 p-8 rounded-lg shadow-md space-y-6"
          >
            <h1 className="text-black text-center text-2xl font-bold">
              Iniciar Sesión
            </h1>
            <hr className="my-4 border-gray-300" />

            {/** Campos */}
            {["email", "password"].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">
                      {fieldName === "email" ? "Email" : "Contraseña"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={fieldName === "password" ? "password" : "text"}
                        placeholder={
                          fieldName === "email" ? "tu@email.com" : "••••••"
                        }
                        {...field}
                        className="bg-white text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {/** Botones */}
            <div className="flex space-x-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="submit"
                    className="bg-gray-800 hover:bg-gray-600 flex-1 max-w-xs cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? "Validando..." : "Iniciar Sesión"}
                  </Button>
                </AlertDialogTrigger>

                {apiError && (
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Error</AlertDialogTitle>
                      {apiError}
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction>Intentar de nuevo</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                )}
              </AlertDialog>

              <Button
                type="button"
                variant="outline"
                className="bg-gray-800 text-white hover:bg-gray-300 flex-1 cursor-pointer"
                onClick={() => router.push("/auth/register")}
              >
                Registrarse
              </Button>
            </div>

            {/** Link recuperación */}
            <div className="text-center">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 text-sm"
                onClick={() => router.push("/forgot-password")}
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
