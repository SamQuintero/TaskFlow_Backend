"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const getTasks = (req, res) => {
    res.json({ message: "Lista de tareas" });
};
exports.getTasks = getTasks;
const createTask = (req, res) => {
    res.status(201).json({ message: "Tarea creada" });
};
exports.createTask = createTask;
const updateTask = (req, res) => {
    res.json({ message: `Tarea ${req.params.id} actualizada` });
};
exports.updateTask = updateTask;
const deleteTask = (req, res) => {
    res.json({ message: `Tarea ${req.params.id} eliminada` });
};
exports.deleteTask = deleteTask;
