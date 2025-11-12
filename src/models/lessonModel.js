module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT }, // nội dung bài học
    order: { type: DataTypes.INTEGER }, // thứ tự trong lộ trình
    careerPathId: {
      type: DataTypes.UUID,
      references: { model: 'career_paths', key: 'id' },
      onDelete: 'CASCADE'}
  }, {
    tableName: 'lessons',
    timestamps: true
  });

  Lesson.associate = (models) => {
    Lesson.belongsTo(models.CareerPath, { foreignKey: 'careerPathId' });
    Lesson.hasMany(models.Test, { foreignKey: 'lessonId' }); // test gắn với lesson
  };

  return Lesson;
};