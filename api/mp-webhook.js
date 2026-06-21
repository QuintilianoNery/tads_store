// api/mp-webhook.js
// ============================================================
// Webhook do Mercado Pago — confirmação de pagamento (server-side).
// ------------------------------------------------------------
// O Mercado Pago faz POST aqui quando um pagamento é criado/atualizado. Esta
// função busca o pagamento, e grava o status no pedido (Supabase) usando a
// SERVICE ROLE KEY — assim a confirmação acontece no servidor, independente do
// navegador (à prova de "fechou a aba"). Responde 200 para o MP não reenviar.
//
// Pré-requisitos (env de servidor — NUNCA com prefixo VITE_):
//   - MP_ACCESS_TOKEN            (mesmo da create-preference)
//   - MP_WEBHOOK_SECRET          (segredo de assinatura do webhook, painel do MP)
//   - SUPABASE_SERVICE_ROLE_KEY  (Supabase → Settings → API → service_role)
//   - SUPABASE_URL               (ou VITE_SUPABASE_URL como fallback)
//
// Só roda com URL pública https (o MP não alcança localhost) — testável no
// deploy da Vercel. Ver docs/progresso/007.
// ============================================================
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';
import { verifyMercadoPagoSignature } from './_lib/mpSignature.js';

const accessToken = process.env.MP_ACCESS_TOKEN;
const webhookSecret = process.env.MP_WEBHOOK_SECRET;
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  if (!accessToken || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
    console.error('Webhook mal configurado: faltam variáveis de ambiente do servidor.');
    res.status(500).json({ error: 'Webhook não configurado.' });
    return;
  }

  // Tipo do evento e id do recurso (vêm na query e/ou no corpo).
  const type = req.query.type || req.query.topic || req.body?.type;
  const dataId = req.query['data.id'] || req.body?.data?.id || req.query.id;

  // Valida a assinatura — garante que a notificação veio do Mercado Pago.
  const assinaturaOk = verifyMercadoPagoSignature({
    signatureHeader: req.headers['x-signature'],
    requestId: req.headers['x-request-id'],
    dataId,
    secret: webhookSecret,
  });
  if (!assinaturaOk) {
    res.status(401).json({ error: 'Assinatura inválida.' });
    return;
  }

  // Só tratamos pagamentos; outros eventos (ex.: notificação de teste) → 200.
  if (type !== 'payment' || !dataId) {
    res.status(200).json({ received: true });
    return;
  }

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const payment = await new Payment(client).get({ id: dataId });

    const orderId = payment?.external_reference;
    const status = payment?.status; // approved | rejected | cancelled | pending | in_process

    if (orderId && (status === 'approved' || status === 'rejected' || status === 'cancelled')) {
      const newStatus = status === 'approved' ? 'pago' : 'cancelado';
      const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, mp_payment_id: String(payment.id) })
        .eq('id', orderId);
      if (error) {
        console.error('Webhook: falha ao atualizar o pedido:', error);
        res.status(500).json({ error: 'Falha ao atualizar o pedido.' });
        return;
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    // 500 faz o Mercado Pago reenviar a notificação mais tarde (erro transitório).
    console.error('Erro no webhook do Mercado Pago:', err);
    res.status(500).json({ error: 'Falha ao processar a notificação.' });
  }
}
