/**
 * Script para configurar o banco de dados no Supabase
 *
 * USO:
 * 1. Obtenha o SERVICE_ROLE_KEY do Supabase (Settings > API > service_role key)
 * 2. Execute: node scripts/setup-database.js
 *
 * OU configure como variável de ambiente:
 * SUPABASE_SERVICE_ROLE_KEY=sua-chave node scripts/setup-database.js
 */

const fs = require('fs');
const path = require('path');

// Lê o arquivo SQL
const sqlFile = path.join(__dirname, '../supabase-schema.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

console.log('📋 SQL Schema carregado do arquivo supabase-schema.sql\n');
console.log('='.repeat(60));
console.log('INSTRUÇÕES PARA EXECUTAR NO SUPABASE:');
console.log('='.repeat(60));
console.log('\n1. Acesse: https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs');
console.log('2. Vá em: SQL Editor (no menu lateral)');
console.log('3. Clique em: "New query"');
console.log('4. Cole o SQL abaixo e clique em "Run" (ou Cmd/Ctrl + Enter)\n');
console.log('-'.repeat(60));
console.log(sql);
console.log('-'.repeat(60));
console.log('\n✅ Após executar, volte aqui e pressione Enter para continuar...\n');



