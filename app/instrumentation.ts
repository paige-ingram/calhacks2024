// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { OpenAIInstrumentation } from '@arizeai/openinference-instrumentation-openai';

// Enable diagnostic logging for troubleshooting
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// Initialize a tracer provider
const traceExporter = new OTLPTraceExporter({
  url: 'https://ingest.arize.com/v1/traces', // Replace with your Arize URL endpoint if needed
});

const sdk = new NodeSDK({
  traceExporter: new SimpleSpanProcessor(traceExporter),
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'GeminiAIService',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
  spanProcessor: new SimpleSpanProcessor(new ConsoleSpanExporter()), // To print traces in the terminal
});

// Register instrumentation for OpenAI
registerInstrumentations({
  instrumentations: [new OpenAIInstrumentation()],
});

// Start the OpenTelemetry SDK
sdk.start().then(() => {
  console.log('OpenTelemetry initialized with Arize tracing');
});
