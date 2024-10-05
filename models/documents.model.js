import mongoose from 'mongoose';

const documentsSchema = new mongoose.Schema(
  {
    docName: {
      type: String,
      required: true,
    },
    docum: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
 
  },
  { timestamps: true }
);

const Documents = mongoose.model('Documents', documentsSchema);

export default Documents;