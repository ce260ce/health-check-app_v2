// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ListPage from "./pages/ListPage";
import NameList from "./pages/NameList";
import SelectUserPage from "./pages/SelectUserPage";
import AdminPage from "./pages/AdminPage";
import TodayRecordPage from "./pages/TodayRecordPage";
import "./styles/button.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/select" element={<SelectUserPage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/names" element={<NameList />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/today" element={<TodayRecordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
