import Appointment from '../models/appointmentModel.js';



export const payAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId, 
      { 
        isPaid: true, 
        paymentDate: new Date() 
      }, 
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ 
      message: 'Payment successful', 
      appointment 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Payment processing failed', 
      error: error.message 
    });
  }
};