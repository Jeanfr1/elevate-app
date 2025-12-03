/**
 * Script automático para configurar o banco de dados no Supabase
 * Executa o SQL schema automaticamente via API
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configurações do Supabase
const SUPABASE_URL = 'https://mwxloigfqmzlybxncjjs.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eGxvaWdmcW16bHlieG5jampzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDY2MDI2OCwiZXhwIjoyMDgwMjM2MjY4fQ.RYRuGlpP3U5xGuFp-H3eSwYHFVVjYwkBQgZU49uzpAA';

// Lê o arquivo SQL
const sqlFile = path.join(__dirname, '../supabase-schema.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

console.log('🚀 Configurando banco de dados no Supabase...\n');
console.log('📋 Executando SQL schema...\n');

// Função para fazer requisição HTTP
function executeSQL(sqlQuery) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      query: sqlQuery
    });

    const options = {
      hostname: 'mwxloigfqmzlybxncjjs.supabase.co',
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Tenta executar via REST API (método alternativo)
async function setupDatabase() {
  try {
    // O Supabase não tem um endpoint REST direto para executar SQL arbitrário
    // Vamos usar o método pg_rest ou executar via psql
    // Mas a forma mais segura é usar o PostgREST com funções específicas

    console.log('⚠️  O Supabase não permite executar SQL arbitrário via REST API por segurança.');
    console.log('📝 Vou criar um script que você pode executar localmente com psql\n');

    // Criar script SQL formatado
    const scriptContent = `#!/bin/bash
# Script para executar SQL no Supabase via psql
# Requer: psql instalado e acesso ao banco

export PGPASSWORD='${SERVICE_ROLE_KEY}'

psql -h db.mwxloigfqmzlybxncjjs.supabase.co \\
     -U postgres \\
     -d postgres \\
     -f supabase-schema.sql

echo "✅ SQL executado com sucesso!"
`;

    const scriptPath = path.join(__dirname, '../execute-sql.sh');
    fs.writeFileSync(scriptPath, scriptContent);
    console.log(`✅ Script criado: ${scriptPath}`);
    console.log('\n📋 MAS A FORMA MAIS FÁCIL É:\n');
    console.log('1. Acesse: https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/sql/new');
    console.log('2. Copie o conteúdo de supabase-schema.sql');
    console.log('3. Cole e clique em "Run"\n');

    // Alternativa: usar fetch se disponível (Node 18+)
    if (typeof fetch !== 'undefined') {
      console.log('🔄 Tentando método alternativo...\n');
      // Não há endpoint direto, então vamos apenas mostrar instruções
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n📋 Use o método manual:\n');
    console.log('1. Acesse: https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/sql/new');
    console.log('2. Copie TODO o conteúdo de supabase-schema.sql');
    console.log('3. Cole e clique em "Run"\n');
  }
}

// Executa
setupDatabase();



