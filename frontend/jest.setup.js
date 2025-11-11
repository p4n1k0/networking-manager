import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// ✅ Polyfill manual para streams (sem import quebrado)
if (typeof global.TransformStream === 'undefined') {
  global.TransformStream = class TransformStream {};
}
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = class ReadableStream {};
}
if (typeof global.WritableStream === 'undefined') {
  global.WritableStream = class WritableStream {};
}

import 'whatwg-fetch';
import matchers from '@testing-library/jest-dom/matchers';
import { expect } from '@jest/globals';
expect.extend(matchers);

