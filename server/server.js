//imports
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const dbConnections = require("./config/database.js");
const session = require("express-session");
const { Server } = require("socket.io");
const http = require("http");
const multer = require('multer')

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 5mb.
    fileSize: 5 * 1024 * 1024,
  },
});

//app
const app = express();
app.use(multerMid.array('file', 6))

//db
dbConnections.connectMongoDB();

//middleware
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
//session initialization
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: Number(process.env.COOKIE_EXPIRES), // 1 hours
      secure: false, // set to true if you're using https
      httpOnly: true,
    },
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID>: ${socket.id} joined rom: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.use(bodyParser.json());
// app.use(cors({ origin: true, credentials: true }));

//routes
const petRoutes = require("./routes/petRoutes");
app.use("/api", petRoutes);

//imported adoption routes
const adoptionRoutes = require('./routes/adoptionRoutes.js');
app.use('/api/adoptionRequests', adoptionRoutes);

const authRoutes = require("./routes/authRoutes.js");
app.use("/api/auth", authRoutes);

const eventRoutes = require("./routes/eventRoutes.js");
app.use("/api/event", eventRoutes);

const careTakersBooking = require("./routes/careTakersBookingRouter.js")
app.use("/api", careTakersBooking);

const careTakersRoutes = require("./routes/careTakersRoutes.js");
app.use("/api", careTakersRoutes);

const dayCaresRoutes = require("./routes/dayCareRoutes.js");
app.use("/api", dayCaresRoutes);

const dayCaresBooking = require("./routes/dayCaresBookingRoutes.js")
app.use("/api", dayCaresBooking);

const lostAndFoundPets = require("./routes/lostAndFoundPetsRoutes.js");
app.use("/api", lostAndFoundPets);

const petServiceCenterRoutes = require("./routes/petServiceCentersRoutes.js");
app.use("/api/pet-service-centers", petServiceCenterRoutes);

//port
const port = process.env.PORT || 8080;

//listener
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
