import mongoose from 'mongoose';

const EmailTemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  footer: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, // Store the URL of the uploaded image
    required: false,
  },
});

export default mongoose.models.EmailTemplate ||
  mongoose.model('EmailTemplate', EmailTemplateSchema);
