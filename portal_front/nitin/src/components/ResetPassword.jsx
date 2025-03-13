import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Form, Button, Alert, Card } from "react-bootstrap";

const ResetPassword = () => {
  const { token } = useParams(); // Get reset token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
  
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:9091/api/users/reset-password", {
        token,
        password,
      });
      setMessage(response.data.message || "Password reset successful");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error("Error response:", error.response); // Debugging
  
      if (error.response?.data?.message) {
        setError(error.response.data.message); // If the backend provides an error message
      } else if (error.response?.data) {
        setError(JSON.stringify(error.response.data)); // Convert object to string
      } else {
        setError("Failed to reset password. Please try again.");
      }
    }
    setLoading(false);
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
        <h3 className="text-center">Reset Password</h3>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="success" type="submit" className="w-100" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </Form>
        <div className="text-center mt-3">
          <Button variant="link" onClick={() => navigate("/login")}>
            Back to Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;
