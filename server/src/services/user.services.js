
import { findUser } from "../repositories/user.repositories.js"
export async function getUserData(uid){
    try {
        const result =  await findUser(uid);
        return result;
    } catch (error) {
        console.error("Error in getUserData services");
        throw error;
    }
}