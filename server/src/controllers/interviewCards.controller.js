import { createCardsServices } from "../services/interviewCards.services.js";


export async function createCardsController(req,res,next){
    try {
        // ambil respon buat create kartu
        const {namaBeasiswa,banyakPertanyaan,jenisPertanyaan,bahasa} = req.body;
        const convertedBanyakPertanyaan = Number(banyakPertanyaan)
        // ambil id usernya juga
        const uid = req.user.sub;
        // call function create kartu
        const kartu = await createCardsServices(uid,namaBeasiswa,convertedBanyakPertanyaan,jenisPertanyaan,bahasa);
        // respon sukses
        res.status(201).json({
            success:true,
            message:"Data berhasil ditambahkan",
            data: kartu
        })
    } catch (error) {
        next(error)
    }
}

export async function editCardsController(req,res,next){
    try {
        
    } catch (error) {
        
    }
}

export async function deleteCardsController(req,res,next){
    try {
        
    } catch (error) {
        
    }
}

export async function getCardsController(req,res,next){
    try {
        
    } catch (error) {
        
    }
}