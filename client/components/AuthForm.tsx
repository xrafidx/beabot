// AuthForm.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import FormField from "./FormField";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // <-- Tambahkan ini

const AuthFormSchema = (type: FormType) => {
  return z.object({
    name: type === "register" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: type === "register" ? z.string().min(8) : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter(); // <-- Inisialisasi router di sini
  const formSchema = AuthFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const endpoint = type === "register" ? "http://localhost:5000/register" : "http://localhost:5000/sign-in";

      let payload;

      if (type === "register") {
        payload = {
          name: values.name,
          email: values.email,
          password: values.password,
        };
      } else {
        payload = {
          email: values.email,
          password: values.password,
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`${type === "register" ? "Registrasi" : "Login"} berhasil!`);
        console.log("Response dari server:", data);

        // Setelah berhasil login/register
        // Simpan token jika backend mengembalikan token di body response
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }

        // <-- REDIRECT PENTING DI SINI -->
        router.push("/dashboard"); // Arahkan ke halaman dashboard
      } else {
        const errorData = await response.json();
        // Coba tampilkan pesan error yang lebih spesifik dari backend jika ada
        toast.error(`Gagal ${type === "register" ? "registrasi" : "login"}: ${errorData.message || "Terjadi kesalahan"}`);
        console.error("Gagal mengirim data:", errorData);
      }
    } catch (error) {
      toast.error(`Terjadi kesalahan: ${error instanceof Error ? error.message : "Tidak diketahui"} `);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div>
      <div className="flex flex-row gap-2 justify-center mb-3">
        <h2>Beabot</h2>
      </div>
      <div className="card-border lg:min-w-[566px] shadow-2xl">
        <div className="flex flex-col gap-3 card py-14 px-10">
          <h6 className="text-purple-600 font-semibold">{isSignIn ? "Sign in to Beabot" : "Get started on Beabot"}</h6>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3 form">
              {!isSignIn && <FormField control={form.control} name="name" label="Name" placeholder="Enter your name" type="text" description="For your display name"></FormField>}
              <FormField control={form.control} name="email" label="Email" placeholder="Enter your email" type="email" description={isSignIn ? "" : "For sign in and to receive latest newsletter"}></FormField>
              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder={isSignIn ? "Enter your password" : "Create a unique password"}
                type="password"
                description={isSignIn ? "" : "For authorizing when signing in"}></FormField>
              {!isSignIn && <FormField control={form.control} name="confirmPassword" label="Confirm Password" placeholder="Confirm your password" type="password" description="Enter the same password you just created"></FormField>}
              <Button className="btn" type="submit">
                {isSignIn ? "Sign In" : "Register on Beabot"}
              </Button>
            </form>
          </Form>
          <div className="text-dark text-center">
            <p>
              {isSignIn ? "Not registered to Beabot?" : "Registered on Beabot already?"}
              <Link href={!isSignIn ? "/sign-in" : "/register"} className="font-bold text-user-primary ml-1">
                {!isSignIn ? "Sign In" : "Register"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
