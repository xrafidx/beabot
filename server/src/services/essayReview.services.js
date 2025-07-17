import ai from "../config/gemini.js";
import fs from 'fs';
import fsp from 'fs/promises'; // Gunakan 'fs/promises'
import { createEssay, searchSpecificEssay, searchAllEssay } from "../repositories/essayReview.repositories.js";


export async function hapusFile(fileName) {
  try {
    await fsp.unlink(`./upload/${fileName}`);
    console.log(`File ${fileName} berhasil dihapus.`);
  } catch (error) {
    // Tangani error, misalnya jika file tidak ditemukan
    console.error(`Gagal menghapus file: ${error.message}`);
  }
}
export async function essayReviewPrompt(fileName){
    try {
    const contents = [
        { text: `
Anda adalah seorang penilai esai yang berpengalaman dan kritis untuk sebuah yayasan beasiswa bergengsi. Tugas Anda adalah memberikan analisis tajam dan konstruktif terhadap teks esai berikut.

Fokuslah pada aspek-aspek berikut:
1.  **Tata Bahasa dan Ejaan**: Temukan semua kesalahan ketik, ejaan, dan penggunaan tata bahasa yang tidak tepat.
2.  **Struktur dan Alur Argumen**: Evaluasi bagaimana penulis membangun argumennya, dari pembuka hingga penutup.
3.  **Kejelasan dan Gaya Bahasa**: Nilai apakah kalimatnya jelas, efektif, dan tidak bertele-tele.
4.  **Substansi dan Kedalaman Isi**: Analisis kekuatan ide dan kedalaman pemikiran yang disampaikan.
5.  **Teknikal                   **: Analisis margin, font, spacing yang sekiranya sesuai.

Berikan output HANYA dalam format string JSON yang valid dan bisa langsung di-parse. JANGAN tambahkan teks pembuka, penutup, atau penjelasan apa pun di luar objek JSON. JANGAN gunakan format Markdown seperti \`\`\`json.

Gunakan struktur berikut:

{
  "judulessay": string,
  "rating": number,
  "kesalahan": string[],
  "kelebihan": string[],
  "masukan": string[]
}`
        },
        {
            inlineData: {
                mimeType: 'application/pdf',
                data: Buffer.from(fs.readFileSync(`../../beabot/server/upload/${fileName}`)).toString("base64")
            }
        }
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents
    });
    return response.text;
    } catch (error) {
        throw new Error("Error in essayReview services");
    }
}
export function jsonParser(jsonMatch){
    if (jsonMatch) {
        try {
            const jsonString = jsonMatch[0];
            // 3. Parse string JSON yang sudah bersih
            const parsedJson = JSON.parse(jsonString);
            const tanggalHariIni = new Date();
            const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            };
            const tanggalFormatted = tanggalHariIni.toLocaleDateString('en-US', options);
            const {judulessay,nilai,kesalahan,kelebihan,masukan} = parsedJson;
            const restructuredJson = {
                judulessay:judulessay,
                nilai:nilai,
                kesalahan:kesalahan,
                kelebihan:kelebihan,
                masukan:masukan,
                tanggal:tanggalFormatted
            }
            return restructuredJson;
        } catch (error) {
            throw new Error("Gagal mem-parse JSON dari respons AI.");
        }
    } 
    else {
        throw new Error("Tidak ditemukan format JSON yang valid dalam respons AI.");
    }
}

export async function getSpecificEssay(essayid,uid){
    try {
        const result = await searchSpecificEssay(essayid,uid);
        return result; 
    } catch (error) {
        console.error("Error pada getSpecificEssay services");
        throw error;
    }
}

export async function saveEssay(uid,data){
    try {
    const result = await createEssay(uid,data);
    return result;
    } catch (error) {
        console.error("Error pada saveEssay services");
        throw error;
    }
}

export async function getAllEssay(uid){
    try {
        const result = await searchAllEssay(uid);
        return result;
    } catch (error) {
        console.error("Error pada getAllEssay services");
        throw error;
    }
}

export async function deleteEssay(essayid,uid){
    
}