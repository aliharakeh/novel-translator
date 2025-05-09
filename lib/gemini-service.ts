import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

// Define the types
export interface GeminiResponse {
    text: string;
    error?: string;
}

export const AVAILABLE_MODELS = [
    { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash 8b' },
];

class GeminiService {
    private apiKey: string | null = null;
    private model: string = 'gemini-2.0-flash-lite';
    private genAI: GoogleGenerativeAI | null = null;

    constructor() {
        // API key will be set by the user through the UI
        if (typeof window !== 'undefined') {
            this.model = localStorage.getItem('gemini_model') ?? 'gemini-2.0-flash-lite';
        }
    }

    setApiKey(apiKey: string) {
        this.apiKey = apiKey;
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Save the API key to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('gemini_api_key', apiKey);
        }
    }

    getApiKey(): string | null {
        // Try to get the API key from localStorage when the service is initialized
        if (!this.apiKey && typeof window !== 'undefined') {
            const savedApiKey = localStorage.getItem('gemini_api_key');
            if (savedApiKey) {
                this.setApiKey(savedApiKey);
            }
        }
        return this.apiKey;
    }

    setModel(model: string) {
        this.model = model;
        if (typeof window !== 'undefined') {
            localStorage.setItem('gemini_model', model);
        }
    }

    getModel(): string {
        return this.model;
    }

    async *generateContentStream(prompt: string, systemPrompt: string) {
        try {
            if (!this.apiKey) {
                yield 'Please set your Gemini API key in the settings.';
                return;
            }

            if (!this.genAI) {
                this.genAI = new GoogleGenerativeAI(this.apiKey);
            }

            const geminiModel = this.genAI.getGenerativeModel({
                model: this.model,
                safetySettings: [
                    {
                        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                ],
            });

            // Configure the generation
            const generationConfig = {
                temperature: 1,
                topP: 0.95,
                maxOutputTokens: 8192,
            };

            // Create a new chat for each interaction
            const chat = geminiModel.startChat({
                generationConfig,
                history: [
                    {
                        role: 'user',
                        parts: [{ text: systemPrompt }],
                    },
                    {
                        role: 'model',
                        parts: [{ text: "I'll follow these instructions." }],
                    },
                ],
            });

            const result = await chat.sendMessageStream(prompt);

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                yield chunkText;
            }
        } catch (error) {
            yield `Error generating content: ${
                error instanceof Error ? error.message : String(error)
            }`;
        }
    }
}

// Create a singleton instance
const geminiService = new GeminiService();
export default geminiService;
