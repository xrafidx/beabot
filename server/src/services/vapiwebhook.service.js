import { getQuestion } from "../repositories/question.repositories.js";
import { jsonParser } from "./essayReview.services.js";
import ai from '../config/gemini.js';

// {
//   "message": {
//     "type": "end-of-call-report",
//     "endedReason": "hangup",
//     "call": { Call Object },
//     "recordingUrl": "https://vapi-public.s3.amazonaws.com/recordings/1234.wav",
//     "summary": "The user picked up the phone then asked about the weather...",
//     "transcript": "AI: How can I help? User: What's the weather? ...",
//     "messages":[
//       {
//         "role": "assistant",
//         "message": "How can I help?",
//       },
//       {
//         "role": "user",
//         "message": "What's the weather?"
//       },
//       ...
//     ]
//   }
// }


export async function getInterviewData(cardsid){
    try {
        const questionData = await getQuestion(cardsid);
        return questionData; 
    } catch (error) {
        throw error;
    }

}

export async function saveFeedback(payload){
    const {cardsid,userid,transcript} = payload;
    try {
        // formatting transcript
        const formattedTranscript = transcript
        .map((sentence) => {
            `- ${sentence.role}: ${sentence.content}\n`
        }).join('');
        console.log(formattedTranscript)
        // AI prompt
        const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Anda adalah seorang penilai percakapan wawancara yang berpengalaman dan kritis untuk sebuah yayasan beasiswa bergengsi. Tugas Anda adalah memberikan analisis tajam dan konstruktif terhadap percakapan berikut.
        ${formattedTranscript}
Fokuslah pada aspek-aspek berikut:
1.  **Struktur dan Kejelasan (Skor 0-100):** Apakah jawabannya terstruktur dengan baik (misalnya, menggunakan metode STAR: Situation, Task, Action, Result)? Apakah mudah dipahami?
2.  **Relevansi dan Kedalaman (Skor 0-100):** Seberapa relevan jawaban tersebut dengan pertanyaan yang diajukan? Apakah kandidat memberikan detail dan bukti yang kuat?
3.  **Kekuatan Utama Jawaban:** Sebutkan 2-3 hal terbaik dari jawaban ini.
4.  **Area untuk Peningkatan:** Berikan 2-3 saran konkret tentang bagaimana kandidat bisa memperbaiki jawabannya.

Berikan output HANYA dalam format string JSON yang valid dan bisa langsung di-parse. JANGAN tambahkan teks pembuka, penutup, atau penjelasan apa pun di luar objek JSON. JANGAN gunakan format Markdown seperti \`\`\`json.

Gunakan struktur berikut:

{
  "struktur": integer,
  "relevansi": integer,
  "kekuatan": string[],
  "peningkatan": string[],
  "masukan": string[]
}`,
        config: {
        systemInstruction: `Anda adalah seorang ahli yang mampu memberikan penilaian yang komprehensif dan subjektif untuk percakapan interview beasiswa`,
        },
})
        const jsonmatch = response.text.match(/\{[\s\S]*\}/);
        


        
    } catch (error) {
        console.error("Error saving feedback");
        throw error;
    }
}

export async function saveInterviewResult(hangPayload){
    try {
        const interviewid = hangPayload.call.variables?.cardsid;
        const transcript = hangPayload.transcript;

        // ini verifikasi ada apa engga interview idnya
        if(!interviewid){
            console.warn("SERVICE: Tidak bisa menyimpan hasil, interviewId tidak ditemukan.");
            return;
        }

        // query ke db kalo ada cardsidnya.
    } catch (error) {
        console.error("Error on saveInterviewResult");
        throw error
        
    }
}



export async function handleFunctionCall(functionCallPayload){
    try {
        // ngambil nama fungsinya
        const {name} = functionCallPayload.functionCall;
        // ngambil nama variables
        const {parameters} = functionCallPayload.call;
        console.log(name,parameters);

        if(name === 'getInterviewData'){
            return getInterviewData(parameters.cardsid);
        }
        if(name === 'saveFeedback'){
            return saveFeedback(parameters.cardsid);
        }
        throw new Error(`Fungsi tidak dikenal: ${name}`);  
    } catch (error) {
        console.error("Error in handleFunctionCall services");
        throw error
    }
}