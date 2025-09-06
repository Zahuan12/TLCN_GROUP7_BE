module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define('Blog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    imageUrl: { type: DataTypes.STRING }, // nếu có ảnh
    category: { type: DataTypes.STRING }, // nhóm bài viết
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',   // bảng users
        key: 'id'
      },
      onDelete: 'CASCADE' // nếu user bị xóa thì blog cũng xóa
    }
  }, {
    tableName: 'blog',
    timestamps: true,
    paranoid: true
  });

  Blog.associate = (models) => {
    Blog.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
    Blog.hasMany(models.Comment, { foreignKey: 'postId' });
    Blog.hasMany(models.Like, { foreignKey: 'postId' });
  };

  return Blog;
};
