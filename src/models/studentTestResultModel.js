module.exports = (sequelize, DataTypes) => {
  const StudentTestResult = sequelize.define('StudentTestResult', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    score: { type: DataTypes.FLOAT },
    submittedCode: { type: DataTypes.TEXT },
    startedAt: { type: DataTypes.DATE },
    finishedAt: { type: DataTypes.DATE }
  }, {
    tableName: 'student_test_results',
    timestamps: true
  });

  StudentTestResult.associate = (models) => {
    StudentTestResult.belongsTo(models.Test, { foreignKey: 'testId' });
    StudentTestResult.belongsTo(models.Student, { foreignKey: 'studentId' });
  };

  return StudentTestResult;
};
