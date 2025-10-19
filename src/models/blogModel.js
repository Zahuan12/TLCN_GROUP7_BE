// models/blog.js
module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define('Blog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'hidden'),
      defaultValue: 'published'
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'blogs',
    timestamps: true,
    paranoid: true
  });

  Blog.associate = (models) => {
    // Author relation
    Blog.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });

    // Media: one-to-many
    Blog.hasMany(models.BlogMedia, { foreignKey: 'blogId', as: 'media', onDelete: 'CASCADE' });

    // Optional: comments / likes nếu bạn có các model này
    if (models.Comment) {
      Blog.hasMany(models.Comment, { foreignKey: 'postId', as: 'comments' });
    }
    if (models.Like) {
      Blog.hasMany(models.Like, { foreignKey: 'postId', as: 'likes' });
    }
  };

  return Blog;
};
