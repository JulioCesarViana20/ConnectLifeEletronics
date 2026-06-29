// Carrega os detalhes do produto
async function carregarDetalhes() {
  try {
    // Pega o ID do produto da URL
    const params = new URLSearchParams(window.location.search);
    const produtoId = params.get('id');
    
    if (!produtoId) {
      document.body.innerHTML = '<h1>Produto não encontrado</h1>';
      return;
    }
    
    // Carrega os dados
    const resposta = await fetch('/data/dados.json');
    const dados = await resposta.json();
    
    // Encontra o produto
    const produto = dados.produtos.find(p => p.id === produtoId);
    
    if (!produto) {
      document.body.innerHTML = '<h1>Produto não encontrado</h1>';
      return;
    }
    
    // Renderiza a página de detalhes
    renderizarDetalhes(produto);
  } catch (erro) {
    console.error('Erro ao carregar detalhes:', erro);
    document.body.innerHTML = '<h1>Erro ao carregar o produto</h1>';
  }
}

// Renderiza os detalhes do produto
function renderizarDetalhes(produto) {
  document.title = `${produto.nome} - ConnectLife Store`;
  
  const html = `
    <header class="site-header">
      <div class="header-inner">
        <a href="index.html" class="logo">
          <span class="logo-mark"><img src="img/logo.png" alt="ConnectLife" /></span>
          <div class="logo-text">
            <strong>ConnectLife</strong>
            <span>Loja de eletrônicos</span>
          </div>
        </a>
        <div class="header-actions">
          <button class="btn-cart" id="cartBtn">
            <img class="cart" src="img/cart.jpg" alt="Carrinho de compras">
            <span class="cart-count" id="cartCount">0</span>
          </button>
        </div>
        <nav class="main-nav">
          <a href="index.html#intro">Início</a>
          <a href="index.html#produtos">Produtos</a>
          <a href="index.html#contato">Contato</a>
        </nav>
      </div>
    </header>
    
    <main class="details-container">
      <section class="product-details">
        <a href="index.html#produtos" class="btn btn-back">← Voltar</a>
        
        <div class="details-grid">
          <div class="details-image">
            <img src="${produto.imagem}" alt="${produto.nome}" />
          </div>
          
          <div class="details-content">
            <h1>${produto.nome}</h1>
            
            <div class="price-section">
              <span class="price-label">Preço:</span>
              <span class="price-value">R$ ${produto.preco.toLocaleString('pt-BR')}</span>
            </div>
            
            <div class="description-section">
              <h2>Descrição</h2>
              <p>${produto.descricao}</p>
            </div>
            
            <div class="specs-section">
              <h2>Especificações</h2>
              <p class="specs">${produto.especificacoes}</p>
            </div>
            
            <button class="btn btn-primary btn-comprar" onclick="adicionarAoCarrinho({id: '${produto.id}', nome: '${produto.nome}', preco: ${produto.preco}, imagem: '${produto.imagem}'})">🛒 Adicionar ao Carrinho</button>
          </div>
        </div>
      </section>
    </main>
    
    <footer class="site-footer">
      <p>&copy; 2026 ConnectLife. Todos os direitos reservados.</p>
    </footer>
  `;
  
  document.body.innerHTML = html;
  
  // Inicializa o carrinho
  atualizarContadorCarrinho();
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', irParaCarrinho);
  }
}

// Carrega os detalhes quando a página inicia
document.addEventListener('DOMContentLoaded', carregarDetalhes);
