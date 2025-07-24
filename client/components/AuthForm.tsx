// AuthForm.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldErrors } from "react-hook-form"; // Import FieldErrors for type safety
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image"; // If you are using Image from next/image
import Link from "next/link";
import FormField from "./FormField"; // Assuming this is your custom FormField component
import { toast } from "sonner"; // Assuming you have sonner installed and <Toaster /> in your layout
import { useRouter } from "next/navigation";
import { API_ENDPOINTS, BASE_URL } from "@/constants";

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
        path: ["confirmPassword"], // This path ensures the error message shows under the confirmPassword field
      });
  } else {
    // For 'sign-in', only include relevant fields from the base schema
    return z.object({
      email: baseSchema.shape.email,
      password: baseSchema.shape.password,
    });
  }
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = AuthFormSchema(type);

  // 1. Define your form with zodResolver and defaultValues
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", // Keep these even if optional, to ensure React Hook Form manages them
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Function to handle validation errors from React Hook Form
  // This function is called by form.handleSubmit ONLY when validation fails
  const onError = (errors: FieldErrors<z.infer<typeof formSchema>>) => {
    // Log all validation errors for debugging purposes in the console
    console.log("Validation errors detected (onError callback):", errors);

    // Get the message of the first error found
    const firstErrorKey = Object.keys(errors)[0] as keyof typeof errors;
    const errorMessage = errors[firstErrorKey]?.message;

    if (errorMessage) {
      toast.error(errorMessage); // Display the specific error message as a toast
    } else {
      toast.error("Please check the form for errors."); // Fallback message
    }
    // IMPORTANT: No 'return;' here, allow the component to render the form with error messages
  };

  // 2. Define a submit handler.
  // This function is called by form.handleSubmit ONLY when validation passes
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // At this point, the form data is already validated by Zod,
    // so no need to check form.formState.errors here.

    try {
      const endpoint = type === "register" ? `${BASE_URL}${API_ENDPOINTS.REGISTER}` : `${BASE_URL}${API_ENDPOINTS.SIGN_IN}`;

      let payload;

      if (type === "register") {
        // Ensure only relevant data is sent to the backend for registration
        payload = {
          name: values.name,
          email: values.email,
          password: values.password,
        };
      } else {
        // Ensure only relevant data is sent for sign-in
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
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`${type === "register" ? "Registered" : "Signed in"} successfully!`);
        console.log("Server response:", data);

        // Store token if provided by the backend
        // if (data.token) {
        //   localStorage.setItem("authToken", data.token);
        // }

        router.push(`${type === "register" ? "/sign-in" : "/dashboard"}`); // Redirect to the dashboard on success
      } else {
        const errorData = await response.json();
        // Display specific error message from the backend if available
        toast.error(`Failed to ${type === "register" ? "register" : "sign in"}: ${errorData.message || "An unknown error occurred."}`);
        console.error("Failed to send data:", errorData);
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
            {/* IMPORTANT: Pass both onSubmit and onError to form.handleSubmit */}
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
