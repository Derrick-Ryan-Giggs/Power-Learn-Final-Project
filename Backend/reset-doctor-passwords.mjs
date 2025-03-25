import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Doctor from './models/doctorModel.js';

// Connect to your MongoDB
mongoose.connect('mongodb+srv://RyanGiggs:Rayann18@cluster0.tsi78.mongodb.net/MediLink?retryWrites=true&w=majority')
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));

async function resetAllDoctorPasswords() {
  try {
    const temporaryPassword = 'DoctorTemp123'; // Choose a secure temporary password
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
    
    const result = await Doctor.updateMany(
      {}, // Empty filter means all documents
      { $set: { password: hashedPassword } }
    );
    
    console.log(`Updated ${result.modifiedCount} doctor accounts`);
    console.log(`New temporary password for all doctors: ${temporaryPassword}`);
  } catch (error) {
    console.error('Error resetting passwords:', error);
  }
}

resetAllDoctorPasswords()
  .then(() => console.log('Password reset complete'))
  .catch(err => console.error('Password reset failed:', err))
  .finally(() => mongoose.connection.close());