import express from "express";
import { appointment, confirmPayment,getAppointment ,updateAppointmentStatus, getAppointmentByEmail} from "../controllers/appointment.controller.js";



const router = express.Router();

router.post("/book-appointment", appointment);
router.put("/confirm-payment/:id", confirmPayment);
router.get("/getAppointment",getAppointment)
router.put('/update-status/:id', updateAppointmentStatus);
router.get('/getAppointment/:email', getAppointmentByEmail);

export default router;
