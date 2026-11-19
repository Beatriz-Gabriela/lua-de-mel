# Lua de Mel · Nossa viagem

Aplicativo responsivo para organizar a viagem de fim de ano de 2026/2027.

## Funcionalidades
- Painel inicial com contagem regressiva até a saída de Manaus (29/12/2026 às 16:35).
- Roteiro personalizável com sugestões para Maceió, Porto de Galinhas e Recife, links para o Google Maps e lista de lugares escolhidos.
- Controle financeiro com meta de R$ 16.339,31, entradas e despesas sem limite de lançamentos.
- Área de reservas para registrar hospedagens, passeios e detalhes.

## Executar localmente
Abra `index.html` em um navegador ou sirva a pasta com um servidor estático.

## Publicação
O workflow em `.github/workflows/deploy.yml` tenta publicar o conteúdo no GitHub Pages a cada atualização na branch `main`. Para concluir, confira em **Settings → Pages** se a publicação por GitHub Actions está habilitada e acompanhe a execução em **Actions**.

## Importante sobre os dados
Nesta primeira versão, lançamentos financeiros, roteiro escolhido e reservas ficam salvos no armazenamento local do navegador (localStorage). Isso mantém os dados no mesmo navegador/dispositivo, mas **não sincroniza automaticamente entre os celulares do casal** e não substitui backup. Para uso compartilhado em tempo real, será necessário conectar um banco de dados com autenticação, como Supabase, em uma próxima etapa.

As passagens já compradas e os valores históricos de R$ 1.000,00 de entrada e R$ 1.000,00 de despesa são mostrados como referência inicial; saldo inicial R$ 0,00.
