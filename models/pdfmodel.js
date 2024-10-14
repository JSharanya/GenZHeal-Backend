import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
  docName: { type: String, required: true },
  docum: { type: String, required: true }, 
  date: { type: Date, required: true },
}, { timestamps: true }); 

const PdfModel = mongoose.model('Pdf', pdfSchema);

export default PdfModel;
