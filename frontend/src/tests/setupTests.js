import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { server } from './mocks/server';

// Inicia o Mock Service Worker
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
