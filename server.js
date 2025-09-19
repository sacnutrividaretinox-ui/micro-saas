// Importa dependências
const express = require("express");
const path = require("path");

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Servir arquivos estáticos (index.html, css, js, etc)
app.use(express.static(path.join(__dirname)));

// Rota principal → abre o index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Rota de teste para API
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    message: "API funcionando corretamente ✅",
  });
});

// Porta dinâmica do Railway (fallback para 3000 local)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
