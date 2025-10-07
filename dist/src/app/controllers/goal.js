"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGoal = exports.updateGoal = exports.createGoal = exports.getGoals = void 0;
const getGoals = (req, res) => {
    res.json({ message: "Lista de metas" });
};
exports.getGoals = getGoals;
const createGoal = (req, res) => {
    res.status(201).json({ message: "Meta creada" });
};
exports.createGoal = createGoal;
const updateGoal = (req, res) => {
    res.json({ message: `Meta ${req.params.id} actualizada` });
};
exports.updateGoal = updateGoal;
const deleteGoal = (req, res) => {
    res.json({ message: `Meta ${req.params.id} eliminada` });
};
exports.deleteGoal = deleteGoal;
