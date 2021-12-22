const express = require("express");
const mercadopago = require("mercadopago");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors());

mercadopago.configure({
  sandbox: true, //Desenvolvimento
  access_token:
    "TEST-8703045907930339-122023-37b95e86c013f2bf5c3913e7d4e79ebd-262119893",
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

    return res.redirect(pagamento.body.init_point);
  } catch (error) {
    return res.send(error.message);
  }
});

app.post("/not", (req, res) => {
  const id = req.query.id;
  setTimeout(() => {
    const filter = {
      "order.id": id,
    };

    mercadopago.payment
      .search({
        qs: filter,
      })
      .then((data) => {
        const pagamento = data.body.results[0]
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, 20000);
  res.send("Ok");
});

app.listen(process.env.PORT || 443, (req, res) => {
  console.log("App is running");
});
