"use client";

import { EssayCardProps } from "@/Types";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import CardWrapper from "./CardWrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/constants";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

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
    },

    onError: (err, essayIdToDelete, context) => {
      if (context?.previousEssays) {
        queryClient.setQueryData<EssayCardProps[]>(["userEssaysDashboard"], context.previousEssays);
      }
      toast.error(`Gagal menghapus review: ${err.message}`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userEssaysDashboard"] });
    },
  });

  const handleDelete = () => {
    if (confirm("Yakin ingin menghapus review ini?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <CardWrapper>
      {/* Badge */}
      <div className="absolute top-0 right-0 w-fit p-2 rounded-bl-lg bg-[#753a88]">
        <p className="badge-text text-white">Essay Review</p>
      </div>

      {/* Judul */}
      <h3 className="mt-5 text-lg font-semibold capitalize">{judulessay} Essay</h3>

      {/* Info: Tanggal & Rating */}
      <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Image src="/calendar.svg" alt="calendar" width={18} height={18} />
          <span>{tanggal}</span>
        </div>
        <div className="flex items-center gap-2">
          <Image src="/star.svg" alt="star" width={18} height={18} />
          <span>Nilai: {rating !== null && rating !== undefined ? rating.toFixed(1) : "---"}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-between items-center">
        <Button className="btn-primary" asChild>
          <Link href={`/dashboard/essay-review/${id}/`} passHref>
            Lihat Essay
          </Link>
        </Button>

        {/* Dropdown More */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-700">
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardWrapper>
  );
};

export default EssayCard;
