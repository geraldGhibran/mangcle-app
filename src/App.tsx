import { Box, ChakraProvider, theme, useToast } from '@chakra-ui/react';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Invoices from './components/Profile';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import RootLayout from './components/RootLayout';
import ProfilesLayout from './components/ProfilesLayout';
import { supabaseClient } from './config/supabase-client';
import NewPostPage from './pages/NewPostPage';
import PostDetailPage from './pages/PostDetailPage';
import PostLayout from './pages/PostLayout';
import PostPage from './pages/PostPage';
import ProfileLayout from './pages/ProfileLayout';
import ProfilePage from './pages/ProfilePage';
import WelcomePage from './pages/WelcomePage';
import ProfilesPage from './pages/ProfilesPage';
import Signin from './components/Auth/Signin';
import Profile from './components/Profile';
import { SearchUser } from './components/search-user';
import SearchPage from './pages/Search';
import FollowLayout from './pages/FollowLayout';
import FollowPage from './components/Follower';
import FollowPages from './pages/FollowPages';
import UpdatePassword from './components/Auth/UpdatePassword';
import EditProfile from './components/EditProfile';

export const App = () => {
  const [signedIn, setSignedIn] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>();
  const toast = useToast();
  const [event, setEvent] = useState<AuthChangeEvent>();

  supabaseClient.auth.onAuthStateChange(event => {
    if (event === 'SIGNED_OUT') {
      setSignedIn(false);
      setEvent(event);
    }
    if (event === 'SIGNED_IN') {
      setSignedIn(true);
      setEvent(event);
    }
  });

  const showToast = useCallback(
    (e: any) => {
      toast({
        position: 'bottom',
        render: () => (
          <Box color="white" p={3} bg="green.500">
            {e === 'SIGNED_IN' ? `Signed In` : `Signed Out`}
          </Box>
        )
      });
    },
    [toast]
  );

  useEffect(() => {
    if (event) showToast(event);

    const setData = async () => {
      const {
        data: { session },
        error
      } = await supabaseClient.auth.getSession();
      if (error) throw error;
      if (session) {
        setSession(session);
        //console.log('session from App', session.access_token)
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    };
    setData();
  }, [event, showToast]);

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <RootLayout>
          <Routes>
            <Route path="/" element={<PostLayout />}>
              <Route index element={<PostPage />} />
            </Route>
            <Route path="/profiles" element={<ProfilesLayout />}>
              <Route index element={<ProfilesPage />} />
            </Route>
            <Route path="/search" element={<SearchPage />}>
              <Route index element={<SearchUser />} />
            </Route>
            <Route path="/follows" element={<FollowLayout />}>
              <Route index element={<FollowPages />} />
            </Route>
            <Route path="*" element={<NotFound />} />
            <Route path="/posts" element={<PostLayout />}>
              <Route index element={<PostPage />} />
            </Route>
            <Route path="/posts/:id" element={<PostLayout />}>
              <Route index element={<PostDetailPage session={session} />} />
            </Route>
            <Route path="/post/new" element={<PostLayout />}>
              <Route
                index
                element={
                  <ProtectedRoute signedIn={signedIn}>
                    <NewPostPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            {/* <Route path="/posts/:id" element={<PostDetailPage session={session} />} /> */}
            {/* <Route
              path="/post/new"
              element={
                <ProtectedRoute signedIn={signedIn}>
                  <NewPostPage />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute signedIn={signedIn}>
                  <ProfileLayout />
                </ProtectedRoute>
              }>
              <Route index element={<Profile />} />
            </Route>
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute signedIn={signedIn}>
                  <ProfileLayout />
                </ProtectedRoute>
              }>
              <Route index element={<EditProfile />} />
            </Route>
            <Route path="/login" element={<Signin />} />
            <Route path="/update-password" element={<UpdatePassword />} />
          </Routes>
        </RootLayout>
      </BrowserRouter>
    </ChakraProvider>
  );
};
