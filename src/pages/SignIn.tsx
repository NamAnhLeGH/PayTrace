import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase"; // Import the Firebase auth object
import { Button, Form } from "react-bootstrap"; // Import Bootstrap components

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form default submission behavior
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/search"; // Redirect to the search page after successful login
    } catch (error: any) {
      setError(error.message); // Set error message on failure
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Sign In</h2>
          {/* Sign-in Form */}
          <div className="card shadow-sm">
            <div className="card-body">
              <Form onSubmit={handleSignIn}>
                {/* Email Input */}
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Password Input */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Sign In Button */}
                <Button variant="primary" type="submit" className="w-100">
                  Sign In
                </Button>

                {/* Error Message */}
                {error && (
                  <div className="mt-3 alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
