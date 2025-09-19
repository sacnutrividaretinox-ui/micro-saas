// server.js
const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname))); // serve arquivos (como index.html)

// 🔑 Credenciais Z-API (configure no Railway em "Variables")
const ZAPI = {
  instanceId: process.env.INSTANCE_ID,
  token: process.env.TOKEN,
  clientToken: process.env.CLIENT_TOKEN
};

// Rota principal -> carrega index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Enviar mensagem única
app.post("/send", async (req, res) => {
  try {
    const { phone, message } = req.body;
    const url = `https://api.z-api.io/instances/${ZAPI.instanceId}/token/${ZAPI.token}/send-text`;

    const response = await axios.post(url, {
      phone,
      message
    }, {
      headers: {
        "Client-Token": ZAPI.clientToken,
        "Content-Type": "application/json"
      }
    });

    res.json({ success: true, data: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Enviar mensagens em massa
app.post("/send-bulk", async (req, res) => {
  try {
    const { contacts, message } = req.body; 
    // contacts deve ser um array de números de telefone

    const results = [];

    for (let phone of contacts) {
      try {
        const url = `https://api.z-api.io/instances/${ZAPI.instanceId}/token/${ZAPI.token}/send-text`;
        const response = await axios.post(url, {
          phone,
          message
        }, {
          headers: {
            "Client-Token": ZAPI.clientToken,
            "Content-Type": "application/json"
          }
        });

        results.push({ phone, status: "ok", data: response.data });
      } catch (e) {
        results.push({ phone, status: "error", error: e.response?.data || e.message });
      }
    }

    res.json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🚀 Porta dinâmica para Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
