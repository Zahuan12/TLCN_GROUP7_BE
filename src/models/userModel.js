module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: { 
      type: DataTypes.STRING, 
      unique: true, 
      allowNull: false 
    },
    username: { 
      type: DataTypes.STRING, 
      unique: true, 
      allowNull: true   // Cho phép null cho user Google
    },
    fullName: { type: DataTypes.STRING },
    role: { 
      type: DataTypes.ENUM('STUDENT', 'COMPANY', 'ADMIN'), 
      allowNull: false 
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true
  });

  User.associate = (models) => {
    User.hasMany(models.AuthProvider, { foreignKey: 'userId' });
    User.hasMany(models.RefreshToken, { foreignKey: 'userId' });
    User.hasOne(models.Student, { foreignKey: 'userId' });
    User.hasOne(models.Company, { foreignKey: 'userId' });
  };

  return User;
};
