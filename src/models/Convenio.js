module.exports = (sequelize, DataTypes) => {
  const Convenio = sequelize.define('Convenio', {
    id: { 
        type: DataTypes.INTEGER,
         primaryKey: true,
          autoIncrement: true 
        },
    numero_convenio: {
         type: DataTypes.STRING,
          allowNull: false
         },
    data_criacao: {
         type: DataTypes.DATE,
          allowNull: false,
           defaultValue: DataTypes.NOW
         },
    conta_id: {
         type: DataTypes.INTEGER,
          allowNull: false 
        },
  }, {
    tableName: 'Convenio', 
    timestamps: true,
    underscored: true,
  });

  Convenio.associate = (models) => {
    Convenio.belongsTo(models.Conta, { foreignKey: 'conta_id', as: 'conta' });
    Convenio.hasMany(models.Servico, { foreignKey: 'convenio_id', as: 'servicos' });
  };

  return Convenio;
};