module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    message: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('SYSTEM', 'FOLLOW', 'COMMENT', 'LIKE'), defaultValue: 'SYSTEM' },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'notifications',
    timestamps: true
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'userId' }); // gửi tới user nào
  };

  return Notification;
};
