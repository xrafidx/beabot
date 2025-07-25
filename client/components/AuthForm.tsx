// AuthForm.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldErrors } from "react-hook-form"; // Import FieldErrors for type safety
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import FormField from "./FormField";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS, BASE_URL } from "@/constants"; // <<-- PASTIKAN BASE_URL DIIMPOR
import Cookies from "js-cookie"; // <<-- PERBAIKAN DI SINI: Import 'js-cookie' (singular)

// Define FormType if not already defined globally or in another type file
type FormType = "sign-in" | "register";

// Define the Zod schema based on the form type
const AuthFormSchema = (type: FormType) => {
  const baseSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
  });

  if (type === "register") {
    return baseSchema
      .extend({
        name: z.string().min(3, "Name must be at least 3 characters long."),
        confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long."),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
  } else {
    return z.object({
      email: baseSchema.shape.email,
      password: baseSchema.shape.password,
    });
  }
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = AuthFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      type === "register"
        ? {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }
        : {
            email: "",
            password: "",
          },
  });

  const onError = (errors: FieldErrors<z.infer<typeof formSchema>>) => {
    console.log("Validation errors detected (onError callback):", errors);
    const firstErrorKey = Object.keys(errors)[0] as keyof typeof errors;
    const errorMessage = errors[firstErrorKey]?.message;

    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.error("Please check the form for errors.");
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Panggilan ke backend eksternal Anda
      const externalBackendEndpoint = type === "register" ? `${BASE_URL}${API_ENDPOINTS.REGISTER}` : `${BASE_URL}${API_ENDPOINTS.SIGN_IN}`;

      let payload;
      if (type === "register") {
        payload = {
          name: (values as any).name,
          email: values.email,
          password: values.password,
        };
      } else {
        payload = {
          email: values.email,
          password: values.password,
        };
      }

      const externalResponse = await fetch(externalBackendEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include", // Tetap include jika backend eksternal Anda juga membaca/menyetel cookie
      });

      if (externalResponse.ok) {
        const data = await externalResponse.json();
        console.log("Server respons backend eksternal:", data);

        // ******************************************************
        // START: PANGGIL NEXT.JS API ROUTE UNTUK MENYETEL COOKIE
        if (data.accessToken) {
          // Pastikan backend eksternal mengirim accessToken di body
          const setCookieResponse = await fetch("/api/auth/set-cookie", {
            // Panggil API Route internal Next.js Anda
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ accessToken: data.accessToken }),
            // credentials: 'same-origin' atau tidak perlu karena ini same-origin
          });

          if (!setCookieResponse.ok) {
            const errorData = await setCookieResponse.json();
            console.error("Gagal menyetel cookie via Next.js API Route:", errorData);
            toast.error("Gagal menyimpan sesi. Mohon coba lagi.");
            return; // Hentikan alur jika cookie gagal disetel
          }
          console.log("Cookie accessToken berhasil disetel oleh Next.js API Route.");
          toast.success(`${type === "register" ? "Registered" : "Signed in"} successfully!`);
        } else {
          toast.error("Access token tidak diterima dari backend. Login gagal.");
          console.error("Backend response did not contain accessToken:", data);
          return;
        }
        // END: PANGGIL NEXT.JS API ROUTE UNTUK MENYETEL COOKIE
        // ******************************************************

        router.push(`${type === "register" ? "/sign-in" : "/dashboard"}`);
      } else {
        const errorData = await externalResponse.json();
        toast.error(`Failed to ${type === "register" ? "register" : "sign in"}: ${errorData.message || "An unknown error occurred."}`);
        console.error("Failed to send data to external backend:", errorData);
      }
    } catch (error) {
      toast.error(`An error occurred: ${error instanceof Error ? error.message : "Unknown error."}`);
      console.error("Network or unexpected error:", error);
    }
  }

  const isSignIn = type === "sign-in";
  return (
    <div>
      <div className="flex flex-row gap-2 justify-center mb-3">
        <Image src="/beabot-icon/beabot-logo-ungu-samping.png" alt="beabot logo" height={120} width={120}></Image>
      </div>
      <div className="card-border lg:min-w-[566px] shadow-2xl">
        <div className="flex flex-col gap-3 card py-14 px-10">
          <h6 className="text-purple-600 font-semibold">{isSignIn ? "Sign in to Beabot" : "Get started on Beabot"}</h6>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="w-full space-y-3 form">
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
