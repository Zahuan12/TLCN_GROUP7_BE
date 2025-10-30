module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    studentId: { type: DataTypes.STRING, unique: true },
    university: { type: DataTypes.STRING },
    major: { type: DataTypes.STRING },
    graduationYear: { type: DataTypes.INTEGER },
    careerInterest: { type: DataTypes.JSON }, // ví dụ: 'BACKEND', 'FRONTEND', 'BA'
  }, {
    tableName: 'students'
  });

  Student.associate = (models) => {
    Student.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Student;
};
