# Task: Implementar Reserva de Livros

Status: Em progresso

## Passos:

- [x] 1. Adicionar refreshData no CatalogPage.jsx e passar para BookGrid
- [x] 2. Atualizar BookGrid.jsx para passar refreshData para BookCard
- [x] 3. Atualizar BookCard.jsx para passar livro.id e refreshData para ReserveButton
- [x] 4. Substituir alert por chamada createPedido no ReserveButton.jsx
- [x] 5. Testar fluxo de reserva (faça npm run dev, login user ativo, reserve livro disponível)

## Detalhes:

- Reserva cria pedido em /pedidos com status 'reservado'
- disponivel atualiza automaticamente após refresh
- Prazo 7 dias: responsabilidade do backend
