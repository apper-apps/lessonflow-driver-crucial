import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import Home from "@/components/pages/Home"
import Lessons from "@/components/pages/Lessons"
import LessonDetail from "@/components/pages/LessonDetail"
import Community from "@/components/pages/Community"
import Membership from "@/components/pages/Membership"
import MyLearning from "@/components/pages/MyLearning"
import AdminDashboard from "@/components/pages/AdminDashboard"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lessons/:id" element={<LessonDetail />} />
            <Route path="/community" element={<Community />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/my-learning" element={<MyLearning />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App