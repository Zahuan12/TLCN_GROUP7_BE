module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    studentId: {
      type: DataTypes.UUID,
      primaryKey: true, // dùng làm khóa chính luôn
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    major: { type: DataTypes.STRING },
    school: { type: DataTypes.STRING },
    // các thông tin khác của sinh viên
  }, {
    tableName: 'students',
    timestamps: true
  });

  Student.associate = (models) => {
    Student.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

    // các mối quan hệ khác
    Student.hasMany(models.StudentTestResult, { foreignKey: 'studentId', as: 'testResults' });
  };

  return Student;
};
