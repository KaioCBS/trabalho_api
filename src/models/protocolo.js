// src/models/protocolo.js
module.exports = (sequelize, DataTypes) => {
  const Protocolo = sequelize.define('Protocolo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false },
    produto: { type: DataTypes.STRING, allowNull: false },
    dados: { type: DataTypes.JSONB, allowNull: true },
    data_envio: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pendente' },
    softwarehouse_id: { type: DataTypes.INTEGER, allowNull: true },
    cedente_id: { type: DataTypes.INTEGER, allowNull: true },
  }, {
    tableName: 'Protocolos',
    timestamps: false,
  });

  return Protocolo;
};
