module.exports = (sequelize, DataTypes) => {
  const Servico = sequelize.define('Servico', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    data_criacao: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    cedente_id: { type: DataTypes.INTEGER, allowNull: false },
    nome: { type: DataTypes.STRING, allowNull: false },
    detalhes: { type: DataTypes.JSONB, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'ativo' }
  }, {
    tableName: 'Servicos',
    timestamps: false
  });

  Servico.associate = (models) => {
    Servico.belongsTo(models.Cedente, { foreignKey: 'cedente_id' });
  };

  return Servico;
};
