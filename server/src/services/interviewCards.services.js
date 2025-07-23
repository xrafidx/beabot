import { addCards, getAllCards, getSpecificCards, deleteSpecificCard, editSpecificCards, deleteFeedback, deleteQuestion} from "../repositories/cards.repositories.js";
import { format } from 'date-fns';
export async function createCardsServices(uid,data){
    try {
        // parsing data body
        let {judulInterview,namaBeasiswa,banyakPertanyaan,jenisPertanyaan,bahasa,imageurl} = data;
        // convert banyak pertanyaan
        banyakPertanyaan = Number(banyakPertanyaan);

        // initial status
        const intialstatus = "PENDING_QUESTIONS";

        // generate tanggal
        const tanggal = new Date();
        // call function buat bikin row baru di kartu.
        const result = await addCards(uid,namaBeasiswa,banyakPertanyaan,jenisPertanyaan,bahasa,judulInterview,tanggal,imageurl,intialstatus);
        return result;
    } catch (error) {
        throw error
    }
}
export async function getAllCardsServices(uid){
    try {
        const result = await getAllCards(uid);
        const originalDataArray = result;
        const newDataArray = originalDataArray.map((item)=>{
            let {id,judulinterview,namabeasiswa,tanggal,imageurl,jenisinterview,bahasa,status} = item; 
            // formatting tanggal
            tanggal = format(new Date(tanggal), 'MMM d, yyyy');

            const dataUntukRespons = {
                id: id,
                judulinterview,judulinterview,
                namabeasiswa:namabeasiswa,
                tanggal:tanggal,
                imageurl:imageurl,
                jenispertanyaan:jenisinterview,
                bahasa:bahasa,
                interviewstatus:status
            }
            return dataUntukRespons
        })
        return newDataArray;
    } catch (error) {
        throw error
    }
}

export async function getSpecificCardsServices(uid,cardId){
    try {
        const result = await getSpecificCards(uid,cardId);
        if(result.length < 1){
            throw new Error("Data tidak ditemukan");
        }
        let {id,judulinterview,namabeasiswa,tanggal,imageurl,jenisinterview,bahasa} = result[0];
        // formatting tanggal
        tanggal = format(new Date(tanggal), 'MMM d, yyyy');
        const dataUntukRespons = {
            id: id,
            judulinterview,judulinterview,
            namabeasiswa:namabeasiswa,
            tanggal:tanggal,
            imageurl:imageurl,
            jenispertanyaan:jenisinterview,
            bahasa:bahasa
        }
        return dataUntukRespons;
    } catch (error) {
        throw error;
    }
}

export async function deleteSpecificCardsServices(uid,cardId){
    try{
        // hapus kartu
        const result = await deleteSpecificCard(uid,cardId);
        if(result.length < 1){
            throw new Error("Data tidak ditemukan");
        }
        return result;
    }
    catch(error){
        throw error;
    }
}

export async function editSpecificCardsServices(cardId,uid,data){
    try {
        // parsing data body
        let {judulInterview,namaBeasiswa,banyakPertanyaan,jenisPertanyaan,bahasa,imageurl} = data;
        // convert banyak pertanyaan
        banyakPertanyaan = Number(banyakPertanyaan);
        // generate tanggal
        const tanggal = new Date();
        // call function buat edit kartu
        const result = await editSpecificCards(cardId,uid,namaBeasiswa,banyakPertanyaan,jenisPertanyaan,bahasa,judulInterview,tanggal,imageurl);
        if(result.length < 1){
            throw new Error("Data Tidak Ditemukan");
        }
        return result;
    } catch (error) {
        throw error
    }
}

export async function deleteSpecificFeedbackServices(cardId){
    try {
        const result = await deleteFeedback(cardId);
        return result;   
    } catch (error) {
        console.error("Error in deleteSpecificFeedbackServices");
        throw error;
    }

}

export async function deleteSpecificQuestionServices(cardId){
    try {
        const result = await deleteQuestion(cardId);
        return result;
    } catch (error) {
        console.error("Error in deleteSpecificQuestionServices");
        throw error;
    }
}