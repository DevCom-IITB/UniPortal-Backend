const mongoose=require('mongoose')

const notificationSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    recipientlist: [{type: String, required: true}],
    senderid: {type: String, required: true},
    contentid: {type: String, required: true},
    content: {type: String },
    sent_At: {type: Date, default: Date.now},
    isseen: {type: Boolean, default: false, required: true},
    isquestion: {type: Boolean, default: false, required: true}
});

const notificationModel = mongoose.model("notificationModel", notificationSchema);

module.exports = notificationModel;
