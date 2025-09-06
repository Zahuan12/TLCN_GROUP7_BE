module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  }, {
    tableName: 'follows',
    timestamps: true
  });

  Follow.associate = (models) => {
    // Ai follow ai
    Follow.belongsTo(models.User, { foreignKey: 'followerId', as: 'follower' });
    Follow.belongsTo(models.User, { foreignKey: 'followingId', as: 'following' });
  };

  return Follow;
};
