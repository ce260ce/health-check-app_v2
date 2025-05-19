// src/components/Header.js
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/names"); // メンバー管理画面に遷移
  };

  return (
    <div style={{ textAlign: "right", marginBottom: "10px" }}>
      <button onClick={handleClick}>👤 メンバー管理</button>
    </div>
  );
}

export default Header;
