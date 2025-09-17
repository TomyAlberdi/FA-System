import "@/App.css";
import "@/App.scss";
import { Welcome } from "@/Pages/Welcome/Welcome";
import CustomRouter from "@/routes";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

function App() {
  const { isAuthenticated } = useKindeAuth();

  return (
    <div className="App">
      {isAuthenticated ? <CustomRouter /> : <Welcome />}
    </div>
  );
}

export default App;
