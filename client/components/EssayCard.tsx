import { EssayCardProps } from "@/Types";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import CardWrapper from "./CardWrapper";

const EssayCard = ({ id, uid, judulessay, tanggal, rating, completestatus }: EssayCardProps) => {
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
          <Button className="btn-primary">View Essay</Button>
        </div>
      </div>
    </CardWrapper>
  );
};

export default EssayCard;
