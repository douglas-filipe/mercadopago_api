const express = require("express");
const mercadopago = require("mercadopago");
const cors = require("cors")

require("dotenv").config();

const app = express();

app.use(express.json())

app.use(cors())

mercadopago.configure({
  sandbox: true, //Desenvolvimento
  access_token: process.env.TOKEN,
});

app.get("/", (req, res) => {
  res.json("Ola mundo");
});

app.get("/pagar", async (req, res) => {
  const dados = {
    items: [
      (item = {
        id: "" + Date.now(),
        title: "teste",
        quantity: 1,
        currency_id: "BRL",
        unit_price: parseFloat(10),
      }),
    ],

    payer: {
      email: "douglas@gmail.com",
    },
    external_reference: "" + Date.now(),
  };
  try {
    const pagamento = await mercadopago.preferences.create(dados);
    console.log(pagamento);

    return res.redirect(pagamento.body.init_point);
  } catch (error) {
    return res.send(error.message);
  }
});

app.post("/not", (req, res) => {
  console.log(req.query)
  res.send("Ok")
})

app.listen(process.env.PORT || 8080, (req, res) => {
  console.log("App is running");
});
