import { signInWithPopup, OAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const provider = new OAuthProvider("microsoft.com");

    try {
      await signInWithPopup(auth, provider);
      navigate("/home"); // redirigir al home después del login
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>Iniciar sesión con Microsoft</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
