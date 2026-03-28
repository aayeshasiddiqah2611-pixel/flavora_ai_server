import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { RecipeProvider } from './context/RecipeContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomeFeed from './pages/HomeFeed';
import Explore from './pages/Explore';
import CreateRecipe from './pages/CreateRecipe';
import RecipeDetailPage from './pages/RecipeDetailPage';
import Profile from './pages/Profile';
import Trending from './pages/Trending';
import Notifications from './pages/Notifications';
import About from './pages/About';

// Layout component for pages with Navbar and Footer
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Layout for auth pages (no Navbar/Footer)
function AuthLayout() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RecipeProvider>
          <Router>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                </Route>

                {/* Main Routes */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomeFeed />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/trending" element={<Trending />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/recipe/:id" element={<RecipeDetailPage />} />
                  <Route path="/profile/:id" element={<Profile />} />
                  
                  {/* Protected Routes */}
                  <Route path="/create" element={
                    <ProtectedRoute>
                      <CreateRecipe />
                    </ProtectedRoute>
                  } />
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                </Route>
              </Routes>
            </AnimatePresence>
          </Router>
        </RecipeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
