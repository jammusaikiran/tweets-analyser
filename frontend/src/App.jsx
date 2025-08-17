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

function App() {
  return (
    <>
      <NavBar />
      <div className="pt-5 mt-3"> {/* padding to avoid navbar overlap */}
        <Routes>
          <Route path="/" element={<Work />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sentiment" element={<SentimentBarGraph />} />
          <Route path="/upload" element={<ImageUpload />} />
          <Route path="/parties" element={<NationalParties />} />
          <Route path="/search" element={<SearchNames />} />
        </Routes>
      </div>
    </>
  )
}

export default App;
