import express from "express";
import Book from "../models/book.js";
import BookCopy from "../models/bookCopy.js";

const router = express.Router();

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
