import { error } from "console";
import { essayReviewPrompt,jsonParser, hapusFile, getSpecificEssay, saveEssay, getAllEssay,deleteEssayService} from "../services/essayReview.services.js"

export async function essayReview(req,res,next){
    try {
        // PROMPT AI ESSAY REVIEW
        if(!req.file){
            console.error("File Not Found");
            throw new Error("File Not Found in essayReview");
        }
        // ambil id user
        const uid = Number(req.user.sub);
        const namaFile = req.file.originalname;
        const locfile = req.file.path;
        const rawResponseText = await essayReviewPrompt(locfile);
        const jsonMatch = rawResponseText.match(/\{[\s\S]*\}/)
        const parsedResponse = jsonParser(jsonMatch);
        await hapusFile(locfile);
        const simpanEssay = await saveEssay(uid,parsedResponse);
        res.status(201).json({
            success:true,
            message: "Data berhasil tersimpan",
            result: simpanEssay
        });
    } catch (error) {
        if(error.message === 'Error in essayReview services'){
            return res.status(502).json({
                success: false,
                message: 'Gagal memproses dokumen dengan layanan AI. Silakan coba lagi nanti.'
            });
        }
        next(error);
    }
}

export async function specificEssay(req,res,next){
    try {
        // ambil essay cards yang specific
        const essayid = Number(req.params.essayid);
        // ambil id user
        const uid = Number(req.user.sub);
        if(!essayid || !uid){
            console.error("essayid atau uid tidak ditemukan");
            throw new Error("essayid atau uid tidak ditemukan");
        }
        const essayCards = await getSpecificEssay(essayid,uid);
        // respon sukses
        res.status(200).json({
            success:true,
            message:"Data berhasil ditemukan",
            data: essayCards
        })
    } catch (error) {
        if(error.message == "Data tidak ditemukan"){
            res.status(404).json({
                success:false,
                message:"Data tidak ditemukan"
            })
        }
        else{
            next(error);  
        }
    }
}

export async function allEssay(req,res,next){
    try {
        // ambil id user
        const uid = req.user.sub;
         if(!uid){
            console.error("uid tidak ditemukan");
            throw new Error("uid tidak ditemukan");
        }
        const data = await getAllEssay(uid);
        // respon sukses
        res.status(200).json({
            success:true,
            message:"Data berhasil ditemukan",
            data: data
        })
    } catch (error) {
        next(error);
    }
}

export async function deleteEssay(req,res,next){
    try {
        // ambil essay cards yang specific
        const essayid = Number(req.params.essayid);
        // ambil id user
        const uid = Number(req.user.sub);
        if(!essayid || !uid){
            console.error("essayid atau uid tidak ditemukan");
            throw new Error("essayid atau uid tidak ditemukan");
        }
        const essayCards = await deleteEssayService(essayid,uid);
        // respon sukses
        res.status(200).json({
            success:true,
            message:"Data berhasil dihapus",
            data: essayCards
        })
    } catch (error) {
        if(error.message == "Data tidak ditemukan"){
            res.status(404).json({
                success:false,
                message: "Essay dengan ID tersebut tidak ditemukan atau bukan milik Anda."
            })
        }
        else{
            next(error);
        }
    }
}