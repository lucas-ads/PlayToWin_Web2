const conn = require("../db/conn");
const { DataTypes } = require("sequelize");

const Jogo = conn.define("Jogo", {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Jogo;
