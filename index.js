import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
});

// checkAge middleware
function checkAge(req, res, next) {
  const age = req.query.age;
  if (!age || Number(age) < 18) {
    return res.status(400).json({ error: "Bạn chưa đủ 18 tuổi" });
  }
  next();
}

// GET /api/info
app.get("/api/info", checkAge, (req, res) => {
  const { name, age } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Thiếu tên" });
  }
  res.json({
    name,
    age: Number(age),
    message: `Chào mừng ${name}!`,
  });
});

// POST /api/register
let nextId = 1;

app.post("/api/register", (req, res) => {
  const { name, age, email } = req.body;

  if (!name || !age || !email) {
    return res.status(400).json({ error: "Thiếu thông tin" });
  }

  const user = {
    id: nextId++,
    name,
    age: Number(age),
    email,
  };

  res.json(user);
});

// static file
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
