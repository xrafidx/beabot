import { getQuestion } from "../repositories/question.repositories";

export async function getInterviewData(cardsid){
    try {
        const questionData = await getQuestion(cardsid);
        return questionData; 
    } catch (error) {
        
    }

}

export async function handleFunctionCall(functionCallPayload){
    try {
        const {name} = functionCallPayload.functionCall;
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