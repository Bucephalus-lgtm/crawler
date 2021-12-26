const mongoose = require('mongoose');
const mongoDbUrl = 'mongodb://localhost:27017/webscrapdb';
// Database connection
mongoose.connect(mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// SOFData model (StackOverFlowData i.e., simply SOFData)
const SOFData = mongoose.model('sof', {
    uniqueURL: { type: String },
    upvote: { type: String },
    answer: { type: String },
    referenceCount: { type: String }
});

// Save data to the database
module.exports.saveToDatabase = async data => {
    try {
        await SOFData.insertMany(data);
        console.log('Data inserted to database successfully!');
    } catch (err) {
        console.error(err);
        throw err;
    }
}