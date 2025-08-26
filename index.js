import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config(); // Load variables from .env file


const app = express();
const port = 3000;

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).send("Something went wrong while fetching items.");
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // items.push({title: item});

  // Input validation
  if (!item || !item.trim()) {
    // Don't insert empty items
    return res.redirect("/");
  }
  
  try {
    await pool.query("INSERT INTO items (title) VALUES ($1)", [item.trim()]);
    res.redirect("/");
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).send("Something went wrong while adding the item.");
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await pool.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.error("Error editing item:", err);
    res.status(500).send("Something went wrong while editing the item.");
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await pool.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.error("Error editing item:", err);
    res.status(500).send("Something went wrong while editing the item.");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
