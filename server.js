const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Variáveis de ambiente (configure no Railway → "Variables")
const INSTANCE_ID = process.env.INSTANCE_ID;
const TOKEN = process.env.TOKEN;
const CLIENT_TOKEN = process.env.CLIENT_TOKEN;

// ✅ Rota inicial para teste
app.get("/", (req, res) => {
  res.send("🚀 Micro-SaaS rodando no Railway!");
});

// ✅ Rota para enviar mensagem pelo WhatsApp via Z-API
app.post("/send", async (req, res) => {
  try {
    const { phone, message } = req.body;

    const url = `https://api.z-api.io/instances/${INSTANCE_ID}/token/${TOKEN}/send-text`;

    const response = await axios.post(
      url,
      { phone, message },
      { headers: { "Client-Token": CLIENT_TOKEN } }
    );

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ✅ Configuração da porta dinâmica exigida pelo Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
