module.exports = (sequelize, DataTypes) => {
  const WebhookProcessado = sequelize.define('WebhookProcessado', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cedente_id: { type: DataTypes.INTEGER, allowNull: false },
    payload: { type: DataTypes.JSONB, allowNull: false },
    processado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'WebhooksProcessados',
    timestamps: false,
  });

  WebhookProcessado.associate = (models) => {
    WebhookProcessado.belongsTo(models.Cedente, { foreignKey: 'cedente_id', as: 'cedente' });
  };

  return WebhookProcessado;
};
