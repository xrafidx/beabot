import e from "express";
import { createCardsServices, getAllCardsServices, getSpecificCardsServices, deleteSpecificCardsServices, editSpecificCardsServices} from "../services/interviewCards.services.js";


export async function createCardsController(req,res,next){
    try {
        // ngambil response
        const data = req.body;
        // ambil id user
        const uid = req.user.sub;
        // call function create kartu
        const kartu = await createCardsServices(uid,data);
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
        // ngambil response
        const data = req.body;
        // ambil id usernya juga
        const uid = req.user.sub;
        // id kartu spesifik yang diinginkan
        const cardId = Number(req.params.id);
        // kartu baru yang udah diedit
        const kartu = await editSpecificCardsServices(cardId,uid,data);
        
        // respon sukses
        
        res.status(200).json({
            success:true,
            message:"Data berhasil diubah",
            data: kartu
        })
    } catch (error) {
        if(error.message == "Data tidak ditemukan"){
            res.status(404).json({
                success: false,
                message: "Data tidak ditemukan"
            })
        }
        else{
            next(error)
        }
    }
}

export async function deleteCardsController(req,res,next){
    try {
    // id kartu spesifik yang diinginkan untuk dihapus
    const cardId = Number(req.params.id);

    // id user yang minta
    const userId = req.user.sub;  
    
    // hapus kartu

    const kartu = await deleteSpecificCardsServices(userId,cardId);

    // respon sukses
    res.status(200).json({
        success:true,
        message:"Data berhasil dihapus",
        data: kartu
    })

    } catch (error) {
        if(error.message == "Data tidak ditemukan"){
            res.status(404).json({
                success: false,
                message: "Data tidak ditemukan"
            })
        }
        else{
            next(error)
        }
    }
}

export async function getCardsController(req,res,next){
    try {
        // ambil uid user yang minta
        const uid = req.user.sub;

        // call function buat ambil semua kartu yang dia punya
        const kartu = await getAllCardsServices(uid);

        // respon sukses
        res.status(200).json({
            success:true,
            message:"Data berhasil ditemukan",
            data: kartu
        })

    } catch (error) {
        next(error);
    }
}

export async function getCardByIdController(req,res,next){
    try {
    // id kartu spesifik yang diinginkan
    const cardId = Number(req.params.id);

    // id user yang minta
    const userId = req.user.sub;

    // call function buat ambil kartu yang spesifik

    const kartu = await getSpecificCardsServices(userId,cardId);
    
    // respon sukses
    res.status(200).json({
        success:true,
        message:"Data berhasil ditemukan",
        data: kartu
    })

    } catch (error) {
        if(error.message == "Data tidak ditemukan"){
            res.status(404).json({
                success: false,
                message: "Data tidak ditemukan"
            })
        }
        else{
          next(error)   
        }
    }
}