const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve index.html

// 🔑 Credenciais Z-API
const ZAPI = {
  instanceId: process.env.INSTANCE_ID,
  token: process.env.TOKEN,
  clientToken: process.env.CLIENT_TOKEN,
  baseUrl: function () {
    return `https://api.z-api.io/instances/${this.instanceId}/token/${this.token}`;
  }
};

// ✅ Status da instância
app.get("/status", async (req, res) => {
  try {
    const r = await axios.get(ZAPI.baseUrl() + "/status", {
      headers: { "Client-Token": ZAPI.clientToken }
    });
    res.json(r.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Enviar texto
app.post("/send-text", async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message) {
      return res.status(400).json({ error: "Telefone e mensagem são obrigatórios" });
    }

    const r = await axios.post(ZAPI.baseUrl() + "/send-text", { phone, message }, {
      headers: { "Client-Token": ZAPI.clientToken }
    });

    res.json(r.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Micro SaaS rodando na porta ${PORT}`));
