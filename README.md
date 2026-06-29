# ConnectLife - Loja de Eletrônicos

Aplicação web automatizada para exibir produtos com cards dinâmicos usando JavaScript.

## 🎯 Como Funciona

- **dados.json**: Arquivo central com todos os dados dos produtos (nome, preço, imagem, descrição)
- **script.js**: Carrega e renderiza os cards automaticamente na página inicial
- **details.js**: Exibe os detalhes completos de cada produto

## 📝 Adicionar Novos Produtos

1. Abra o arquivo `dados.json`
2. Adicione um novo objeto no array `produtos`:

```json
{
  "id": "produtoX",
  "nome": "Nome do Produto",
  "preco": 9999,
  "imagem": "img/imagem.webp",
  "descricao": "Descrição do produto",
  "especificacoes": "Especificação 1 | Especificação 2 | Especificação 3"
}
```

3. Adicione a imagem na pasta `img/`
4. Atualize a página - os novos cards aparecerão automaticamente!

## 🚀 Opção 1: Abrir Direto no Navegador

1. Navegue até a pasta do projeto
2. Duplo-clique em `index.html`

## 🚀 Opção 2: Usar Servidor Node.js

```bash
# Instale o Node.js (se não tiver)
# https://nodejs.org

# Execute o servidor
node server.js

# Abra no navegador
# http://localhost:3000
```

## 📱 Estrutura de Arquivos

```
connectLife/
├── index.html          # Página principal
├── details.html        # Página de detalhes
├── style.css           # Estilos
├── dados.json          # Base de dados dos produtos
├── server.js           # Servidor Node.js (opcional)
├── src/
│   ├── script.js       # Script que carrega os cards
│   └── details.js      # Script que carrega os detalhes
└── img/                # Pasta com as imagens
```

## 🎨 Personalizações

### Modificar Cores
Edite as variáveis CSS em `style.css`:

```css
:root {
  --primary: #0a84ff;        /* Cor azul principal */
  --primary-dark: #0047b3;   /* Azul escuro */
  --bg: #f7f8fb;             /* Fundo */
  --text: #0f172a;           /* Texto */
}
```

### Adicionar Mais Campos aos Produtos
Se quiser adicionar campos como "categoria", "estoque", etc., altere `dados.json` e depois:

1. Abra `script.js`
2. Atualize a template HTML para incluir o novo campo
3. Abra `details.js`
4. Atualize a renderização para mostrar o novo campo

## ✨ Recursos Automáticos

✅ Cards renderizados dinamicamente  
✅ Formatação de preço em português (R$)  
✅ Links de detalhes funcionais  
✅ Página de detalhes com especificações  
✅ Design responsivo (mobile, tablet, desktop)  
✅ Sem necessidade de recarga de página  

## 🔧 Tecnologias

- HTML5
- CSS3
- JavaScript Vanilla (sem dependências)
- Node.js (opcional)

---

**Desenvolvido com ❤️ para ConnectLife**
