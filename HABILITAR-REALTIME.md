# 🔄 Como Habilitar Realtime para translation_jobs

## 📍 Onde Encontrar:

O Realtime pode estar em **dois lugares diferentes** dependendo da versão do Supabase:

### Opção 1: Database > Publications (Mais Comum)

1. **No menu lateral**, vá em **"Database"**
2. Clique em **"Publications"** (pode estar em "Database Management")
3. Você verá uma publicação chamada **"supabase_realtime"**
4. Clique nela ou procure por uma opção para **"Add table"** ou **"Manage tables"**
5. Adicione a tabela **`translation_jobs`** à publicação

### Opção 2: Database > Replication (Aba Realtime)

1. **Na página de Replication** que você está agora
2. Procure por uma **aba** ou **seção** chamada **"Realtime"** ou **"Tables"**
3. Pode estar no topo da página ou em um menu lateral dentro da página
4. Lá você verá a lista de tabelas e poderá habilitar o toggle

### Opção 3: Via SQL (Alternativa)

Se não encontrar a interface, você pode habilitar via SQL:

1. Vá em **SQL Editor**: https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/sql/new
2. Execute este comando:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE translation_jobs;
```

3. Clique em **"Run"**

---

## 🎯 Recomendação:

**Use a Opção 3 (SQL)** - É mais rápida e sempre funciona!

1. Abra: https://supabase.com/dashboard/project/mwxloigfqmzlybxncjjs/sql/new
2. Cole este comando:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE translation_jobs;
```
3. Clique em **"Run"**
4. ✅ Pronto!

---

## 🔍 Se ainda não funcionar:

O Realtime pode já estar habilitado por padrão para todas as tabelas. Teste o app e veja se as atualizações em tempo real funcionam!



