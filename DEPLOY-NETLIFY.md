# 🚀 Deploy no Netlify - GlobalVoice

## 📋 Pré-requisitos

1. Conta no Netlify (gratuita): https://app.netlify.com
2. Repositório no GitHub: https://github.com/Jeanfr1/elevate-app
3. Variáveis de ambiente do Supabase e N8N

## 🔧 Passo a Passo

### Opção 1: Deploy via Netlify UI (Recomendado)

1. **Acesse o Netlify**
   - Vá para https://app.netlify.com
   - Faça login com sua conta GitHub

2. **Conecte o Repositório**
   - Clique em "Add new site" → "Import an existing project"
   - Escolha "GitHub" e autorize o Netlify
   - Selecione o repositório: `Jeanfr1/elevate-app`
   - Branch: `main`

3. **Configure o Build**
   - Build command: `npm run build`
   - Publish directory: `.next` (será detectado automaticamente)
   - Node version: `20` (será usado automaticamente)

4. **Configure Variáveis de Ambiente**
   - Vá em "Site settings" → "Environment variables"
   - Adicione as seguintes variáveis:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://mwxloigfqmzlybxncjjs.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
   N8N_WEBHOOK_URL=sua-url-do-webhook-n8n
   NEXT_PUBLIC_STORAGE_BUCKET=videos
   ```

5. **Deploy**
   - Clique em "Deploy site"
   - Aguarde o build completar (pode levar 2-5 minutos)

### Opção 2: Deploy via Netlify CLI

1. **Instale o Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login no Netlify**
   ```bash
   netlify login
   ```

3. **Inicialize o Site**
   ```bash
   cd "/Users/jeanpereira/Desktop/App-elevate copy"
   netlify init
   ```
   - Escolha "Create & configure a new site"
   - Escolha um nome para o site (ou deixe o padrão)
   - Escolha o time (se tiver)

4. **Configure Variáveis de Ambiente**
   ```bash
   netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://mwxloigfqmzlybxncjjs.supabase.co"
   netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "sua-anon-key-aqui"
   netlify env:set N8N_WEBHOOK_URL "sua-url-do-webhook-n8n"
   netlify env:set NEXT_PUBLIC_STORAGE_BUCKET "videos"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## ✅ Verificações Pós-Deploy

1. **Acesse o site**
   - O Netlify fornecerá uma URL: `https://seu-site.netlify.app`
   - Teste o login e cadastro

2. **Verifique os Logs**
   - Vá em "Deploys" → Clique no deploy → "Deploy log"
   - Verifique se não há erros

3. **Teste as Funcionalidades**
   - Login/Cadastro
   - Upload de vídeo
   - Histórico de traduções

## 🔒 Segurança

- ✅ `.env.local` está no `.gitignore` (não será commitado)
- ✅ Variáveis sensíveis devem ser configuradas no Netlify UI
- ✅ O Netlify usa HTTPS por padrão

## 🐛 Troubleshooting

### Build falha
- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique os logs do build no Netlify
- Certifique-se de que o Node.js 20 está sendo usado

### Erro de autenticação
- Verifique se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretos
- Verifique se o Supabase está configurado corretamente

### Erro de upload
- Verifique se o bucket `videos` existe no Supabase Storage
- Verifique as permissões do bucket (deve ser público)

## 📚 Recursos

- [Documentação Netlify](https://docs.netlify.com/)
- [Next.js no Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Netlify CLI](https://cli.netlify.com/)

## 🎉 Pronto!

Seu app GlobalVoice está no ar! 🚀

