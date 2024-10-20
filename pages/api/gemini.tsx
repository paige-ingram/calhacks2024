// BACKEND
import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { trace, Span } from "@opentelemetry/api";
import { SpanKind } from "@opentelemetry/api";
import { SemanticConventions, OpenInferenceSpanKind } from "@arizeai/openinference-semantic-conventions";

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const tracer = trace.getTracer('gemini-tracer');

// Hardcoded chat history
const hardcodedChatHistory = [
  {
    "type": "assistant_message",
    "message": {
      "role": "assistant",
      "content": "Good morning!"
    },
    "models": {
      "prosody": {
        "scores": {
          "excitement": 0.2081,
          "fear": 0.0455,
          "guilt": 0.0121,
          "joy": 0.1013,
          "sadness": 0.0258,
        }
      }
    },
    "receivedAt": "2024-10-19T23:01:49.193Z"
  },
  {
    "type": "user_message",
    "message": {
      "role": "user",
      "content": "Okay."
    },
    "models": {
      "prosody": {
        "excitement": 0.0293,
        "fear": 0.0366,
        "guilt": 0.0107,
        "joy": 0.0273,
        "sadness": 0.0258,
      }
    },
    "receivedAt": "2024-10-19T23:01:50.940Z"
  }
];

// Parse hardcoded chat log
const parseChatLog = (): string[] => {
  const simplifiedLog: string[] = hardcodedChatHistory
    .filter((item: any) => item.type === "assistant_message" || item.type === "user_message")
    .map((item: any) => `${item.type}: ${item.message.content}`);
  
  return simplifiedLog;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const textData = parseChatLog();

  // Start tracing the span
  return tracer.startActiveSpan(
    "gemini-chat",
    { kind: SpanKind.CLIENT },
    async (span: Span) => {
      try {
        const prompt = `Analyze this conversation: ${textData}`;

        // Set tracing attributes (Arize traces)
        span.setAttributes({
          [SemanticConventions.OPENINFERENCE_SPAN_KIND]: OpenInferenceSpanKind.CHAIN,
          [SemanticConventions.INPUT_VALUE]: prompt,
        });

        // Generate content using Gemini API
        const result = await model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            }
          ]
        });

        // Process and trace the result
        if (result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
          const summary = result.response.candidates[0].content.parts[0].text;

          // Set the output value in Arize trace
          span.setAttributes({
            [SemanticConventions.OUTPUT_VALUE]: summary,
          });

          // Log the traced summary
          console.log("Gemini API trace: ", summary);

          span.end();  // End the span
          return res.status(200).json({ summary });
        } else {
          span.end();
          return res.status(500).json({ error: "No summary found in the response." });
        }
      } catch (error) {
        span.end();  // Ensure span ends even on error
        return res.status(500).json({ error: `Failed to generate content. Error: ${error.message}` });
      }
    }
  );
}
