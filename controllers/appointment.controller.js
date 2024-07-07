import Appointment from "../models/appointment.model.js";
import Stripe from "stripe";

export const appointment = async (req, res, next) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  });
  const { type, name, email, gender, age, sessionNumber, appointmentDate } =
    req.body;

  const appointmentData = {
    type,
    gender,
    age,
    sessionNumber,
    appointmentDate,
  };

  if (type === "Normal") {
    appointmentData.name = name;
    appointmentData.email = email;
  }

  const newAppointment = new Appointment(appointmentData);

  try {
    const savedAppointment = await newAppointment.save();
    const appointmentId = savedAppointment._id;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      phone_number_collection: {
        enabled: true,
      },
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Appointment Fee",
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout-success?appointmentId=${appointmentId}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout-error?appointmentId=${appointmentId}`,
    });

    res.status(200).json({
      appointment: savedAppointment,
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const confirmPayment = async (req, res) => {
  const { id } = req.params;

  try {
    const updateAppointment = await Appointment.findByIdAndUpdate(
      id,
      { paymentStatus: true },
      { new: true, runValidators: true }
    );
    if (!updateAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(updatevirualclub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
