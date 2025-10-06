import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import NotFoundPage from "./app_modules/404Page";
import Registration from "./authentication/12";
import ClothingUpload from "./upload cloths/uploadPage";
import OutfitGenerator from "./generate Outfit/genOutfitFlow";
import DashboardApp from "./dashboard";
import CalApp from "./calendar/App";
import WelcomePage from "./assets/welcome";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/upload-cloths" element={<ClothingUpload/>}/>
        <Route path="/generate-outfit" element={<OutfitGenerator/>}/>
        <Route path="/welcome" element={<WelcomePage/>}/>
        <Route path="/" element={<WelcomePage/>}/>
        <Route path="/calendar" element={<CalApp/>}/>
      </Routes>
    </Router>
  );
}

export default App;
