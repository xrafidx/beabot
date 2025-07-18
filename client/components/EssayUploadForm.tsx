import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { resolve } from "path";
import React from "react";

import { z } from "zod";

const EssayUploadFormSchema = z.object({
  file:
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
      file: undefined,
    },
  });

  const { isSubmitting } = form.formState;

  return <div></div>;
};

export default EssayUploadForm;
