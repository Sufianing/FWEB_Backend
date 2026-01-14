import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    student_id: {
      type: String,
      default: null, 
    },

    name: {
      type: String,
      required: true,
    },

    user_type: {
      type: String,
      enum: ["Student", "Librarian"],
      required: true,
    },

    current_fine_total: {
      type: Number,
      default: 0,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      default: null, 
    },
  },
  { 
    timestamps: true, 
    collection: 'user',
}
);

export default mongoose.model("User", userSchema);
