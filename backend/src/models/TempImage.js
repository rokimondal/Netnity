import mongoose, { Types } from 'mongoose'

const tempImageSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    publicId: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const TempImage = mongoose.model('TempImage', tempImageSchema);
export default TempImage;