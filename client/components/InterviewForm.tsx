"use client";

import { API_ENDPOINTS, BASE_URL, INTERVIEW_DURATION_OPTIONS, INTERVIEW_LANGUAGE_OPTIONS, INTERVIEW_TYPES_OPTIONS } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Form } from "./ui/form";
import FormField from "./FormField";
import FormSelect from "./FormSelect";
import FormFileInput from "./FormFileInput";
// Pastikan semua tipe ini diimpor, termasuk InterviewStatus
import { InterviewFormData, BackendInterviewData, InterviewCardProps, InterviewStatus } from "@/Types";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// Import mapper
import { mapBackendInterviewToCard } from "@/hooks/useFetchCardsData";

const InterviewFormSchema = z
  .object({
    judulInterview: z.string().min(1, "Harap isi Judul Interview."),
    namaBeasiswa: z.string().min(1, "Harap isi nama beasiswa."),
    jenisPertanyaan: z.enum(["regular", "essay-driven"], {
      errorMap: () => ({ message: "Pilih jenis interview yang valid." }),
    }),

    //     banyakPertanyaan: z.enum(["1", "3", "5"], { // -- HARUSNYA INI!
    //       errorMap: () => ({ message: "Pilih durasi interview yang valid." }),
    banyakPertanyaan: z.enum(["1", "3", "5"], {
      errorMap: () => ({ message: "Pilih durasi interview." }),
    }),
    bahasa: z.enum(["id", "en"]),
    essay:
      typeof window === "undefined"
        ? z.any().optional()
        : z
            .custom<FileList | undefined>((val) => val === undefined || val instanceof FileList, {
              message: "File tidak valid.",
            })
            .optional()
            .refine((files) => !files || files.length > 0, "Harap unggah file essay dalam format .pdf")
            .refine((files) => !files || files[0]?.size <= 5 * 1024 * 1024, "Ukuran file tidak boleh lebih dari 5MB.")
            .refine((files) => !files || files[0]?.type === "application/pdf", "File harus dalam format .pdf."),
  })
  .superRefine((data, ctx) => {
    if (data.jenisPertanyaan === "essay-driven") {
      if (!data.essay || data.essay.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File esai harus diunggah untuk interview berbasis esai.",
          path: ["essay"],
        });
      }
    }
  });

// Ganti nama komponen dari InterviewForm menjadi InterviewFormPage jika ini adalah file page.tsx
const InterviewForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<InterviewFormData>({
    resolver: zodResolver(InterviewFormSchema),
    defaultValues: {
      judulInterview: "",
      namaBeasiswa: "",
      jenisPertanyaan: "regular",
      banyakPertanyaan: "3",
      bahasa: "id",
      essay: undefined,
    },
  });

  const { isSubmitting } = form.formState;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onError = (errors: FieldErrors<InterviewFormData>) => {
    console.log("Validation errors detected (onError callback):", errors);
    const firstErrorKey = Object.keys(errors)[0] as keyof typeof errors;
    const errorMessage = errors[firstErrorKey]?.message;
    toast.error(errorMessage || "Mohon periksa form Anda.");
  };

  const createInterviewMutation = useMutation({
    mutationFn: async (values: InterviewFormData) => {
      const formData = new FormData();
      formData.append("judulInterview", values.judulInterview);
      formData.append("namaBeasiswa", values.namaBeasiswa);
      formData.append("jenisPertanyaan", values.jenisPertanyaan);
      formData.append("banyakPertanyaan", String(values.banyakPertanyaan));
      formData.append("bahasa", values.bahasa);

      if (values.jenisPertanyaan === "essay-driven" && values.essay && values.essay.length > 0) {
        formData.append("essay", values.essay[0]);
      }

      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.CREATE_INTERVIEW_CARD}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          toast.error("Sesi anda tidak valid. Silahkan masuk kembali");
          router.push("/sign-in");
          return;
        }
        throw new Error(errorData.message || `Gagal menyimpan data interview: ${response.status}`);
      }

      const result = await response.json();
      const cardId = result.data.id;
      console.log("Interview berhasil dibuat (API create cards):", result);
      toast.success("Interview berhasil dibuat!");

      if (values.jenisPertanyaan === "regular") {
        const generateResponse = await fetch(`${BASE_URL}${API_ENDPOINTS.GENERATE_REGULAR_QUESTION}/${cardId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            cardId: cardId,
            banyakPertanyaan: values.banyakPertanyaan,
            bahasa: values.bahasa,
          }),
        });
        if (!generateResponse.ok) {
          const errorData = await generateResponse.json();
          throw new Error(errorData.message || `Gagal generate pertanyaan reguler: ${generateResponse.status}`);
        }
        console.log("Pertanyaan reguler berhasil digenerate:", await generateResponse.json());
      } else if (values.jenisPertanyaan === "essay-driven") {
        const essayQuestionUpload = new FormData();
        essayQuestionUpload.append("cardId", cardId);
        if (values.essay && values.essay.length > 0) {
          essayQuestionUpload.append("essay", values.essay[0]);
        }
        essayQuestionUpload.append("banyakPertanyaan", String(values.banyakPertanyaan));
        essayQuestionUpload.append("bahasa", values.bahasa);

        const generateEssayResponse = await fetch(`${BASE_URL}${API_ENDPOINTS.GENERATE_ESSAY_QUESTION}/${cardId}`, {
          method: "POST",
          credentials: "include",
          body: essayQuestionUpload,
        });
        if (!generateEssayResponse.ok) {
          const errorData = await generateEssayResponse.json();
          throw new Error(errorData.message || `Gagal generate pertanyaan esai: ${generateEssayResponse.status}`);
        }
        console.log("Pertanyaan esai berhasil digenerate:", await generateEssayResponse.json());
      }
      return result;
    },
    onMutate: async (newInterviewData: InterviewFormData) => {
      await queryClient.cancelQueries({ queryKey: ["userInterviewsDashboard"] });
      const previousInterviews = queryClient.getQueryData<InterviewCardProps[]>(["userInterviewsDashboard"]);

      const tempId = `temp-${Date.now()}`;
      // KOREKSI: Buat objek optimisticInterview yang persis mencerminkan BackendInterviewData
      const optimisticInterview: BackendInterviewData = {
        id: tempId, // ID sementara (string)
        uid: "temp-user", // Mengikuti casing Anda
        judulinterview: newInterviewData.judulInterview, // Casing lowercase
        namabeasiswa: newInterviewData.namaBeasiswa, // Casing lowercase
        jenispertanyaan: newInterviewData.jenisPertanyaan as "regular" | "essay-driven", // Sesuaikan tipe
        banyakPertanyaan: Number(newInterviewData.banyakPertanyaan),
        bahasa: newInterviewData.bahasa,
        tanggal: new Date().toISOString(), // ISO string
        // rating: null, // <-- KOREKSI: Ganti 0 menjadi null untuk pending state
        complete: false,
        // KOREKSI: Tambahkan properti status
        interviewstatus: InterviewStatus.PENDING_QUESTIONS, // <-- TAMBAHKAN INI
      };

      // Map ke InterviewCardProps untuk konsistensi cache frontend
      const optimisticInterviewCard = mapBackendInterviewToCard(optimisticInterview);

      queryClient.setQueryData<InterviewCardProps[]>(["userInterviewsDashboard"], (old) => {
        return old ? [optimisticInterviewCard, ...old] : [optimisticInterviewCard];
      });

      toast.loading("Interview Anda sedang dipersiapkan...");
      return { previousInterviews };
    },
    onSuccess: (resultFromMainMutation, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["userInterviewsDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["userDashboard"] });

      toast.success("Interview berhasil dibuat dan pertanyaan sedang digenerate!");
      toast.dismiss();
      form.reset();
      router.push("/dashboard");
    },
    onError: (error, variables, context) => {
      if (context?.previousInterviews) {
        queryClient.setQueryData<InterviewCardProps[]>(["userInterviewsDashboard"], context.previousInterviews);
      }
      toast.error(`Gagal membuat interview: ${error.message}`);
      console.error("Error saat membuat interview:", error);
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["userInterviewsDashboard"] });
    },
  });

  const onSubmit = (values: InterviewFormData) => {
    createInterviewMutation.mutate(values);
  };

  const jenisInterviewWatch = form.watch("jenisPertanyaan");
  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Buat Interview Baru</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 shadow-sm">
            <FormField control={form.control} name="judulInterview" label="Judul Interview" type="text" placeholder="Contoh: Latihan Interview Beasiswa 1" description="Masukkan judul interview anda"></FormField>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 shadow-sm">
            <FormField control={form.control} name="namaBeasiswa" label="Nama Beasiswa" type="text" placeholder="Contoh: Beasiswa Unggulan" description="Masukkan nama beasiswa"></FormField>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 shadow-sm">
            <FormSelect // <-- KOREKSI: Gunakan FormSelect
              control={form.control}
              name="banyakPertanyaan"
              label="Durasi Interview" // <-- KOREKSI: Ubah label
              options={INTERVIEW_DURATION_OPTIONS} // <-- KOREKSI: Gunakan opsi baru
              description="Pilih durasi interview Anda." // <-- Sesuaikan deskripsi
            ></FormSelect>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 shadow-sm">
            <FormSelect control={form.control} name="jenisPertanyaan" label="Jenis Interview" options={INTERVIEW_TYPES_OPTIONS} description="Pilih jenis interview."></FormSelect>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 shadow-sm">
            <FormSelect control={form.control} name="bahasa" label="Bahasa Interview" options={INTERVIEW_LANGUAGE_OPTIONS} description="Pilih bahasa yang digunakan dalam interview"></FormSelect>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 shadow-sm">
            {jenisInterviewWatch === "essay-driven" && <FormFileInput control={form.control} name="essay" label="Unggah Esai (PDF)" accept=".pdf" description="Unggah esai Anda dalam format .pdf (maks. 5MB)"></FormFileInput>}

            {createInterviewMutation.isError && <p className="text-sm text-red-600">{createInterviewMutation.error?.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting || createInterviewMutation.isPending} className="btn-primary">
            {createInterviewMutation.isPending ? "Membuat Interview" : "Mulai Setup Interview"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InterviewForm;
