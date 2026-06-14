import { useEffect, useState } from "react";
import oceanView from "./assets/ocean-view.png";
import gardenView from "./assets/garden-view.png";
import suite from "./assets/suite.png";
import profileImage from "./assets/profile-palmora.png";
import palmoraLogo from "./assets/palmorawhitelogo.png";
import homeBg from "./assets/background2.jpeg";
import loginBg from "./assets/loginbg.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const LUXURY_BASE_BACKGROUND =
  "linear-gradient(180deg, #0a5a5b 0%, #0d4f52 35%, #083d41 68%, #052d30 100%)";
const LUXURY_OVERLAY =
  "linear-gradient(rgba(2, 26, 28, 0.12), rgba(2, 26, 28, 0.38))";

const FALLBACK_ROOM_IMAGES = {
  "Ocean View": oceanView,
  "Garden View": gardenView,
  Suites: suite,
  Suite: suite,
};

const ROOM_DESCRIPTIONS = {
  "Ocean View":
    "Enjoy breathtaking ocean views from your private balcony. Modern comfort and tropical elegance for a perfect stay.",
  "Garden View":
    "Relax in a peaceful garden atmosphere surrounded by tropical greenery. A cozy escape designed for comfort and serenity.",
  Suites:
    "Experience luxury and spacious living with elegant interiors and stunning resort views. Perfect for a premium Palmora stay.",
};

const ROOM_CARD_FILTERS = ["All", "Ocean View", "Garden View", "Suites"];

const ADMIN_CREDENTIALS = {
  email: "admin@palmora.com",
  password: "admin123",
};

const ADMIN_TABS = ["Dashboard", "Bookings", "Rooms", "Reports", "Profile"];

const ADMIN_SAMPLE_RESERVATIONS = [
  {
    guest: "Amira Demir",
    room: "Ocean View",
    dates: "Jun 10 - Jun 16, 2025",
    status: "Confirmed",
  },
  {
    guest: "David Stone",
    room: "Garden View",
    dates: "Jun 12 - Jun 15, 2025",
    status: "Pending",
  },
  {
    guest: "Selin Kaya",
    room: "Suites",
    dates: "Jun 14 - Jun 20, 2025",
    status: "Confirmed",
  },
];

const ADMIN_SAMPLE_USERS = [
  {
    name: "Amira Demir",
    email: "amira@example.com",
    status: "Active",
    booking: "Ocean View",
  },
  {
    name: "David Stone",
    email: "david@example.com",
    status: "Disabled",
    booking: "Garden View",
  },
  {
    name: "Selin Kaya",
    email: "selin@example.com",
    status: "Active",
    booking: "Suites",
  },
];

const ADMIN_SAMPLE_ROOMS = [
  {
    number: "101",
    type: "Ocean View",
    availability: "Available",
    price: "$220",
  },
  {
    number: "202",
    type: "Garden View",
    availability: "Occupied",
    price: "$190",
  },
  {
    number: "303",
    type: "Suites",
    availability: "Available",
    price: "$350",
  },
];

const ADMIN_REPORT_ITEMS = [
  {
    label: "Occupancy Rate",
    value: "74%",
    meta: "+6% from last week",
  },
  {
    label: "Average Stay",
    value: "3.8 Nights",
    meta: "Stable performance",
  },
  {
    label: "Guest Satisfaction",
    value: "96%",
    meta: "+2% from last month",
  },
];

const formatDateLabel = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const calculateNights = (checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const nights = Math.ceil((checkOut - checkIn) / 86400000);
  return Number.isFinite(nights) && nights > 0 ? nights : 1;
};

export default function App() {
  const appStyle = {
    width: "440px",
    height: "777px",
    margin: "0 auto",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
  };

  const [screen, setScreen] = useState("login");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingTab, setBookingTab] = useState("upcoming");
  const [roomSearch, setRoomSearch] = useState({
    location: "Famagusta",
    checkInDate: "2026-05-20",
    checkOutDate: "2026-05-24",
    guestCount: "2",
    type: "All",
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState("Dashboard");
  const [adminCredentials, setAdminCredentials] = useState({
    email: "",
    password: "",
  });
  const [adminError, setAdminError] = useState("");
  const [adminModal, setAdminModal] = useState(null);

  const demoRooms = [
    {
      name: "Ocean View",
      price: 220,
      image: oceanView,
      description: ROOM_DESCRIPTIONS["Ocean View"],
      guests: "3 Guests",
      RoomID: 1,
      id: 1,
    },
    {
      name: "Garden View",
      price: 190,
      image: gardenView,
      description: ROOM_DESCRIPTIONS["Garden View"],
      guests: "2 Guests",
      RoomID: 2,
      id: 2,
    },
    {
      name: "Suites",
      price: 350,
      image: suite,
      description: ROOM_DESCRIPTIONS.Suites,
      guests: "4 Guests",
      RoomID: 3,
      id: 3,
    },
  ];

  const activeRoom = selectedRoom || availableRooms[0] || demoRooms[0];
  const bookingNights = calculateNights(
    roomSearch.checkInDate,
    roomSearch.checkOutDate,
  );
  const adminAvailableRoomsCount = availableRooms.length || 23;

  const normalizeRoom = (room) => ({
    ...room,
    RoomID: room.RoomID ?? room.id,
    id: room.id ?? room.RoomID,
    image: room.image
      ? // If API returns an absolute URL, use it. If it returns a path
        // prefer non-SVG assets from the backend; treat SVG responses
        // as decorative/demo images and fall back to local PNGs so
        // thumbnails show expected photos in the UI.
        room.image.startsWith("http")
        ? room.image
        : room.image.endsWith(".svg")
          ? FALLBACK_ROOM_IMAGES[room.name] || suite
          : `${API_BASE}${room.image}`
      : FALLBACK_ROOM_IMAGES[room.name] || suite,
  });

  const openAdminModal = (title, detail) => {
    setAdminModal({ title, detail });
  };

  const closeAdminModal = () => setAdminModal(null);

  const resetAdminSession = () => {
    setIsAdmin(false);
    setShowAdminLogin(false);
    setAdminTab("Dashboard");
    setAdminCredentials({ email: "", password: "" });
    setAdminError("");
    setAdminModal(null);
    setScreen("login");
  };

  const handleAdminLogin = () => {
    const email = adminCredentials.email.trim().toLowerCase();
    const password = adminCredentials.password;

    if (
      email === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setAdminError("");
      setIsAdmin(true);
      setAdminTab("Dashboard");
      return;
    }

    setAdminError("Invalid admin credentials.");
  };

  const renderAdminModal = () => {
    if (!adminModal) {
      return null;
    }

    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(1, 22, 24, 0.62)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 80,
          padding: 18,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            borderRadius: 26,
            padding: 20,
            background:
              "linear-gradient(180deg, rgba(16, 78, 79, 0.98) 0%, rgba(7, 45, 48, 0.98) 100%)",
            border: "1px solid rgba(145, 218, 176, 0.16)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2 style={{ margin: 0, color: "var(--text-h)", fontSize: 24 }}>
            {adminModal.title}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.6 }}>
            {adminModal.detail}
          </p>
          <button
            onClick={closeAdminModal}
            style={{
              width: "100%",
              border: "none",
              borderRadius: 14,
              padding: 14,
              background: "var(--cta)",
              color: "#0b271d",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const renderAdminBottomNav = () => (
    <div style={adminNavStyle}>
      {ADMIN_TABS.map((tab) => {
        const active = adminTab === tab;
        const tabIcons = {
          Dashboard: "⌂",
          Bookings: "◫",
          Rooms: "◧",
          Reports: "▤",
          Profile: "◉",
        };
        return (
          <button
            key={tab}
            onClick={() => setAdminTab(tab)}
            style={{
              ...adminNavButtonStyle,
              color: active ? "var(--text-h)" : "rgba(255,255,255,0.62)",
              background: active
                ? "linear-gradient(180deg, rgba(18, 74, 66, 0.98) 0%, rgba(9, 40, 36, 0.98) 100%)"
                : "transparent",
              boxShadow: active
                ? "0 10px 20px rgba(0, 0, 0, 0.28), inset 0 0 0 1px rgba(217, 194, 124, 0.16)"
                : "none",
              transform: active ? "translateY(-8px)" : "translateY(0)",
            }}
          >
            <span
              style={{
                fontSize: 18,
                lineHeight: 1,
                color: active ? "var(--accent)" : "rgba(255,255,255,0.56)",
              }}
            >
              {tabIcons[tab]}
            </span>
            {tab}
          </button>
        );
      })}
    </div>
  );

  const renderAdminDashboard = () => (
    <div style={adminContentShellStyle}>
      <div style={adminTopBarStyle}>
        <button type="button" style={adminHeaderIconButtonStyle}>
          ☰
        </button>
        <div style={adminTopBarTitleWrapStyle}>
          <h1 style={adminTopBarTitleStyle}>Admin Dashboard</h1>
        </div>
        <button type="button" style={adminHeaderIconButtonStyle}>
          🔔
        </button>
      </div>

      <div
        style={{
          textAlign: "left",
          padding: "0 4px",
          marginBottom: "18px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "var(--text-h)",
            fontSize: "23px",
            fontWeight: "700",
            letterSpacing: -0.2,
          }}
        >
          Good Evening, Admin 👋
        </h2>
        <p
          style={{
            margin: "6px 0 0",
            color: "rgba(247, 228, 176, 0.78)",
            fontSize: "13px",
            lineHeight: 1.45,
          }}
        >
          Here&apos;s what&apos;s happening at Palmora today.
        </p>
      </div>

      <div style={adminStatGridStyle}>
        {[
          {
            icon: "📅",
            label: "Total Bookings",
            value: "87",
            meta: "+12% from last month",
          },
          {
            icon: "👥",
            label: "Active Guests",
            value: "124",
            meta: "+8% from last month",
          },
          {
            icon: "🛏️",
            label: "Available Rooms",
            value: String(adminAvailableRoomsCount),
            meta: "+5% from last month",
          },
          {
            icon: "💰",
            label: "Revenue (This Month)",
            value: "$12,450",
            meta: "+15% from last month",
          },
        ].map((stat) => (
          <div key={stat.label} style={adminStatCardStyle}>
            <div style={adminStatIconWrapStyle}>{stat.icon}</div>
            <p style={adminStatLabelStyle}>{stat.label}</p>
            <h2 style={adminStatValueStyle}>{stat.value}</h2>
            <p style={adminStatMetaStyle}>{stat.meta}</p>
          </div>
        ))}
      </div>

      <div style={adminPanelStyle}>
        <div style={adminPanelHeaderStyle}>
          <h2 style={adminPanelTitleStyle}>Latest Reservations</h2>
          <button type="button" style={adminViewAllTextStyle}>
            View All
          </button>
        </div>
        <div style={adminListStyle}>
          {ADMIN_SAMPLE_RESERVATIONS.map((row) => (
            <div
              key={`${row.guest}-${row.room}`}
              style={adminReservationRowStyle}
            >
              <div
                style={{
                  ...adminReservationPreviewStyle,
                }}
              >
                <img
                  src={FALLBACK_ROOM_IMAGES[row.room] || suite}
                  alt={row.room}
                  style={adminReservationPreviewImageStyle}
                />
              </div>
              <div style={adminReservationInfoStyle}>
                <p style={adminRowPrimaryStyle}>{row.room}</p>
                <p style={adminRowSecondaryStyle}>{row.guest}</p>
                <p style={adminReservationDateStyle}>{row.dates}</p>
              </div>
              <span
                style={{
                  ...adminBadgeStyle,
                  background:
                    row.status === "Confirmed"
                      ? "rgba(47, 141, 87, 0.22)"
                      : "rgba(168, 106, 46, 0.2)",
                  color:
                    row.status === "Confirmed"
                      ? "var(--success)"
                      : "var(--warn)",
                }}
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {renderAdminBottomNav()}
    </div>
  );

  const renderAdminBookings = () => (
    <div style={adminContentShellStyle}>
      <div style={adminHeaderStyle}>
        <div>
          <p style={adminEyebrowStyle}>Management</p>
          <h1 style={adminHeadingStyle}>Bookings</h1>
          <p style={adminSubheadingStyle}>
            Review guest activity and manage access locally.
          </p>
        </div>
      </div>

      <div style={adminPanelStyle}>
        {ADMIN_SAMPLE_USERS.map((user) => (
          <div key={user.email} style={adminManagementRowStyle}>
            <div>
              <p style={adminRowPrimaryStyle}>{user.name}</p>
              <p style={adminRowSecondaryStyle}>{user.email}</p>
              <p style={adminRowSecondaryStyle}>
                Latest booking: {user.booking}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  ...adminBadgeStyle,
                  background:
                    user.status === "Active"
                      ? "rgba(71, 201, 115, 0.2)"
                      : "rgba(255, 166, 66, 0.2)",
                  color:
                    user.status === "Active" ? "var(--success)" : "var(--warn)",
                }}
              >
                {user.status}
              </span>
              <div style={adminActionRowStyle}>
                <button
                  onClick={() =>
                    openAdminModal(
                      "View User",
                      `${user.name} | ${user.email} | Current booking: ${user.booking}`,
                    )
                  }
                  style={adminGhostButtonStyle}
                >
                  View
                </button>
                <button
                  onClick={() =>
                    openAdminModal(
                      "Disable User",
                      `${user.name} can be disabled in the real system. This demo only previews the action and does not change any backend data.`,
                    )
                  }
                  style={adminOutlineButtonStyle}
                >
                  Disable User
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {renderAdminBottomNav()}
    </div>
  );

  const renderAdminRooms = () => (
    <div style={adminContentShellStyle}>
      <div style={adminTopBarStyle}>
        <button type="button" style={adminHeaderIconButtonStyle}>
          ←
        </button>
        <div style={adminTopBarTitleWrapStyle}>
          <h1 style={adminTopBarTitleStyle}>Room Management</h1>
        </div>
        <button type="button" style={adminAddRoomButtonStyle}>
          + Add Room
        </button>
      </div>

      <div style={{ ...adminPanelStyle, marginBottom: 16 }}>
        {ADMIN_SAMPLE_ROOMS.map((room) => {
          const roomImage = FALLBACK_ROOM_IMAGES[room.type] || suite;
          const available = room.availability === "Available";
          return (
            <div key={room.number} style={adminRoomCardStyle}>
              <img
                src={roomImage}
                alt={room.type}
                style={adminRoomThumbStyle}
              />
              <div style={adminRoomInfoStyle}>
                <div style={adminRoomTitleRowStyle}>
                  <div>
                    <p style={adminRoomTitleStyle}>{room.type} Room</p>
                    <p style={adminRoomPriceStyle}>{room.price} / night</p>
                  </div>
                  <span
                    style={{
                      ...adminBadgeStyle,
                      background: available
                        ? "rgba(52, 166, 103, 0.28)"
                        : "rgba(207, 79, 66, 0.26)",
                      color: available ? "var(--success)" : "var(--danger)",
                    }}
                  >
                    {room.availability}
                  </span>
                </div>

                <div style={adminActionRowStyle}>
                  <button
                    onClick={() =>
                      openAdminModal(
                        "Edit Room",
                        `${room.type} (Room ${room.number}) is shown in demo mode only. No backend edit is performed.`,
                      )
                    }
                    style={adminGhostButtonStyle}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      openAdminModal(
                        "Availability",
                        `Room ${room.number} currently shows ${room.availability}. This preview does not update backend data.`,
                      )
                    }
                    style={adminOutlineButtonStyle}
                  >
                    Availability
                  </button>
                  <button
                    onClick={() =>
                      openAdminModal(
                        "Price",
                        `Room ${room.number} is priced at ${room.price} in this design preview.`,
                      )
                    }
                    style={adminGhostButtonStyle}
                  >
                    Price
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={adminPanelStyle}>
        <div style={adminPanelHeaderStyle}>
          <h2 style={adminPanelTitleStyle}>Recent Bookings</h2>
          <button type="button" style={adminViewAllTextStyle}>
            View All
          </button>
        </div>
        <div style={adminListStyle}>
          {ADMIN_SAMPLE_RESERVATIONS.map((row) => (
            <div
              key={`${row.room}-${row.dates}`}
              style={adminRecentBookingRowStyle}
            >
              <div style={adminRecentBookingNameStyle}>{row.guest}</div>
              <div style={adminRecentBookingMetaStyle}>{row.room}</div>
              <div style={adminRecentBookingMetaStyle}>{row.dates}</div>
              <span
                style={{
                  ...adminBadgeStyle,
                  background:
                    row.status === "Confirmed"
                      ? "rgba(52, 166, 103, 0.22)"
                      : "rgba(207, 79, 66, 0.22)",
                  color:
                    row.status === "Confirmed"
                      ? "var(--success)"
                      : "var(--warn)",
                }}
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {renderAdminBottomNav()}
    </div>
  );

  const renderAdminReports = () => (
    <div style={adminContentShellStyle}>
      <div style={adminHeaderStyle}>
        <div>
          <p style={adminEyebrowStyle}>Analytics</p>
          <h1 style={adminHeadingStyle}>Reports</h1>
          <p style={adminSubheadingStyle}>
            A local-only snapshot of hotel performance.
          </p>
        </div>
      </div>

      <div style={adminPanelStyle}>
        {ADMIN_REPORT_ITEMS.map((item) => (
          <div key={item.label} style={adminReportRowStyle}>
            <div>
              <p style={adminRowPrimaryStyle}>{item.label}</p>
              <p style={adminRowSecondaryStyle}>{item.meta}</p>
            </div>
            <h2 style={adminMiniValueStyle}>{item.value}</h2>
          </div>
        ))}
      </div>

      <div style={adminPanelStyle}>
        <p style={adminPanelTitleStyle}>Demo notes</p>
        <p style={adminRowSecondaryStyle}>
          Reports are intentionally simulated so the admin module stays
          UI-driven and safe for the demo scope.
        </p>
      </div>

      {renderAdminBottomNav()}
    </div>
  );

  const renderAdminProfile = () => (
    <div style={adminContentShellStyle}>
      <div style={adminHeaderStyle}>
        <div>
          <p style={adminEyebrowStyle}>Account</p>
          <h1 style={adminHeadingStyle}>Profile</h1>
          <p style={adminSubheadingStyle}>
            Administrative access is local to this demo session.
          </p>
        </div>
      </div>

      <div style={adminPanelStyle}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={adminAvatarStyle}>A</div>
          <div>
            <p style={adminRowPrimaryStyle}>Admin User</p>
            <p style={adminRowSecondaryStyle}>admin@palmora.com</p>
          </div>
        </div>
        <button onClick={resetAdminSession} style={adminLogoutButtonStyle}>
          Exit Admin Portal
        </button>
      </div>

      {renderAdminBottomNav()}
    </div>
  );

  const renderAdminLoginView = () => (
    <div
      style={{
        ...appStyle,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        position: "relative",
        backgroundImage: `linear-gradient(rgba(2, 24, 27, 0.36), rgba(2, 24, 27, 0.58)), url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          minHeight: 690,
          background:
            "linear-gradient(180deg, rgba(6, 84, 87, 0.58) 0%, rgba(4, 52, 56, 0.76) 100%)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 24,
          padding: "34px 24px 28px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.22)",
        }}
      >
        <img
          src={palmoraLogo}
          alt="Palmora logo"
          style={{
            width: 168,
            maxWidth: "74%",
            marginBottom: 8,
            display: "block",
          }}
        />

        <p
          style={{
            margin: 0,
            color: "#bfead7",
            fontSize: 11,
            letterSpacing: 3.1,
            fontWeight: 600,
          }}
        >
          HOTELS & RESORTS
        </p>

        <h1
          style={{
            margin: "22px 0 6px",
            color: "#ffffff",
            fontSize: 35,
            fontWeight: 600,
            letterSpacing: 0,
            textAlign: "center",
          }}
        >
          Admin Portal
        </h1>

        <p
          style={{
            margin: 0,
            color: "rgba(255, 255, 255, 0.76)",
            fontSize: 14,
            textAlign: "center",
            marginBottom: 22,
          }}
        >
          Sign in to continue
        </p>

        <input
          value={adminCredentials.email}
          onChange={(event) =>
            setAdminCredentials((current) => ({
              ...current,
              email: event.target.value,
            }))
          }
          placeholder="Admin Email"
          style={{
            ...signupInputStyle,
            marginBottom: 12,
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            color: "#ffffff",
          }}
        />
        <input
          value={adminCredentials.password}
          onChange={(event) =>
            setAdminCredentials((current) => ({
              ...current,
              password: event.target.value,
            }))
          }
          type="password"
          placeholder="Password"
          style={{
            ...signupInputStyle,
            marginBottom: 10,
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            color: "#ffffff",
          }}
        />

        <label
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "rgba(255, 255, 255, 0.86)",
            fontSize: 13,
            margin: "6px 0 10px",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            style={{
              width: 16,
              height: 16,
              accentColor: "var(--accent)",
              cursor: "pointer",
            }}
          />
          <span>Remember me</span>
        </label>

        {adminError && <p style={adminErrorStyle}>{adminError}</p>}

        <button
          onClick={handleAdminLogin}
          style={{
            ...adminPrimaryButtonStyle,
            background: "linear-gradient(180deg, #48ca7f 0%, #2aa85e 100%)",
            color: "#ffffff",
            boxShadow: "0 12px 24px rgba(20, 119, 74, 0.22)",
            marginTop: 4,
          }}
        >
          Login
        </button>

        <button
          onClick={() => {
            setShowAdminLogin(false);
            setAdminError("");
          }}
          style={adminBackButtonStyle}
        >
          Back to Guest Login
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    if (screen !== "rooms") {
      return undefined;
    }

    const controller = new AbortController();
    const timerId = window.setTimeout(async () => {
      setRoomsLoading(true);
      setRoomsError("");

      try {
        const params = new URLSearchParams({
          location: roomSearch.location,
          checkInDate: roomSearch.checkInDate,
          checkOutDate: roomSearch.checkOutDate,
          guestCount: roomSearch.guestCount,
          type: roomSearch.type,
        });

        const response = await fetch(
          `${API_BASE}/api/rooms/search?${params.toString()}`,
          {
            signal: controller.signal,
          },
        );
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(
            payload.message || payload.error || "Unable to load rooms.",
          );
        }

        setAvailableRooms(payload.map(normalizeRoom));
      } catch (error) {
        if (error.name !== "AbortError") {
          setRoomsError(error.message || "Unable to load rooms.");
          setAvailableRooms([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setRoomsLoading(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timerId);
      controller.abort();
    };
  }, [
    screen,
    roomSearch.location,
    roomSearch.checkInDate,
    roomSearch.checkOutDate,
    roomSearch.guestCount,
    roomSearch.type,
  ]);

  const handleBookingConfirm = async () => {
    if (!activeRoom) {
      return;
    }

    setPaymentError("");
    setPaymentSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/bookings/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          GuestID: 1,
          RoomID: activeRoom.RoomID || activeRoom.id,
          checkInDate: roomSearch.checkInDate,
          checkOutDate: roomSearch.checkOutDate,
          totalAmount: activeRoom.price * bookingNights,
          paymentMethod: "Credit/ Debit Card",
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(
          payload.message || payload.error || "Booking confirmation failed.",
        );
      }

      setScreen("confirmation");
    } catch (error) {
      setPaymentError(error.message || "Booking confirmation failed.");
    } finally {
      setPaymentSubmitting(false);
    }
  };

  if (isAdmin) {
    const adminShellStyle = {
      width: "440px",
      height: "777px",
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
      /* Use longhand properties to avoid mixing shorthand with background-*/
      /* longhand (backgroundSize/Position/Repeat) elsewhere and prevent */
      /* react warnings about removing conflicting style properties. */
      backgroundImage: `${LUXURY_OVERLAY}, url(${loginBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundColor: "#072a24",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
    };

    console.log("ACTIVE ADMIN MASTER SHELL STYLES:", adminShellStyle);

    return (
      <div style={adminShellStyle}>
        {adminTab === "Dashboard" && renderAdminDashboard()}
        {adminTab === "Bookings" && renderAdminBookings()}
        {adminTab === "Rooms" && renderAdminRooms()}
        {adminTab === "Reports" && renderAdminReports()}
        {adminTab === "Profile" && renderAdminProfile()}
        {renderAdminModal()}
      </div>
    );
  }

  if (showAdminLogin) {
    return renderAdminLoginView();
  }

  if (screen === "login") {
    return (
      <div
        style={{
          ...page(),
          ...appStyle,
          backgroundImage: `${LUXURY_OVERLAY}, url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          justifyContent: "center",
        }}
      >
        <img
          src={palmoraLogo}
          alt="Palmora Logo"
          style={{ width: 240, marginBottom: 20, zIndex: 2 }}
        />

        <div
          style={{
            width: "75%",
            maxWidth: 700,
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 28,
            padding: 22,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: 40,
              marginBottom: 0,
              fontWeight: 300,
              letterSpacing: 1,
            }}
          >
            WELCOME!
          </h1>
          <p
            style={{
              marginTop: 5,
              marginBottom: 35,
              color: "white",
              opacity: 0.9,
            }}
          >
            Relax, you're almost in
          </p>
          <h2
            style={{
              color: "white",
              marginBottom: 25,
              fontSize: 40,
              fontWeight: 400,
            }}
          >
            LOG IN
          </h2>

          <input
            placeholder="User name/email"
            style={{
              ...inputStyle,
              width: "100%",
              background: "rgba(255,255,255,0.40)",
              border: "1px solid rgba(255,255,255,0.35)",
              color: "black",
            }}
          />
          <input
            placeholder="Password"
            type="password"
            style={{
              ...inputStyle,
              width: "100%",
              background: "rgba(255,255,255,0.40)",
              border: "1px solid rgba(255,255,255,0.35)",
              color: "black",
            }}
          />

          <button
            onClick={() => setScreen("home")}
            style={{
              ...buttonStyle,
              width: "100%",
              marginTop: 30,
              fontSize: 20,
            }}
          >
            LOG IN
          </button>

          <p style={{ color: "white", marginTop: 22 }}>
            Don't have an account?{" "}
            <span
              onClick={() => setScreen("signup")}
              style={{
                textDecoration: "underline",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Sign up
            </span>
          </p>

          <button
            onClick={() => {
              setShowAdminLogin(true);
              setAdminError("");
            }}
            style={adminPortalLinkStyle}
          >
            Admin Portal
          </button>
        </div>
      </div>
    );
  }

  if (screen === "signup") {
    return (
      <div
        style={{
          ...page(),
          ...appStyle,
          backgroundImage: `${LUXURY_OVERLAY}, url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          justifyContent: "center",
        }}
      >
        <img
          src={palmoraLogo}
          alt="Palmora Logo"
          style={{ width: 180, marginBottom: 25 }}
        />

        <div
          style={{
            width: "85%",
            maxWidth: 320,
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 28,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{ color: "white", fontSize: 40, margin: 0, fontWeight: 300 }}
          >
            SIGN UP
          </h1>
          <p
            style={{
              color: "white",
              opacity: 0.9,
              marginTop: 6,
              marginBottom: 22,
            }}
          >
            Create your account
          </p>

          <input placeholder="Full Name" style={signupInputStyle} />
          <input placeholder="Email" style={signupInputStyle} />
          <input placeholder="Phone Number" style={signupInputStyle} />
          <input
            placeholder="Password"
            type="password"
            style={signupInputStyle}
          />
          <input
            placeholder="Confirm Password"
            type="password"
            style={signupInputStyle}
          />

          <button
            onClick={() => setScreen("home")}
            style={{
              ...buttonStyle,
              width: "100%",
              marginTop: 18,
              fontSize: 18,
            }}
          >
            SIGN UP
          </button>

          <p style={{ color: "white", marginTop: 20 }}>
            Already a member?{" "}
            <span
              onClick={() => setScreen("login")}
              style={{
                textDecoration: "underline",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Log in
            </span>
          </p>

          <button
            onClick={() => {
              setShowAdminLogin(true);
              setAdminError("");
            }}
            style={adminPortalLinkStyle}
          >
            Admin Portal
          </button>
        </div>
      </div>
    );
  }

  if (screen === "home") {
    return (
      <div
        style={{
          ...screenPage(),
          ...appStyle,
          backgroundImage: `${LUXURY_OVERLAY}, url(${homeBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          position: "relative",
        }}
      >
        <div style={{ textAlign: "left", width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 15,
              marginTop: 40,
            }}
          >
            <img
              src={profileImage}
              alt="Profile"
              style={{
                width: 65,
                height: 65,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid white",
              }}
            />
            <div>
              <p style={{ margin: 0, fontSize: 16 }}>Welcome back,</p>
              <h2 style={{ margin: 0, fontSize: 24, lineHeight: 1.1 }}>
                [NAME]!
              </h2>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(4px)",
            borderRadius: 25,
            padding: 30,
            textAlign: "left",
            marginTop: 320,
            width: "80%",
          }}
        >
          <h2>Your Private Paradise</h2>
          <p>
            Experience comfort, luxury and unforgettable moments in our
            exclusive resort.
          </p>
          <button onClick={() => setScreen("rooms")} style={buttonStyle}>
            Explore Rooms
          </button>
        </div>

        <div style={navbarStyle}>
          <button onClick={() => setScreen("home")} style={navButton}>
            Home
          </button>
          <button onClick={() => setScreen("rooms")} style={navButton}>
            Rooms
          </button>
          <button onClick={() => setScreen("mybookings")} style={navButton}>
            Bookings
          </button>
          <button onClick={() => setScreen("profile")} style={navButton}>
            Profile
          </button>
        </div>
      </div>
    );
  }

  if (screen === "rooms") {
    return (
      <div
        style={{
          ...screenPage(),
          ...appStyle,
          backgroundImage: `${LUXURY_OVERLAY}, url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: 24,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 20 }}
        >
          <button
            onClick={() => setScreen("home")}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: 34,
              cursor: "pointer",
              marginRight: 45,
            }}
          >
            ←
          </button>
          <h1 style={{ color: "white", fontSize: 30, margin: 0 }}>
            Rooms & Suites
          </h1>
        </div>

        <div
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 22,
            padding: 14,
            boxSizing: "border-box",
            marginBottom: 14,
            backdropFilter: "blur(8px)",
          }}
        >
          <input
            value={roomSearch.location}
            onChange={(event) =>
              setRoomSearch((current) => ({
                ...current,
                location: event.target.value,
              }))
            }
            placeholder="City / Location"
            style={{ ...searchInputStyle, marginBottom: 10 }}
          />

          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <input
              type="date"
              value={roomSearch.checkInDate}
              onChange={(event) =>
                setRoomSearch((current) => ({
                  ...current,
                  checkInDate: event.target.value,
                }))
              }
              style={{ ...searchInputStyle, flex: 1 }}
            />
            <input
              type="date"
              value={roomSearch.checkOutDate}
              onChange={(event) =>
                setRoomSearch((current) => ({
                  ...current,
                  checkOutDate: event.target.value,
                }))
              }
              style={{ ...searchInputStyle, flex: 1 }}
            />
          </div>

          <input
            type="number"
            min="1"
            value={roomSearch.guestCount}
            onChange={(event) =>
              setRoomSearch((current) => ({
                ...current,
                guestCount: event.target.value,
              }))
            }
            placeholder="Guests"
            style={searchInputStyle}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {ROOM_CARD_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setRoomSearch((current) => ({ ...current, type: filter }));
              }}
              style={{
                padding: "8px 14px",
                borderRadius: 20,
                border: "none",
                background: activeFilter === filter ? "white" : "transparent",
                color: activeFilter === filter ? "var(--bg)" : "white",
                cursor: "pointer",
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {roomsLoading && (
          <p
            style={{
              color: "white",
              marginTop: 0,
            }}
          >
            Searching available rooms...
          </p>
        )}
        {roomsError && (
          <p
            style={{
              color: "#ffd0d0",
              width: "100%",
              textAlign: "left",
              marginTop: 0,
            }}
          >
            {roomsError}
          </p>
        )}

        {!roomsLoading && !roomsError && availableRooms.length === 0 && (
          <p
            style={{
              color: "white",
              width: "100%",
              textAlign: "left",
              marginTop: 0,
            }}
          >
            No rooms matched the current search.
          </p>
        )}

        {availableRooms
          .filter((room) => {
            if (activeFilter === "All") return true;
            if (activeFilter === "Suites")
              return room.name === "Suites" || room.name === "Suite";
            return room.name === activeFilter;
          })
          .map((room) => (
            <div
              key={room.RoomID || room.id || room.name}
              onClick={() => {
                setSelectedRoom(room);
                setScreen("details");
              }}
              style={{
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.22)",
                backdropFilter: "blur(10px)",
                padding: 10,
                borderRadius: 24,
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                width: "90%",
              }}
            >
              <img
                src={room.image}
                alt={room.name}
                style={{
                  width: 130,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 18,
                }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    FALLBACK_ROOM_IMAGES[room.name] || suite;
                }}
              />

              <div style={{ flex: 1, textAlign: "left", color: "white" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: 22, color: "white" }}>
                    {room.name}
                  </h2>
                  <span style={{ fontSize: 26 }}>♡</span>
                </div>

                <p style={{ margin: "10px 0 4px", fontSize: 13, opacity: 0.9 }}>
                  {room.guests} &nbsp;&nbsp; 1 King Bed
                </p>

                <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>
                  {room.name === "Suites" || room.name === "Suite"
                    ? "50 m²"
                    : room.name === "Garden View"
                      ? "28 m²"
                      : "32 m²"}
                </p>

                <p
                  style={{
                    margin: "22px 0 0",
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  ${room.price}
                  <span style={{ fontSize: 10, fontWeight: "normal" }}>
                    /night
                  </span>
                </p>
              </div>
            </div>
          ))}

        <div style={navbarStyle}>
          <button onClick={() => setScreen("home")} style={navButton}>
            Home
          </button>
          <button onClick={() => setScreen("rooms")} style={navButton}>
            Rooms
          </button>
          <button onClick={() => setScreen("mybookings")} style={navButton}>
            Bookings
          </button>
          <button onClick={() => setScreen("profile")} style={navButton}>
            Profile
          </button>
        </div>
      </div>
    );
  }

  if (screen === "details") {
    return (
      <div
        style={{
          width: 390,
          height: 844,
          margin: "0 auto",
          background: LUXURY_BASE_BACKGROUND,
          borderRadius: 34,
          overflow: "hidden",
          position: "relative",
          color: "white",
        }}
      >
        <div style={{ position: "relative", height: 300 }}>
          <img
            src={activeRoom.image}
            alt={activeRoom.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          <button
            onClick={() => setScreen("rooms")}
            style={{
              position: "absolute",
              top: 22,
              left: 18,
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: 36,
              cursor: "pointer",
            }}
          >
            ←
          </button>

          <button
            style={{
              position: "absolute",
              top: 24,
              right: 22,
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: 32,
            }}
          >
            ♡
          </button>
        </div>

        <div
          style={{
            height: 544,
            padding: "24px 22px",
            backgroundImage: `${LUXURY_OVERLAY}, url(${loginBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 28,
            }}
          >
            <h1 style={{ margin: 0, color: "white", fontSize: 30 }}>
              {activeRoom.name}
            </h1>
            <h2 style={{ margin: 0, color: "white", fontSize: 24 }}>
              ${activeRoom.price}
              <span style={{ fontSize: 14, fontWeight: "normal" }}>/night</span>
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              textAlign: "center",
              marginBottom: 22,
            }}
          >
            <div>
              <h3 style={{ margin: 0, color: "white" }}>
                {roomSearch.guestCount}
              </h3>
              <p style={{ margin: "6px 0 0", fontSize: 13 }}>Guests</p>
            </div>

            <div>
              <h3 style={{ margin: 0, color: "white" }}>1</h3>
              <p style={{ margin: "6px 0 0", fontSize: 13 }}>King Bed</p>
            </div>

            <div>
              <h3 style={{ margin: 0, color: "white" }}>
                {activeRoom.name === "Suites" || activeRoom.name === "Suite"
                  ? "50"
                  : activeRoom.name === "Garden View"
                    ? "28"
                    : "32"}
              </h3>
              <p style={{ margin: "6px 0 0", fontSize: 13 }}>m²</p>
            </div>

            <div>
              <h3 style={{ margin: 0, color: "white" }}>Ocean</h3>
              <p style={{ margin: "6px 0 0", fontSize: 13 }}>View</p>
            </div>
          </div>

          <hr style={{ borderColor: "rgba(255,255,255,0.18)" }} />

          <h2 style={{ color: "white", fontSize: 20, marginTop: 18 }}>
            About this room
          </h2>
          <p
            style={{
              lineHeight: 1.6,
              fontSize: 14,
              opacity: 0.9,
              marginBottom: 24,
            }}
          >
            {activeRoom.description}
          </p>

          <hr style={{ borderColor: "rgba(255,255,255,0.18)" }} />

          <h2 style={{ color: "white", fontSize: 20, marginTop: 18 }}>
            Amenities
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              textAlign: "center",
              marginTop: 16,
              fontSize: 13,
            }}
          >
            <p>Free Wi-Fi</p>
            <p>AC</p>
            <p>TV</p>
            <p>Mini Bar</p>
          </div>

          <button
            onClick={() => setScreen("booking")}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              border: "none",
              background: "#0a2d35",
              color: "white",
              fontSize: 18,
              marginTop: 18,
              cursor: "pointer",
            }}
          >
            BOOK NOW
          </button>
        </div>
      </div>
    );
  }

  if (screen === "booking") {
    return (
      <div
        style={{
          ...screenPage(),
          ...appStyle,
          padding: "22px 24px",
          justifyContent: "flex-start",
          backgroundImage: `${LUXURY_OVERLAY}, url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <button
          onClick={() => setScreen("details")}
          style={{
            position: "absolute",
            top: 26,
            left: 24,
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: 34,
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          ←
        </button>

        <h1
          style={{
            color: "white",
            fontSize: 26,
            margin: "54px 0 26px",
            textAlign: "center",
          }}
        >
          Booking Details
        </h1>

        <div
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 22,
            padding: 10,
            display: "flex",
            alignItems: "center",
            gap: 14,
            boxSizing: "border-box",
            marginBottom: 14,
            backdropFilter: "blur(8px)",
          }}
        >
          <img
            src={activeRoom.image}
            alt={activeRoom.name}
            style={{
              width: 110,
              height: 92,
              objectFit: "cover",
              borderRadius: 16,
            }}
          />
          <div style={{ textAlign: "left" }}>
            <h2 style={{ margin: 0, color: "white", fontSize: 22 }}>
              {activeRoom.name}
            </h2>
            <p style={{ margin: "8px 0 0", color: "white", fontSize: 18 }}>
              ${activeRoom.price}
              <span style={{ fontSize: 12, opacity: 0.8 }}> /night</span>
            </p>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 22,
            padding: "18px 20px",
            boxSizing: "border-box",
            marginBottom: 14,
            textAlign: "left",
            backdropFilter: "blur(8px)",
          }}
        >
          <p style={{ margin: 0, opacity: 0.75, fontSize: 13 }}>Check-in</p>
          <h3 style={{ margin: "5px 0 14px", color: "white", fontSize: 18 }}>
            {formatDateLabel(roomSearch.checkInDate)}
          </h3>
          <hr style={{ borderColor: "rgba(255,255,255,0.14)" }} />

          <p style={{ margin: "14px 0 0", opacity: 0.75, fontSize: 13 }}>
            Check-out
          </p>
          <h3 style={{ margin: "5px 0 14px", color: "white", fontSize: 18 }}>
            {formatDateLabel(roomSearch.checkOutDate)}
          </h3>
          <hr style={{ borderColor: "rgba(255,255,255,0.14)" }} />

          <p style={{ margin: "14px 0 0", opacity: 0.75, fontSize: 13 }}>
            Guests
          </p>
          <h3 style={{ margin: "5px 0 0", color: "white", fontSize: 18 }}>
            {roomSearch.guestCount} Adults
          </h3>
        </div>

        <div
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 22,
            padding: "18px 20px",
            boxSizing: "border-box",
            marginBottom: 30,
            textAlign: "left",
            backdropFilter: "blur(8px)",
          }}
        >
          <p style={{ margin: 0, opacity: 0.75, fontSize: 13 }}>
            Total ({bookingNights} Nights)
          </p>
          <h1 style={{ margin: "6px 0 0", color: "white", fontSize: 34 }}>
            ${activeRoom.price * bookingNights}
          </h1>
        </div>

        <button
          onClick={() => setScreen("payment")}
          style={{
            width: "100%",
            maxWidth: 330,
            padding: 14,
            borderRadius: 10,
            border: "none",
            background: "#082f3a",
            color: "white",
            fontSize: 16,
            cursor: "pointer",
            marginTop: "auto",
            marginBottom: 18,
          }}
        >
          CONTINUE TO PAYMENT
        </button>
      </div>
    );
  }

  if (screen === "mybookings") {
    const upcomingBookings = [
      {
        room: demoRooms[0],
        date: `${formatDateLabel(roomSearch.checkInDate)} - ${formatDateLabel(roomSearch.checkOutDate)}`,
        guests: `${roomSearch.guestCount} Adults`,
        status: "Upcoming",
      },
    ];

    const pastBookings = [
      {
        room: demoRooms[1],
        date: "June 10, 2025 - June 16, 2025",
        guests: "2 Adults",
        status: "Completed",
      },
      {
        room: demoRooms[2],
        date: "March 3, 2023 - March 8, 2023",
        guests: "2 Adults",
        status: "Completed",
      },
    ];

    const shownBookings =
      bookingTab === "upcoming" ? upcomingBookings : pastBookings;

    return (
      <div
        style={{
          ...screenPage(),
          ...appStyle,
          padding: 28,
          backgroundImage: `${LUXURY_OVERLAY}, url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <button
          onClick={() => setScreen("home")}
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: 34,
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          ←
        </button>

        <h1
          style={{
            color: "white",
            fontSize: 30,
            margin: "28px 0 24px",
            textAlign: "center",
          }}
        >
          My Bookings
        </h1>

        <div
          style={{
            display: "flex",
            width: "70%",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 14,
            overflow: "hidden",
            marginBottom: 28,
          }}
        >
          <button
            onClick={() => setBookingTab("upcoming")}
            style={{
              flex: 1,
              padding: 12,
              border: "none",
              color: "white",
              cursor: "pointer",
              background:
                bookingTab === "upcoming"
                  ? "rgba(255,255,255,0.22)"
                  : "transparent",
            }}
          >
            Upcoming
          </button>
          <button
            onClick={() => setBookingTab("past")}
            style={{
              flex: 1,
              padding: 12,
              border: "none",
              color: "white",
              cursor: "pointer",
              background:
                bookingTab === "past"
                  ? "rgba(255,255,255,0.22)"
                  : "transparent",
            }}
          >
            Past
          </button>
        </div>

        {shownBookings.map((booking) => (
          <div
            key={booking.room.name}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: 24,
              padding: 14,
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: "white",
              textAlign: "left",
              boxSizing: "border-box",
              marginBottom: 14,
              backdropFilter: "blur(8px)",
            }}
          >
            <img
              src={booking.room.image}
              alt={booking.room.name}
              style={{
                width: 110,
                height: 90,
                objectFit: "cover",
                borderRadius: 16,
              }}
            />
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, color: "white", fontSize: 22 }}>
                {booking.room.name}
              </h2>
              <p style={{ margin: "8px 0", color: "white", fontSize: 14 }}>
                {booking.date}
              </p>
              <p style={{ margin: 0, color: "white", fontSize: 16 }}>
                {booking.guests}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "white", fontSize: 34, marginBottom: 14 }}>
                ›
              </div>
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 14px",
                  borderRadius: 10,
                  background:
                    booking.status === "Upcoming" ? "#2f9bb6" : "#2fa86e",
                  color: "white",
                  fontSize: 14,
                }}
              >
                {booking.status}
              </span>
            </div>
          </div>
        ))}

        <div style={navbarStyle}>
          <button onClick={() => setScreen("home")} style={navButton}>
            Home
          </button>
          <button onClick={() => setScreen("rooms")} style={navButton}>
            Rooms
          </button>
          <button onClick={() => setScreen("mybookings")} style={navButton}>
            Bookings
          </button>
          <button onClick={() => setScreen("profile")} style={navButton}>
            Profile
          </button>
        </div>
      </div>
    );
  }

  if (screen === "payment") {
    return (
      <div
        style={{
          ...screenPage(),
          ...appStyle,
          padding: 28,
          backgroundImage: `${LUXURY_OVERLAY}, url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <button
          onClick={() => setScreen("booking")}
          style={{
            position: "absolute",
            top: 26,
            left: 26,
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: 34,
            cursor: "pointer",
          }}
        >
          ←
        </button>

        <h1 style={{ color: "white", fontSize: 30, margin: "28px 0 18px" }}>
          Payment
        </h1>
        <hr style={{ width: "100%", borderColor: "rgba(255,255,255,0.18)" }} />

        <div style={{ width: "100%", textAlign: "left", marginTop: 18 }}>
          <h2 style={{ color: "white", fontSize: 18 }}>Payment Method</h2>
          <p style={{ color: "white" }}>○ &nbsp; Credit/ Debit Card</p>
          <p style={{ color: "white" }}>○ &nbsp; PayPal</p>
          <p style={{ color: "white" }}>♙ &nbsp; Apple Pay</p>
        </div>

        <div style={{ width: "100%", textAlign: "left", marginTop: 22 }}>
          <label>Card Number</label>
          <input style={paymentInputStyle} />

          <label>Name On Card</label>
          <input style={paymentInputStyle} />

          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label>Expiry Date</label>
              <input placeholder="MM / YY" style={paymentInputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label>CVV</label>
              <input style={paymentInputStyle} />
            </div>
          </div>
        </div>

        <hr
          style={{
            width: "100%",
            borderColor: "rgba(255,255,255,0.18)",
            marginTop: 24,
          }}
        />

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
            color: "white",
          }}
        >
          <h2 style={{ fontSize: 18, color: "white" }}>Total Amount</h2>

          <div style={{ textAlign: "right" }}>
            <h1 style={{ margin: 0, fontSize: 36, color: "white" }}>
              ${activeRoom.price * bookingNights}
            </h1>
            <p style={{ margin: 0, opacity: 0.8, color: "white" }}>
              ({bookingNights} Nights)
            </p>
          </div>
        </div>

        <button
          onClick={handleBookingConfirm}
          disabled={paymentSubmitting}
          style={{
            ...buttonStyle,
            width: "100%",
            marginTop: "auto",
            marginBottom: 22,
            fontSize: 18,
            padding: 15,
            borderRadius: 12,
            opacity: paymentSubmitting ? 0.7 : 1,
            cursor: paymentSubmitting ? "progress" : "pointer",
          }}
        >
          {paymentSubmitting ? "PROCESSING..." : "PAY NOW"}
        </button>

        {paymentError && (
          <p
            style={{
              width: "100%",
              color: "#ffd0d0",
              marginTop: 0,
              textAlign: "center",
            }}
          >
            {paymentError}
          </p>
        )}
      </div>
    );
  }

  if (screen === "profile") {
    return (
      <div
        style={{
          ...screenPage(),
          ...appStyle,
          padding: 28,
          backgroundImage: `${LUXURY_OVERLAY}, url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <button
          onClick={() => setScreen("home")}
          style={{
            position: "absolute",
            top: 26,
            left: 26,
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: 34,
            cursor: "pointer",
          }}
        >
          ←
        </button>

        <img
          src={profileImage}
          alt="profile"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #19a7ff",
            marginTop: 45,
          }}
        />
        <h1 style={{ color: "white", margin: "14px 0 4px", fontSize: 30 }}>
          [NAME]!
        </h1>
        <p style={{ color: "white", opacity: 0.75, margin: 0 }}>
          personalemail@gmail.com
        </p>

        <div
          style={{
            width: "100%",
            marginTop: 28,
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: 24,
            padding: "12px 18px",
            boxSizing: "border-box",
            backdropFilter: "blur(8px)",
          }}
        >
          {[
            "Personal Information",
            "My Bookings",
            "Payment Method",
            "Settings",
            "Help & Support",
          ].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.14)",
                color: "white",
                fontSize: 15,
              }}
            >
              <span>{item}</span>
              <span style={{ fontSize: 26 }}>›</span>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "13px 0 4px",
              color: "red",
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            Log Out
          </div>
        </div>

        <div style={navbarStyle}>
          <button onClick={() => setScreen("home")} style={navButton}>
            Home
          </button>
          <button onClick={() => setScreen("rooms")} style={navButton}>
            Rooms
          </button>
          <button onClick={() => setScreen("mybookings")} style={navButton}>
            Bookings
          </button>
          <button onClick={() => setScreen("profile")} style={navButton}>
            Profile
          </button>
        </div>
      </div>
    );
  }

  if (screen === "confirmation") {
    return (
      <div
        style={{
          ...screenPage(),
          ...appStyle,
          padding: 28,
          justifyContent: "center",
          backgroundImage: `${LUXURY_OVERLAY}, url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            border: "2px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 48,
            marginBottom: 28,
          }}
        >
          ✓
        </div>

        <h1
          style={{ color: "white", fontSize: 22, margin: 0, marginBottom: 10 }}
        >
          Booking Confirmed!
        </h1>
        <p
          style={{
            color: "white",
            opacity: 0.9,
            textAlign: "center",
            marginBottom: 28,
            lineHeight: 1.5,
          }}
        >
          Your stay has been successfully booked.
        </p>

        <div
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: 26,
            padding: 18,
            boxSizing: "border-box",
            backdropFilter: "blur(16px)",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              marginBottom: 22,
            }}
          >
            <img
              src={activeRoom.image}
              alt={activeRoom.name}
              style={{
                width: 120,
                height: 95,
                objectFit: "cover",
                borderRadius: 18,
              }}
            />
            <div style={{ textAlign: "left" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: 20 }}>
                {activeRoom.name}
              </h2>
              <p style={{ color: "white", opacity: 0.85, marginTop: 6 }}>
                Palmora Resort & SPA
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20,
              textAlign: "left",
            }}
          >
            <div>
              <p style={{ opacity: 0.7, marginBottom: 8 }}>Check-in</p>
              <h3 style={{ color: "white", margin: 0 }}>
                {formatDateLabel(roomSearch.checkInDate)}
              </h3>
            </div>

            <div>
              <p style={{ opacity: 0.7, marginBottom: 8 }}>Check-out</p>
              <h3 style={{ color: "white", margin: 0 }}>
                {formatDateLabel(roomSearch.checkOutDate)}
              </h3>
            </div>
          </div>

          <div style={{ textAlign: "left" }}>
            <p style={{ opacity: 0.7, marginBottom: 8 }}>Guests</p>
            <h3 style={{ color: "white", margin: 0 }}>
              {roomSearch.guestCount} Adults
            </h3>
          </div>

          <hr
            style={{ borderColor: "rgba(255,255,255,0.16)", margin: "22px 0" }}
          />

          <div style={{ textAlign: "left" }}>
            <p style={{ opacity: 0.7, marginBottom: 8 }}>Total Paid</p>
            <h1 style={{ color: "white", margin: 0, fontSize: 48 }}>
              ${activeRoom.price * bookingNights}
            </h1>
          </div>
        </div>

        <button
          onClick={() => setScreen("mybookings")}
          style={{
            ...buttonStyle,
            width: "100%",
            padding: 16,
            borderRadius: 14,
            fontSize: 18,
          }}
        >
          VIEW MY BOOKING
        </button>
      </div>
    );
  }

  return null;
}

const page = () => ({
  width: "100%",
  height: "100%",
  /* Use backgroundImage instead of shorthand to avoid mixing with
     backgroundSize/Position/Repeat in components that spread `page()`
     and also set backgroundImage (prevents React warnings). */
  backgroundImage: LUXURY_BASE_BACKGROUND,
  backgroundColor: "#071b17",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  flexDirection: "column",
  boxSizing: "border-box",
  overflow: "hidden",
});

const screenPage = () => ({
  width: "100%",
  height: "100%",
  backgroundImage: LUXURY_BASE_BACKGROUND,
  backgroundColor: "#071b17",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "white",
  overflow: "hidden",
  boxSizing: "border-box",
});

const inputStyle = {
  padding: 12,
  margin: 10,
  borderRadius: 10,
  border: "none",
  width: 220,
};

const buttonStyle = {
  padding: 12,
  width: 220,
  borderRadius: 20,
  border: "none",
  background: "#0a2d35",
  color: "white",
  cursor: "pointer",
  marginTop: 15,
};

const navbarStyle = {
  position: "absolute",
  bottom: 12,
  left: 20,
  right: 20,
  background: "rgba(255,255,255,0.18)",
  backdropFilter: "blur(10px)",
  display: "flex",
  justifyContent: "space-around",
  padding: "14px 10px",
  borderRadius: 15,
  boxSizing: "border-box",
};

const navButton = {
  background: "transparent",
  border: "none",
  color: "white",
  fontSize: 16,
  cursor: "pointer",
};

const paymentInputStyle = {
  width: "100%",
  padding: 12,
  marginTop: 8,
  marginBottom: 18,
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.65)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  boxSizing: "border-box",
};

const searchInputStyle = {
  width: "100%",
  padding: 11,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.55)",
  background: "rgba(255,255,255,0.18)",
  color: "white",
  boxSizing: "border-box",
};

const signupInputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 10,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.65)",
  background: "rgba(255,255,255,0.28)",
  color: "black",
  boxSizing: "border-box",
};

const adminPortalLinkStyle = {
  marginTop: 8,
  background: "transparent",
  border: "none",
  color: "var(--accent)",
  textDecoration: "underline",
  cursor: "pointer",
  fontSize: 12,
  letterSpacing: 1,
  alignSelf: "center",
};

const adminContentShellStyle = {
  width: "100%",
  height: "100%",
  padding: 20,
  paddingBottom: 18,
  boxSizing: "border-box",
  position: "relative",
  overflowY: "auto",
  /* make content shell translucent so adminShellStyle background (loginBg)
     shows through. Use the global overlay for subtle darkening. */
  background: LUXURY_OVERLAY,
  backgroundColor: "transparent",
  color: "white",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const adminLoginShellStyle = {
  width: "100%",
  maxWidth: 360,
  background: "rgba(9, 60, 64, 0.52)",
  borderRadius: 30,
  padding: 28,
  border: "1px solid rgba(255, 255, 255, 0.12)",
  boxShadow: "0 22px 60px rgba(0, 0, 0, 0.26)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  boxSizing: "border-box",
};

const adminEyebrowStyle = {
  margin: 0,
  color: "var(--accent)",
  textTransform: "uppercase",
  letterSpacing: 2,
  fontSize: 12,
};

const adminHeadingStyle = {
  margin: 0,
  fontSize: 28,
  lineHeight: 1.1,
  color: "var(--text-h)",
};

const adminSubheadingStyle = {
  margin: 0,
  color: "rgba(255,255,255,0.76)",
  fontSize: 14,
  lineHeight: 1.5,
};

const adminInputStyle = {
  width: "100%",
  padding: 14,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  boxSizing: "border-box",
  outline: "none",
};

const adminErrorStyle = {
  margin: 0,
  color: "#ffb4b4",
  fontSize: 13,
};

const adminPrimaryButtonStyle = {
  marginTop: 8,
  width: "100%",
  border: "none",
  borderRadius: 16,
  padding: 15,
  background: "linear-gradient(180deg, #49cd82 0%, #2ca85f 100%)",
  color: "#ffffff",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(24, 118, 72, 0.22)",
};

const adminBackButtonStyle = {
  background: "transparent",
  border: "none",
  color: "var(--accent)",
  textDecoration: "underline",
  cursor: "pointer",
  fontSize: 13,
  marginTop: 4,
};

const adminHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 14,
  marginBottom: 18,
};

const adminTopBarStyle = {
  display: "grid",
  gridTemplateColumns: "44px 1fr auto",
  alignItems: "center",
  gap: 10,
  marginBottom: 14,
  padding: "2px 0 4px",
};

const adminHeaderIconButtonStyle = {
  width: 40,
  height: 40,
  border: "none",
  borderRadius: 14,
  background: "rgba(255,255,255,0.05)",
  color: "#ffffff",
  fontSize: 20,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
};

const adminTopBarTitleWrapStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const adminTopBarTitleStyle = {
  margin: 0,
  color: "#ffffff",
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: 0.2,
  textAlign: "center",
};

const adminAddRoomButtonStyle = {
  border: "1px solid rgba(112, 216, 149, 0.2)",
  borderRadius: 14,
  padding: "10px 14px",
  background:
    "linear-gradient(180deg, rgba(80, 203, 124, 0.98) 0%, rgba(45, 171, 96, 0.98) 100%)",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: 12,
  cursor: "pointer",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
};

const adminPrimaryActionStyle = {
  border: "none",
  borderRadius: 16,
  padding: "12px 16px",
  background: "var(--cta)",
  color: "#0a261c",
  fontWeight: 800,
  cursor: "pointer",
  flexShrink: 0,
};

const adminStatGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
  marginBottom: 4,
};

const adminStatCardStyle = {
  minHeight: 140,
  background:
    "linear-gradient(180deg, rgba(23, 89, 92, 0.96) 0%, rgba(12, 53, 57, 0.98) 100%)",
  borderRadius: 20,
  padding: "16px 16px 14px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 16px 34px rgba(0, 0, 0, 0.18)",
};

const adminStatIconWrapStyle = {
  width: 34,
  height: 34,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#f0c24d",
  fontSize: 20,
  marginBottom: 10,
  background: "rgba(240, 194, 77, 0.14)",
  border: "1px solid rgba(240, 194, 77, 0.18)",
};

const adminStatLabelStyle = {
  margin: 0,
  color: "rgba(255, 255, 255, 0.84)",
  fontSize: 12,
  fontWeight: 500,
};

const adminStatValueStyle = {
  margin: "8px 0 6px",
  fontSize: 30,
  lineHeight: 1,
  color: "#ffffff",
  fontWeight: 600,
};

const adminMiniValueStyle = {
  margin: "8px 0 4px",
  fontSize: 24,
  lineHeight: 1,
  color: "#49cd82",
};

const adminStatMetaStyle = {
  margin: 0,
  color: "var(--success)",
  fontSize: 12,
};

const adminPanelStyle = {
  /* translucent frosted panel so the background image is visible */
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  borderRadius: 22,
  padding: 18,
  border: "1px solid rgba(255, 255, 255, 0.06)",
  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.20)",
  marginBottom: 14,
};

const adminPanelHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  marginBottom: 14,
};

const adminPanelTitleStyle = {
  margin: 0,
  fontSize: 18,
  color: "#ffffff",
  letterSpacing: 0.2,
};

const adminPanelPillStyle = {
  borderRadius: 999,
  padding: "6px 10px",
  background: "var(--success-bg)",
  color: "var(--cta)",
  fontSize: 12,
};

const adminViewAllTextStyle = {
  border: "none",
  background: "transparent",
  color: "rgba(255, 255, 255, 0.88)",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  padding: 0,
  margin: 0,
};

const adminListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const adminReservationRowStyle = {
  display: "grid",
  gridTemplateColumns: "54px minmax(0, 1fr) auto",
  gap: 12,
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const adminReservationPreviewStyle = {
  width: 50,
  height: 50,
  borderRadius: 14,
  background:
    "linear-gradient(135deg, rgba(240, 194, 77, 0.22) 0%, rgba(18, 108, 110, 0.96) 100%)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
  overflow: "hidden",
};

const adminReservationPreviewImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const adminReservationInfoStyle = {
  minWidth: 0,
};

const adminReservationDateStyle = {
  color: "rgba(255, 255, 255, 0.72)",
  fontSize: 13,
  textAlign: "left",
  lineHeight: 1.3,
  marginTop: 4,
};

const adminManagementRowStyle = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr",
  gap: 12,
  alignItems: "start",
  padding: "14px 0",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const adminRoomCardStyle = {
  display: "grid",
  gridTemplateColumns: "114px minmax(0, 1fr)",
  gap: 14,
  alignItems: "center",
  padding: 14,
  borderRadius: 22,
  background:
    "linear-gradient(180deg, rgba(24, 89, 90, 0.96) 0%, rgba(11, 50, 54, 0.98) 100%)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 16px 34px rgba(0, 0, 0, 0.18)",
};
const adminRoomThumbStyle = {
  width: 114,
  height: 86,
  objectFit: "cover",
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 12px 26px rgba(0, 0, 0, 0.24)",
};

const adminRoomInfoStyle = {
  minWidth: 0,
};

const adminRoomTitleRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 10,
  marginBottom: 8,
};

const adminRoomTitleStyle = {
  margin: 0,
  color: "#ffffff",
  fontSize: 16,
  fontWeight: 700,
};

const adminRoomPriceStyle = {
  margin: "4px 0 0",
  color: "rgba(255,255,255,0.74)",
  fontSize: 13,
};

const adminRecentBookingRowStyle = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr auto",
  gap: 12,
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const adminRecentBookingNameStyle = {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 700,
};

const adminRecentBookingMetaStyle = {
  color: "rgba(255,255,255,0.72)",
  fontSize: 12,
};

const adminReportRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  padding: "14px 0",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const adminRowPrimaryStyle = {
  margin: 0,
  color: "#ffffff",
  fontSize: 15,
  fontWeight: 700,
};

const adminRowSecondaryStyle = {
  margin: "4px 0 0",
  color: "rgba(255,255,255,0.72)",
  fontSize: 12,
  lineHeight: 1.4,
};

const adminBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 0,
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
};

const adminActionRowStyle = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const adminGhostButtonStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  padding: "8px 12px",
  background: "rgba(255,255,255,0.05)",
  color: "#ffffff",
  cursor: "pointer",
};

const adminOutlineButtonStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  padding: "8px 12px",
  background: "rgba(255,255,255,0.05)",
  color: "rgba(255,255,255,0.9)",
  cursor: "pointer",
};

const adminMiniGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 10,
};

const adminMiniCardStyle = {
  background: "rgba(255,255,255,0.04)",
  borderRadius: 18,
  padding: 14,
  border: "1px solid rgba(217, 194, 124, 0.14)",
};

const adminAvatarStyle = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  background: "linear-gradient(180deg, var(--cta) 0%, var(--accent) 100%)",
  color: "#072018",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 24,
  fontWeight: 800,
};

const adminLogoutButtonStyle = {
  width: "100%",
  marginTop: 18,
  border: "none",
  borderRadius: 16,
  padding: 14,
  background: "var(--cta)",
  color: "#0a261c",
  fontWeight: 800,
  cursor: "pointer",
};

const adminNavStyle = {
  position: "sticky",
  left: 0,
  right: 0,
  bottom: 0,
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  gap: 0,
  marginTop: "auto",
  padding: "10px 10px 12px",
  borderRadius: "20px 20px 0 0",
  /* translucent nav so background image shows behind it */
  background: "rgba(6,20,20,0.44)",
  borderTop: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 -14px 28px rgba(0, 0, 0, 0.22)",
  boxSizing: "border-box",
};

const adminNavButtonStyle = {
  border: "none",
  borderRadius: 16,
  padding: "10px 6px 8px",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 600,
  lineHeight: 1.1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 5,
  minHeight: 58,
};
