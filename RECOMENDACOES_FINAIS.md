# Recomendações Finais — Lançamento Oficial do Site de Jonaas

Com o site publicado em produção no Vercel ([https://https-www-instagram-com-jonaasmusic.vercel.app](https://https-www-instagram-com-jonaasmusic.vercel.app)) e a versão `v1.1.0` registrada no GitHub, este guia reúne as ações recomendadas para a etapa final de entrega ao artista/cliente.

---

## 1. Conectar Domínio Próprio (Custom Domain)
Atualmente o site está acessível pelo subdomínio gratuito da Vercel. Para uma imagem profissional perante a imprensa, gravadoras e fãs, o ideal é vincular um domínio personalizado (ex.: `jonaasmusic.com` ou `jonaas.pt`).

### Passo a passo no painel da Vercel:
1. Acesse o projeto na [Vercel](https://vercel.com/mgl-arthur/https-www-instagram-com-jonaasmusic-https).
2. Vá em **Settings** > **Domains**.
3. Insira o domínio desejado (ex.: `jonaasmusic.com`).
4. Configure as entradas DNS no registrador do domínio (GoDaddy, Namecheap, Amen, Cloudflare, etc.):
   - **Registro A:** Apontando para `76.76.21.21`
   - **CNAME (para `www`):** Apontando para `cname.vercel-dns.com`
5. A Vercel gerará o certificado SSL (HTTPS) automaticamente em poucos minutos.

---

## 2. Meta Tags de Compartilhamento Social (Open Graph & WhatsApp)
Para que os links compartilhados no WhatsApp, Instagram Stories, Twitter/X, Telegram e iMessage exibam um card elegante com imagem e descrição do artista:

```html
<!-- Inserir dentro do <head> em dist/index.html -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://https-www-instagram-com-jonaasmusic.vercel.app/">
<meta property="og:title" content="Jonaas — Website Oficial">
<meta property="og:description" content="O universo de Jonaas. Música, vídeos, podcasts e biografia. Ouça 'Vou Fazer Mais Como'.">
<meta property="og:image" content="https://https-www-instagram-com-jonaasmusic.vercel.app/assets/hero-desktop-v11.webp">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Jonaas — Website Oficial">
<meta name="twitter:description" content="O universo de Jonaas. Música, vídeos, podcasts e biografia.">
<meta name="twitter:image" content="https://https-www-instagram-com-jonaasmusic.vercel.app/assets/hero-desktop-v11.webp">
```

---

## 3. Vercel Web Analytics & Speed Insights
Monitore o tráfego do site e os países de origem dos ouvintes (Portugal, Angola, Moçambique, Brasil, etc.) sem comprometer o tempo de carregamento:

1. No dashboard do projeto na Vercel, clique na aba **Analytics**.
2. Clique em **Enable Web Analytics** (plano gratuito disponível).
3. Isso fornecerá métricas em tempo real sobre acessos, dispositivos e páginas mais visitadas.

---

## 4. Google Search Console & Indexação
Para que o site apareça no topo das pesquisas do Google quando buscarem *"Jonaas"*, *"Jonaas cantor"*, *"Jonaas música"*:

1. Acesse o [Google Search Console](https://search.google.com/search-console).
2. Adicione a URL do site como propriedade.
3. Valide a propriedade via tag HTML ou verificação de DNS.
4. Solicite a indexação da URL principal.

---

## 5. Como Atualizar Novos Lançamentos no Futuro
A arquitetura do site foi projetada para ser simples de manter:

- **Novas músicas e álbuns:** Atualize as listas no arquivo `dist/content.js`.
- **Novas entrevistas / podcasts:** Atualize a seção `#conversas` em `dist/index.html`.
- **Deploy automático:** Ao salvar e enviar via `git push origin main`, o Vercel atualiza o site no ar em menos de 10 segundos.

---

## 6. Checklist de Apresentação ao Cliente

- [x] Design editorial responsivo e fluido em Desktop, Tablet e Mobile.
- [x] Seção Biografia em blocos alternados preto/off-white com scroll reveal.
- [x] Podcasts sincronizados com trailers do YouTube sem cortes de tela.
- [x] Catálogo de Discografia interativo com players integrados.
- [x] Botões de Booking e Contacto direto via Instagram e telefone.
- [x] Código versionado no GitHub (`v1.1.0`) e publicado em produção no Vercel.
