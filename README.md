# Protótipo — R. Araújo Distribuidora

Página estática em HTML, CSS e JavaScript, preparada para apresentação ao cliente. Abra `index.html` no navegador; não requer instalação ou compilação.

## Melhorias

- Logo da loja extraída da capa do catálogo 2026, aplicada no cabeçalho, rodapé e favicon.
- Fotografias locais de sete produtos, nas categorias, no banner e nos cards.
- Ícones SVG consistentes, sem dependência de bibliotecas ou fontes de ícones.
- Busca sem distinção de acentos e filtros combinados por categoria e marca.
- Estado sem resultados, botão para limpar filtros e menu mobile acessível.
- Carrinho demonstrativo com quantidades, remoção de produtos e animação da foto até o ícone ao adicionar.
- Layout responsivo, foco visível e suporte a movimento reduzido.

## Material do cliente

Fonte: `CATALOGO_FRB_DISTRIBUIDORA_VERSAO_2026.pdf`. As páginas abaixo correspondem à posição no arquivo PDF.

| Arquivo em assets/ | Página | Conteúdo |
| --- | --- | --- |
| logo-ra-araujo.webp | 1 | Logo da capa |
| products/pano-multiuso.webp | 6 | Pano Multiuso Seca+ Vabene |
| products/luva-nitrilica.webp | 15 | Luva Nitrílica Medical Vabene |
| products/assadeira-aluminio.webp | 28 | Assadeiras grandes Vabene |
| products/toalha-compacta.webp | 34 | Toalha Compacta Talge Beauty |
| products/saco-kraft.webp | 39 | Saco Kraft Liso Vinco |
| products/queijo-parmesao.webp | 50 | Queijo Parmesão Argentino Inteiro RAR |
| products/azeite-hecke.webp | 56 | Azeite Extra Virgem Nucete, Hecke Import |

Os recortes preservam a arte do catálogo e são imagens WebP locais. Para refazer a extração, execute `python tools/extract_catalog_assets.py` com `pypdfium2` e Pillow instalados. A resolução é limitada pelo material de origem; para a loja definitiva, solicitar logo vetorial e fotos originais dos fornecedores.

## Limites do protótipo

Os sete produtos exibem preços fictícios em reais, criados apenas para demonstrar o protótipo; os valores não foram retirados do catálogo e não representam uma oferta comercial. Telefones, e-mail, abrangência da entrega e horários de atendimento precisam de confirmação do cliente. O PDF é disponibilizado pelo link "Catálogo 2026".

O carrinho fica apenas na memória da página e é reiniciada ao recarregar. O checkout demonstrativo permite ajustar quantidades, conferir o total, escolher Pix, cartão de crédito ou boleto e clicar em Pagar para receber uma confirmação simulada. Pedido, carrinho e pagamento ficam somente na memória JavaScript da página e são perdidos ao recarregar. Nenhum dado de cartão é solicitado e nenhuma cobrança, pedido, autenticação ou comunicação com backend é realizada. A newsletter demonstra a interação sem armazenar dados ou enviar e-mail. O portfólio exibido é uma seleção; a implementação da loja exigirá cadastro completo, estoque, preços, frete, pagamento e condições comerciais.

As fontes Google Fonts são o único recurso visual remoto; em caso de indisponibilidade, o site usa as fontes de fallback do sistema.

