import { AuthProvider } from "./contexts/AuthContext";
import AppRouter from "./router";
import Navbar from "./components/layout/Navbar";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <AppRouter />
    </AuthProvider>
  );
}