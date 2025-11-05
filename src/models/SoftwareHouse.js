module.exports = (sequelize, DataTypes) => {
  const SoftwareHouse = sequelize.define('SoftwareHouse', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    data_criacao: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    cnpj: { type: DataTypes.STRING(14), allowNull: false, unique: true },
    token: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    configuracao_notificacao: { type: DataTypes.JSONB, allowNull: true },
  }, {
    tableName: 'SoftwareHouses', // ✅
    timestamps: true,
    underscored: true,
  });

  SoftwareHouse.associate = (models) => {
    SoftwareHouse.hasMany(models.Cedente, { foreignKey: 'softwarehouse_id', as: 'cedentes' });
  };

  return SoftwareHouse;
};