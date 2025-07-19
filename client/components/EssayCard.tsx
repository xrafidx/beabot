import { EssayCardProps } from "@/Types";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import CardWrapper from "./CardWrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/constants";
import Link from "next/link";

const EssayCard = ({ id, judulessay, tanggal, rating, completestatus }: EssayCardProps) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (essayIdToDelete: string) => {
      const response = await fetch(`http://localhost:5000${API_ENDPOINTS.ESSAY_REVIEW}/${essayIdToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal menghapus review: ${response.status}`);
      }
      return response.json();
    },

    onMutate: async (essayIdToDelete: string) => {
      await queryClient.cancelQueries({ queryKey: ["userEssaysDashboard"] });
      const previousEssays = queryClient.getQueryData<EssayCardProps[]>(["userEssaysDashboard"]);
      queryClient.setQueryData<EssayCardProps[]>(["userEssaysDashboard"], (old) => (old ? old.filter((essay) => essay.id !== essayIdToDelete) : []));
      toast.loading("Menghapus review...");
      return { previousEssays };
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Riwayat review berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["userEssaysDashboard"] });
    },

    onError: (err, essayIdToDelete, context) => {
      if (context?.previousEssays) {
        queryClient.setQueryData<EssayCardProps[]>(["userEssaysDashboard"], context.previousEssays);
      }
      toast.error(`Gagal menghapus interview: ${err.message}`);
      console.error("Error menghapus interview:", err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userEssaysDashboard"] });
    },
  });

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus riwayat review ini?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <CardWrapper>
      <div>
        <div className="absolute top-0 right-0 w-fit p-2 rounded-bl-lg bg-accent">
          <p className="badge-text text-black">Essay Review</p>
        </div>
      </div>

      <Image src="/covers/defaultScholarship.svg" alt="essay cover" width={90} height={90} className="rounded-full object-cover size-[90px]" />

      <h3 className="mt-5 capitalize">{judulessay} Essay</h3>

      <div className="flex flex-row gap-2">
        <p>{completestatus && rating !== null && rating !== undefined ? `Score: ${rating.toFixed(1)}` : "Review pending."}</p>
      </div>

      <div className="flex flex-row gap-5 mt-3">
        <div className="flex flex-row gap-2">
          <Image src="/calendar.svg" alt="calendar" width={22} height={22}></Image>
          <p>{tanggal}</p> {/* Gunakan formattedDate */}
        </div>

        <div className="flex flex-row gap-2 items-center">
          <Image src="/star.svg" alt="star" width={22} height={22}></Image>
          <p>{rating !== null && rating !== undefined ? rating.toFixed(1) : "---"}</p>
        </div>
      </div>

      <div className="flex flex-row gap-5 mt-3">
        <div className="flex flex-row justify-between">
          <Button className="btn-primary" asChild>
            <Link href={`/dashboard/essay-review/${id}/`} passHref>
              Lihat Essay
            </Link>
          </Button>

          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </div>
    </CardWrapper>
  );
};

export default EssayCard;
