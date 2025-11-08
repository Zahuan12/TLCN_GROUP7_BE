module.exports = (sequelize, DataTypes) => {
  const CareerPath = sequelize.define('CareerPath', {
    id: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true 
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'companies', key: 'companyId' },
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'career_paths',
    timestamps: true
  });

  CareerPath.associate = (models) => {
    CareerPath.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
    CareerPath.hasMany(models.Lesson, { foreignKey: 'careerPathId' });
    CareerPath.hasMany(models.Test, { foreignKey: 'careerPathId' });
  };

  return CareerPath;
};
