// src/models/pix.js
module.exports = (sequelize, DataTypes) => {
  const Pix = sequelize.define('Pix', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'ACTIVE' },
    valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    data_criacao: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    cedente_id: { type: DataTypes.INTEGER, allowNull: true },
  }, {
    tableName: 'Pix',
    timestamps: false,
  });

  return Pix;
};
