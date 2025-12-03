# 🔧 Configuração do Supabase - Passo a Passo

## 1️⃣ Obter Credenciais do Supabase

1. No dashboard do Supabase, vá em **Settings** (⚙️) → **API**
2. Você verá duas informações importantes:
   - **Project URL**: Algo como `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: Uma chave longa começando com `eyJ...`

## 2️⃣ Configurar Variáveis de Ambiente

Abra o arquivo `.env.local` e adicione/atualize com:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# N8N Webhook URL (opcional por enquanto)
N8N_WEBHOOK_URL=https://seu-n8n-instance.com/webhook/video-translation

# Supabase Storage Bucket Name
NEXT_PUBLIC_STORAGE_BUCKET=videos

# Outras variáveis que você já tinha
GEMINI_API_KEY=PLACEHOLDER_API_KEY
```

## 3️⃣ Configurar o Banco de Dados

1. No Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Copie TODO o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em **Run** (ou pressione Cmd/Ctrl + Enter)

## 4️⃣ Criar Bucket de Storage

1. No Supabase, vá em **Storage**
2. Clique em **New bucket**
3. Nome: `videos`
4. **IMPORTANTE**: Marque como **Public bucket**
5. Clique em **Create bucket**

## 5️⃣ Habilitar Realtime

1. No Supabase, vá em **Database** → **Replication**
2. Encontre a tabela `translation_jobs`
3. Ative o toggle para habilitar replicação em tempo real

## 6️⃣ Reiniciar o Servidor

Após configurar tudo, reinicie o servidor:

```bash
# Pare o servidor (Ctrl + C)
# Depois rode novamente:
npm run dev
```

## ✅ Checklist

- [ ] Credenciais do Supabase no `.env.local`
- [ ] SQL schema executado no SQL Editor
- [ ] Bucket `videos` criado e público
- [ ] Realtime habilitado para `translation_jobs`
- [ ] Servidor reiniciado



