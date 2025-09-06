module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    companyId: { type: DataTypes.STRING, unique: true },
    companyName: { type: DataTypes.STRING, allowNull: false },
    industry: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT }
  }, {
    tableName: 'companies'
  });

  Company.associate = (models) => {
    Company.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Company;
};
