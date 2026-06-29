require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos (frontend) - IMPORTANTE: servir da pasta public
app.use(express.static(path.join(__dirname, "public")));

// Cliente Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

// Rota principal (site)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔥 CRIAR PAGAMENTO (PIX + CARTÃO)
app.post("/criar-pagamento", async (req, res) => {
    try {
        const { title, price, quantity } = req.body;

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: [
                    {
                        title: title || "Produto da ConnectLife",
                        quantity: quantity || 1,
                        unit_price: Number(price),
                        currency_id: "BRL",
                    },
                ],

                back_urls: {
                    success: "http://localhost:3000/sucesso",
                    failure: "http://localhost:3000/erro",
                    pending: "http://localhost:3000/pendente",
                },

                auto_return: "approved",
            },
        });

        // link do checkout do Mercado Pago
        res.json({
            id: result.id,
            init_point: result.init_point,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao criar pagamento" });
    }
});

// páginas simples de retorno
app.get("/sucesso", (req, res) => {
    res.send("Pagamento aprovado! ✅");
});

app.get("/erro", (req, res) => {
    res.send("Pagamento recusado ❌");
});

app.get("/pendente", (req, res) => {
    res.send("Pagamento pendente ⏳");
});

// iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});