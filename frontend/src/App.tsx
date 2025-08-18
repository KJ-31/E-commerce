import { Navigate, Route, Routes } from 'react-router-dom'
import ElevenStreetHome from './11st-Home'
import SellerMyPage from './seller_mypage/SellerMyPage'


function App() {
  return (
    <Routes>
      <Route path="/" element={<ElevenStreetHome />} />
      <Route path="/seller/mypage" element={<SellerMyPage />} />
    </Routes>
  )
}

export default App
