import "@/App.css";
import "@/App.scss";
import CustomRouter from "@/routes";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

function App() {
  return (
    <KindeProvider
      clientId="3ca097572fbe4ab29308c9f21c78b1c5"
      domain="https://fasa.kinde.com"
      redirectUri="http://localhost:5173"
      logoutUri="http://localhost:5173"
      audience="fa-backend-api"
    >
      <div className="App">
        <CustomRouter />
      </div>
    </KindeProvider>
  );
}

export default App;