module.exports = (sequelize, DataTypes) => {
  const WebhookReprocessado = sequelize.define('WebhookReprocessado', {
    id: {
         type: DataTypes.UUID,
          primaryKey: true,
           defaultValue: DataTypes.UUIDV4 
        },
    data: { 
        type: DataTypes.JSONB,
         allowNull: false 
        },
    data_criacao: {
         type: DataTypes.DATE,
          allowNull: false,
           defaultValue: DataTypes.NOW
         },
    cedente_id: {
         type: DataTypes.INTEGER,
          allowNull: false
         },
    kind: {
         type: DataTypes.STRING,
          allowNull: false 
        },
    type: {
         type: DataTypes.STRING,
          allowNull: false 
        },
    servico_id: {
         type: DataTypes.TEXT,
          allowNull: false 
        }, 
    protocolo: { 
        type: DataTypes.STRING,
         allowNull: false
         },
  }, {
    tableName: 'WebhookReprocessado', 
    timestamps: true,
    underscored: true,
  });

  WebhookReprocessado.associate = (models) => {
    WebhookReprocessado.belongsTo(models.Cedente, { foreignKey: 'cedente_id', as: 'cedente' });
  };

  return WebhookReprocessado;
};