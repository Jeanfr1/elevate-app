#!/bin/bash

echo "🚀 GlobalVoice - Executar SQL Schema"
echo "====================================="
echo ""

# Verifica se tem connection string
if [ -z "$CONNECTION_STRING" ]; then
    echo "📋 MÉTODO MANUAL (Mais Fácil):"
    echo ""
    echo "1. Acesse: https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/sql/new"
    echo "2. Abra o arquivo: supabase-schema.sql"
    echo "3. Copie TODO o conteúdo"
    echo "4. Cole no SQL Editor e clique em 'Run'"
    echo ""
    echo "---"
    echo ""
    echo "📋 OU use o método automático:"
    echo ""
    echo "1. Obtenha a connection string em:"
    echo "   https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/settings/database"
    echo ""
    echo "2. Execute:"
    echo "   CONNECTION_STRING='sua-string' node scripts/setup-db-direct.js"
    echo ""
    exit 0
fi

echo "🔌 Executando SQL automaticamente..."
node scripts/setup-db-direct.js

