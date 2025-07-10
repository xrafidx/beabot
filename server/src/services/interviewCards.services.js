import { addCards } from "../repositories/cards.repositories.js";
export async function createCardsServices(uid,namaBeasiswa,banyakPertanyaan,jenisPertanyaan,bahasa){
    try {
        // call function buat bikin row baru di kartu.
        const result = await addCards(uid,namaBeasiswa,banyakPertanyaan,jenisPertanyaan,bahasa);
        return result;
    } catch (error) {
        throw error
    }
}