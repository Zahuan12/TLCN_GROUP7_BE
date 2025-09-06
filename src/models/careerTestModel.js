module.exports = (sequelize, DataTypes) => {
  const CareerTest = sequelize.define('CareerTest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    result: { type: DataTypes.STRING, allowNull: false }, // ví dụ: Backend, Frontend, Data...
    score: { type: DataTypes.INTEGER }
  }, {
    tableName: 'career_tests',
    timestamps: true
  });

  CareerTest.associate = (models) => {
    CareerTest.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return CareerTest;
};
