import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Avatar, // Added for bot avatar
  Stack, // Added for message spacing
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"; // AI/Bot icon

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Handle sending a message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // API call to the backend
      const res = await axios.post("http://127.0.0.1:8000/chat", {
        messages,
        message: input,
      });
      

      // Add bot response to state
      const botMessage = { role: "bot", content: res.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      // Handle API errors
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Error connecting to server." },
      ]);
    }
    setLoading(false);
  };

  // Handle 'Enter' key press in the input field
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        // New background gradient
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          py: 2,
          px: 3,
          m: 2,
          mb: 0,
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          maxWidth: "820px",
          width: "calc(100% - 32px)",
          alignSelf: "center",
          zIndex: 10,
        }}
      >
        <AutoAwesomeIcon sx={{ color: "#6d28d9" }} />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.15rem" }}>
          Knowledge Assistant
        </Typography>
      </Paper>

      {/* Chat Window */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          maxWidth: "820px",
          width: "100%",
          alignSelf: "center",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack spacing={2} sx={{ mt: 1, width: "100%" }}>
          {messages.map((m, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {/* Bot Avatar */}
              {m.role === "bot" && (
                <Avatar
                  sx={{
                    bgcolor: "#6d28d9",
                    mr: 1.5,
                    width: 32,
                    height: 32,
                  }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: "1.1rem" }} />
                </Avatar>
              )}
              {/* Message Bubble */}
              <Paper
                elevation={2}
                sx={{
                  px: 2,
                  py: 1.25,
                  borderRadius:
                    m.role === "user"
                      ? "20px 20px 4px 20px"
                      : "20px 20px 20px 4px",
                  background: m.role === "user" ? "#4f46e5" : "#ffffff",
                  color: m.role === "user" ? "#fff" : "#333",
                  maxWidth: "75%",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                {/* Ensure newlines are rendered */}
                <Typography sx={{ whiteSpace: "pre-wrap", fontSize: "0.95rem" }}>
                  {m.content}
                </Typography>
              </Paper>
            </Box>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#6d28d9",
                  mr: 1.5,
                  width: 32,
                  height: 32,
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: "1.1rem" }} />
              </Avatar>
              <CircularProgress size={24} sx={{ color: "#6d28d9" }} />
            </Box>
          )}
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </Stack>
      </Box>

      {/* Input Area */}
      <Paper
        elevation={4}
        sx={{
          p: 1.5,
          m: 2,
          mt: 1,
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          maxWidth: "820px",
          width: "calc(100% - 32px)",
          alignSelf: "center",
          boxSizing: "border-box",
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined" // Changed from standard
          sx={{
            mr: 1.5,
            "& .MuiOutlinedInput-root": {
              // Style the input field itself
              borderRadius: "12px",
              background: "#f5f5f5",
              "& fieldset": {
                borderColor: "transparent", // Hide border
              },
              "&:hover fieldset": {
                borderColor: "#ddd", // Show light border on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "#4f46e5", // Accent border on focus
                borderWidth: "1px",
              },
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          sx={{
            background: "#4f46e5",
            color: "white",
            "&:hover": {
              background: "#4338ca",
            },
            "&:disabled": {
              background: "#e0e0e0",
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}

export default App;