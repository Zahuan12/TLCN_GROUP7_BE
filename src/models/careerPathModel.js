module.exports = (sequelize, DataTypes) => {
  const CareerPath = sequelize.define('CareerPath', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT }
  }, {
    tableName: 'career_paths',
    timestamps: true
  });

  CareerPath.associate = (models) => {
    CareerPath.belongsTo(models.Company, { foreignKey: 'companyId' }); // thuộc công ty nào
    CareerPath.hasMany(models.Lesson, { foreignKey: 'careerPathId' });
    CareerPath.hasMany(models.Test, { foreignKey: 'careerPathId' }); // final test của lộ trình
  };

  return CareerPath;
};
