import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>Bienvenido, {user?.displayName}</h1>
      <p>{user?.email}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}
