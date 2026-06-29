require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
const MP_TOKEN = process.env.MP_ACCESS_TOKEN;

if (!MP_TOKEN) {
    console.error("❌ Crie um arquivo .env com MP_ACCESS_TOKEN=seu_token");
    process.exit(1);
}

const isTestToken = MP_TOKEN.startsWith("TEST-");
const isDev = process.env.NODE_ENV !== "production";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function mpRequest(pathname, options = {}) {
    const response = await fetch(`https://api.mercadopago.com${pathname}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${MP_TOKEN}`,
            ...options.headers,
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const msg = data.message || data.error || `Erro Mercado Pago (${response.status})`;
        throw new Error(msg);
    }

    return data;
}

function getCheckoutUrl(preference) {
    if (isTestToken || isDev) {
        return preference.sandbox_init_point || preference.init_point;
    }
    return preference.init_point || preference.sandbox_init_point;
}

async function criarPreferencia(items) {
    return mpRequest("/checkout/preferences", {
        method: "POST",
        body: JSON.stringify({
            items,
            back_urls: {
                success: `${APP_URL}/sucesso`,
                failure: `${APP_URL}/erro`,
                pending: `${APP_URL}/pendente`,
            },
        }),
    });
}

app.get("/api/status", (req, res) => {
    res.json({
        ok: true,
        mercadoPago: isTestToken ? "teste" : isDev ? "sandbox (dev)" : "producao",
        url: APP_URL,
    });
});

app.post("/criar-pagamento", async (req, res) => {
    try {
        const { title, price, quantity } = req.body;
        const unitPrice = Number(price);

        if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
            return res.status(400).json({ error: "Preço inválido" });
        }

        const preference = await criarPreferencia([
            {
                title: title || "Produto ConnectLife",
                quantity: Number(quantity) || 1,
                unit_price: unitPrice,
                currency_id: "BRL",
            },
        ]);

        res.json({
            id: preference.id,
            init_point: getCheckoutUrl(preference),
        });
    } catch (error) {
        console.error("❌ Pagamento:", error.message);
        res.status(500).json({ error: "Erro ao criar pagamento", detalhes: error.message });
    }
});

app.post("/criar-pagamento-carrinho", async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Carrinho vazio" });
        }

        const mpItems = items.map((item) => {
            const unitPrice = Number(item.unit_price);
            if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
                throw new Error(`Preço inválido: ${item.title || "item"}`);
            }

            return {
                title: String(item.title),
                quantity: Number(item.quantity) || 1,
                unit_price: unitPrice,
                currency_id: "BRL",
            };
        });

        const preference = await criarPreferencia(mpItems);

        res.json({
            id: preference.id,
            init_point: getCheckoutUrl(preference),
        });
    } catch (error) {
        console.error("❌ Carrinho:", error.message);
        res.status(500).json({ error: "Erro ao criar pagamento", detalhes: error.message });
    }
});

app.get("/sucesso", (req, res) => {
    res.send("<h1>Pagamento aprovado ✅</h1><p><a href='/'>Voltar à loja</a></p>");
});

app.get("/erro", (req, res) => {
    res.send("<h1>Pagamento recusado ❌</h1><p><a href='/cart.html'>Tentar novamente</a></p>");
});

app.get("/pendente", (req, res) => {
    res.send("<h1>Pagamento pendente ⏳</h1><p><a href='/'>Voltar à loja</a></p>");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(express.static(path.join(__dirname, "public")));

async function iniciar() {
    try {
        const user = await mpRequest("/users/me");
        console.log(`✅ Token válido — conta MP #${user.id}`);
    } catch (error) {
        console.error("❌ Token inválido ou sem internet:", error.message);
        console.error("   Gere um token novo em: https://www.mercadopago.com.br/developers/panel");
        process.exit(1);
    }

    app.listen(PORT, () => {
        const modo = isTestToken ? "teste" : isDev ? "sandbox (desenvolvimento)" : "produção";
        console.log(`🚀 Loja: ${APP_URL}`);
        console.log(`💳 Mercado Pago: ${modo}`);
        console.log("⚠️  Deixe este terminal aberto");
    });
}

iniciar();
