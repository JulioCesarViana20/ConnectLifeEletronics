// Sistema de Carrinho de Compras com localStorage

const STORAGE_KEY = 'connectlife_cart';

// Inicializa o carrinho
function inicializarCarrinho() {
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', irParaCarrinho);
  }
  atualizarContadorCarrinho();
  
  // Se estiver na página do carrinho, renderiza
  if (document.getElementById('cartContent')) {
    renderizarCarrinho();
  }
}

// Obtém o carrinho do localStorage
function obterCarrinho() {
  const carrinho = localStorage.getItem(STORAGE_KEY);
  return carrinho ? JSON.parse(carrinho) : [];
}

// Salva o carrinho no localStorage
function salvarCarrinho(carrinho) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho));
  atualizarContadorCarrinho();
}

// Adiciona item ao carrinho
function adicionarAoCarrinho(produto) {
  const carrinho = obterCarrinho();
  const itemExistente = carrinho.find(item => item.id === produto.id);
  
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem,
      quantidade: 1
    });
  }
  
  salvarCarrinho(carrinho);
  mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
}

// Remove item do carrinho
function removerDoCarrinho(produtoId) {
  let carrinho = obterCarrinho();
  carrinho = carrinho.filter(item => item.id !== produtoId);
  salvarCarrinho(carrinho);
}

// Atualiza quantidade do item
function atualizarQuantidade(produtoId, novaQuantidade) {
  const carrinho = obterCarrinho();
  const item = carrinho.find(item => item.id === produtoId);
  
  if (item) {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(produtoId);
    } else {
      item.quantidade = novaQuantidade;
      salvarCarrinho(carrinho);
    }
  }
  
  // Atualiza a renderização se estiver na página do carrinho
  if (document.getElementById('cartContent')) {
    renderizarCarrinho();
  }
}

// Atualiza o contador do carrinho no header
function atualizarContadorCarrinho() {
  const carrinho = obterCarrinho();
  const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
  const contadores = document.querySelectorAll('#cartCount');
  contadores.forEach(contador => {
    contador.textContent = totalItens;
  });
}

// Renderiza a página do carrinho
function renderizarCarrinho() {
  const carrinho = obterCarrinho();
  const cartContent = document.getElementById('cartContent');
  
  if (carrinho.length === 0) {
    cartContent.innerHTML = `
      <div class="cart-empty">
        <h2>Seu carrinho está vazio</h2>
        <p>Explore nossos produtos e adicione alguns itens!</p>
        <a href="index.html#produtos" class="btn btn-primary" style="display: inline-block; margin-top: 1.5rem;">
          Voltar aos produtos
        </a>
      </div>
    `;
    return;
  }
  
  // Calcula totais
  let total = 0;
  let totalItens = 0;
  
  let html = '<div class="cart-items">';
  
  carrinho.forEach((item, index) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    totalItens += item.quantidade;
    
    html += `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${item.imagem}" alt="${item.nome}">
        </div>
        <div class="cart-item-details">
          <h3>${item.nome}</h3>
          <p>R$ ${item.preco.toLocaleString('pt-BR')}</p>
        </div>
        <div class="cart-item-quantity">
          <button class="qty-btn qty-minus" data-product-id="${item.id}" data-action="minus">−</button>
          <span style="min-width: 30px; text-align: center;" class="qty-display">${item.quantidade}</span>
          <button class="qty-btn qty-plus" data-product-id="${item.id}" data-action="plus">+</button>
        </div>
        <div class="cart-item-price">
          R$ ${subtotal.toLocaleString('pt-BR')}
        </div>
        <button class="cart-item-remove" data-product-id="${item.id}">Remover</button>
      </div>
    `;
  });
  
  html += '</div>';
  
  // Adiciona resumo
  html += `
    <div class="cart-summary">
      <div class="summary-item">
        <span class="summary-item-label">Subtotal</span>
        <span class="summary-item-value">R$ ${total.toLocaleString('pt-BR')}</span>
      </div>
      <div class="summary-item">
        <span class="summary-item-label">Frete</span>
        <span class="summary-item-value">Grátis</span>
      </div>
      <div class="summary-item summary-item-total">
        <span class="summary-item-label">Total</span>
        <span class="summary-item-value">R$ ${total.toLocaleString('pt-BR')}</span>
      </div>
    </div>
    
    <div class="cart-actions">
      <a href="index.html#produtos" class="btn-continue">← Continuar comprando</a>
      <button class="btn-checkout" id="btnCheckout">Finalizar Compra</button>
    </div>
  `;
  
  cartContent.innerHTML = html;
  
  // Adiciona event listeners
  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const produtoId = e.target.dataset.productId;
      const carrinho = obterCarrinho();
      const item = carrinho.find(i => i.id === produtoId);
      if (item && item.quantidade > 1) {
        atualizarQuantidade(produtoId, item.quantidade - 1);
      } else if (item && item.quantidade === 1) {
        removerDoCarrinho(produtoId);
        renderizarCarrinho();
      }
    });
  });
  
  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const produtoId = e.target.dataset.productId;
      const carrinho = obterCarrinho();
      const item = carrinho.find(i => i.id === produtoId);
      if (item) {
        atualizarQuantidade(produtoId, item.quantidade + 1);
      }
    });
  });
  
  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const produtoId = e.target.dataset.productId;
      removerDoCarrinho(produtoId);
      renderizarCarrinho();
    });
  });
  
  document.getElementById('btnCheckout').addEventListener('click', finalizarCompra);
}

// Finaliza a compra
function finalizarCompra() {
  const carrinho = obterCarrinho();
  if (carrinho.length === 0) return;
  
  const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  const itens = carrinho.map(item => `${item.nome} (${item.quantidade}x)`).join(', ');
  
  // Redireciona para WhatsApp com o pedido
  const mensagem = `Olá! Gostaria de fazer um pedido:\n\n${itens}\n\nTotal: R$ ${total.toLocaleString('pt-BR')}\n\nPor favor, confirme a disponibilidade e o melhor forma de pagamento.`;
  const whatsappUrl = `https://wa.me/556282480408?text=${encodeURIComponent(mensagem)}`;
  
  // Limpa o carrinho após finalizar
  localStorage.removeItem(STORAGE_KEY);
  atualizarContadorCarrinho();
  
  // Abre o WhatsApp
  window.open(whatsappUrl, '_blank');
  
  // Mostra mensagem de sucesso
  setTimeout(() => {
    alert('Pedido enviado com sucesso! Redirecionando para o WhatsApp...');
    window.location.href = 'index.html';
  }, 500);
}

// Direciona para a página do carrinho
function irParaCarrinho() {
  window.location.href = 'cart.html';
}

// Mostra notificação temporária
function mostrarNotificacao(mensagem) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4caf50;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  notif.textContent = mensagem;
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notif.remove(), 300);
  }, 2000);
}

// Adiciona animações CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Inicializa quando a página carrega
document.addEventListener('DOMContentLoaded', inicializarCarrinho);
