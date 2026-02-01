const mongoose = require('mongoose');

async function removeDateFieldsFromTasks() {
  try {
    console.log('Starting to remove date fields from tasks...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/task-management');
    
    console.log('✅ Connected to MongoDB');
    
    // Get reference to tasks collection directly
    const db = mongoose.connection.db;
    const tasksCollection = db.collection('tasks');
    
    // Remove the startDate and deadline fields from all documents
    const result = await tasksCollection.updateMany(
      {}, // Update all documents
      {
        $unset: {
          startDate: "",
          deadline: ""
        }
      }
    );
    
    console.log(`\n✅ Removed date fields from ${result.modifiedCount} tasks`);
    console.log(`📊 Matched ${result.matchedCount} tasks total`);
    
    // Verify removal
    const sampleTask = await tasksCollection.findOne({});
    console.log('\n📋 Sample task after removal:');
    console.log('- Has startDate field:', 'startDate' in sampleTask);
    console.log('- Has deadline field:', 'deadline' in sampleTask);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    console.log('\n🎉 Date fields removed successfully!');
    
  } catch (error) {
    console.error('❌ Error removing date fields:', error.message);
    
    // Try to disconnect even if there's an error
    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting:', disconnectError.message);
    }
    
    process.exit(1);
  }
}

// Run the cleanup
removeDateFieldsFromTasks();