module.exports = (sequelize, DataTypes) => {
  const Cedente = sequelize.define('Cedente', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
         },
    data_criacao: { 
        type: DataTypes.DATE,
        allowNull: false,
         defaultValue: DataTypes.NOW
         },
    cnpj: { 
        type: DataTypes.STRING(14),
         allowNull: false,
          unique: true
         },
    token: { 
        type: DataTypes.STRING,
         allowNull: false
         },
    softwarehouse_id: { 
        type: DataTypes.INTEGER,
         allowNull: false
         },
    status: { 
        type: DataTypes.STRING,
         allowNull: false
         },
    configuracao_notificacao: { 
        type: DataTypes.JSONB,
         allowNull: true
         },
  });

    Cedente.associate = (models) => {
    Cedente.belongsTo(models.SoftwareHouse, { foreignKey: 'softwarehouse_id', as: 'softwarehouse' });
    Cedente.hasMany(models.Conta, { foreignKey: 'cedente_id', as: 'contas' });
    Cedente.hasMany(models.WebhookReprocessado, { foreignKey: 'cedente_id', as: 'webhooks' });
  };

  return Cedente;
};
