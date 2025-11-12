const BlogMediaHandler = require('../../services/blogMediaHandler');

class BlogMediaConsumer {
  constructor(kafka) {
    this.kafka = kafka;
    this.consumer = this.kafka.consumer({ groupId: 'blog-media-group' });
    this.topic = process.env.KAFKA_BLOG_MEDIA_TOPIC || 'blog-media-events';
  }

  async start() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());
        console.log('[Kafka] Received blog media event:', data.blogMediaId);

        try {
          await BlogMediaHandler.uploadAndUpdate(
            data.blogMediaId,
            data.bufferBase64,
            data.type,
            data.blogId
          );

          console.log(`[BlogMediaConsumer] Completed ${data.blogMediaId}`);
        } catch (err) {
          console.error('[BlogMediaConsumer] Upload error:', err.message);
        }
      }
    });

    console.log('[Kafka] BlogMediaConsumer started');
  }
}

module.exports = BlogMediaConsumer;
