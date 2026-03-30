console.log("🔥 THIS IS MY SERVER FILE RUNNING");

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use(cors());
app.use(express.json());

// 🔥 Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// 🔥 Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

// ✅ DB (Railway)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect((err) => {
  if (err) console.log("❌ DB Error:", err);
  else console.log("✅ Railway MySQL Connected");
});

// 🔥 HOME ROUTE
app.get("/", (req, res) => {
  res.send("🔥 Free Fire Backend Running");
});

// 🔥 CREATE MATCH
app.post("/create-match", (req, res) => {
  const { title, fee, total_slots } = req.body;

  db.query(
    "INSERT INTO matches (title, fee, total_slots) VALUES (?, ?, ?)",
    [title, fee, total_slots],
    (err) => {
      if (err) {
        console.log("❌ CREATE MATCH ERROR:", err);
        return res.json({ success: false });
      }

      res.json({ success: true });
    }
  );
});

// 🔥 DELETE MATCH
app.delete("/delete-match/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM matches WHERE id=?", [id], (err) => {
    if (err) {
      console.log("❌ DELETE MATCH ERROR:", err);
      return res.json({ success: false });
    }

    res.json({ success: true });
  });
});

// 🔥 SUBMIT PAYMENT
app.post("/submit", upload.single("screenshot"), (req, res) => {
  const { name, phone, match_id, player_uid } = req.body;

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const screenshotPath = req.file
    ? `${baseUrl}/uploads/${req.file.filename}`
    : null;

  db.query(
    "INSERT INTO submissions (player_name, phone, match_id, screenshot, player_uid) VALUES (?, ?, ?, ?, ?)",
    [name, phone, match_id, screenshotPath, player_uid || null],
    (err) => {
      if (err) {
        console.log("❌ SUBMIT ERROR:", err);
        return res.json({ success: false });
      }

      res.json({ success: true });
    }
  );
});

// 🔥 MATCHES
app.get("/matches", (req, res) => {
  const query = `
    SELECT m.*,
    (
      SELECT COUNT(*)
      FROM submissions s
      WHERE s.match_id = m.id AND s.status = 'approved'
    ) AS filled_slots
    FROM matches m
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }
    res.json(result);
  });
});

// 🔥 MATCH DETAILS
app.get("/match/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM matches WHERE id=?", [id], (err, result) => {
    if (err || result.length === 0) return res.json(null);
    res.json(result[0]);
  });
});

// 🔥 UPDATE MATCH
app.put("/update-match/:id", (req, res) => {
  const { id } = req.params;
  const { title, fee, total_slots, room_id, room_password } = req.body;

  db.query(
    "UPDATE matches SET title=?, fee=?, total_slots=?, room_id=?, room_password=? WHERE id=?",
    [title, fee, total_slots, room_id || null, room_password || null, id],
    (err) => {
      if (err) {
        console.log(err);
        return res.json({ success: false });
      }

      res.json({ success: true });
    }
  );
});

// 🔥 PLAYERS
app.get("/players/:matchId", (req, res) => {
  const { matchId } = req.params;

  db.query(
    "SELECT player_name, player_uid FROM submissions WHERE match_id=? AND status='approved'",
    [matchId],
    (err, result) => {
      if (err) return res.json([]);
      res.json(result);
    }
  );
});

// 🔥 ADMIN DATA
app.get("/submissions", (req, res) => {
  const query = `
    SELECT s.*, m.title AS match_title
    FROM submissions s
    JOIN matches m ON s.match_id = m.id
    ORDER BY s.id DESC
  `;

  db.query(query, (err, result) => {
    if (err) return res.json([]);
    res.json(result);
  });
});

// 🔥 APPROVE / REMOVE
app.post("/approve", (req, res) => {
  const { id } = req.body;

  db.query("SELECT status FROM submissions WHERE id=?", [id], (err, result) => {
    if (err) return res.json({ success: false });

    const status = result[0].status;

    if (status === "approved") {
      db.query("UPDATE submissions SET status='pending' WHERE id=?", [id]);
      return res.json({ success: true });
    }

    db.query("UPDATE submissions SET status='approved' WHERE id=?", [id]);
    res.json({ success: true });
  });
});

// 🔥 CLEAR ALL SUBMISSIONS
app.delete("/clear-submissions", (req, res) => {
  db.query("DELETE FROM submissions", (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({ success: true });
  });
});

// ================== FRONTEND SERVING (VERY IMPORTANT) ==================

const __dirname = path.resolve();

// Serve frontend build
app.use(express.static(path.join(__dirname, "dist")));

// React router fix
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// 🚀 START SERVER
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
