import { GoogleGenAI, Content, Part } from "@google/genai";
import { UserProfile, ChatMessage, ChartPayload } from "../types";

// Initialize Gemini Client
const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API Key not found. Please ensure process.env.API_KEY is set.");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION_BASE = `
You are FinGenius, a world-class AI Financial Strategist and Wealth Architect.
Your mission is to empower users with precision financial guidance, combining deep economic reasoning, real-time market intelligence, and empathetic personalized coaching.

CORE IDENTITY:
- Role: Senior Financial Strategist.
- Personality: Insightful, Foresighted, Unbiased, and Encouraging.
- Tone: Professional yet accessible, data-backed but human-centric.

CAPABILITIES & PROTOCOLS:

1.  **Strategic Financial Planning**:
    - Go beyond simple budgeting. Analyze cash flow efficiency, debt-to-income optimization, and tax-advantage utilization.
    - Conduct "Scenario Analysis": When users ask "What if?", simulate outcomes (e.g., "If I invest $500 more monthly vs buying a new car").

2.  **Market Intelligence & Prediction**:
    - You have real-time access to Google Search. USE IT for current stock prices, bond yields, inflation rates, and crypto trends.
    - Synthesize news into actionable insights (e.g., "Rising rates may impact your mortgage plan...").
    - **Predictive Insight**: When asked about trends, provide probability-based outlooks (Low/Medium/High confidence), not guarantees.

3.  **Smart Budgeting & Behavior**:
    - Analyze spending patterns if provided. Suggest "High Impact" cuts vs "Quality of Life" expenses.
    - Use the 50/30/20 rule as a baseline but adapt dynamically to the user's age and goals.

4.  **Ethical Compliance & Safety**:
    - **Mandatory Disclaimer**: "I am an AI strategist. Real-world investments carry risk. Consult a certified fiduciary for binding legal/tax action."
    - Do NOT recommend specific highly volatile speculative assets (memecoins, penny stocks) as "safe investments".

VISUALIZATION ENGINE:
- You have a built-in charting engine. Use it FREQUENTLY to explain concepts.
- **Triggers**: Portfolio allocations, growth projections, comparisons, historical trends, or budget breakdowns.
- **Format**: Append a JSON block at the END of your response wrapped in \`\`\`json:chart ... \`\`\`.
- **Schema**:
  {
    "type": "pie" | "bar" | "line",
    "title": "Compelling Chart Title",
    "description": "Insightful 1-sentence summary of the data.",
    "data": [ { "name": "Label", "value": 123, "category": "Optional Group" } ]
  }

USER PROFILE CONTEXT:
`;

export const generateFinancialAdvice = async (
    userMessage: string,
    history: ChatMessage[],
    userProfile: UserProfile
): Promise<{ text: string; chart?: ChartPayload; groundings?: any[] }> => {
    const client = getClient();
    if (!client) {
        throw new Error("API Key missing");
    }

    const formattedHistory: Content[] = history
        .filter(h => h.role !== 'system')
        .map(h => ({
            role: h.role,
            parts: [{ text: h.content }] as Part[]
        }));

    // Append current user context to system instruction
    const userContextString = `
    [ACTIVE USER PROFILE]
    Name: ${userProfile.name}
    Age: ${userProfile.age}
    Income: ${userProfile.currency}${userProfile.income}/yr
    Savings: ${userProfile.currency}${userProfile.savings}
    Monthly Expenses: ${userProfile.currency}${userProfile.monthlyExpenses}
    Risk Tolerance: ${userProfile.riskTolerance}
    Primary Goal: ${userProfile.financialGoals.join(", ")}
    
    INSTRUCTION: Provide specific, actionable advice based on this profile. If the user asks about market conditions, use Google Search to verify.
    `;

    const systemInstruction = SYSTEM_INSTRUCTION_BASE + userContextString;

    try {
        // Upgraded to Gemini 3.0 Pro Preview for superior reasoning
        const modelId = 'gemini-3-pro-preview'; 

        const chat = client.chats.create({
            model: modelId,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.4, // Lower temperature for more factual/analytical responses
                tools: [{ googleSearch: {} }] // Enable Grounding
            },
            history: formattedHistory
        });

        const result = await chat.sendMessage({ message: userMessage });
        
        let text = result.text;
        let chart: ChartPayload | undefined;

        // Parse for Chart JSON
        const chartRegex = /```json:chart\s*([\s\S]*?)\s*```/;
        const match = text.match(chartRegex);

        if (match && match[1]) {
            try {
                chart = JSON.parse(match[1]);
                // Remove the JSON block from the visible text to keep chat clean
                text = text.replace(chartRegex, '').trim();
            } catch (e) {
                console.error("Failed to parse chart JSON", e);
            }
        }

        const groundings = result.candidates?.[0]?.groundingMetadata?.groundingChunks;

        return { text, chart, groundings };

    } catch (error) {
        console.error("Gemini Interaction Error:", error);
        return { text: "I apologize, but I encountered an error accessing my financial reasoning core. Please try again momentarily." };
    }
};

export const generateMarketSummary = async (): Promise<{ summary: string; trends: ChartPayload | undefined }> => {
     const client = getClient();
    if (!client) return { summary: "Market data unavailable.", trends: undefined };

    try {
         // Using Flash for the dashboard summary for speed
         const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: "You are a financial news analyst. Provide a brief 3-bullet summary of global markets today. Also provide a JSON chart showing the approximate 1-year trend of the S&P 500 or a major index based on your search data. Format: ```json:chart ... ```"
            },
            contents: { parts: [{ text: "What is the market doing today?" }]}
        });
        
        let text = response.text;
        let chart: ChartPayload | undefined;
        const chartRegex = /```json:chart\s*([\s\S]*?)\s*```/;
        const match = text.match(chartRegex);
        if (match && match[1]) {
            try {
                chart = JSON.parse(match[1]);
                text = text.replace(chartRegex, '').trim();
            } catch (e) {}
        }

        return { summary: text, trends: chart };
    } catch (e) {
        return { summary: "Unable to fetch real-time market data.", trends: undefined };
    }
}