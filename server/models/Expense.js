import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now
  },
  description: {
    type: String,
    trim: true,
    maxlength: [100, 'Description cannot be more than 100 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster querying by date and user
ExpenseSchema.index({ date: 1, user: 1 });
ExpenseSchema.index({ category: 1, user: 1 });

export default mongoose.model('Expense', ExpenseSchema);