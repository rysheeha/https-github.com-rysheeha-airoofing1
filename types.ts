
export enum OperatingMode {
  MODE_A = 'MODE A — Carrier Communication Drafting',
  MODE_B = 'MODE B — Homeowner Explanation',
  MODE_C = 'MODE C — Document Intelligence & Claim Build'
}

export interface ClaimMetadata {
  carrier: string;
  claimNumber: string;
  address: string;
  dateOfLoss: string;
  adjuster: string;
  nextStep: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  attachments?: string[];
  isAnalysis?: boolean;
}

export interface ProcessedFile {
  name: string;
  type: string;
  base64: string;
}
