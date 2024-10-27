import "@/App.css";
import "@/App.scss";
import CustomRouter from "@/routes";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Welcome } from "@/Pages/Welcome/Welcome";
import { useEffect } from "react";

function App() {
  const { isAuthenticated } = useKindeAuth();

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <div className="App">
      {isAuthenticated ? <CustomRouter /> : <Welcome />}
    </div>
  );
}

export default App;
