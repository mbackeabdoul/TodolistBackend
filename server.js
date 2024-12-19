const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { specs, swaggerUi } = require('./swagger');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); 

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/todolist")
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur MongoDB :", err));

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré de la tâche
 *         title:
 *           type: string
 *           description: Titre de la tâche
 *         completed:
 *           type: boolean
 *           description: État de complétion de la tâche
 *           default: false
 */

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Récupère toutes les tâches
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Liste des tâches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des tâches" });
  }
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crée une nouvelle tâche
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tâche créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
app.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task({ title: req.body.title });
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de l'ajout de la tâche" });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Supprime une tâche
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la tâche
 *     responses:
 *       200:
 *         description: Tâche supprimée
 */
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Tâche supprimée" });
  } catch (err) {
    res.status(404).json({ error: "Tâche non trouvée" });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Met à jour une tâche
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la tâche
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tâche mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la mise à jour de la tâche" });
  }
});

app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));