
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// Esta função pode ser executada manualmente para atualizar os planos
// ou através do console do Supabase

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceRole);

// Limpar planos existentes
await supabase.from("subscription_plans").delete().neq("id", "00000000-0000-0000-0000-000000000000");

// Inserir apenas o plano Pro
await supabase.from("subscription_plans").insert([
  {
    name: "Pro",
    description: "Acesso completo a todas as funcionalidades",
    price: 29.90,
    stripe_price_id: "price_pro", // Substitua pelo seu ID real do Stripe
    features: [
      "Calendário completo com eventos ilimitados",
      "Controle financeiro avançado sem limites",
      "Repertório ilimitado",
      "Networking completo",
      "Sem anúncios",
      "Suporte prioritário"
    ]
  }
]);

console.log("Planos atualizados com sucesso!");
