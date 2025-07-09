import ai from "../config/gemini.js";
import fs from 'fs';
import fsp from 'fs/promises'; // Gunakan 'fs/promises'


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

Berikan output HANYA dalam format string JSON yang valid dan bisa langsung di-parse. JANGAN tambahkan teks pembuka, penutup, atau penjelasan apa pun di luar objek JSON. JANGAN gunakan format Markdown seperti \`\`\`json.

Gunakan struktur berikut:

{
  "nilai": number,
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
            console.log(parsedJson.nilai); // Output: 4
            return parsedJson;
        } catch (error) {
            throw new Error("Gagal mem-parse JSON dari respons AI.");
        }
    } 
    else {
        throw new Error("Tidak ditemukan format JSON yang valid dalam respons AI.");
    }
}