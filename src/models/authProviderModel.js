module.exports = (sequelize, DataTypes) => {
  const AuthProvider = sequelize.define('AuthProvider', {
    provider: { 
      type: DataTypes.ENUM('LOCAL', 'GOOGLE', 'FACEBOOK'), 
      allowNull: false 
    },
    providerId: { type: DataTypes.STRING }, // GoogleID, FacebookID...
    password: { type: DataTypes.STRING },   // chỉ dùng khi provider = LOCAL
  }, {
    tableName: 'auth_providers'
  });

  AuthProvider.associate = (models) => {
    AuthProvider.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return AuthProvider;
};
