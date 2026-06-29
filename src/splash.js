// Animação de Entrada (Splash Screen)
// Só mostra na página inicial (index.html)

function mostrarSplashScreen() {
  // Detecta se está na página inicial
  const pathname = window.location.pathname;
  const filename = pathname.split('/').pop();
  
  // Mostra splash se estiver na raiz ou em index.html
  const isPaginaInicial = filename === '' || filename === 'index.html' || pathname.endsWith('/ConnectLifeEletronics/');
  
  if (isPaginaInicial) {
    const splash = document.createElement('div');
    splash.id = 'splash-screen';
    splash.innerHTML = `
      <div class="splash-content">
        <div class="splash-logo">
          <img src="img/logo.png" alt="ConnectLife" class="splash-logo-img">
        </div>
        <div class="splash-text">
          <h1>ConnectLife</h1>
          <p>Loja de eletrônicos</p>
        </div>
        <div class="splash-loader">
          <div class="loader-dot"></div>
          <div class="loader-dot"></div>
          <div class="loader-dot"></div>
        </div>
      </div>
    `;
    
    document.body.insertBefore(splash, document.body.firstChild);
    
    // Remove o splash após 3 segundos
    setTimeout(() => {
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.remove();
      }, 500);
    }, 3000);
  }
}

// Executa a animação quando a página carrega
document.addEventListener('DOMContentLoaded', mostrarSplashScreen);

