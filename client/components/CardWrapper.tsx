"use client";
import React from "react";

interface CardWrapperProps {
  children: React.ReactNode;
}

const CardWrapper: React.FC<CardWrapperProps> = ({ children }) => {
  return (
    <div className="card-border w-[360px] max-sm:w-full">
      <div className="card-interview">{children}</div>
    </div>
  );
};

export default CardWrapper;
