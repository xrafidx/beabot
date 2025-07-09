import ai from "../config/gemini.js";
import fs from 'fs';
export async function essayReviewPrompt(fileName){
    try {
    const contents = [
        { text: "" },
        {
            inlineData: {
                mimeType: 'application/pdf',
                data: Buffer.from(fs.readFileSync(`../../beabot/server/upload/${fileName}`)).toString("base64")
            }
        }
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents
    });
    return response.text
    } catch (error) {
        throw new Error("Error in essayReview services");
    }
}