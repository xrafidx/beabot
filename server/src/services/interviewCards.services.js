import { addCards, getAllCards, getSpecificCards} from "../repositories/cards.repositories.js";
export async function createCardsServices(uid,namaBeasiswa,banyakPertanyaan,jenisPertanyaan,bahasa){
    try {
        // call function buat bikin row baru di kartu.
        const result = await addCards(uid,namaBeasiswa,banyakPertanyaan,jenisPertanyaan,bahasa);
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
        return result;
    } catch (error) {
        throw error
    }
}