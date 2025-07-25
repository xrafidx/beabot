import { getNamaBeasiswa,getName,saveQuestion,getQuestion, updateCardstoGenerated } from "../repositories/question.repositories.js";
import fs from 'fs'
import ai from "../config/gemini.js";
import fsp from 'fs/promises'; // Gunakan 'fs/promises'


export async function hapusFile(datafile) {
  try {
    const locfile = datafile.path;
    await fsp.unlink(locfile);
    console.log(`File ${fileName} berhasil dihapus.`);
  } catch (error) {
    // Tangani error, misalnya jika file tidak ditemukan
    console.error(`Gagal menghapus file: ${error.message}`);
  }
}
//

export async function createRegQuestion(cardsId){
    try {
    // dapetin nama user
    const name = await getName(cardsId);
    // dapetin nama beasiswa dan banyak pertanyaan
    const {userid,namaBeasiswa,banyakPertanyaan,bahasa} = await getNamaBeasiswa(cardsId);
    
    // prompt ke ai buat bikin pertanyaan.
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Anda adalah seorang interviewer dari program beasiswa ${namaBeasiswa}. 
  Tugas Anda adalah membuat daftar pertanyaan wawancara untuk seorang mahasiswa bernama 
  ${name}. Buat pertanyaan dalam bahasa ${bahasa}
  Buatlah sebanyak ${banyakPertanyaan} pertanyaan.
  \n\nPERHATIKAN FORMAT OUTPUT DENGAN SANGAT SEKSAMA:\n\n1. 
  Output HARUS berupa teks mentah (raw text) JSON yang valid, 
  tanpa teks penjelasan atau pembungkus markdown (\`\`\`).\n
  2. Output HARUS berupa sebuah JSON array.\n3. Setiap pertanyaan individual HARUS menjadi satu elemen string terpisah di dalam array tersebut.
  \n\nContoh Format yang BENAR:\n[\n  \"Ini adalah pertanyaan pertama.\",\n  \"Ini adalah pertanyaan kedua.\",\n  \"Ini adalah pertanyaan ketiga.\"\n]\n
  \nContoh Format yang SALAH:\n[\n  \"Ini adalah pertanyaan pertama.\\n
  Ini adalah pertanyaan kedua.\"\n]\n\n
  Pastikan respons Anda dimulai dengan karakter \`[\` dan diakhiri dengan \`]\`.`,
        config: {
        systemInstruction: `Kamu adalah interviewer dari ${namaBeasiswa}, dan kamu akan membuat pertanyaan untuk seorang mahasiswa yang bernama ${name}, kamu akan mengajuk pertanyaan yang kritis dan dalam untuk mengetahui keseriusan dari mahasiswa tersebut dan menggali potensi dari mahasiswa tersebut dan visi msii dari mahasiswa tersebut. Gunakan bahasa ${bahasa}`,
        },
    });

    const rawData = response.candidates[0].content.parts[0].text
    // bikin tanggal
    const tanggal = new Date();
    // essaydriven
    const essayDriven = false;
    // save response ke DB
    const save = await saveQuestion(userid,cardsId,rawData,tanggal,essayDriven);
    // parsing json
    const parsedData = JSON.parse(rawData)
    return parsedData

    } catch (error) {
        console.error("Error in getNamaBeasiswa services");
        throw error
    }
}
export async function findRegQuestion(cardsid){
    try {
        const result = await getQuestion(cardsid);
        return result;
    } catch (error) {
        console.error("Error in findRegQuestion");
        throw error
    }
}

export async function createEssQuestion(cardsid,datafile){
    try {
        const locfile = datafile.path;
        // dapetin file name
        const fileName = datafile.filename;
        // dapetin nama user
        const name = await getName(cardsid);
        // dapetin nama beasiswa dan banyak pertanyaan
        const {userid,namaBeasiswa,banyakPertanyaan,bahasa} = await getNamaBeasiswa(cardsid);
    const contents = [
        { text: `Anda adalah seorang interviewer dari program beasiswa ${namaBeasiswa}. 
  Tugas Anda adalah membuat daftar pertanyaan wawancara untuk seorang mahasiswa bernama 
  ${name}. Buat pertanyaan dalam bahasa ${bahasa}
  Buatlah sebanyak ${banyakPertanyaan} pertanyaan. Pertanyaan diambil dari file essay PDF yang saya lampirkan.
  \n\nPERHATIKAN FORMAT OUTPUT DENGAN SANGAT SEKSAMA:\n\n1. 
  Output HARUS berupa teks mentah (raw text) JSON yang valid, 
  tanpa teks penjelasan atau pembungkus markdown (\`\`\`).\n
  2. Output HARUS berupa sebuah JSON array.\n3. Setiap pertanyaan individual HARUS menjadi satu elemen string terpisah di dalam array tersebut.
  \n\nContoh Format yang BENAR:\n[\n  \"Ini adalah pertanyaan pertama.\",\n  \"Ini adalah pertanyaan kedua.\",\n  \"Ini adalah pertanyaan ketiga.\"\n]\n
  \nContoh Format yang SALAH:\n[\n  \"Ini adalah pertanyaan pertama.\\n
  Ini adalah pertanyaan kedua.\"\n]\n\n
  Pastikan respons Anda dimulai dengan karakter \`[\` dan diakhiri dengan \`]\`.`
        },
        {
            inlineData: {
                mimeType: 'application/pdf',
                data: Buffer.from(fs.readFileSync(locfile)).toString("base64")
            }
        }
    ];
        // prompt ke ai buat bikin pertanyaan.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                    systemInstruction: `Kamu adalah interviewer dari ${namaBeasiswa}, dan kamu akan membuat pertanyaan untuk seorang mahasiswa yang bernama ${name}, kamu akan mengajuk pertanyaan yang kritis dan dalam untuk mengetahui keseriusan dari mahasiswa tersebut dan menggali potensi dari mahasiswa tersebut dan visi msii dari mahasiswa tersebut. Gunakan bahasa ${bahasa}`,
                    },
        });
        const rawDataResponse = response.candidates[0].content.parts[0].text
        // bikin tanggal
        const tanggal = new Date();
        // essaydriven
        const essayDriven = true;
        // save response ke DB
        const save = await saveQuestion(userid,cardsid,rawDataResponse,tanggal,essayDriven);
        // parsing json
        const parsedrawDataResponse = JSON.parse(rawDataResponse)
        // hapus file
        hapusFile(fileName);
        return parsedrawDataResponse;
    } catch (error) {
        console.error('error in createEssQuestion services');
        throw error
    }
}

export async function findEssQuestion(cardsid){
    try {
        const result = await getQuestion(cardsid);
        return result;
    } catch (error) {
        console.error("Error in findEssQuestion");
        throw error
    }
}

export async function updateCardsStatus(cardsId){
    try {
        const result = await updateCardstoGenerated(cardsId);
        return result;
    } catch (error) {
        console.error("Error in updateCardsStatus Services");
        throw error
    }
}
