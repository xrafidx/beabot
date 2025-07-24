"use server";

import { BASE_URL } from "@/constants";
// import { redirect } from "next/dist/server/api-utils";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireUser() {
  const cookiesStore = cookies();
  const token = (await cookiesStore).get("token")?.value;
  console.log(token);

  const res = await fetch(`${BASE_URL}/api`, {
    method: "GET",
    headers: {
      Cookie: `token=${token}`,
    },
    cache: "no-store",
  });

  if (res.status !== 200) {
    redirect("/sign-in");
  }
  const user = await res.json();
  return user;
}
