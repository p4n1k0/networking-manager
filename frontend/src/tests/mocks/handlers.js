import { rest } from 'msw';

export const handlers = [
  rest.get('/v1/referrals', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([{ id: 1, name: 'Indicado Teste', email: 'teste@email.com' }])
    );
  }),

  rest.get('/v1/payments', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([{ id: 1, memberId: 1, amount: 120, status: 'paid' }])
    );
  }),

  rest.get('/v1/meetings', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([{ id: 1, date: '2025-11-10', topic: 'Reunião inicial' }])
    );
  }),
];
