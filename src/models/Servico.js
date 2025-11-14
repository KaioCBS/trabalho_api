module.exports = (sequelize, DataTypes) => {
  const Servico = sequelize.define('Servico', {
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
    convenio_id: {
         type: DataTypes.INTEGER,
          allowNull: false 
        },
    status: { 
        type: DataTypes.STRING,
         allowNull: false 
        },
  }, {
    tableName: 'servicos', 
    timestamps: true,
    underscored: true,
  });

  Servico.associate = (models) => {
    Servico.belongsTo(models.Convenio, { foreignKey: 'convenio_id', as: 'convenio' });
  };

  return Servico;
};