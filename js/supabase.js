import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "TU_SUPABASE_URL_AQUI";
const SUPABASE_ANON_KEY = "TU_SUPABASE_ANON_KEY_AQUI";

const estaConfigurado =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("TU_SUPABASE_URL") &&
  SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_ANON_KEY.includes("TU_SUPABASE_ANON_KEY");

const supabase = estaConfigurado
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export async function guardarRegistroEnSupabase(payload) {
  if (!supabase) {
    return {
      ok: false,
      offlineMode: true,
      error: "Supabase aún no está configurado en js/supabase.js.",
    };
  }

  const { data, error } = await supabase
    .from("registros_reto_2026")
    .insert([
      {
        nombre_completo: payload.nombreCompleto.trim(),
        telefono_whatsapp: payload.telefonoWhatsApp.trim(),
        interes_inicial: payload.interesInicial,
        desafios_interes: payload.desafiosInteres,
        notas: payload.notas ? payload.notas.trim() : null,
      },
    ])
    .select()
    .single();

  if (error) {
    return {
      ok: false,
      offlineMode: false,
      error: error.message,
    };
  }

  return {
    ok: true,
    data,
  };
}