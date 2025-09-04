import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PersonalPage from "./pages/PersonalPage";
import AdminPage from "./pages/AdminPage";
import InventoryList from "./pages/InventoryList";
import InventoryDetail from "./pages/Inventory/InventoryDetail";
import CreateInventoryPage from "./pages/CreateInventoryPage";
import ItemPage from "./pages/ItemPage";
import SearchPage from "./pages/SearchPage";
import OAuthRedirect from "./pages/OAuthRedirect"; // исправлено

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/personal" element={<PersonalPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/inventories" element={<InventoryList />} />
            <Route path="/inventories/:id" element={<InventoryDetail />} />
            <Route path="/create-inventory" element={<CreateInventoryPage />} />
            <Route path="/items/:id" element={<ItemPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/oauth-redirect" element={<OAuthRedirect />} /> {/* исправлено */}
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  </AuthProvider>
);

export default App;













