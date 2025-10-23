module.exports = (sequelize, DataTypes) => {
  const Cedente = sequelize.define('Cedente', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    data_criacao: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    cnpj: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: false },
    softwarehouse_id: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'ativo' },
    configuracao_notificacao: { type: DataTypes.JSONB, allowNull: true },
  }, {
    tableName: 'Cedentes',
    timestamps: false,
  });

  Cedente.associate = (models) => {
    Cedente.belongsTo(models.SoftwareHouse, { foreignKey: 'softwarehouse_id', as: 'softwareHouse' });
    Cedente.hasMany(models.Conta, { foreignKey: 'cedente_id', as: 'contas' });
    Cedente.hasMany(models.Convenio, { foreignKey: 'cedente_id', as: 'convenios' });
   Cedente.hasMany(models.WebhookReprocessado, { foreignKey: 'cedente_id', as: 'webhooks' });
  };

  return Cedente;
};
