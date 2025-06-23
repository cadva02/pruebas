import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const user = auth.currentUser;

  return user ? <>{children}</> : <Navigate to="/" replace />;
}
