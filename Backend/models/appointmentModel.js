import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  docId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentDate: {
    type: Date,
    default: null
  },
  slotDate: {
    type: String,
    required: true
  },
  slotTime: {
    type: String,
    required: true
  },
  userData: {
    type: Object,
    required: true
  },
  docData: {
    type: Object,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Number,
    required: true
  },
  cancelled: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const appointmentModel = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

export default appointmentModel;