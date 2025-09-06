module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,              // Kiểu UUID
      defaultValue: DataTypes.UUIDV4,    // Sequelize sẽ auto generate v4 UUID
      primaryKey: true
    },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    fullName: { type: DataTypes.STRING },
    role: { type: DataTypes.ENUM('STUDENT', 'COMPANY', 'ADMIN'), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'users',
    timestamps: true,   // Sequelize sẽ tự thêm createdAt, updatedAt
    paranoid: true      // Thêm deletedAt (soft delete)
  });

  User.associate = (models) => {
    User.hasMany(models.AuthProvider, { foreignKey: 'userId' });
    User.hasMany(models.RefreshToken, { foreignKey: 'userId' });

    User.hasOne(models.Student, { foreignKey: 'userId' });
    User.hasOne(models.Company, { foreignKey: 'userId' });
    // User.hasOne(models.Admin, { foreignKey: 'userId' });
  };

  return User;
};
