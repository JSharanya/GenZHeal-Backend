import Appointment from "../models/appointment.model.js";
import Stripe from "stripe";
import Counter from "../models/counter.model.js";

export const appointment = async (req, res, next) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  });

  const { type, name, email, gender, age, sessionNumber, appointmentDate } = req.body;

  // Validate request data
  if (!type || !appointmentDate) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // Generate a unique appointmentId
    const appointmentId = await generateAppointmentId();

    const appointmentData = {
      type,
      gender,
      age,
      sessionNumber,
      appointmentDate,
      appointmentId, // Set the generated appointmentId
    };

    if (type === "Normal") {
      appointmentData.name = name;
    }
    appointmentData.email = email;


    const newAppointment = new Appointment(appointmentData);
    const savedAppointment = await newAppointment.save();

    // Create a payment session with Stripe
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
            unit_amount: 1000, // Amount in cents ($10.00)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout-success?appointmentId=${appointmentId}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout-error?appointmentId=${appointmentId}`,
    });

    // Send response with appointment details and Stripe session ID
    res.status(200).json({
      appointment: savedAppointment,
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (err) {
    console.error('Error during appointment creation:', err); // Log the error for debugging
    res.status(400).json({ error: err.message });
  }
};
// Function to generate a unique appointmentId
const generateAppointmentId = async () => {
  const result = await Counter.findOneAndUpdate(
    { name: 'appointmentId' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return result.value;
};


export const confirmPayment = async (req, res) => {
  const { id } = req.params;

  try {
    const updateAppointment = await Appointment.findOneAndUpdate(
      { appointmentId: id }, // Find by appointmentId
      { paymentStatus: true }, // Update paymentStatus to true
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!updateAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(updateAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getAppointment = async (req,res)=>{
    try{
        const response =  await Appointment.find()
        if(!response)
        {
          console.log("no item found")
        }
        res.status(200).json(response);
    }
    catch(err){
        console.error(err,"not found")
    }
}

// In your appointment.controller.js

export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(updatedAppointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getAppointmentByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    
    const appointment = await Appointment.findOne({ email });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAppointmentId = async(req,res) =>{
  try{
      const response = await Appointment.findOne().sort({appointmentId : -1})
      res.status(200).json(response.appointmentId)
      console.log(response.appointmentId);
  }
  catch(err){

  }
}





