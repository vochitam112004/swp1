import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import InputField from "../common/InputField";

export default function RegisterForm() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      register(username, password);
      navigate("/dashboard");
    } else {
      setError("Vui lòng nhập đầy đủ thông tin");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Đăng ký</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <InputField
        label="Tên đăng nhập"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <InputField
        label="Mật khẩu"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Button type="submit" className="w-full mt-4">Đăng ký</Button>
    </form>
  );
}