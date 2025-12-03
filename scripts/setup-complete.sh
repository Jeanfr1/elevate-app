#!/bin/bash

# Script completo de setup do Supabase
# Executa: bash scripts/setup-complete.sh

echo "🚀 GlobalVoice - Setup do Supabase"
echo "===================================="
echo ""

# Verifica se as variáveis estão configuradas
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ Erro: NEXT_PUBLIC_SUPABASE_URL não encontrado no .env.local"
    exit 1
fi

echo "✅ Variáveis de ambiente encontradas"
echo ""

echo "📋 Próximos passos:"
echo ""
echo "1️⃣  EXECUTAR SQL SCHEMA:"
echo "   - Acesse: https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/sql"
echo "   - Clique em 'New query'"
echo "   - Abra o arquivo: supabase-schema.sql"
echo "   - Copie TODO o conteúdo"
echo "   - Cole no SQL Editor e clique em 'Run'"
echo ""

echo "2️⃣  CRIAR BUCKET DE STORAGE:"
echo "   - Acesse: https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/storage"
echo "   - Clique em 'New bucket'"
echo "   - Nome: videos"
echo "   - Marque como 'Public bucket'"
echo "   - Clique em 'Create bucket'"
echo ""

echo "3️⃣  HABILITAR REALTIME:"
echo "   - Acesse: https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/database/replication"
echo "   - Encontre a tabela 'translation_jobs'"
echo "   - Ative o toggle"
echo ""

echo "✨ Após completar os 3 passos acima, seu app estará pronto!"
echo ""



