import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "notes",
  password: "3016",
  port: 5432,
});

db.connect();

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY rating DESC");
    const books = result.rows;
    res.render("index.ejs", {
      books: books,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/add", (req, res) => {
  res.render("add.ejs");
});

app.get("/remove", (req, res) => {
  res.render("remove.ejs");
});

app.get("/notes/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const result = await db.query("SELECT * FROM books WHERE isbn = $1", [
      isbn,
    ]);
    const book = result.rows[0];
    res.render("notes.ejs", { isbn: isbn, book: book });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  try {
    const isbn = req.body.isbn;
    const title = req.body.title;
    const date = req.body.date;
    const desc = req.body.desc;
    const notes = req.body.notes;
    const rating = req.body.rating;
    await db.query("INSERT INTO books VALUES ($1, $2, $3, $4, $5, $6)", [
      isbn,
      title,
      date,
      desc,
      notes,
      rating,
    ]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/remove", async (req, res) => {
  try {
    const isbn = req.body.isbn;
    await db.query("DELETE FROM books WHERE isbn = $1", [isbn]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
