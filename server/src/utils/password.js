import bcrypt from 'bcrypt';



// hash password
async function hashPass(plainTextPass){
    try {
        const saltRounds = Number(process.env.SALT_ROUNDS);
        const hashedPass = await bcrypt.hash(plainTextPass, saltRounds);
        console.log("DEBUG: Hashed Password Type (to Prisma):", typeof hashedPass);
        return hashedPass;
    } catch (error) {
        console.error("Hashing error:", error);
        throw error;
    }
}


//compare password
async function verifyPass(plainTextPass,hashedPass){
    try {
        return await bcrypt.compare(plainTextPass, hashedPass);
    } catch (error) {
        console.error("Password comparison error:", error);
        throw error;
    }
}

export {hashPass,verifyPass}