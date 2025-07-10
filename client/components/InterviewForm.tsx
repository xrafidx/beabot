import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { string, z } from "zod";

const InterviewFormSchema = () => {
  const interviewSchema = z
    .object({
      judulInterview: z.string().min(1, "Please fill the Interview Title"),
      namaBeasiswa: z.string().min(1, "Please fill the scholarship name."),
      jenisPertanyaan: z.enum(["Regular", "Essay-driven"], {
        errorMap: () => ({ message: "Pilih jenis interview yang valid." }),
      }),
      banyakPertanyaan: z.number().min(1, "Jumlah pertanyaan minimal 1.").max(15, "Jumlah pertanyaan maksimal 15.").int("Masukkan angka bulat"),
      bahasaInterview: z.enum(["Bahasa Indonesia", "English"]),
      essayAttachment: typeof window === "undefined" ? z.any().optional() : z.instanceof(FileList).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.jenisPertanyaan === "essay-driven") {
        if (!data.essayAttachment || data.essayAttachment.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "The essay file must be uploaded for the essay-driven interview.",
            path: ["essayAttachment"],
          });
        } else {
          const file = data.essayAttachment[0];

          if (file && file.type !== "application/pdf") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "The file must be uploaded in .pdf format.",
              path: ["essayAttachment"],
            });
          }
        }
      }
    });
};

const InterviewForm = () => {
  const router = useRouter();
  const formSchema = InterviewFormSchema();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      judulInterview: "",
      namaBeasiswa: "",
      jenisPertanyaan: "",
      banyakPertanyaan: "",
      bahasaInterview: "",
      essayAttachment: "",
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
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
    } catch (error) {}
    console.log(values);
  }
  return <div></div>;
};

export default InterviewForm;
