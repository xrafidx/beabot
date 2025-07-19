import { getUserData } from "../services/user.services.js";

export async function getUserController(req,res,next){
    try {
        // ambil id user
        const uid = Number(req.user.sub);
        const result = await getUserData(uid);

        res.status(200).json({
            success:true,
            message: "Data Ditemukan",
            data: result
        })
        
    } catch (error) {
        if(error.message == "Data Tidak Ditemukan"){
            res.status(404).json({
                success:false,
                message: "Data Tidak Ditemukan"
            })
        }
        else{
            next(error);  
        }
    }
}