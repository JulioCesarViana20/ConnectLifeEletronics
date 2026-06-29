const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "public")));

// API REST
app.get("/api", (req, res) => {
  res.json({ message: "ConnectLife API rodando 🚀" });
});

// Exemplo de login (placeholder)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  return res.json({
    user: { email },
    token: "fake-token-123"
  });
});

// Rota para carregar dados dos produtos
app.get("/api/produtos", (req, res) => {
  const produtos = require("./public/data/dados.json");
  res.json(produtos);
});

// Rota padrão para SPA (Single Page Application)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
});