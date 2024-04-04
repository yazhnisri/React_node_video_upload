const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors"); // Import the cors package
const fs = require("fs");

const app = express();
const port = 3001;

// Enable CORS for requests from your frontend
app.use(cors({ origin: "https://cstqkt-3000.csb.app" }));

// Create storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, "public/uploads/");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    console.log("testt dir", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log("filename", file.originalname);
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

// Create multer instance with storage engine
const upload = multer({ storage });

/**
 * Create a simple route to test the server
 */
app.get("/", (req, res) => {
  res.send("Hello World!");
});
/**
 * Upload a file to the server using multer storage engine
 *
 */
app.post("/upload", upload.single("video"), (req, res) => {
  try {
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("File uploaded successfully:", req.file);
    res.json({ success: true });
  } catch (e) {
    console.error("Upload failed:", e);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
