module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    token: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    expiresAt: { 
      type: DataTypes.DATE, 
      allowNull: false 
    },
    // 👇 Thêm khóa ngoại userId
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // Tên bảng User
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'refresh_tokens'
  });

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return RefreshToken;
};
