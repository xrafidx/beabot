v; // app/api/upload-essay-pdf/route.ts
// Ini adalah API Route yang hanya untuk kebutuhan mocking sementara

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const essayFile = formData.get("essayAttachment") as File | null; // Ambil file dari FormData

    console.log("MOCK API: Menerima permintaan upload esai.");
    if (essayFile) {
      console.log(`MOCK API: File diterima - Nama: ${essayFile.name}, Ukuran: ${essayFile.size} bytes, Tipe: ${essayFile.type}`);
      // Di sini, di real API, Anda akan menyimpan file ke cloud storage (S3, Cloudinary, dll.)
    } else {
      console.log("MOCK API: Tidak ada file esai yang diterima.");
    }

    // Berikan respons sukses palsu
    return NextResponse.json(
      {
        success: true,
        message: "File esai berhasil diunggah (MOCK response).",
        fileName: essayFile ? essayFile.name : null,
        fileSize: essayFile ? essayFile.size : null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("MOCK API: Error saat mengunggah esai:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengunggah file esai (MOCK response).",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
