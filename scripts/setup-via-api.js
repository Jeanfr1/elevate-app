/**
 * Tenta executar o SQL usando a API do Supabase
 * Usa o service_role key para criar as tabelas via REST API
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mwxloigfqmzlybxncjjs.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eGxvaWdmcW16bHlieG5jampzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDY2MDI2OCwiZXhwIjoyMDgwMjM2MjY4fQ.RYRuGlpP3U5xGuFp-H3eSwYHFVVjYwkBQgZU49uzpAA';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTables() {
  console.log('🚀 Tentando criar tabelas via API...\n');

  try {
    // Infelizmente, o Supabase não permite criar tabelas via REST API diretamente
    // Mas podemos verificar se já existem

    console.log('⚠️  O Supabase não permite criar tabelas via REST API.');
    console.log('📋 O método MANUAL é realmente o mais rápido:\n');
    console.log('1️⃣  Abra: https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/sql/new\n');
    console.log('2️⃣  Copie TODO o conteúdo do arquivo supabase-schema.sql\n');
    console.log('3️⃣  Cole e clique em "Run"\n');
    console.log('✅ Pronto em 30 segundos!\n');

    // Verificar se as tabelas já existem
    const { data: profiles, error: e1 } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    const { data: jobs, error: e2 } = await supabase
      .from('translation_jobs')
      .select('id')
      .limit(1);

    if (!e1 && !e2) {
      console.log('✅ Tabelas já existem!');
      return;
    }

    console.log('📝 Tabelas ainda não existem. Use o método manual acima.\n');

  } catch (error) {
    console.log('📋 Use o método manual (é mais rápido!):\n');
    console.log('1. https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/sql/new');
    console.log('2. Cole o SQL de supabase-schema.sql');
    console.log('3. Clique em "Run"\n');
  }
}

createTables();



