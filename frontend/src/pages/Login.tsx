import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();
  
  const { login } = useAuth();


  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {

      await login(
        email,
        password
      );


      navigate("/dashboard");


    } catch {

      setError("Invalid credentials");

    }
  }

  return (

    <form onSubmit={handleSubmit}>

      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button type="submit">
        Login
      </button>

      {error && <p>{error}</p>}

    </form>
  );
}
