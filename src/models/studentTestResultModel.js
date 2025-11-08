module.exports = (sequelize, DataTypes) => {
  const StudentTestResult = sequelize.define('StudentTestResult', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    score: { type: DataTypes.FLOAT },
    testId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'tests', key: 'id' },
      onDelete: 'CASCADE'
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'students', key: 'userId' }, // 👈 đổi lại ở đây
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'student_test_results',
    timestamps: true
  });

  StudentTestResult.associate = (models) => {
    StudentTestResult.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
  };

  return StudentTestResult;
};
