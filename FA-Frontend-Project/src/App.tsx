import "@/App.css";
import "@/App.scss";
import CustomRouter from "@/routes";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Welcome } from "@/Pages/Welcome/Welcome";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const { isAuthenticated } = useKindeAuth();

  return (
    <div className="App">
      {isAuthenticated ? <CustomRouter /> : <Welcome />}
      <Toaster />
    </div>
  );
}

export default App;
