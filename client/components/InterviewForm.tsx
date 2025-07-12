"use client";

import { API_ENDPOINTS, INTERVIEW_LANGUAGE_OPTIONS, INTERVIEW_TYPES_OPTIONS } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Form } from "./ui/form";
import { FormInput } from "lucide-react";
import FormField from "./FormField";
import FormSelect from "./FormSelect";

const InterviewFormSchema = () => {
  const interviewSchema = z
    .object({
      judulInterview: z.string().min(1, "Please fill the Interview Title"),
      namaBeasiswa: z.string().min(1, "Please fill the scholarship name."),
      jenisPertanyaan: z.enum(["regular", "essay-driven"], {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formSchema = InterviewFormSchema();

  // 1. Define your form.
  const form = useForm<InterviewFormData>({
    resolver: zodResolver(InterviewFormSchema),
    defaultValues: {
      judulInterview: "",
      namaBeasiswa: "",
      jenisPertanyaan: "regular",
      banyakPertanyaan: 5,
      bahasaInterview: "id",
      essayAttachment: undefined,
    },
  });

  // Function to handle validation errors from React Hook Form
  // This function is called by form.handleSubmit ONLY when validation fails
  const onError = (errors: FieldErrors<InterviewFormData>) => {
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
  async function onSubmit(values: InterviewFormData) {
    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append("judulInterview", values.judulInterview);
    formData.append("namaBeasiswa", values.namaBeasiswa);
    formData.append("jenisPertanyaan", values.jenisPertanyaan);
    formData.append("banyakPertanyaan", String(values.banyakPertanyaan));
    formData.append("bahasa", values.bahasaInterview);

    if (values.essayAttachment && values.essayAttachment.length > 0) {
      formData.append("essayAttachment", values.essayAttachment[0]);
    }

    try {
      const response = await fetch(`http://localhost:5000${API_ENDPOINTS.CREATE_INTERVIEW_CARD}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          toast.error("Sesi anda tidak valid. Silahkan masuk kembali");
          router.push("/login");
          return;
        }
        throw new Error(errorData.message || `Gagal menyimpan data interview: ${response.status}`);
      }

      const result = await response.json();
      console.log("Interview berhasil dibuat:", result);
      toast.success("Interview berhasil dibuat!");
      form.reset();
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error saat submit form:", error);
      setSubmitError(error.message || "Terjadi kesalahan saat menyimpan data.");
      toast.error(error.message || "Gagal membuat interview.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const jenisInterviewWatch = form.watch("jenisPertanyaan");
  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Buat Interview Baru</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          {/* Judul Interview */}
          <FormField control={form.control} name="judulInterview" label="Judul Interview" type="text" placeholder="Contoh: Latihan Interview Beasiswa 1" description="Masukkan judul interview anda"></FormField>

          {/* Nama Beasiswa */}
          <FormField control={form.control} name="namaBeasiswa" label="Nama Beasiswa" type="text" placeholder="Contoh: Beasiswa Unggulan" description="Masukkan nama beasiswa"></FormField>

          {/* Banyak Pertanyaan */}
          <FormField control={form.control} name="banyakPertanyaan" label="Banyak Pertanyaan" type="number" placeholder="Contoh: 8" description="Tentukan banyaknya pertanyaan yang akan diajukan (maksimal : 15)."></FormField>

          {/* Jenis Interview */}
          <FormSelect control={form.control} name="jenisPertanyaan" label="Jenis Interview" options={INTERVIEW_TYPES_OPTIONS} description="Pilih jenis interview."></FormSelect>

          {/* Essay Attachment (cuma muncul kalo piih essay-driven) */}

          {/* Bahasa Interview */}
          <FormSelect control={form.control} name="bahasaInterview" label="Bahasa Interview" options={INTERVIEW_LANGUAGE_OPTIONS} description="Pilih bahasa yang digunakan dalam interview"></FormSelect>
        </form>
      </Form>
    </div>
  );
};

export default InterviewForm;
