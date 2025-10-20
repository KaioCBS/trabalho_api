module.exports = (sequelize, DataTypes) => {
  const Convenio = sequelize.define('Convenio', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    data_criacao: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    cedente_id: { type: DataTypes.INTEGER, allowNull: false },
    numero: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'ativo' }
  }, {
    tableName: 'Convenios',
    timestamps: false
  });

  Convenio.associate = (models) => {
    Convenio.belongsTo(models.Cedente, { foreignKey: 'cedente_id' });
  };

  return Convenio;
};
