import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-white">Ace your interviews and perfect your essays.</h2>
          <p className="text-lg">Practice on real interviews questions & get instant feedback.</p>
          <div className="flex flex-row gap-6 max-md:flex-col">
            <Button asChild className="btn-primary max-sm:w-full">
              <Link href="/interview">Start an Interview</Link>
            </Button>
            <Button asChild className="btn-primary max-sm:w-full">
              <Link href="/essay-review">Start Essay Review</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section Interviews yang udah diambil */}
      <section className="flex flex-col gap-4 mt-8">
        <h2 className="text-white">Your Interviews</h2>

        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id}></InterviewCard>
          ))}
        </div>
        {!dummyInterviews ? "" : <p>You haven`t taken any interviews yet.</p>}
      </section>

      {/* Interview yang belom dijalanin */}
      <section className="flex flex-col gap-6 mt-8">
        <h2 className="text-white">Take an Interview</h2>

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
