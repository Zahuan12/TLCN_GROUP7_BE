module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    companyId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    companyName: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    taxCode: {                      // 👈 Thêm trường mã số thuế
      type: DataTypes.STRING(20),   // đủ cho mã số thuế VN (10–14 ký tự)
      unique: true,                 // tránh trùng lặp giữa các công ty
      allowNull: true               // cho phép null nếu chưa có
    },
    industry: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT }
  }, {
    tableName: 'companies',
    timestamps: true
  });

  Company.associate = (models) => {
    Company.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Company.hasMany(models.CareerPath, { foreignKey: 'companyId', as: 'careerPaths' });
  };

  return Company;
};
