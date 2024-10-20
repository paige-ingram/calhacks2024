/* pages/api/testTrace.ts */
import { NextApiRequest, NextApiResponse } from 'next';
import { tracer } from '../../app/instrumentation'; // Import the tracer

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Start a span
  const span = tracer.startSpan('test-api-span');

  try {
    // Do some mock work (e.g., simulating a delay)
    for (let i = 0; i < 1000000; i++) {} // Dummy work to simulate processing

    // Log span attributes
    span.setAttribute('test.attribute', 'my-attribute-value');

    // End the span
    span.end();

    // Respond to the request
    res.status(200).json({ message: 'Span emitted and logged in console' });

  } catch (error) {
    // In case of error, end the span
    span.recordException(error);
    span.setStatus({ code: 2, message: 'Error occurred' });
    span.end();
    res.status(500).json({ error: 'Something went wrong' });
  }
}
