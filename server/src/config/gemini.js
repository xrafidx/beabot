// IMPORT SDK Gemini
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config("../../.env");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default ai;
