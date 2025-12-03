# 🚀 Executar SQL Automaticamente

## Opção 1: Automática (Recomendada)

### Passo 1: Obter Connection String

1. Acesse: https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/settings/database
2. Role até a seção **"Connection string"**
3. Clique em **"URI"** (não "Session mode")
4. Copie a string que começa com `postgresql://postgres:[YOUR-PASSWORD]@...`
5. **IMPORTANTE**: Substitua `[YOUR-PASSWORD]` pela senha do seu banco
   - Se não souber a senha, você pode resetá-la nas configurações

### Passo 2: Executar Script

```bash
CONNECTION_STRING="postgresql://postgres:SUA_SENHA@db.mwxloigfqmzlybxncjjs.supabase.co:5432/postgres" node scripts/setup-db-direct.js
```

---

## Opção 2: Manual (Mais Fácil - 2 minutos)

1. **Abra**: https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/sql/new
2. **Abra o arquivo** `supabase-schema.sql` no seu editor
3. **Copie TODO o conteúdo**
4. **Cole no SQL Editor** do Supabase
5. **Clique em "Run"** (ou Cmd/Ctrl + Enter)
6. **Pronto!** ✅

---

## ⚡ Qual escolher?

- **Opção 1**: Se você tem a connection string e quer automatizar
- **Opção 2**: Mais simples e rápida (recomendada!)

---

## 📋 Após executar o SQL:

1. ✅ Criar bucket `videos` no Storage (público)
2. ✅ Habilitar Realtime para `translation_jobs`



