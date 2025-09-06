module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    type: { 
      type: DataTypes.ENUM('MINI', 'FINAL_PATH'), 
      allowNull: false 
    },
    content: { type: DataTypes.JSON }, // quiz hoặc coding
    maxScore: { type: DataTypes.FLOAT, defaultValue: 100 }
  }, {
    tableName: 'tests',
    timestamps: true
  });

  Test.associate = (models) => {
    Test.belongsTo(models.Lesson, { foreignKey: 'lessonId', allowNull: true });
    Test.belongsTo(models.CareerPath, { foreignKey: 'careerPathId', allowNull: true });
    Test.hasMany(models.StudentTestResult, { foreignKey: 'testId' });
  };

  return Test;
};
