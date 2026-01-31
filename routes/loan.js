import express from "express";
import Loan from "../models/loan.js";
import "../models/user.js";
import "../models/bookCopy.js";
import "../models/book.js";

const router = express.Router();

/**
 * @swagger
 * /loan:
 *   get:
 *     summary: Retrieve loans
 *     description: Returns loan records. Can be filtered by user ID.
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: User ID to filter loans
 *     responses:
 *       200:
 *         description: List of loans
 */
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.user) filter.user = req.query.user;

    const loans = await Loan.find(filter)
      .populate("user")
      .populate({
        path: "bookCopy",
        populate: { path: "book" },
      });

    res.status(200).json(loans);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
