import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainPage } from "./pages/MainPage";
import { ListPage } from "./pages/ListPage";
import { NameList } from "./pages/NameList";
import { SelectUserPage } from "./pages/SelectUserPage";
import { AdminPage } from "./pages/AdminPage";
import { TodayRecordPage } from "./pages/TodayRecordPage";
import { TaskPage } from "./pages/TaskPage";
import { LinkBuilderPage } from "./pages/LinkBuilderPage";
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
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/link-builder" element={<LinkBuilderPage />} />
      </Routes>
    </Router>
  );
}

export default App;
