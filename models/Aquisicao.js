const conn = require("../db/conn");
const { DataTypes } = require("sequelize");

const Usuario = require("./Usuario");
const Jogo = require("./Jogo");

const Aquisicao = conn.define(
  "Aquisicao",
  {
    precoFinal: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    tableName: "Aquisicoes",
  }
);

Usuario.belongsToMany(Jogo, { through: Aquisicao });
Jogo.belongsToMany(Usuario, { through: Aquisicao });

module.exports = Aquisicao;
