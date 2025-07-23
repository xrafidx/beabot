"use client";

import { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";
import { API_ENDPOINTS, BASE_URL } from "@/constants";
import { useParams } from "next/navigation";

const vapi = new Vapi(process.env.NEXT_PUBLIC_API_KEY);

export default function VapiWorkflowButton() {
  const [isCalling, setIsCalling] = useState(false);

  // Buat ambil name
  const [user, setUser] = useState({ name: "Guest", email: "" });
  useEffect(() => {
    fetch(`${BASE_URL}${API_ENDPOINTS.USER_DATA}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        setUser({
          name: data.data.name,
          email: data.data.email,
        });
      })
      .catch((err) => {
        console.error(`Failed to fetch user: ${err}`);
      });
  }, []);

  // Buat ambil jenis pertanyaan, userid, bahasa
  const [cards, setCards] = useState({ jenispertanyaan: "", userid: "", id: "", bahasa: "" });
  const params = useParams();
  const cardsId = params.id;

  useEffect(() => {
    fetch(`${BASE_URL}${API_ENDPOINTS.BASE_INTERVIEW_CARD_BY_ID}/${cardsId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized Cards");
        }
        return res.json();
      })
      .then((data) => {
        setCards({
          jenispertanyaan: data.data.jenispertanyaan,
          userid: data.data.userid,
          id: data.data.id,
          bahasa: data.data.bahasa,
        });
      })
      .catch((err) => {
        console.error(`Failed to fetch cards: ${err}`);
      });
  }, [cardsId]); // <- tambahkan ini!

  // Buat ambil Questions
  const [questionList, setQuestionsList] = useState<string[]>([]);
  const jenisPertanyaanEndpoint = `${cards.jenispertanyaan === "regular" ? API_ENDPOINTS.GENERATE_REGULAR_QUESTION : API_ENDPOINTS.GENERATE_ESSAY_QUESTION}`;
  // const cardsIdForQuestion = cards.id;
  useEffect(() => {
    if (!cards.id || !cards.jenispertanyaan) return;

    const endpoint = cards.jenispertanyaan === "regular" ? API_ENDPOINTS.GENERATE_REGULAR_QUESTION : API_ENDPOINTS.GENERATE_ESSAY_QUESTION;

    fetch(`${BASE_URL}${endpoint}/${cards.id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized Question");
        return res.json();
      })
      .then((data) => {
        setQuestionsList(data.response || []); // <- sesuai struktur JSON kamu
      })
      .catch((err) => {
        console.error(`Failed to fetch questions: ${err}`);
      });
  }, [cards.id, cards.jenispertanyaan]);

  const startWorkflowCall = async () => {
    try {
      setIsCalling(true);
      await vapi.start(undefined, undefined, undefined, process.env.NEXT_PUBLIC_WORKFLOW_ID!, {
        variableValues: {
          name: user.name,
          email: user.email, // hardcode dulu
          cardsid: cards.id,
          bahasa: cards.bahasa,
          question: questionList.join(" | "),
        },
      });
    } catch (error) {
      console.error("Gagal memulai workflow:", error);
    }
  };

  const stopCall = () => {
    vapi.stop();
  };

  useEffect(() => {
    const onCallStart = () => setIsCalling(true);
    const onCallEnd = () => setIsCalling(false);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
    };
  }, []);

  return <button onClick={isCalling ? stopCall : startWorkflowCall}>{isCalling ? "Hentikan Panggilan" : "Mulai Interview (Workflow)"} 🎙️</button>;
}
