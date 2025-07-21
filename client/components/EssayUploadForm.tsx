import { API_ENDPOINTS } from "@/constants";
import { BackendEssayData } from "@/Types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resolve } from "path";
import React from "react";
import { Form } from "@/components/ui/form";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";

import { z } from "zod";
import FormFileInput from "./FormFileInput";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { FileUp } from "lucide-react";

const EssayUploadFormSchema = z.object({
  essay:
    typeof window === "undefined"
      ? z.any().optional()
      : z
          .instanceof(FileList, { message: "Harap unggah file." })
          .refine((files) => files?.length > 0, "Harap unggah file essay dalam format .pdf")
          .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, "Ukuran file tidak boleh lebih dari 5MB.")
          .refine((files) => files?.[0]?.type === "application/pdf", "File harus dalam format .pdf"),
});

type EssayUploadFormData = z.infer<typeof EssayUploadFormSchema>;

const EssayUploadForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<EssayUploadFormData>({
    resolver: zodResolver(EssayUploadFormSchema),
    defaultValues: {
      essay: undefined,
    },
  });

  const { isSubmitting } = form.formState;

  const onError = (errors: FieldErrors<EssayUploadFormData>) => {
    console.log("Validation errors:", errors);
    const firstErrorKey = Object.keys(errors)[0] as keyof typeof errors;
    const errorMessage = errors[firstErrorKey]?.message;
    toast.error(errorMessage || "Mohon periksa form Anda.");
  };

  const essayMutation = useMutation({
    mutationFn: async (dataToUpload: EssayUploadFormData) => {
      const formData = new FormData();

      if (dataToUpload.essay && dataToUpload.essay.length > 0) {
        formData.append("essay", dataToUpload.essay[0]);
      } else {
        throw new Error("Tidak ada file yang diunggah");
      }

      const response = await fetch(`http://localhost:5000${API_ENDPOINTS.ESSAY_REVIEW}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal memproses esai: ${response.status}`);
      }
      return response.json();
    },

    onMutate: async (newEssayUpload: EssayUploadFormData) => {
      await queryClient.cancelQueries({ queryKey: ["userEssaysDashboard"] });

      const previousEssays = queryClient.getQueryData<BackendEssayData[]>(["userEssaysDashboard"]);

      const tempId = `temp-${Date.now()}`;
      const optimisticEssay: BackendEssayData = {
        id: tempId,
        userid: "temp-user",
        aireview: null,
      };

      queryClient.setQueryData<BackendEssayData[]>(["userEssaysDashboard"], (old) => {
        return old ? [optimisticEssay, ...old] : [optimisticEssay];
      });

      toast.loading("Esai sedang diunggah dan diproses oleh AI...");
      return { previousEssays };
      router.push("/dashboard");
    },

    onError: (err, newEssayUpload, context) => {
      if (context?.previousEssays) {
        queryClient.setQueryData<BackendEssayData[]>(["userEssaysDashboard"], context.previousEssays);
      }
      toast.error(`Gagal mengunggah esai: ${err.message}`);
      console.error("Error submit esai:", err);
      toast.dismiss();
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["userEssaysDashboard"] });
      toast.dismiss();
    },
  });

  const onSubmit = (values: EssayUploadFormData) => {
    essayMutation.mutate(values);
  };
  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Unggah Esai untuk Review</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col items-center justify-center gap-6 p-8 rounded-xl w-72 h-72 border-2 border-dashed border-[#753a88] bg-white shadow-md">
          <FileUp className="w-12 h-12 text-[#753a88]" />
          <FormFileInput control={form.control} name="essay" className="text-center text-sm text-gray-600" />
          <Button type="submit" disabled={isSubmitting} className="btn-primary">
            Upload
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EssayUploadForm;
