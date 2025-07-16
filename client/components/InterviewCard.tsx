"use client";

import React from "react";
import dayjs from "dayjs";
import { getCoverImage } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { BackendInterviewData, Feedback } from "@/Types";

const InterviewCard = ({ id, uid, judulinterview, namabeasiswa, jenispertanyaan, tanggal, rating }: BackendInterviewData) => {
  const feedback = null as Feedback | null;
  const formattedDate = dayjs(tanggal).format("MMM D, YYYY");
  return (
    // Bikin card
    <div className="card-border w-[360px] zmax-sm:w-full ">
      <div className="card-interview">
        <div>
          {/* Ini teks buat kategori interview */}
          <div className="absolute top-0 right-0 w-fit p-2 rounded-bl-lg bg-accent">
            <p className="badge-text text-black">{jenispertanyaan}</p>
          </div>
        </div>

        {/* Logo Instansi */}
        <Image src={getCoverImage(namabeasiswa)} alt="interview cover" width={90} height={90} className="rounded-full object-fit size-[90px]" />

        {/* Judul Interview */}
        <h3 className="mt-5 capitalize">{judulinterview}</h3>

        <div className="flex flex-row gap-2">
          {/* Summary singkat Interview */}
          <p>{feedback?.totalScore || "You haven't take this interview yet. Take it now to improve your skills."}</p>
        </div>

        {/* Icon Kalender */}
        <div className="flex flex-row gap-5 mt-3">
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" alt="calendar" width={22} height={22}></Image>
            <p>{formattedDate}</p>
          </div>

          {/* Icon Bintang */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" alt="star" width={22} height={22}></Image>
            <p>{rating || "---"}</p>
          </div>
        </div>

        <div className="flex flex-row gap-5 mt-3">
          <div className="flex flex-row justify-between">
            {/* <DisplayFieldLogo></DisplayFieldLogo> */}
            <Button className="btn-primary">View an interview</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
