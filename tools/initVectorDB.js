const vectorService = require('../src/services/vectorService');
const qdrantConfig = require('../src/configs/qdrant');

async function initializeVectorDB() {
    try {
        console.log('=== Vector Database Initialization ===');
        
        // Test Qdrant connection
        console.log('Testing Qdrant connection...');
        const isConnected = await qdrantConfig.testConnection();
        
        if (!isConnected) {
            console.error('❌ Qdrant connection failed. Make sure Qdrant server is running.');
            console.log('To start Qdrant locally with Docker:');
            console.log('docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant');
            process.exit(1);
        }
        
        console.log('✅ Qdrant connection successful');
        
        // Initialize collections and embeddings
        await vectorService.initializeVectorDatabase();
        
        console.log('🎉 Vector database initialization completed successfully!');
        console.log('You can now use semantic search in your AI service.');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Vector database initialization failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run the initialization
if (require.main === module) {
    initializeVectorDB();
}

module.exports = { initializeVectorDB };