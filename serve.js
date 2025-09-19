const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const ZAPI = {
  instanceId: "3E6DD0DEED00C0FD52197AE2AD17DA62",
  token: "0BF08CF507E5ECC6C5937E55",
  clientToken: "Fff96312c20d64274bc54226e2d7d30c2S",
  baseUrl() {
    return `https://api.z-api.io/instances/${this.instanceId}/token/${this.token}`;
  }
};

// rota de teste
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// rota de envio
app.post("/send-message", async (req, res) => {
  try {
    const { phone, message, title, footer, buttonActions } = req.body;

    let url = ZAPI.baseUrl() + "/send-text";
    let payload = { phone, message };

    if (buttonActions && buttonActions.length > 0) {
      url = ZAPI.baseUrl() + "/send-button-actions";
      payload = { phone, message, title, footer, buttonActions };
    }

    const response = await axios.post(url, payload, {
      headers: { "Client-Token": ZAPI.clientToken }
    });

    res.json(response.data); // 🔥 garante que devolve JSON pro front
  } catch (err) {
    res.status(500).json({
      error: err.message,
      details: err.response?.data || null
    });
  }
});

app.listen(3000, () => {
  console.log("🚀 Micro SaaS rodando na porta 3000");
});
