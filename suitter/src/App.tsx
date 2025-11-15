import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'
import { Toaster } from './components/Toaster'

// Lazy load routes
const HomePage = lazy(() => import('./pages/HomePage'))
const ExplorePage = lazy(() => import('./pages/ExplorePage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const MessagesPage = lazy(() => import('./pages/MessagesPage'))
const NFTGalleryPage = lazy(() => import('./pages/NFTGalleryPage'))
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'))
const ListsPage = lazy(() => import('./pages/ListsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/nft-gallery" element={<NFTGalleryPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/lists" element={<ListsPage />} />
              <Route path="/profile/:id?" element={<ProfilePage />} />
              <Route path="/post/:id" element={<PostDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  )
}

export default App

