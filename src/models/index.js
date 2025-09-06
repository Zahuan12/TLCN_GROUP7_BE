const Sequelize = require("sequelize");
const sequelize = require("../configs/database");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require("./userModel")(sequelize, Sequelize.DataTypes);
db.Student = require("./studentModel")(sequelize, Sequelize.DataTypes);
db.Company = require("./companyModel")(sequelize, Sequelize.DataTypes);
db.AuthProvider = require("./authProviderModel")(sequelize, Sequelize.DataTypes);
db.RefreshToken = require("./refreshTokenModel")(sequelize, Sequelize.DataTypes);
db.Blog = require("./blogModel")(sequelize, Sequelize.DataTypes);
db.Comment = require("./commentModel")(sequelize, Sequelize.DataTypes);
db.Like = require("./likeModel")(sequelize, Sequelize.DataTypes);
db.Follow = require("./followModel")(sequelize, Sequelize.DataTypes);
db.Message = require("./messageModel")(sequelize, Sequelize.DataTypes);
db.Conversation = require("./conversationModel")(sequelize, Sequelize.DataTypes);
db.Notification = require("./notificationModel")(sequelize, Sequelize.DataTypes);
db.CareerPath = require("./careerPathModel")(sequelize, Sequelize.DataTypes);
db.Lesson = require("./lessonModel")(sequelize, Sequelize.DataTypes);
db.Test = require("./testModel")(sequelize, Sequelize.DataTypes);
db.StudentTestResult = require("./studentTestResultModel")(sequelize, Sequelize.DataTypes);
db.StudentProgress = require("./studentProgressModel")(sequelize, Sequelize.DataTypes);
db.ChallengeTest = require("./challengeTestModel")(sequelize, Sequelize.DataTypes);
db.ChallengeSubmission = require("./challengeSubmission")(sequelize, Sequelize.DataTypes);
db.CareerTest = require("./careerTestModel")(sequelize, Sequelize.DataTypes);


// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
