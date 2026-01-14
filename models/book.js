import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    ISBN: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    total_copies: {
      type: Number,
      default: 0,
    },

    cover_image: {
      type: String,
      default: "", 
    },
  },
  { 
    timestamps: true, 
    collection: 'book',
}
);

export default mongoose.model("Book", bookSchema);
