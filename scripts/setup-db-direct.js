/**
 * Script para executar SQL diretamente no banco Supabase
 * Requer: npm install pg
 *
 * Para obter a connection string:
 * 1. Vá em Settings > Database
 * 2. Copie a "Connection string" (URI format)
 * 3. Execute: CONNECTION_STRING="sua-string" node scripts/setup-db-direct.js
 */

const fs = require('fs');
const path = require('path');

// Tenta importar pg
let pg;
try {
  pg = require('pg');
} catch (e) {
  console.log('❌ Biblioteca "pg" não encontrada.');
  console.log('📦 Instalando...\n');
  console.log('Execute: npm install pg\n');
  process.exit(1);
}

const sqlFile = path.join(__dirname, '../supabase-schema.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// Connection string do Supabase
// Formato: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
const connectionString = process.env.CONNECTION_STRING || process.env.DATABASE_URL;

if (!connectionString) {
  console.log('❌ CONNECTION_STRING não encontrada!\n');
  console.log('📋 Para obter a connection string:');
  console.log('1. Acesse: https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/settings/database');
  console.log('2. Role até "Connection string"');
  console.log('3. Copie a URI (começa com postgresql://)');
  console.log('4. Execute: CONNECTION_STRING="sua-string-aqui" node scripts/setup-db-direct.js\n');
  console.log('💡 OU use o método manual mais fácil:');
  console.log('1. Acesse: https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/sql/new');
  console.log('2. Cole o conteúdo de supabase-schema.sql');
  console.log('3. Clique em "Run"\n');
  process.exit(1);
}

async function executeSQL() {
  const client = new pg.Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Conectando ao banco de dados...');
    await client.connect();
    console.log('✅ Conectado!\n');

    console.log('📋 Executando SQL schema...\n');

    // Divide o SQL em comandos individuais (separados por ;)
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.length > 0) {
        try {
          await client.query(command + ';');
          console.log(`✅ Comando ${i + 1}/${commands.length} executado`);
        } catch (error) {
          // Ignora erros de "já existe" ou similares
          if (error.message.includes('already exists') ||
              error.message.includes('duplicate')) {
            console.log(`⚠️  Comando ${i + 1}: ${error.message.split('\n')[0]}`);
          } else {
            console.error(`❌ Erro no comando ${i + 1}:`, error.message);
          }
        }
      }
    }

    console.log('\n✅ SQL schema executado com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Criar bucket "videos" no Storage (público)');
    console.log('2. Habilitar Realtime para tabela translation_jobs\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

executeSQL();



