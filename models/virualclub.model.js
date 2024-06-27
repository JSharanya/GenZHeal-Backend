import mongoose from 'mongoose';

const virualclubSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        'https://www.verywellhealth.com/thmb/O9Jf7NHIjmQlevzFLb0Ki9GmAtQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1301448265-4f6fe4dcc72c415dac170062bc2d58b4.jpg',
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
    type: {
      type: String,
      default: 'untype',
    }, 
    link: {
      type: String,
      default:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    },
 
  },
  { timestamps: true }
);

const Virualclub = mongoose.model('Virual', virualclubSchema);

export default Virualclub;