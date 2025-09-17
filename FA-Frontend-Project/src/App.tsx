import "@/App.css";
import "@/App.scss";
import CustomRouter from "@/routes";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

function App() {
  const { isAuthenticated } = useKindeAuth();

  return (
    <div className="App">
      {/* isAuthenticated ? <CustomRouter /> : <Welcome /> */}
      <CustomRouter />
    </div>
  );
}

export default App;
