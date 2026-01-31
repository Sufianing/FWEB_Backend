import express from "express";
import Book from "../models/book.js";
import BookCopy from "../models/bookCopy.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         ISBN:
 *           type: string
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           example: Available
 */

const router = express.Router();

/**
 * @swagger
 * /book:
 *   get:
 *     summary: Retrieve all books
 *     description: Returns a list of books with computed availability status.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search by title, author, category, or ISBN
 *     responses:
 *       200:
 *         description: List of books
 */
router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    const filter = q
      ? {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { author: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } },
            { ISBN: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const books = await Book.find(filter).lean();

    const copies = await BookCopy.find({
      book: { $in: books.map((b) => b._id) },
    }).lean();

    const copyMap = {};
    copies.forEach((c) => {
      const key = c.book.toString();
      copyMap[key] = copyMap[key] || [];
      copyMap[key].push(c);
    });

    const result = books.map((b) => {
      const bookCopies = copyMap[b._id.toString()] || [];

      let status = "Unavailable";
      if (bookCopies.some((c) => c.status === "Available")) status = "Available";
      else if (bookCopies.some((c) => c.status === "Reserved")) status = "Reserved";
      else if (bookCopies.some((c) => c.status === "On Loan")) status = "On Loan";

      return { ...b, status };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /book/{id}:
 *   get:
 *     summary: Retrieve a book by ID
 *     description: Returns a book with its copies and computed availability status.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book found
 *       404:
 *         description: Book not found
 */
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const copies = await BookCopy.find({ book: book._id }).lean();

    let status = "Unavailable";
    if (copies.some((c) => c.status === "Available")) status = "Available";
    else if (copies.some((c) => c.status === "Reserved")) status = "Reserved";
    else if (copies.some((c) => c.status === "On Loan")) status = "On Loan";

    res.status(200).json({
      ...book,
      status,
      copies, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
