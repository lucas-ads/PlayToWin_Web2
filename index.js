require("dotenv").config();
const conn = require("./db/conn");
const express = require("express");
const handlebars = require("express-handlebars");

const Cartao = require("./models/Cartao");

const Usuario = require("./models/Usuario");
const Jogo = require("./models/Jogo");
const Aquisicao = require("./models/Aquisicao");

const app = express();

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.findAll({ raw: true });
  const msg = req.params.msg;

  res.render("usuarios", { usuarios, msg });
});

app.get("/usuarios/novo", (req, res) => {
  res.render("formUsuario");
});

app.post("/usuarios/novo", async (req, res) => {
  const dadosUsuario = {
    nickname: req.body.nickname,
    nome: req.body.nome,
  };

  const usuario = await Usuario.create(dadosUsuario);

  res.redirect(`/usuarios?msg=Usuário cadastrado com o ID ${usuario.id}`);
  //res.send(`Usuário criado com o ID ${usuario.id}!`);
});

app.get("/usuarios/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);

  const usuario = await Usuario.findByPk(id, { raw: true });

  if (usuario != null) {
    res.render("formUsuario", { usuario });
  } else {
    res.redirect("/usuarios");
  }
});

app.post("/usuarios/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);

  const dadosUsuario = {
    nome: req.body.nome,
    nickname: req.body.nickname,
  };

  Usuario.update(dadosUsuario, { where: { id: id } });

  res.redirect("/usuarios");
});

app.post("/usuarios/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);

  Usuario.destroy({ where: { id: id } });

  res.redirect("/usuarios");
});

//Operações no model Cartao
app.get("/usuarios/:id/cartoes", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, {
    include: Cartao,
  });

  // const cartoes = await Cartao.findAll({
  //   raw: true,
  //   where: { UsuarioId: id },
  // });

  const cartoes = usuario.Cartaos.map((cartao) => cartao.toJSON());

  res.render("cartoes", {
    cartoes,
    usuario: usuario.toJSON(),
  });
});

app.get("/usuarios/:id/novoCartao", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, { raw: true });

  res.render("formCartao", { usuario });
});

app.post("/usuarios/:id/novoCartao", async (req, res) => {
  const id = parseInt(req.params.id);

  const dadosCartao = {
    numero: req.body.numero,
    nome: req.body.nome,
    cvv: req.body.cvv,
    UsuarioId: id,
  };

  await Cartao.create(dadosCartao);

  res.redirect(`/usuarios/${id}/cartoes`);
});

app.listen(process.env.SERVER_PORT, () => {
  console.log("Server rodando!");
});

conn
  .sync()
  .then(() => {
    console.log("Conectado com sucesso!");
  })
  .catch((err) => {
    console.log("Erro: " + err);
  });
