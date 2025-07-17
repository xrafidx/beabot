"use client";
import React from "react";
import { Button } from "./ui/button";
import { DataStatusDisplayProps } from "@/Types";
import LoadingSpinner from "./LoadingSpinner";

const DataStatusDisplay: React.FC<DataStatusDisplayProps> = ({ isLoading, isError, error, onRetry, loadingMessage, errorMessage }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner></LoadingSpinner>
        <p className="text-center text-gray-500">{loadingMessage}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-red-500">
          {errorMessage}
          {error?.message && `(${error.message})`}
        </p>
        <Button onClick={onRetry} className="btn-primary mt-4">
          Try Again
        </Button>
      </div>
    );
  }
  return null;
};

export default DataStatusDisplay;
