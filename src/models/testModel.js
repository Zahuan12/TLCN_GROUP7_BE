module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.ENUM('MINI', 'FINAL_PATH'),
      allowNull: false
    },
    content: {
      type: DataTypes.JSON // có thể chứa quiz, coding test, v.v.
    },
    maxScore: {
      type: DataTypes.FLOAT,
      defaultValue: 100
    },
    lessonId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'lessons',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    careerPathId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'career_paths',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  }, {
    tableName: 'tests',
    timestamps: true
  });

  Test.associate = (models) => {
    // Một Test thuộc về Lesson (có thể null nếu là FINAL_PATH)
    Test.belongsTo(models.Lesson, {
      foreignKey: 'lessonId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Một Test thuộc về CareerPath (có thể null nếu là MINI)
    Test.belongsTo(models.CareerPath, {
      foreignKey: 'careerPathId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Một Test có thể có nhiều kết quả của học viên
    Test.hasMany(models.StudentTestResult, {
      foreignKey: 'testId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Test;
};
