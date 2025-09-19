const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

// Rota principal -> abre o index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rota de teste da API
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    message: "API funcionando corretamente ✅"
  });
});

// Porta dinâmica do Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
