import prisma from '../config/prisma.js'
export async function findUser(email){
    try {
        const user = await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        return user;
    } 
    catch (error) {
        console.error("Database error in findUser:", error);
        throw error;
    }
}
export async function createUser(name,email,hashedPass){
    try {
    const newUser = await prisma.user.create({
  data: {
    name: name,
    email: email,
    hashedPassword: hashedPass,
  },
});
    return newUser;
    } 
    catch (error) {
        console.error('Database Error in createUser',error);
        throw error
    }
}