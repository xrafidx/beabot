import { addCards, getAllCards, getSpecificCards, deleteSpecificCard, editSpecificCards} from "../repositories/cards.repositories.js";
export async function createCardsServices(uid,namaBeasiswa,convertedBanyakPertanyaan,jenisPertanyaan,bahasa,rating,judulInterview,tanggal){
    try {
        // call function buat bikin row baru di kartu.
        const result = await addCards(uid,namaBeasiswa,convertedBanyakPertanyaan,jenisPertanyaan,bahasa,rating,judulInterview,tanggal);
        return result;
    } catch (error) {
        throw error
    }
}
export async function getAllCardsServices(uid){
    try {
        const result = await getAllCards(uid);
        return result;
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
        return result;
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

export async function editSpecificCardsServices(cardId,uid,namaBeasiswa,convertedBanyakPertanyaan,jenisPertanyaan,bahasa,convertedRating,judulInterview,tanggal){
    try {
        // call function buat edit kartu
        const result = await editSpecificCards(cardId,uid,namaBeasiswa,convertedBanyakPertanyaan,jenisPertanyaan,bahasa,convertedRating,judulInterview,tanggal);
        if(result.length < 1){
            throw new Error("Data Tidak Ditemukan");
        }
        return result;
    } catch (error) {
        throw error
    }
}