// api/create-preference.js
// ============================================================
// Vercel Serverless Function (Node) — create-preference
// ------------------------------------------------------------
// Cria uma "preference" (intenção de pagamento) no Mercado Pago
// usando o Access Token SECRETO, que vive SOMENTE aqui no servidor
// (variável de ambiente MP_ACCESS_TOKEN na Vercel / .env local).
//
// ⚠️  Este token NUNCA pode ir para o frontend: tudo que começa com
//     VITE_ é embutido no bundle e fica visível no navegador.
//
// Recebe { items, payer, back_urls, external_reference } e devolve
// { id, init_point, sandbox_init_point } — a URL do Checkout Pro
// para onde o frontend redireciona o comprador.
//
// Dev local: roda com `vercel dev` (o `npm run dev` do Vite NÃO
// serve a pasta /api). Ver docs/progresso/004.
// ============================================================
import { MercadoPagoConfig, Preference } from 'mercadopago';

const accessToken = process.env.MP_ACCESS_TOKEN;

export default async function handler(req, res) {
  // Pré-flight CORS (a função é de mesma origem; mantido por segurança)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  if (!accessToken) {
    res.status(500).json({ error: 'MP_ACCESS_TOKEN não configurado no servidor.' });
    return;
  }

  try {
    const { items, payer, back_urls, external_reference } = req.body ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Lista de itens vazia.' });
      return;
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items,
        payer,
        back_urls,
        external_reference,
        // auto_return exige uma URL pública (https). Em localhost o Mercado
        // Pago recusa, então só ativamos quando a URL de sucesso for https.
        auto_return: back_urls?.success?.startsWith('https') ? 'approved' : undefined,
        statement_descriptor: 'TADS STORE',
      },
    });

    res.status(200).json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });
  } catch (err) {
    console.error('Erro ao criar preference:', err);
    res.status(500).json({
      error: 'Falha ao criar preference no Mercado Pago.',
      detail: String(err?.message ?? err),
    });
  }
}
