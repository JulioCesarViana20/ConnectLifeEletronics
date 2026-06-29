// Carrega e renderiza os produtos automaticamente
async function carregarProdutos() {
  try {
    const resposta = await fetch('dados.json');
    const dados = await resposta.json();
    renderizarCards(dados.produtos);
  } catch (erro) {
    console.error('Erro ao carregar dados:', erro);
  }
}

// Renderiza os cards dinamicamente
function renderizarCards(produtos) {
  const gridContainer = document.querySelector('.grid');
  
  // Limpa o container
  gridContainer.innerHTML = '';
  
  // Cria e adiciona cada card
  produtos.forEach(produto => {
    const card = document.createElement('article');
    card.className = 'product-card';
    
    card.innerHTML = `
      <div class="product-image">
        <img src="${produto.imagem}" alt="${produto.nome}" />
      </div>
      <div class="product-content">
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <div class="product-meta">
          <span class="price">R$ ${produto.preco.toLocaleString('pt-BR')}</span>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <a href="details.html?id=${produto.id}" class="btn btn-card">Ver detalhes</a>
            <button class="btn btn-card btn-add-cart" onclick="adicionarAoCarrinho({id: '${produto.id}', nome: '${produto.nome}', preco: ${produto.preco}, imagem: '${produto.imagem}'})">🛒 Adicionar</button>
          </div>
        </div>
      </div>
    `;
    
    gridContainer.appendChild(card);
  });
}

// Carrega os produtos quando a página inicia
document.addEventListener('DOMContentLoaded', carregarProdutos);