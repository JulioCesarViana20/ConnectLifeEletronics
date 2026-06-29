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

// Finaliza a compra com Mercado Pago
async function finalizarCompra() {
  const carrinho = obterCarrinho();
  if (carrinho.length === 0) return;

  const btnCheckout = document.getElementById('btnCheckout');
  const textoOriginal = btnCheckout ? btnCheckout.textContent : '';

  if (btnCheckout) {
    btnCheckout.disabled = true;
    btnCheckout.textContent = 'Redirecionando...';
  }

  let redirecting = false;

  try {
    // Prepara os itens para o Mercado Pago
    const items = carrinho.map(item => ({
      title: item.nome,
      quantity: item.quantidade,
      unit_price: item.preco,
    }));
    
    // Envia para o servidor criar a preferência de pagamento
    const response = await apiFetch('/criar-pagamento-carrinho', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detalhes || data.error || "Erro ao processar pagamento");
    }

    if (data.init_point) {
      redirecting = true;
      localStorage.removeItem(STORAGE_KEY);
      atualizarContadorCarrinho();
      window.location.replace(data.init_point);
      return;
    }

    alert('Erro ao processar pagamento. Tente novamente.');
  } catch (erro) {
    console.error('Erro ao finalizar compra:', erro);
    let msg = erro.message || 'Erro ao conectar com o servidor de pagamento.';

    if (erro.name === 'AbortError') {
      msg = 'Servidor demorou demais. Rode "npm start" e acesse http://localhost:3000';
    } else if (msg === 'Failed to fetch') {
      msg = 'Servidor offline. Rode "npm start" e acesse http://localhost:3000';
    }

    alert(msg);
  } finally {
    if (!redirecting && btnCheckout) {
      btnCheckout.disabled = false;
      btnCheckout.textContent = textoOriginal;
    }
  }
}

// Direciona para a página do carrinho
function irParaCarrinho() {
  window.location.href = '/cart.html';
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
