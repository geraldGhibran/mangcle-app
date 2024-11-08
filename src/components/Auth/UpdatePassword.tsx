import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import { Session, User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../../config/supabase-client';
import { regex } from '../../utils/constants';
import { Logo } from './Logo';

export const UpdatePassword = () => {
  const formBackground = useColorModeValue('gray.100', 'gray.700');
  const [authButtonState, setAuthButtonState] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [magicEmail, setMagicEmail] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [loading, setLoading] = useState(false);
  const [magicEmailDisabled, setMagicEmailDisabled] = useState(true);
  const [emailDisabled, setEmailDisabled] = useState(true);
  const [Rmsg, setRMsg] = useState(''); // Registration message
  const [Lmsg, setLMsg] = useState(''); // Login message
  const [user, setUser] = useState<User | null>(); // User object after registration / login
  const [session, setSession] = useState<Session | null>();

  const { isOpen, onToggle } = useDisclosure();

 
  const checkEmail = (e: any) => {
    setEmailDisabled(!regex.test(e.target.value));
    setEmail(e.target.value);
  };

  const handlePassword = (e: any) => {
    setPassword(e.target.value);
  };

  const handleUpdatePassword = async (new_password: string) => {
    try {
      setLoading(true);
      // const { error } = await supabaseClient.auth.signInWithOtp({ email });
      const { error } = await supabaseClient.auth.updateUser({ password: new_password });
      if (error) throw error;
      toast({
        title: 'Password confirmed.',
        position: 'top',
        description: 'Password has been updated.',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      setTimeout(() => navigate('/login'), 1500);
    } catch (error: any) {
      toast({
        title: 'Error',
        position: 'top',
        description: error.error_description || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
      setEmail('');
    }
  };



  useEffect(() => {
    if (session) {
      console.log(session);
    }
  }, []);

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Stack spacing="8">
        <Stack spacing="6">
          <Logo />
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading fontSize={'4xl'}>
              {!authButtonState ? 'Register a new account' : 'Sign in to your account'}
            </Heading>
            <HStack spacing="1" justify="center">
              <Text color="muted">{authButtonState ? "Don't have an account?" : 'Already a User?'}</Text>
              <Button onClick={() => setAuthButtonState(!authButtonState)} variant="link" colorScheme="blue">
                {authButtonState ? 'Sign up' : 'Log in'}
              </Button>
            </HStack>
          </Stack>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={formBackground}
          boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
          borderRadius={{ base: 'none', sm: 'xl' }}>
          <Tabs align="center" isLazy>
            <TabList mb="1em">
              <Tab>Forgot Password</Tab>
            </TabList>
            <TabPanels>
              {/* initially not mounted */}
              <TabPanel>
                <Stack spacing={4}>
                  <FormControl id="pasword">
                    <FormLabel>Password</FormLabel>
                    {/* <Input value={magicEmail} type="password" /> */}
                    <Input
                      onChange={handlePassword}
                      id="password"
                      name="password"
                      type={isOpen ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                    />
                  </FormControl>
                  <Stack spacing={4}>
                    <Button
                      onClick={e => {
                        e.preventDefault();
                        handleUpdatePassword(password);
                      }}
                      isLoading={loading}
                      loadingText="Sending password ..."
                      colorScheme="blue"
                      spinnerPlacement="start">
                      {loading || 'Send password'}
                    </Button>
                  </Stack>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Stack>
    </Container>
  );
};

export default UpdatePassword;
