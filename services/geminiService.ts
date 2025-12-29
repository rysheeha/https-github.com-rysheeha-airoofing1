
import { GoogleGenAI, Chat } from "@google/genai";
import { MEGAN_SYSTEM_INSTRUCTION, IRC_EXPERT_PROMPT } from "../constants";
import { OperatingMode, ClaimMetadata, ProcessedFile } from "../types";

export class GeminiService {
  // Use GoogleGenAI type and follow strict initialization guidelines
  private genAI: GoogleGenAI;
  private chatSession: Chat | null = null;

  constructor() {
    // Fix: Initialize GoogleGenAI with the API key from process.env.API_KEY directly
    this.genAI = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async initializeChat(mode: OperatingMode, metadata: ClaimMetadata) {
    const fullSystemInstruction = `
      ${MEGAN_SYSTEM_INSTRUCTION}
      
      CURRENT OPERATING MODE: ${mode}
      
      CURRENT CLAIM DATA:
      Carrier: ${metadata.carrier || 'Unknown'}
      Claim #: ${metadata.claimNumber || 'Unknown'}
      Address: ${metadata.address || 'Unknown'}
      Date of Loss: ${metadata.dateOfLoss || 'Unknown'}
      Adjuster: ${metadata.adjuster || 'Unknown'}
      Desired Next Action: ${metadata.nextStep || 'Not specified'}

      ${IRC_EXPERT_PROMPT}
    `;

    // Fix: Using gemini-3-pro-preview for complex reasoning tasks
    this.chatSession = this.genAI.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: fullSystemInstruction,
      },
    });
  }

  async sendMessage(text: string, files: ProcessedFile[]) {
    if (!this.chatSession) {
      throw new Error("Chat not initialized");
    }

    // Build multi-part content including text and optional files
    const parts: any[] = [{ text }];
    
    for (const file of files) {
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: file.base64
        }
      });
    }

    // Fix: chat.sendMessage should take the 'message' parameter. 
    // Access response.text as a property, not a method.
    const response = await this.chatSession.sendMessage({
      message: { parts }
    });

    return response.text;
  }

  // Placeholder for future Live API implementation
  async connectLive(callbacks: {
    onMessage: (text: string) => void;
    onError: (e: any) => void;
  }) {
    console.log("Live audio connected...");
  }
}

export const gemini = new GeminiService();
