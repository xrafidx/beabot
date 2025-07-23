import { getQuestion } from "../repositories/question.repositories.js";

export async function getInterviewData(cardsid){
    try {
        const questionData = await getQuestion(cardsid);
        return questionData; 
    } catch (error) {
        throw error;
    }

}

export async function saveInterviewResult(hangPayload){
    try {
        const interviewid = hangPayload.call.variables?.cardsid;
        const transcript = hangPayload.transcript;

        // ini verifikasi ada apa engga interview idnya
        if(!interviewid){
            console.warn("SERVICE: Tidak bisa menyimpan hasil, interviewId tidak ditemukan.");
            return;
        }

        // query ke db kalo ada cardsidnya.
    } catch (error) {
        console.error("Error on saveInterviewResult");
        throw error
        
    }
}

export async function handleFunctionCall(functionCallPayload){
    try {
        // ngambil nama fungsinya
        const {name} = functionCallPayload.functionCall;
        // ngambil nama variables
        const {variables} = functionCallPayload.call;

        if(name === 'getInterviewData'){
            return getInterviewData(variables.cardsid);
        }
        throw new Error(`Fungsi tidak dikenal: ${name}`);  
    } catch (error) {
        console.error("Error in handleFunctionCall services");
        throw error
    }
}