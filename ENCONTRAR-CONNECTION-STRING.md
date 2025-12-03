# 🔍 Como Encontrar a Connection String no Supabase

## 📍 Onde Procurar:

### Opção 1: Settings > Database
1. No menu lateral, clique em **"Settings"** (⚙️)
2. Clique em **"Database"**
3. Role a página para baixo
4. Procure por uma seção chamada **"Connection string"** ou **"Connection info"**
5. Você verá algo como:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.mwxloigfqmzlybxncjjs.supabase.co:5432/postgres
   ```

### Opção 2: Connection Pooling
1. Na mesma página de Database Settings
2. Procure por **"Connection pooling"**
3. Pode haver uma aba ou seção com connection strings

### Opção 3: Settings > API
1. Vá em **Settings** > **API**
2. Às vezes a connection string aparece lá também

---

## 🎯 MAS... Você não precisa da Connection String!

O método **MANUAL é mais rápido** e não precisa de connection string:

1. **Abra**: https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/sql/new
2. **Copie** o conteúdo de `supabase-schema.sql`
3. **Cole** e clique em **"Run"**

**Pronto em 30 segundos!** ⚡

---

## 💡 Por que o método manual é melhor?

- ✅ Mais rápido (30 segundos vs 5 minutos procurando connection string)
- ✅ Mais seguro (não expõe credenciais)
- ✅ Mais confiável (funciona sempre)
- ✅ Você vê o que está sendo executado

---

**Recomendação**: Use o método manual! É muito mais simples. 🚀



