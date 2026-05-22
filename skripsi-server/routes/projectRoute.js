const express = require("express");
const route = express.Router();
const ProjectController = require("../controllers/ProjectController");

route.get("/", ProjectController.getProject);
route.post("/", ProjectController.addProject);
route.get("/:id", ProjectController.getOneProject);
route.delete("/:id", ProjectController.deleteProject);
route.put("/:id", ProjectController.editProject);

module.exports = route;