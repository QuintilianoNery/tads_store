// supabase/functions/create-preference/index.ts
// ============================================================
// Supabase Edge Function — create-preference
// ------------------------------------------------------------
// Cria uma "preference" (intenção de pagamento) no Mercado Pago
// usando o Access Token SECRETO, que vive SOMENTE aqui no servidor.
//
// Deploy:
//   1. supabase login
//   2. supabase link --project-ref <SEU_PROJECT_REF>
//   3. supabase secrets set MP_ACCESS_TOKEN="APP_USR-..."
//   4. supabase functions deploy create-preference --no-verify-jwt
//
// Ver passo a passo completo em:
//   docs/progresso/004_edge_function_create_preference.md
// ============================================================

import { MercadoPagoConfig, Preference } from 'npm:mercadopago@2'

const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')

// Cabeçalhos CORS — permitem que o frontend (Vite) chame esta função
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  // Pré-flight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Método não permitido' }, 405)
  }

  if (!MP_ACCESS_TOKEN) {
    return jsonResponse(
      { error: 'MP_ACCESS_TOKEN não configurado no servidor.' },
      500,
    )
  }

  try {
    const { items, payer, back_urls, external_reference } = await req.json()

    if (!Array.isArray(items) || items.length === 0) {
      return jsonResponse({ error: 'Lista de itens vazia.' }, 400)
    }

    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN })
    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items,
        payer,
        back_urls,
        external_reference,
        // Volta automaticamente para a loja após pagamento aprovado
        auto_return: 'approved',
        statement_descriptor: 'TADS STORE',
      },
    })

    return jsonResponse({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    })
  } catch (err) {
    console.error('Erro ao criar preference:', err)
    return jsonResponse(
      { error: 'Falha ao criar preference no Mercado Pago.', detail: String(err?.message ?? err) },
      500,
    )
  }
})

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
