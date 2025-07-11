import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper
} from "@mui/material";

function App() {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState(30);
  const [shortcode, setShortcode] = useState("");
  const [result, setResult] = useState(null);

  const handleShorten = async () => {
    if (!url.trim()) {
      alert("URL is required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/shorturls", {
        url,
        validity: parseInt(validity),
        shortcode: shortcode.trim() || undefined,
      });
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom align="center">
            URL Shortener
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Original Long URL"
                fullWidth
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Validity (minutes)"
                type="number"
                fullWidth
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Custom Shortcode"
                fullWidth
                value={shortcode}
                onChange={(e) => setShortcode(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleShorten}
              >
                Shorten URL
              </Button>
            </Grid>
          </Grid>

          {result && (
            <Box mt={4} textAlign="center">
              <Typography>
                <strong>Short Link:</strong>{" "}
                <a href={result.shortLink} target="_blank" rel="noopener noreferrer">
                  {result.shortLink}
                </a>
              </Typography>
              <Typography><strong>Expires at:</strong> {result.expiry}</Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
