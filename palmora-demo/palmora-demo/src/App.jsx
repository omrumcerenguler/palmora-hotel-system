import { useState } from "react";
import oceanView from "./assets/ocean-view.png";
import gardenView from "./assets/garden-view.png";
import suite from "./assets/suite.png";
import profileImage from "./assets/profile-palmora.png";
import palmoraLogo from "./assets/palmorawhitelogo.png";
import homeBg from "./assets/background2.jpeg";
import loginBg from "./assets/loginbg.png";

export default function App() {
  const appStyle = {
    width: "440px",
    height: "777px",
    margin: "0 auto",
    position: "relative",
    overflow: "hidden",
    background: "#0f3d3e",
    boxSizing: "border-box",
  };
  const [screen, setScreen] = useState("login");

  const [activeFilter, setActiveFilter] = useState("All");

  const [selectedRoom, setSelectedRoom] = useState(null);

  const [bookingTab, setBookingTab] = useState("upcoming");

  const rooms = [
    {
      name: "Ocean View",
      price: 220,
      image: oceanView,
      description: "Enjoy breathtaking ocean views from your private balcony. Modern comfort and tropical elegance for a perfect stay.",
      guests: "3 Guests",
    },
    {
      name: "Garden View",
      price: 190,
      image: gardenView,
      description: "Relax in a peaceful garden atmosphere surrounded by tropical greenery. A cozy escape designed for comfort and serenity.",
      guests: "2 Guests",
    },
    {
      name: "Suite",
      price: 350,
      image: suite,
      description: "Experience luxury and spacious living with elegant interiors and stunning resort views. Perfect for a premium Palmora stay.",
      guests: "4 Guests",
    },
  ];

  if (screen === "login") {
    return (
      <div style={{
        ...page("#145a5a"),
        ...appStyle,
        backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        justifyContent: "center",
      }}>

        <img
          src={palmoraLogo}
          alt="Palmora Logo"
          style={{
            width: 240,
            marginBottom: 20,
            zIndex: 2,
          }}
        />

        <div style={{
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
        }}>

          <h1 style={{
            color: "white",
            fontSize: 40,
            marginBottom: 0,
            fontWeight: "300",
            letterSpacing: 1,
          }}>
            WELCOME!
          </h1>

          <p style={{
            marginTop: 5,
            marginBottom: 35,
            color: "white",
            opacity: 0.9,
          }}>
            Relax, you're almost in
          </p>

          <h2 style={{
            color: "white",
            marginBottom: 25,
            fontSize: 40,
            fontWeight: "400",
          }}>
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
            Don&apos;t have an account?{" "}
            <span
              onClick={() => setScreen("signup")}
              style={{ textDecoration: "underline", fontWeight: "bold", cursor: "pointer" }}
            >
              Sign up
            </span>
          </p>

        </div>

      </div>
    );
  }

  if (screen === "signup") {
    return (
      <div
        style={{
          ...page("#145a5a"),
          ...appStyle,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          justifyContent: "center",
        }}
      >
        <img
          src={palmoraLogo}
          alt="Palmora Logo"
          style={{
            width: 180,
            marginBottom: 25,
          }}
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
          <h1 style={{ color: "white", fontSize: 40, margin: 0, fontWeight: 300 }}>
            SIGN UP
          </h1>

          <p style={{ color: "white", opacity: 0.9, marginTop: 6, marginBottom: 22 }}>
            Create your account
          </p>

          <input placeholder="Full Name" style={signupInputStyle} />
          <input placeholder="Email" style={signupInputStyle} />
          <input placeholder="Phone Number" style={signupInputStyle} />
          <input placeholder="Password" type="password" style={signupInputStyle} />
          <input placeholder="Confirm Password" type="password" style={signupInputStyle} />

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
              style={{ textDecoration: "underline", fontWeight: "bold", cursor: "pointer" }}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    );
  }

  if (screen === "home") {
    return (
      <div style={{
        ...screenPage("#145a5a"),
        ...appStyle,
        backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${homeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        position: "relative",
      }}>

        <div style={{ textAlign: "left", width: "100%" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 15,
            marginTop: 40,
          }}>
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
              <p style={{ margin: 0, fontSize: 16 }}>
                Welcome back,
              </p>

              <h2 style={{
                margin: 0,
                fontSize: 24,
                lineHeight: 1.1,
              }}>
                [NAME]!
              </h2>
            </div>
          </div>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(4px)",
          borderRadius: 25,
          padding: 30,
          textAlign: "left",
          marginTop: 320,
          marginBottom: 0,
          width: "80%",
        }}>
          <h2>Your Private Paradise</h2>
          <p>Experience comfort, luxury and unforgettable moments in our exclusive resort.</p>

          <button onClick={() => setScreen("rooms")} style={buttonStyle}>
            Explore Rooms
          </button>
        </div>

        <div style={navbarStyle}>
          <button onClick={() => setScreen("home")} style={navButton}>Home</button>
          <button onClick={() => setScreen("rooms")} style={navButton}>Rooms</button>
          <button onClick={() => setScreen("mybookings")} style={navButton}>Bookings</button>
          <button onClick={() => setScreen("profile")} style={navButton}>Profile</button>
        </div>

      </div>
    );
  }

  if (screen === "rooms") {
    return (
      <div style={{
        ...screenPage("#145a5a"),
        ...appStyle,
        backgroundImage: `linear-gradient(rgba(20,90,90,0.82), rgba(20,90,90,0.82)), url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 24,
      }}>

        <div style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 20,
        }}>
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

          <h1 style={{
            color: "white",
            fontSize: 30,
            margin: 0,
          }}>
            Rooms & Suites
          </h1>
        </div>

        <div style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
        }}>
          {["All", "Ocean View", "Garden View", "Suites"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: "8px 14px",
                borderRadius: 20,
                border: "none",
                background: activeFilter === filter ? "white" : "transparent",
                color: activeFilter === filter ? "#145a5a" : "white",
                cursor: "pointer",
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {rooms
          .filter((room) => {
            if (activeFilter === "All") return true;
            if (activeFilter === "Suites") return room.name === "Suite";
            return room.name === activeFilter;
          })
          .map((room) => (
            <div
              key={room.name}
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
              />

              <div style={{
                flex: 1,
                textAlign: "left",
                color: "white",
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <h2 style={{
                    margin: 0,
                    fontSize: 22,
                    color: "white",
                  }}>
                    {room.name}
                  </h2>

                  <span style={{ fontSize: 26 }}>♡</span>
                </div>

                <p style={{
                  margin: "10px 0 4px",
                  fontSize: 13,
                  opacity: 0.9,
                }}>
                  {room.guests} &nbsp;&nbsp; 1 King Bed
                </p>

                <p style={{
                  margin: 0,
                  fontSize: 13,
                  opacity: 0.9,
                }}>
                  {room.name === "Suite" ? "50 m²" : room.name === "Garden View" ? "28 m²" : "32 m²"}
                </p>

                <p style={{
                  margin: "22px 0 0",
                  fontSize: 24,
                  fontWeight: "bold",
                }}>
                  ${room.price}
                  <span style={{
                    fontSize: 10,
                    fontWeight: "normal",
                  }}>
                    /night
                  </span>
                </p>
              </div>
            </div>
          ))}

        <div style={navbarStyle}>
          <button onClick={() => setScreen("home")} style={navButton}>Home</button>
          <button onClick={() => setScreen("rooms")} style={navButton}>Rooms</button>
          <button onClick={() => setScreen("mybookings")} style={navButton}>Bookings</button>
          <button onClick={() => setScreen("profile")} style={navButton}>Profile</button>
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
          background: "#1f5a55",
          borderRadius: 34,
          overflow: "hidden",
          position: "relative",
          color: "white",
        }}
      >
        <div style={{ position: "relative", height: 300 }}>
          <img
            src={selectedRoom.image}
            alt={selectedRoom.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
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
            background: "rgba(20,90,90,0.82)",
            backgroundImage: `linear-gradient(rgba(20,90,90,0.82), rgba(20,90,90,0.82)), url(${loginBg})`,
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
              {selectedRoom.name}
            </h1>

            <h2 style={{ margin: 0, color: "white", fontSize: 24 }}>
              ${selectedRoom.price}
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
              <h3 style={{ margin: 0, color: "white" }}>2</h3>
              <p style={{ margin: "6px 0 0", fontSize: 13 }}>Guests</p>
            </div>

            <div>
              <h3 style={{ margin: 0, color: "white" }}>1</h3>
              <p style={{ margin: "6px 0 0", fontSize: 13 }}>King Bed</p>
            </div>

            <div>
              <h3 style={{ margin: 0, color: "white" }}>
                {selectedRoom.name === "Suite"
                  ? "50"
                  : selectedRoom.name === "Garden View"
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
            {selectedRoom.description}
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
          ...screenPage("#145a5a"),
          ...appStyle,
          padding: "22px 24px",
          justifyContent: "flex-start",
          background: `linear-gradient(rgba(20,90,90,0.35), rgba(20,90,90,0.35)), url(${loginBg}) center/cover no-repeat`,
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
            src={selectedRoom.image}
            alt={selectedRoom.name}
            style={{
              width: 110,
              height: 92,
              objectFit: "cover",
              borderRadius: 16,
            }}
          />

          <div style={{ textAlign: "left" }}>
            <h2 style={{ margin: 0, color: "white", fontSize: 22 }}>
              {selectedRoom.name}
            </h2>

            <p style={{ margin: "8px 0 0", color: "white", fontSize: 18 }}>
              ${selectedRoom.price}
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
            May 20, 2026
          </h3>

          <hr style={{ borderColor: "rgba(255,255,255,0.14)" }} />

          <p style={{ margin: "14px 0 0", opacity: 0.75, fontSize: 13 }}>
            Check-out
          </p>
          <h3 style={{ margin: "5px 0 14px", color: "white", fontSize: 18 }}>
            May 24, 2026
          </h3>

          <hr style={{ borderColor: "rgba(255,255,255,0.14)" }} />

          <p style={{ margin: "14px 0 0", opacity: 0.75, fontSize: 13 }}>
            Guests
          </p>
          <h3 style={{ margin: "5px 0 0", color: "white", fontSize: 18 }}>
            2 Adults
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
            Total (4 Nights)
          </p>

          <h1 style={{ margin: "6px 0 0", color: "white", fontSize: 34 }}>
            ${selectedRoom.price * 4}
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
        room: rooms[0],
        date: "May 20, 2026 - May 24, 2026",
        guests: "2 Adults",
        status: "Upcoming",
      },
    ];

    const pastBookings = [
      {
        room: rooms[1],
        date: "June 10, 2025 - June 16, 2025",
        guests: "2 Adults",
        status: "Completed",
      },
      {
        room: rooms[2],
        date: "March 3, 2023 - March 8, 2023",
        guests: "2 Adults",
        status: "Completed",
      },
    ];

    const shownBookings = bookingTab === "upcoming" ? upcomingBookings : pastBookings;

    return (
      <div
        style={{
          ...screenPage("#145a5a"),
          ...appStyle,
          padding: 28,
          backgroundImage: `linear-gradient(rgba(20,90,90,0.78), rgba(20,90,90,0.78)), url(${loginBg})`,
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
          ...screenPage("#145a5a"),
          ...appStyle,
          padding: 28,
          background: `linear-gradient(rgba(20,90,90,0.25), rgba(20,90,90,0.25)), url(${loginBg}) center/cover no-repeat`,
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
          <h2 style={{
            fontSize: 18,
            color: "white",
          }}>
            Total Amount
          </h2>

          <div style={{ textAlign: "right" }}>
            <h1 style={{ margin: 0, fontSize: 36, color: "white" }}>
              ${selectedRoom.price * 4}
            </h1>
            <p style={{ margin: 0, opacity: 0.8, color: "white" }}>(4 Nights)</p>
          </div>
        </div>

        <button
          onClick={() => setScreen("confirmation")}
          style={{
            ...buttonStyle,
            width: "100%",
            marginTop: "auto",
            marginBottom: 22,
            fontSize: 18,
            padding: 15,
            borderRadius: 12,
          }}
        >
          PAY NOW
        </button>
      </div>
    );
  }

  if (screen === "profile") {
    return (
      <div
        style={{
          ...screenPage("#145a5a"),
          ...appStyle,
          padding: 28,
          backgroundImage: `linear-gradient(rgba(20,90,90,0.82), rgba(20,90,90,0.82)), url(${loginBg})`,
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
          <button onClick={() => setScreen("home")} style={navButton}>Home</button>
          <button onClick={() => setScreen("rooms")} style={navButton}>Rooms</button>
          <button onClick={() => setScreen("mybookings")} style={navButton}>Bookings</button>
          <button onClick={() => setScreen("profile")} style={navButton}>Profile</button>
        </div>
      </div>
    );
  } 
  if (screen === "confirmation") {
  return (
    <div
      style={{
        ...screenPage("#145a5a"),
        ...appStyle,
        padding: 28,
        justifyContent: "center",
        background: `
          linear-gradient(rgba(20,90,90,0.35), rgba(20,90,90,0.35)),
          url(${loginBg}) center/cover no-repeat
        `,
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
        style={{
          color: "white",
          fontSize: 22,
          margin: 0,
          marginBottom: 10,
        }}
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
            src={selectedRoom.image}
            alt={selectedRoom.name}
            style={{
              width: 120,
              height: 95,
              objectFit: "cover",
              borderRadius: 18,
            }}
          />

          <div style={{ textAlign: "left" }}>
            <h2
              style={{
                color: "white",
                margin: 0,
                fontSize: 20,
              }}
            >
              {selectedRoom.name}
            </h2>

            <p
              style={{
                color: "white",
                opacity: 0.85,
                marginTop: 6,
              }}
            >
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
              May 20, 2026
            </h3>
          </div>

          <div>
            <p style={{ opacity: 0.7, marginBottom: 8 }}>Check-out</p>
            <h3 style={{ color: "white", margin: 0 }}>
              May 24, 2026
            </h3>
          </div>
        </div>

        <div style={{ textAlign: "left" }}>
          <p style={{ opacity: 0.7, marginBottom: 8 }}>Guests</p>
          <h3 style={{ color: "white", margin: 0 }}>
            2 Adults
          </h3>
        </div>

        <hr
          style={{
            borderColor: "rgba(255,255,255,0.16)",
            margin: "22px 0",
          }}
        />

        <div style={{ textAlign: "left" }}>
          <p style={{ opacity: 0.7, marginBottom: 8 }}>
            Total Paid
          </p>

          <h1
            style={{
              color: "white",
              margin: 0,
              fontSize: 48,
            }}
          >
            ${selectedRoom.price * 4}
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
}



const page = (bg) => ({
  width: "100%",
  height: "100%",
  background: bg,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  flexDirection: "column",
  boxSizing: "border-box",
  overflow: "hidden",
});

const screenPage = (bg) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundImage: `
    linear-gradient(rgba(10,40,40,0.82), rgba(10,40,40,0.82)),
    url(${loginBg})
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
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

const smallButton = {
  padding: 10,
  borderRadius: 15,
  border: "none",
  cursor: "pointer",
  background: "#7fb0b0cd"
};

const cardStyle = {
  background: "rgba(255,255,255,0.2)",
  padding: 16,
  borderRadius: 20,
  marginTop: 12,
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