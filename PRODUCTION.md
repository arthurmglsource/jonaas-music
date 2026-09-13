# Jonaas — notas de produção

Direção: editorial musical em preto profundo, azul atlântico e branco. Tipografia monumental inspirada nas referências Young Multi fornecidas, com composições e imagens próprias para Jonaas. Monograma tipográfico novo, não apresentado como logótipo oficial.

## Conteúdo e edição
- `dist/index.html`: textos, estrutura e descrição do site.
- `dist/content.js`: links oficiais e discografia. Títulos e durações transcritos das capturas fornecidas. As faixas sem URL individual abrem pesquisa no Spotify; o single tem o URL exato fornecido.
- `dist/style.css`: cores, tipografia, responsividade e animação.
- `dist/script.js`: scroll, menu, modal YouTube e leitor Spotify.
- `dist/style-tile.html`: painel visual editável usando os mesmos tokens CSS.
- `dist/assets/monogram.svg`: monograma vetorial editável.

Para ver localmente, servir a pasta dist com um servidor HTTP, por exemplo `python3 -m http.server 4173 --directory dist`. Abrir http://localhost:4173. Alterações locais não modificam a versão online; é necessário publicar uma nova versão.

## Movimento
Scroll nativo, sem interceção da roda. Hero sticky com 2 alturas de ecrã de deslocação ativa em desktop e 1,4 em mobile, para além da altura do palco. Intervalos: 0–8% repouso; 8–43% saída do nome/texto; 38–58% entrada das origens; 58–85% leitura; 85–100% saída. Zoom contínuo do retrato. Conteúdo posterior flui normalmente. O link de salto e a preferência reduced-motion dispensam a sequência.

Não foi gerado vídeo: não havia ferramenta de vídeo disponível. O movimento é realizado no navegador sobre a fotografia. O vídeo oficial fornecido abre num leitor YouTube; existe link direto alternativo. Spotify e YouTube dependem dos respetivos serviços, permissões de incorporação e disponibilidade; reprodução não foi verificada.

## Fontes e pressupostos
Nacionalidade cabo-verdiana e residência em Portugal informadas pelo utilizador. Sem alegações de prémios, estatísticas, concertos futuros ou localidade específica. Contacto através do Instagram fornecido. Textos de apresentação são propostas editoriais. Títulos, durações e ano do single baseados nas capturas fornecidas; sem alegação de atualização em tempo real.

As referências de Young Multi orientaram contraste, escala tipográfica, acabamento cromado e composição. Não foi reutilizada a marca nem a fotografia de Young Multi. Bandeiras não usadas literalmente: a travessia CV → PT exprime a identidade de forma tipográfica.

## Ativos
- `portrait-original.png`: fotografia fornecida do artista sentado, preservada. `portrait.webp` é a versão otimizada.
- `vou-fazer-mais-como.png`: imagem fornecida do single, preservada. `single.webp` é a versão otimizada.
- `jonaas-editorial.webp`: versão web de fotografia editorial gerada por IA com referências do artista. Original PNG entregue no pacote em `masters/hero.png`. Não é uma fotografia documental.
- Tipos Barlow Condensed e DM Sans carregados de Google Fonts, com fontes de sistema alternativas.

Prompt da imagem (built-in image_gen; uma geração): “Use case: identity-preserve. Asset type: musician website hero photographic portrait. Input images: Image 1 and Image 2 are identity references for the same male musician Jonaas; use only this man, especially the clear face and cornrow braids of image 2. Primary request: create exactly one photorealistic editorial studio portrait preserving his recognizable facial structure, dark brown skin tone, eyebrows, nose, lips, short goatee and cornrow braids. Chest-up portrait of him wearing a black textured open-collar shirt, small earrings and a fine silver chain, confident direct gaze toward camera. Scene: dark blue-black seamless studio. Composition: landscape 1536x1024, centered subject, head top about 10% from canvas top, body occupies middle 60% of width, dark negative space on both sides. Lighting: dramatic fashion/music magazine photography with striking cool blue rim light and a soft neutral key light illuminating his face clearly, retaining natural skin detail; face must not be too dark. Materials: realistic skin pores, textured shirt, subtle analog film grain. Constraints: only the male musician from the references, preserve his identity and braids, no cap, no other people, no text, no graphics, no logos, no watermark, no interface elements.”

## Validação
Sintaxe JavaScript verificada com Node. Referências locais dos HTML validadas. Servidor local respondeu HTTP 200. Imagem gerada inspecionada. Transferência das três imagens WebP: cerca de 270 KiB, sem pré-carregar leitores externos. Não requer build nem dependências para servir o site.

Limitação: o navegador de testes não arrancou neste ambiente. Assim, a aparência nos vários ecrãs, interações e ritmo real do scroll não foram confirmados num browser automatizado. A pré-visualização foi aberta na aplicação para revisão do utilizador. Não se afirma validação visual completa.


## Atualização de design — versão 2
Referência inspecionada no Safari (abertura e captura) e nos ficheiros públicos de animação de Young Multi. Nova tipografia Archivo Black, grelhas geométricas, título cromado, vídeo central que se desloca para abrir espaço às plataformas, saída lateral da secção de música, cartões sticky de discografia e revelação circular do contacto. Sem reutilizar código nem ativos proprietários da referência.

A discografia agrupa os dois singles e as três faixas de Além do Prazer. Os cartões tipográficos não são apresentados como capas oficiais. CSS adicional em dist/motion-design.css e animações em dist/motion-design.js. Em ecrãs estreitos, música passa a layout vertical e elimina a deslocação horizontal. Reduced motion remove os palcos presos e apresenta todos os elementos.

Validação desta atualização: Safari aberto e vistas de hero/discografia inspecionadas por captura; sintaxe JS e referências locais verificadas. O controlo via JavaScript de Eventos Apple está desativado no Safari, pelo que o teste automatizado completo do scroll e das interações permanece pendente.


## Versão 3 — abertura e identidade
Hero simplificada para retrato, logo e menu; slogans, CTA, localização e contador removidos. Logo vetorial redesenhada com base no wordmark fornecido, preservando a ideia dos A ligados e sublinhado. Original fornecido preservado nos outputs. Novo master: dist/assets/jonaas-logo.svg.
Carregamento real da imagem e da logo, pausa visual mínima de 750 ms, abertura sequencial de cinco painéis e entrada do retrato. Timeout de segurança, Escape para dispensar e bypass com reduced-motion ou link direto. Sem percentagens simuladas. Hero limitada a 115svh no desktop e 108svh em ecrãs estreitos.
Verificação: enquadramento e logo inspecionados no Safari em janela larga e estreita, cabeça inteira visível. JS validado. Controlo de scroll por Apple Events continua desativado; não se afirma teste automatizado completo da animação no Safari.
