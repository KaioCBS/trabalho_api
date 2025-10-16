module.exports = (sequelize, DataTypes) => {
  const Conta = sequelize.define('Conta', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    data_criacao: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    cedente_id: { type: DataTypes.INTEGER, allowNull: false },
    descricao: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'ativo' }
  }, {
    tableName: 'Contas',
    timestamps: false
  });

  Conta.associate = (models) => {
    Conta.belongsTo(models.Cedente, { foreignKey: 'cedente_id' });
  };

  return Conta;
};
