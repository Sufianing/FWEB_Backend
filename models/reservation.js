import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reserve_date: {
      type: Date,
      required: true,
    },

    queue_position: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Collected", "Cancelled", "Expired"],
      default: "Pending",
    },

    pickup_deadline: {
      type: Date,
    },
  },
  { 
    timestamps: true, 
    collection: 'reservation',
}
);

export default mongoose.model("Reservation", reservationSchema);
