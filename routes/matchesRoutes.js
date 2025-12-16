import express from "express";
import {
    getLiveMatches,
    getTodayMatches,
    getWeekMatches,
    getMonthMatches,
    getSources
} from "../backend/scraper/main.js";

const router = express.Router();

router.get("/live", async (req, res) => {
    res.json(await getLiveMatches());
});

router.get("/today", async (req, res) => {
    res.json(await getTodayMatches());
});

router.get("/week", async (req, res) => {
    res.json(await getWeekMatches());
});

router.get("/month", async (req, res) => {
    res.json(await getMonthMatches());
});

router.get("/sources", (req, res) => {
    res.json(getSources());
});

export default router;
