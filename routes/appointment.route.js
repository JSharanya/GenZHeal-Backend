import express from "express";
import { appointment, confirmPayment } from "../controllers/appointment.controller.js";


const router = express.Router();

router.post("/book-appointment", appointment);
router.put("/confirm-payment/:id", confirmPayment);

export default router;
