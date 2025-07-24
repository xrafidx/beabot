"use client";

import { useCallback, useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";
import { API_ENDPOINTS, BASE_URL } from "@/constants";
import { useParams } from "next/navigation";
import clsx from "clsx"; // pastikan ini di-install
import Image from "next/image";
// import { Avatar } from "@radix-ui/react-avatar";
import { UserCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

const vapi = new Vapi(process.env.NEXT_PUBLIC_API_KEY);

export default function VapiWorkflowButton() {
  const [isCalling, setIsCalling] = useState(false);
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState({ name: "Guest", email: "" });

  useEffect(() => {
    fetch(`${BASE_URL}${API_ENDPOINTS.USER_DATA}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser({ name: data.data.name, email: data.data.email });
      })
      .catch((err) => {
        console.error(`Failed to fetch user: ${err}`);
      });
  }, []);

  const [cards, setCards] = useState({ jenispertanyaan: "", userid: "", id: "", bahasa: "", judulinterview: "", namabeasiswa: "", banyakpertanyaan: "", imageurl: null as string | null });
  const params = useParams();
  const cardsId = params?.id;

  useEffect(() => {
    fetch(`${BASE_URL}${API_ENDPOINTS.BASE_INTERVIEW_CARD_BY_ID}/${cardsId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized Cards");
        return res.json();
      })
      .then((data) => {
        setCards({
          jenispertanyaan: data.data.jenispertanyaan,
          userid: data.data.userid,
          id: data.data.id,
          bahasa: data.data.bahasa,
          judulinterview: data.data.judulinterview,
          namabeasiswa: data.data.namabeasiswa,
          banyakpertanyaan: data.banyakpertanyaan ? String(data.banyakpertanyaan) : "", // Pastikan menjadi string
          imageurl: data.data.imageurl === undefined ? null : data.imageurl, // Pastikan penanganan null/undefined
        });
      })
      .catch((err) => {
        console.error(`Failed to fetch cards: ${err}`);
      });
  }, [cardsId]);

  const [questionList, setQuestionsList] = useState<string[]>([]);

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
        setQuestionsList(data.response || []);
      })
      .catch((err) => {
        console.error(`Failed to fetch questions: ${err}`);
      });
  }, [cards.id, cards.jenispertanyaan]);

  const updateInterviewStatus = useCallback(
    async (status: string) => {
      if (!cards.id) {
        console.warn("Tidak ada cards.id untuk memperbarui status interview.");
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.BASE_INTERVIEW_CARD_BY_ID}/${cards.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            namaBeasiswa: cards.namabeasiswa,
            interviewstatus: status,
            jenisPertanyaan: cards.jenispertanyaan,
            judulInterview: cards.judulinterview,
            bahasa: cards.bahasa,
            banyakPertanyaan: cards.banyakpertanyaan,
            imageurl: cards.imageurl,
            userid: cards.userid,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to update interview status: ${response.status}`);
        }
        console.log(`Interview status updated to ${status}`);
      } catch (error) {
        console.error("Error updating interview status:", error);
      }
    },
    [cards]
  );
  const startWorkflowCall = async () => {
    try {
      if (!user.name || !cards.id || !cards.bahasa || questionList.length === 0) {
        console.log("Workflow gagal dijalankan karena data belum lengkap.");
        return;
      }

      setIsCalling(true);

      await vapi.start(undefined, undefined, undefined, process.env.NEXT_PUBLIC_WORKFLOW_ID!, {
        variableValues: {
          name: user.name,
          email: user.email,
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
    const onCallEnd = async () => {
      setIsCalling(false);
      setAssistantSpeaking(false);
      setUserSpeaking(false);
      // 1. Update status interview di backend
      await updateInterviewStatus("INTERVIEW_COMPLETED"); // Pastikan ini ada di enum InterviewStatus Anda

      // 2. Simpan transkrip dan pemicu generate feedback
      // await saveInterviewResponseAndGenerateFeedback(currentTranscript);
      queryClient.invalidateQueries({ queryKey: ["userInterviews"] });
      queryClient.invalidateQueries({ queryKey: ["userInterviewsDashboard"] });
      router.push("/dashboard");
    };

    const onSpeechStart = () => setAssistantSpeaking(true);
    const onSpeechEnd = () => setAssistantSpeaking(false);
    const onVolumeLevel = (volume: number) => {
      // Jika volume dari user tinggi → mic aktif
      setUserSpeaking(volume > 0.01);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("volume-level", onVolumeLevel);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("volume-level", onVolumeLevel);
    };
  }, [cards, cards.id, updateInterviewStatus, router, queryClient]);

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen">
      {" "}
      {/* Mengembalikan min-h-screen untuk centering di viewport */}
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-lg md:max-w-xl lg:max-w-2xl">
        {" "}
        {/* Memperbesar max-w */}
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{cards.judulinterview}</h2>
            <h3 className="text-md sm:text-xl font-semibold text-gray-500">{cards.namabeasiswa}</h3>
          </div>

          {/* Kotak Deskripsi di kanan atas */}
          <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full border border-gray-200">{cards.jenispertanyaan}</span>
        </div>
        {/* Interviewer & User Cards */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
          {/* AI Interview Card */}
          <div
            className={clsx(
              "w-full max-w-[180px] md:max-w-[200px] aspect-square flex flex-col items-center justify-center rounded-xl border-4 transition-all duration-300 p-4", // Memperbesar max-w kartu
              assistantSpeaking && isCalling ? "border-purple-600 animate-pulse" : "border-gray-200" // Hanya pulse AI jika berbicara dan panggilan aktif
            )}>
            {/* Ikon AI (placeholder emoji). Ganti ini dengan komponen ikon atau gambar Anda */}
            <div className="text-purple-700 text-6xl mb-2">
              <Image src="/beabot-icon/beabot-logofun-ungu.png" alt="beabot icon" width={60} height={60}></Image>
            </div>
            {/* Memperbesar ukuran ikon */}
            {/* <p className="font-bold text-purple-700 text-lg text-center">AI Interview</p> Memperbesar ukuran teks */}
          </div>

          {/* User Card */}
          <div
            className={clsx(
              "w-full max-w-[180px] md:max-w-[200px] aspect-square flex flex-col items-center justify-center rounded-xl border-4 transition-all duration-300 p-4", // Memperbesar max-w kartu
              !assistantSpeaking && isCalling ? "border-purple-600 animate-pulse" : "border-gray-200" // Hanya pulse user jika berbicara dan panggilan aktif
            )}>
            {/* Ikon User (placeholder emoji). Ganti ini dengan komponen ikon atau gambar Anda */}
            <div className="text-gray-500 text-6xl mb-2">
              <UserCircleIcon width={60} height={60}></UserCircleIcon>
            </div>{" "}
            {/* Memperbesar ukuran ikon */}
            <p className="font-bold text-gray-700 text-lg text-center">Kamu</p> {/* Memperbesar ukuran teks */}
          </div>
        </div>
        {/* Call Button */}
        <div className="w-full flex justify-center">
          <button
            onClick={isCalling ? stopCall : startWorkflowCall}
            className={clsx(
              "flex items-center justify-center gap-2",
              "w-full max-w-md", // Memperbesar max-w tombol
              "bg-purple-700 text-white font-semibold",
              "px-8 py-3 rounded-full", // Padding lebih besar, bentuk lebih bulat
              "transition-colors duration-200 hover:bg-purple-800",
              "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
              {
                "bg-red-600 hover:bg-red-700 focus:ring-red-500": isCalling, // Warna merah saat panggilan aktif (End Call)
              }
            )}>
            {isCalling ? "End Call" : "Start Call"}
          </button>
        </div>
      </div>
    </div>
  );
}
