const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve index.html

// 🔑 Credenciais Z-API (use variáveis de ambiente no Railway)
const ZAPI = {
  instanceId: process.env.INSTANCE_ID || "3E6DD0DEED00C0FD52197AE2AD17DA62",
  token: process.env.TOKEN || "0BF08CF507E5ECC6C5937E55",
  clientToken: process.env.CLIENT_TOKEN || "F79b1ca9735c54d5b997a92edbe62f596S"
};

// ✅ Rota para verificar status da instância
app.get("/status", async (req, res) => {
  try {
    const url = `https://api.z-api.io/instances/${ZAPI.instanceId}/token/${ZAPI.token}`;
    const response = await axios.get(url, {
      headers: { "Client-Token": ZAPI.clientToken }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Rota para enviar mensagem
app.post("/send", async (req, res) => {
  try {
    const { phone, message } = req.body;
    const url = `https://api.z-api.io/instances/${ZAPI.instanceId}/token/${ZAPI.token}/send-text`;
    const response = await axios.post(
      url,
      { phone, message },
      { headers: { "Client-Token": ZAPI.clientToken } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Rota para pegar QR Code (imagem base64)
app.get("/whatsapp-qr", async (req, res) => {
  try {
    const url = `https://api.z-api.io/instances/${ZAPI.instanceId}/token/${ZAPI.token}/qr-code/image`;
    const response = await axios.get(url, {
      headers: { "Client-Token": ZAPI.clientToken }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota padrão para servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🚀 Porta dinâmica (Railway fornece automaticamente)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Micro SaaS rodando na porta ${PORT}`);
});
