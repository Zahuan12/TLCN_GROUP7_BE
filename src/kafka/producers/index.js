const MailProducer = require("./mailProducer");
const BlogMediaProducer = require("./blogMediaProducer");
const CourseImageProducer = require("./courseImageProducer");
const ChallengeTestProducer = require("./challengeTestProducer");

module.exports = {
  mailProducer: MailProducer,
  blogMediaProducer: BlogMediaProducer,
  courseImageProducer: CourseImageProducer,
  challengeTestProducer: ChallengeTestProducer,
};
