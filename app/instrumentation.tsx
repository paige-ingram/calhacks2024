import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { OpenAIInstrumentation } from "@arizeai/openinference-instrumentation-openai";
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";

// Set logger for debugging
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// Initialize the tracer provider
const sdk = new NodeSDK({
  resource: new Resource({
    service: {
      name: 'gemini-service',
    },
  }),
  traceExporter: new ConsoleSpanExporter(),  // Exports spans to the console
});

sdk.start();

// Register Arize instrumentation
registerInstrumentations({
  instrumentations: [
    new OpenAIInstrumentation({}),
  ],
});

console.log("👀 Arize Tracing initialized!");
