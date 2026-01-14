import mongoose from "mongoose";

const bookCopySchema = new mongoose.Schema(
  {
    copy_id: {
      type: String,
      required: true,
      unique: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    shelf_location: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "On Loan", "Reserved"],
      default: "Available",
    },

    last_seen_zone: {
      type: String,
    },
  },
  { 
    timestamps: true, 
    collection: 'bookCopy',
}
);

export default mongoose.model("BookCopy", bookCopySchema);
