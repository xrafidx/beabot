import { EssayCardProps } from "@/Types";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";

const EssayCard = ({ id, uid, judulessay, tanggal, rating }: EssayCardProps) => {
  return (
    <div className="card-border w-[360px] zmax-sm:w-full">
      <div className="card-interview">
        <h3 className="mt-5">{judulessay}</h3>

        <div className="flexx flex-row gap-5 mt-3">
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" alt="calendar" width={22} height={22}></Image>
            <p>{tanggal}</p>
          </div>

          <div className="flex flex-row gap-2">
            <Image src="/star.svg" alt="rating" width={22} height={22}></Image>
            <p>{rating || "---"}</p>
          </div>

          <Button className="btn-primary">View Essay Summary</Button>
        </div>
      </div>
    </div>
  );
};

export default EssayCard;
