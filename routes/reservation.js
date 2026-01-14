import express from "express";
import Reservation from "../models/reservation.js";
import book from "../models/book.js";
import user from "../models/user.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "672f3c2a1a2b3c4d5e6f7890"
 *         book:
 *           type: string
 *           description: MongoDB ObjectId of Book
 *           example: "672f3c2a1a2b3c4d5e6f7891"
 *         user:
 *           type: string
 *           description: MongoDB ObjectId of User
 *           example: "672f3c2a1a2b3c4d5e6f7892"
 *         reserve_date:
 *           type: string
 *           format: date-time
 *           example: "2025-11-01T00:00:00.000Z"
 *         queue_position:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           example: "Pending"
 *         pickup_deadline:
 *           type: string
 *           format: date-time
 *           example: "2025-11-15T09:00:00.000Z"
 */

/**
 * @swagger
 * /reservation:
 *   get:
 *     summary: Retrieve all reservations
 *     description: Returns a list of all reservations (populated with book and user).
 *     responses:
 *       200:
 *         description: A list of reservations
 */
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.user) filter.user = req.query.user;

    const reservation = await Reservation.find(filter)
      .populate("book")
      .populate("user");

    res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /reservation/{id}:
 *   get:
 *     summary: Retrieve a reservation by ID
 *     description: Returns a single reservation by its ID (populated with book and user).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation found
 *       404:
 *         description: Reservation not found
 */
router.get("/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;

    const reservation = await Reservation.findById(reservationId)
      .populate("book")
      .populate("user");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /reservation:
 *   post:
 *     summary: Create a new reservation
 *     description: Creates a new reservation record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", async (req, res) => {
  try {
    const { book, user, reserve_date, queue_position, status, pickup_deadline } =
      req.body;

    // Manual validations (like lab)
    if (!book) return res.status(400).json({ message: "book is required" });
    if (!user) return res.status(400).json({ message: "user is required" });
    if (!reserve_date)
      return res.status(400).json({ message: "reserve_date is required" });
    if (queue_position === undefined || queue_position === null)
      return res.status(400).json({ message: "queue_position is required" });

    // Create and save
    const newReservation = new Reservation({
      book,
      user,
      reserve_date,
      queue_position,
      status, // optional; model has default
      pickup_deadline,
    });

    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    console.error(error);

    // Helpful error message for invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid book/user id format" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /reservation/{id}:
 *   put:
 *     summary: Update a reservation
 *     description: Updates a reservation by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       404:
 *         description: Reservation not found
 */
router.put("/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const updatedData = req.body;

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error(error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid reservation id format" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /reservation/{id}:
 *   delete:
 *     summary: Delete a reservation
 *     description: Deletes a reservation by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       404:
 *         description: Reservation not found
 */
router.delete("/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;

    const deletedReservation = await Reservation.findByIdAndDelete(reservationId);

    if (!deletedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({
      message: "Reservation deleted successfully",
      reservation: deletedReservation,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid reservation id format" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

export default router;
