const mongoose = require('mongoose')


const connectDB = async () => {
    // Connect to MongoDB
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI) 
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
    // If there is an error, log it and exit the process
    catch (err) {
        console.error(err) 
        process.exit(1) // Exit with failure
    }
}
// Export the function so that it can be used in other files
module.exports = connectDB

