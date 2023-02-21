const express = require("express");
const router = express.Router();

const db = require("../../models");
const Todo = db.Todo;

//create
router.get("/new", (req, res) => {
  return res.render("new");
});

//confirm create
router.post("/", (req, res) => {
  const UserId = req.user.id;
  const name = req.body.name;

  return Todo.create({ name, UserId })
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

//detail
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const UserId = req.user.id
  return Todo.findOne({
    where: { id, UserId }
  })
    .then((todo) => res.render("detail", { todo: todo.toJSON() }))
    .catch((error) => console.log(error));
});

//update
router.get("/:id/edit", (req, res) => {
  const UserId = req.user.id;
  const id = req.params.id;

  return Todo.findOne({ where: { id, UserId } })
    .then((todo) => res.render("edit", { todo: todo.get() }))
    .catch((error) => console.log(error));
});

//confirm update
router.put("/:id", (req, res) => {
  const UserId = req.user.id;
  const id = req.params.id;
  const { name, isDone } = req.body;
  console.log(req.body);

  return Todo.findOne({ where: { id, UserId } })
    .then((todo) => {
      todo.name = name;
      todo.isDone = isDone === "on";
      return todo.save();
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch((error) => console.log(error));
});

//delete
router.delete("/:id", (req, res) => {
  const UserId = req.user.id;
  const id = req.params.id;

  return Todo.findOne({ where: { id, UserId } })
    .then((todo) => todo.destroy())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

module.exports = router;
