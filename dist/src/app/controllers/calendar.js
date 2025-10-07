"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = exports.syncCalendar = void 0;
const syncCalendar = (req, res) => {
    res.json({ message: "Calendario sincronizado con éxito" });
};
exports.syncCalendar = syncCalendar;
const getEvents = (req, res) => {
    res.json({ message: "Eventos obtenidos del calendario" });
};
exports.getEvents = getEvents;
