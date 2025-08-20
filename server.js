require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const Todo = require("./model/todo.js");

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/todo";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", async (req, res) => {
  try {
    const todoInfo = req.body;
    if (!todoInfo.todo) {
      return res.json({ Success: "0", message: "No todo provided" });
    }

    const lastTodo = await Todo.findOne().sort({ _id: -1 }).limit(1);
    const c = lastTodo ? lastTodo.unique_id + 1 : 1;

    const newTodo = new Todo({
      unique_id: c,
      title: todoInfo.todo,
    });

    await newTodo.save();
    res.json({ Success: "1" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Success: "0", error: err.message });
  }
});

app.get("/show", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/todo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Todo.findOneAndDelete({ unique_id: id });
    res.send("Success");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Todo app running on http://localhost:${PORT}`);
});
