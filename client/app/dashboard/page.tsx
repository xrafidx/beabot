import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="card-cta flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Kontainer teks */}
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-2xl font-bold">Ace your interviews and perfect your essays.</h2>
          <p className="text-lg">Practice on real interview questions & get instant feedback.</p>
          <div className="flex flex-row gap-4">
            <Button asChild className="btn-primary">
              <Link href="/interview">Start an Interview</Link>
            </Button>
            <Button asChild className="btn-primary">
              <Link href="/essay-review">Start Essay Review</Link>
            </Button>
          </div>
        </div>

        {/* Hero image */}
        <div className="mt-6 lg:mt-0">
          <Image src="/hero.png" alt="hero section image" width={400} height={400} className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none" />
        </div>
      </section>

      {/* Section Interviews yang udah diambil */}
      <section className="flex flex-col gap-4 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id}></InterviewCard>
          ))}
        </div>
        {!dummyInterviews ? "" : <p>You haven`t taken any interviews yet.</p>}
      </section>

      {/* Interview yang belom dijalanin */}
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>

        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id}></InterviewCard>
          ))}

          {!dummyInterviews ? "" : <p>You haven`t taken any interviews yet.</p>}
        </div>
      </section>
    </>
  );
};

export default page;
