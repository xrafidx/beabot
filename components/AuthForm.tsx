// Ini buat ngerender AuthForm nya. Nanti ni file ngambil komponen dari FormField.tsx

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

const AuthFormSchema = (type: FormType) => {
  return z.object({
    name: type === "register" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: type === "register" ? z.string().min(8) : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
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
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "register") {
        console.log("Register", values);
      } else {
        console.log("Sign In", values);
      }
    } catch (error) {
      toast.error(`There was an error: ${error} `);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/globe.svg" alt="beabot logo" width={32} height={32}></Image>
          <h2 className="text-white">Beabot</h2>
        </div>
        <h3>Ace your interviews and perfect your essays.</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
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
        <p className="text-center">
          {isSignIn ? "Not registered to Beabot?" : "Registered on Beabot already?"}
          <Link href={!isSignIn ? "/sign-in" : "/register"} className="font-bold text-user-primary ml-1">
            {!isSignIn ? "Sign In" : "Register"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
