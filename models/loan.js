import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    bookCopy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookCopy",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    loan_date: {
      type: Date,
      required: true,
    },

    due_date: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value > new Date(),
        message: "Due date must be in the future",
      },
    },

    date_returned: {
      type: Date,
      default: null,
    },
  },
  { 
    timestamps: true, 
    collection: 'loan',
}
);

export default mongoose.model("Loan", loanSchema);
