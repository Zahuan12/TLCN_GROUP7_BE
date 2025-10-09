// src/configs/kafka.js
const { Kafka } = require("kafkajs");
require("dotenv").config();

/**
 * 🔧 Broker configuration:
 * - Nếu backend chạy ngoài Docker → dùng localhost:29092
 * - Nếu backend chạy trong Docker → dùng kafka:9092
 * - Có thể override bằng biến môi trường KAFKA_BROKERS
 */
const defaultBrokers =
  process.env.NODE_ENV === "docker"
    ? ["kafka:9092"]
    : ["localhost:29092"];

// Cho phép override qua biến môi trường KAFKA_BROKERS
const brokers = process.env.KAFKA_BROKERS
  ? process.env.KAFKA_BROKERS.split(",").map(b => b.trim())
  : defaultBrokers;

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "my-app",
  brokers,
  retry: {
    retries: 10, // Tăng số lần retry để chờ Kafka khởi động
    initialRetryTime: 300,
  },
  connectionTimeout: 10000, // 10s timeout cho mỗi kết nối
});

console.log("🚀 Kafka config:");
console.log("  NODE_ENV     =", process.env.NODE_ENV);
console.log("  Kafka brokers =", brokers.join(", "));

module.exports = kafka;
