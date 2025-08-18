import './App.css';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Work from './components/Work';
import Login from './components/Login';
import Register from './components/Register';
import SentimentBarGraph from './components/SentimentBarGraph';
import ImageUpload from './components/UploadImage';
import NationalParties from './components/NationalParties';
import SearchNames from './components/SearchNames';
import ChatBotLauncher from './components/ChatBotLauncher';
import ProtectedRoute from './components/ProtectedRoutes';

function App() {
  return (
    <>
      <NavBar />
      <div className="pt-5 mt-3"> {/* padding to avoid navbar overlap */}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Work />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/sentiment"
            element={
              <ProtectedRoute>
                <SentimentBarGraph />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <ImageUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parties"
            element={
              <ProtectedRoute>
                <NationalParties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchNames />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* Always floating on bottom-right */}
      <ChatBotLauncher />
    </>
  );
}

export default App;
