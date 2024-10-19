import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      default: "Normal",
    },
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    age: {
      type: String,
      default: null,
    },
    sessionNumber: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      default: "Pending",
    },
    appointmentDate: {
      type: Date,
      default: null,
    },

    paymentStatus: {
      type: Boolean,
      default: false,
    },
    appointmentId: { type: Number, unique: true, required: true },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
