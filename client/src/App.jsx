import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Pricing from './pages/Pricing'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import Quote from './pages/Quote'
import NotFound from './pages/NotFound'
import AdminLogin from './admin/Login'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/Dashboard'
import AdminQuotes from './admin/Quotes'
import AdminMessages from './admin/Messages'
import AdminBlogManager from './admin/BlogManager'
import ProtectedRoute from './components/ProtectedRoute'
import Container from './components/Container'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-main py-4 sm:py-6">
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/quote" element={<Quote />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={(
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                )}
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="quotes" element={<AdminQuotes />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="blog" element={<AdminBlogManager />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
