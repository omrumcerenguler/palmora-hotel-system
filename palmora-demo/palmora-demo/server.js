import express from "express";
import fs from "fs";
import path from "path";
import process from "node:process";
import { Buffer } from "node:buffer";
import crypto from "crypto";
import { fileURLToPath } from "url";
import initSqlJs from "sql.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "palmora-demo.sqlite");
const PORT = Number(process.env.PORT || 3001);

const ROOM_DESCRIPTIONS = {
  "Ocean View":
    "Enjoy breathtaking ocean views from your private balcony. Modern comfort and tropical elegance for a perfect stay.",
  "Garden View":
    "Relax in a peaceful garden atmosphere surrounded by tropical greenery. A cozy escape designed for comfort and serenity.",
  Suites:
    "Experience luxury and spacious living with elegant interiors and stunning resort views. Perfect for a premium Palmora stay.",
};

const ROOM_GUEST_LABELS = {
  "Ocean View": 3,
  "Garden View": 2,
  Suites: 4,
};

const ROOM_IMAGE_STYLES = {
  "ocean-view": { accent: "#2b8fb5", title: "Ocean View" },
  "garden-view": { accent: "#4f8b55", title: "Garden View" },
  suites: { accent: "#8b6a3d", title: "Suites" },
};

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

const SQL = await initSqlJs({
  locateFile: (fileName) =>
    fileURLToPath(
      new URL(`./node_modules/sql.js/dist/${fileName}`, import.meta.url),
    ),
});

const database = loadDatabase();
initializeSchema(database);
seedDatabase(database);
persistDatabase(database);

function loadDatabase() {
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    return new SQL.Database(fileBuffer);
  }

  return new SQL.Database();
}

function persistDatabase(db = database) {
  const exported = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(exported));
}

function initializeSchema(db) {
  db.run("PRAGMA foreign_keys = ON;");
  db.run(`
    CREATE TABLE IF NOT EXISTS HOTEL (
      HotelID INTEGER PRIMARY KEY AUTOINCREMENT,
      Name TEXT NOT NULL,
      Address TEXT NOT NULL,
      City TEXT NOT NULL,
      StarRating INTEGER NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS GUEST (
      GuestID INTEGER PRIMARY KEY AUTOINCREMENT,
      FirstName TEXT NOT NULL,
      LastName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      PhoneNumber TEXT,
      Address TEXT,
      Password TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS ROOM (
      RoomID INTEGER PRIMARY KEY AUTOINCREMENT,
      HotelID INTEGER NOT NULL,
      RoomNumber TEXT NOT NULL,
      Type TEXT NOT NULL,
      Price REAL NOT NULL,
      Availability INTEGER NOT NULL CHECK (Availability IN (0, 1)),
      FOREIGN KEY (HotelID) REFERENCES HOTEL (HotelID)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS RESERVATION (
      ReservationID INTEGER PRIMARY KEY AUTOINCREMENT,
      GuestID INTEGER NOT NULL,
      RoomID INTEGER NOT NULL,
      CheckInDate TEXT NOT NULL,
      CheckOutDate TEXT NOT NULL,
      TotalAmount REAL NOT NULL,
      Status TEXT NOT NULL CHECK (Status IN ('Pending', 'Confirmed', 'Checked-in', 'Cancelled')),
      FOREIGN KEY (GuestID) REFERENCES GUEST (GuestID),
      FOREIGN KEY (RoomID) REFERENCES ROOM (RoomID)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS PAYMENT (
      PaymentID INTEGER PRIMARY KEY AUTOINCREMENT,
      ReservationID INTEGER NOT NULL,
      Amount REAL NOT NULL,
      PaymentDate TEXT NOT NULL,
      PaymentMethod TEXT NOT NULL,
      Status TEXT NOT NULL CHECK (Status IN ('Pending', 'Success', 'Failed')),
      FOREIGN KEY (ReservationID) REFERENCES RESERVATION (ReservationID)
    );
  `);
}

function seedDatabase(db) {
  const hotelCount = Number(
    queryOne("SELECT COUNT(*) AS count FROM HOTEL", [], db)?.count || 0,
  );
  if (hotelCount > 0) {
    return;
  }

  db.run("BEGIN IMMEDIATE TRANSACTION;");
  try {
    db.run(
      "INSERT INTO HOTEL (Name, Address, City, StarRating) VALUES (?, ?, ?, ?)",
      ["Palmora Famagusta Resort", "Palmora Coastal Avenue", "Famagusta", 5],
    );
    db.run(
      "INSERT INTO HOTEL (Name, Address, City, StarRating) VALUES (?, ?, ?, ?)",
      ["Palmora Garden Retreat", "North Shore Road", "Kyrenia", 4],
    );
    db.run(
      "INSERT INTO HOTEL (Name, Address, City, StarRating) VALUES (?, ?, ?, ?)",
      ["Palmora City Hotel", "Central Boulevard", "Nicosia", 4],
    );

    db.run(
      "INSERT INTO GUEST (FirstName, LastName, email, PhoneNumber, Address, Password) VALUES (?, ?, ?, ?, ?, ?)",
      [
        "Demo",
        "Guest",
        "demo@palmora.com",
        "+90 555 111 22 33",
        "Palmora Resort",
        "demo1234",
      ],
    );

    db.run(
      "INSERT INTO ROOM (HotelID, RoomNumber, Type, Price, Availability) VALUES (?, ?, ?, ?, ?)",
      [1, "101", "Ocean View", 220, 1],
    );
    db.run(
      "INSERT INTO ROOM (HotelID, RoomNumber, Type, Price, Availability) VALUES (?, ?, ?, ?, ?)",
      [2, "202", "Garden View", 190, 1],
    );
    db.run(
      "INSERT INTO ROOM (HotelID, RoomNumber, Type, Price, Availability) VALUES (?, ?, ?, ?, ?)",
      [1, "303", "Suites", 350, 1],
    );

    db.run("COMMIT;");
  } catch (error) {
    db.run("ROLLBACK;");
    throw error;
  }
}

function queryOne(sql, params = [], db = database) {
  const statement = db.prepare(sql);
  statement.bind(params);
  try {
    if (!statement.step()) {
      return null;
    }

    return statement.getAsObject();
  } finally {
    statement.free();
  }
}

function queryAll(sql, params = [], db = database) {
  const statement = db.prepare(sql);
  statement.bind(params);
  const rows = [];
  try {
    while (statement.step()) {
      rows.push(statement.getAsObject());
    }
    return rows;
  } finally {
    statement.free();
  }
}

function beginTransaction() {
  database.run("BEGIN IMMEDIATE TRANSACTION;");
}

function commitTransaction() {
  database.run("COMMIT;");
  persistDatabase();
}

function rollbackTransaction() {
  database.run("ROLLBACK;");
}

function withTransaction(work) {
  beginTransaction();
  try {
    const value = work();
    commitTransaction();
    return value;
  } catch (error) {
    rollbackTransaction();
    throw error;
  }
}

function firstNonEmpty(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }

  return "";
}

function splitFullName(fullName) {
  const cleaned = firstNonEmpty(fullName) || "Guest User";
  const firstSpaceIndex = cleaned.indexOf(" ");

  if (firstSpaceIndex === -1) {
    return {
      firstName: cleaned,
      lastName: "",
    };
  }

  return {
    firstName: cleaned.slice(0, firstSpaceIndex).trim(),
    lastName: cleaned.slice(firstSpaceIndex + 1).trim(),
  };
}

function normalizeEmail(value) {
  return firstNonEmpty(value).toLowerCase();
}

function isValidDate(value) {
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}

function buildRoomImageSvg(title, accent) {
  const safeTitle = String(title)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="620" viewBox="0 0 900 620">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#0b2f35" stop-opacity="1" />
    </linearGradient>
  </defs>
  <rect width="900" height="620" rx="42" fill="url(#bg)" />
  <circle cx="740" cy="160" r="96" fill="rgba(255,255,255,0.12)" />
  <circle cx="180" cy="460" r="150" fill="rgba(255,255,255,0.1)" />
  <text x="72" y="198" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700">Palmora</text>
  <text x="72" y="270" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="34" opacity="0.92">${safeTitle}</text>
  <text x="72" y="352" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="24" opacity="0.82">Hotel Reservation System</text>
</svg>`;
}

function roomImagePath(type) {
  if (type === "Ocean View") {
    return "/api/room-images/ocean-view.svg";
  }

  if (type === "Garden View") {
    return "/api/room-images/garden-view.svg";
  }

  return "/api/room-images/suites.svg";
}

function roomCapacity(type) {
  return ROOM_GUEST_LABELS[type] || 2;
}

function roomDescription(type) {
  return (
    ROOM_DESCRIPTIONS[type] ||
    "Comfortable Palmora accommodation ready for your stay."
  );
}

function normalizeSearchValue(value, fallback) {
  return firstNonEmpty(value) || fallback;
}

function normalizeRoomResponse(room, guestCount) {
  const type = room.Type;
  return {
    id: Number(room.RoomID),
    RoomID: Number(room.RoomID),
    hotelId: Number(room.HotelID),
    HotelID: Number(room.HotelID),
    hotelName: room.HotelName,
    name: type,
    type,
    price: Number(room.Price),
    image: roomImagePath(type),
    description: roomDescription(type),
    guests: `${roomCapacity(type) || guestCount} Guests`,
    availability: Number(room.Availability),
    city: room.City,
    roomNumber: room.RoomNumber,
    starRating: Number(room.StarRating),
  };
}

function findReservationOverlap(roomId, checkInDate, checkOutDate) {
  return queryOne(
    `
      SELECT ReservationID
      FROM RESERVATION
      WHERE RoomID = ?
        AND Status IN ('Pending', 'Confirmed', 'Checked-in')
        AND date(CheckInDate) < date(?)
        AND date(CheckOutDate) > date(?)
      LIMIT 1
    `,
    [roomId, checkOutDate, checkInDate],
  );
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: path.basename(DB_PATH) });
});

app.get("/api/room-images/:slug.svg", (req, res) => {
  const imageStyle =
    ROOM_IMAGE_STYLES[req.params.slug] || ROOM_IMAGE_STYLES["suites"];
  res.type("image/svg+xml");
  res.send(buildRoomImageSvg(imageStyle.title, imageStyle.accent));
});

app.post("/api/auth/signup", (req, res) => {
  const body = req.body || {};
  const fullName = firstNonEmpty(body["Full Name"], body.fullName, body.name);
  const email = normalizeEmail(body.email);
  const password = firstNonEmpty(body.password, body.Password);
  const phoneNumber = firstNonEmpty(
    body.PhoneNumber,
    body.phoneNumber,
    body.phone,
  );
  const address = firstNonEmpty(body.Address, body.address);
  const { firstName, lastName } = splitFullName(fullName);

  if (!email || !password) {
    return res.status(400).json({
      error: "ValidationError",
      message: "Email and password are required.",
    });
  }

  try {
    const existingGuest = queryOne(
      "SELECT GuestID FROM GUEST WHERE lower(email) = lower(?)",
      [email],
    );
    if (existingGuest) {
      return res.status(409).json({
        error: "GuestAlreadyExistsException",
        message: "A guest with this email already exists.",
      });
    }

    database.run("BEGIN IMMEDIATE TRANSACTION;");
    database.run(
      "INSERT INTO GUEST (FirstName, LastName, email, PhoneNumber, Address, Password) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName || "Guest", lastName, email, phoneNumber, address, password],
    );
    const guestRow = queryOne("SELECT last_insert_rowid() AS id");
    database.run("COMMIT;");
    persistDatabase();

    return res.status(201).json({
      message: "Signup successful.",
      token: `session_${crypto.randomUUID()}`,
      user: {
        GuestID: Number(guestRow?.id),
        FirstName: firstName || "Guest",
        LastName: lastName,
        email,
        PhoneNumber: phoneNumber,
        Address: address,
      },
    });
  } catch (error) {
    try {
      database.run("ROLLBACK;");
    } catch {
      // Ignore rollback failures in the lightweight demo backend.
    }

    console.error("Signup failed:", error);
    return res.status(500).json({
      error: "SignupFailedException",
      message: "Unable to create guest account.",
    });
  }
});

app.post("/api/auth/login", (req, res) => {
  const body = req.body || {};
  const email = normalizeEmail(
    firstNonEmpty(body.username, body.email, body["User name/email"]),
  );
  const password = firstNonEmpty(body.password, body.Password);

  if (!email || !password) {
    return res.status(400).json({
      error: "ValidationError",
      message: "Email and password are required.",
    });
  }

  const guest = queryOne(
    "SELECT GuestID, FirstName, LastName, email, PhoneNumber, Address FROM GUEST WHERE lower(email) = lower(?) AND Password = ?",
    [email, password],
  );

  if (!guest) {
    return res.status(401).json({
      error: "AuthenticationFailedException",
      message: "Invalid email or password.",
    });
  }

  return res.json({
    message: "Login successful.",
    token: `session_${crypto.randomUUID()}`,
    user: guest,
  });
});

app.get("/api/rooms/search", (req, res) => {
  const location = normalizeSearchValue(
    req.query.location,
    normalizeSearchValue(req.query.city, "Famagusta"),
  );
  const checkInDate = normalizeSearchValue(
    req.query.checkInDate,
    normalizeSearchValue(req.query.checkIn, "2026-05-20"),
  );
  const checkOutDate = normalizeSearchValue(
    req.query.checkOutDate,
    normalizeSearchValue(req.query.checkOut, "2026-05-24"),
  );
  const guestCount = Number(
    normalizeSearchValue(
      req.query.guestCount,
      normalizeSearchValue(req.query.guests, "2"),
    ),
  );
  const typeFilter = normalizeSearchValue(req.query.type, "All");

  const rooms = queryAll(
    `
      SELECT
        r.RoomID,
        r.HotelID,
        r.RoomNumber,
        r.Type,
        r.Price,
        r.Availability,
        h.Name AS HotelName,
        h.Address AS HotelAddress,
        h.City,
        h.StarRating
      FROM ROOM r
      INNER JOIN HOTEL h ON h.HotelID = r.HotelID
      WHERE lower(h.City) = lower(?)
        AND (? = 'All' OR lower(r.Type) = lower(?))
        AND r.Availability = 1
        AND (CASE r.Type
          WHEN 'Ocean View' THEN 3
          WHEN 'Garden View' THEN 2
          WHEN 'Suites' THEN 4
          ELSE 2
        END) >= ?
        AND NOT EXISTS (
          SELECT 1
          FROM RESERVATION res
          WHERE res.RoomID = r.RoomID
            AND res.Status IN ('Pending', 'Confirmed', 'Checked-in')
            AND date(res.CheckInDate) < date(?)
            AND date(res.CheckOutDate) > date(?)
        )
      ORDER BY r.Price ASC, r.RoomNumber ASC
    `,
    [location, typeFilter, typeFilter, guestCount, checkOutDate, checkInDate],
  );

  return res.json(rooms.map((room) => normalizeRoomResponse(room, guestCount)));
});

app.post("/api/bookings/confirm", (req, res) => {
  const body = req.body || {};
  const guestId = Number(body.GuestID ?? body.guestId);
  const roomId = Number(body.RoomID ?? body.roomId);
  const checkInDate = firstNonEmpty(body.checkInDate, body.CheckInDate);
  const checkOutDate = firstNonEmpty(body.checkOutDate, body.CheckOutDate);
  const totalAmount = Number(body.totalAmount ?? body.TotalAmount);
  const paymentMethod = firstNonEmpty(
    body.paymentMethod,
    body.PaymentMethod,
    "Credit/ Debit Card",
  );
  const simulateGatewayTimeout =
    body.simulateGatewayTimeout === true ||
    body.simulateTimeout === true ||
    /timeout/i.test(paymentMethod);

  if (!guestId || !roomId || !checkInDate || !checkOutDate) {
    return res.status(400).json({
      error: "ValidationError",
      message:
        "GuestID, RoomID, check-in date, and check-out date are required.",
    });
  }

  if (
    !isValidDate(checkInDate) ||
    !isValidDate(checkOutDate) ||
    new Date(checkOutDate) <= new Date(checkInDate)
  ) {
    return res.status(400).json({
      error: "InvalidDateFormatException",
      message: "Check-out date must be after check-in date.",
    });
  }

  const guest = queryOne("SELECT GuestID FROM GUEST WHERE GuestID = ?", [
    guestId,
  ]);
  if (!guest) {
    return res.status(404).json({
      error: "GuestNotFoundException",
      message: "The requested guest record does not exist.",
    });
  }

  const room = queryOne(
    `
      SELECT r.RoomID, r.Availability, r.Price, r.Type, h.City
      FROM ROOM r
      INNER JOIN HOTEL h ON h.HotelID = r.HotelID
      WHERE r.RoomID = ?
      LIMIT 1
    `,
    [roomId],
  );

  if (!room) {
    return res.status(404).json({
      error: "RoomNotFoundException",
      message: "The selected room could not be found.",
    });
  }

  try {
    const result = withTransaction(() => {
      const overlap = findReservationOverlap(roomId, checkInDate, checkOutDate);
      if (overlap) {
        const error = new Error("RoomNotAvailableException");
        error.status = 409;
        error.payload = {
          error: "RoomNotAvailableException",
          message: "The selected room is already reserved for these dates.",
        };
        throw error;
      }

      if (simulateGatewayTimeout) {
        const error = new Error("PaymentGatewayTimeoutException");
        error.status = 504;
        error.payload = {
          error: "PaymentGatewayTimeoutException",
          message:
            "External payment gateway failed to respond within threshold.",
        };
        throw error;
      }

      database.run(
        `
          INSERT INTO RESERVATION (GuestID, RoomID, CheckInDate, CheckOutDate, TotalAmount, Status)
          VALUES (?, ?, ?, ?, ?, 'Confirmed')
        `,
        [guestId, roomId, checkInDate, checkOutDate, totalAmount],
      );
      const reservationRow = queryOne("SELECT last_insert_rowid() AS id");
      const reservationId = Number(reservationRow?.id || 0);

      const paymentDate = new Date().toISOString();
      database.run(
        `
          INSERT INTO PAYMENT (ReservationID, Amount, PaymentDate, PaymentMethod, Status)
          VALUES (?, ?, ?, ?, 'Success')
        `,
        [reservationId, totalAmount, paymentDate, paymentMethod],
      );
      const paymentRow = queryOne("SELECT last_insert_rowid() AS id");
      const paymentId = Number(paymentRow?.id || 0);

      database.run("UPDATE ROOM SET Availability = 0 WHERE RoomID = ?", [
        roomId,
      ]);

      console.log(
        `Reservation confirmed for GuestID ${guestId}, RoomID ${roomId}, ReservationID ${reservationId}, PaymentID ${paymentId}`,
      );

      return {
        reservationId,
        paymentId,
        guestId,
        roomId,
        totalAmount,
        paymentMethod,
        status: "Confirmed",
      };
    });

    return res.status(201).json({
      message: "Booking confirmed.",
      ...result,
    });
  } catch (error) {
    if (
      error.message === "RoomNotAvailableException" ||
      error.message === "PaymentGatewayTimeoutException"
    ) {
      return res.status(error.status || 400).json(error.payload);
    }

    console.error("Booking confirmation failed:", error);
    return res.status(500).json({
      error: "BookingConfirmationFailedException",
      message: "Unable to confirm the reservation.",
    });
  }
});

app.use((error, req, res, next) => {
  void next;
  console.error("Unhandled backend error:", error);
  res.status(500).json({
    error: "ServerError",
    message: "Unexpected server failure.",
  });
});

app.listen(PORT, () => {
  console.log(`Palmora demo backend listening on http://localhost:${PORT}`);
  console.log(`SQLite database file: ${DB_PATH}`);
});
