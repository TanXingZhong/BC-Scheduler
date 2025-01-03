import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

const YearlyCountDown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999); // Dec 31 at 23:59:59.999

    const diff = endOfYear - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <div style={styles.container}>
        <h1 style={styles.title}>Countdown to AWS Change</h1>
        <div style={styles.countdown}>
          <span style={styles.time}>{timeLeft.days}d</span>
          <span style={styles.time}>{timeLeft.hours}h</span>
          <span style={styles.time}>{timeLeft.minutes}m</span>
          <span style={styles.time}>{timeLeft.seconds}s</span>
        </div>
      </div>
    </Box>
  );
};

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    color: "grey",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  countdown: {
    fontSize: "2rem",
    display: "flex",
    gap: "1rem",
  },
  time: {
    fontWeight: "bold",
    fontSize: "2.5rem",
    color: "#f39c12",
  },
};

export default YearlyCountDown;