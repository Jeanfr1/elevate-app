/**
 * Script completo de setup do Supabase
 * Tenta executar o SQL de forma automática
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mwxloigfqmzlybxncjjs.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eGxvaWdmcW16bHlieG5jampzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDY2MDI2OCwiZXhwIjoyMDgwMjM2MjY4fQ.RYRuGlpP3U5xGuFp-H3eSwYHFVVjYwkBQgZU49uzpAA';

const sqlFile = path.join(__dirname, '../supabase-schema.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

console.log('🚀 GlobalVoice - Setup Automático do Banco de Dados\n');
console.log('='.repeat(60));

// O Supabase não permite executar SQL arbitrário via REST API
// Mas podemos criar as tabelas uma por uma usando a API
console.log('\n⚠️  O Supabase não permite executar SQL arbitrário via API REST.');
console.log('📋 Use o método MANUAL (é rápido e fácil!):\n');
console.log('1️⃣  Abra este link:');
console.log('   https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/sql/new\n');
console.log('2️⃣  Copie TODO o conteúdo abaixo:\n');
console.log('-'.repeat(60));
console.log(sql);
console.log('-'.repeat(60));
console.log('\n3️⃣  Cole no SQL Editor e clique em "Run"\n');
console.log('✅ Pronto! O banco estará configurado.\n');
console.log('='.repeat(60));
console.log('\n📋 Depois disso, você ainda precisa:');
console.log('   • Criar bucket "videos" no Storage (público)');
console.log('   • Habilitar Realtime para translation_jobs\n');



