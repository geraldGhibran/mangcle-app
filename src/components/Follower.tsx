import {
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
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
import { useCallback, useEffect, useRef, useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { Navigate, redirect, useNavigate } from 'react-router-dom';
import { supabaseClient } from '../config/supabase-client';
import { regex } from '../utils/constants';
import { Logo } from '../Logo';
import { OAuthButtonGroup } from '../components/Auth/OAuthButtonGroup';
import { FollowerListPage } from '../components/FollowerListPage';
import { useAuthStore } from '../store/auth';
import Picture from './Picture';
import { FollowButton2 } from './FollowButton/FollowButton2';
import { FollowButton } from './FollowButton';

export const FollowPage = () => {
  const formBackground = useColorModeValue('gray.100', 'gray.700');
  const [authButtonState, setAuthButtonState] = useState(false);

  const [session, setSession] = useState<Session | null>();
  const [profileFollower, setProfileFollower] = useState<Follower[] | undefined>();

  const { profile, profileFollowing } = useAuthStore();

  console.log("profileFollowing dari follower",profile);


  useEffect(() => {
    if (session) {
    }
    setProfileFollower(profile?.followers);
  }, []);

  return (
    <Container maxW="full" py={{ base: '2', md: '-1.5' }} px={{ base: '0', sm: '8' }}>
      <Stack spacing="8">
        <Stack spacing="6">
          <Stack spacing={{ base: '2', md: '3' }} textAlign="start">
            <Heading fontSize={'4xl'}>{!authButtonState ? 'Follow' : 'Sign in to your account'}</Heading>
          </Stack>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={useColorModeValue('green.900', 'gray.900')}
          boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
          borderRadius={{ base: 'none', sm: 'xl' }}>
          <Tabs align="center" isFitted>
            <TabList mb="1em">
              <Tab>Followers</Tab>
              <Tab>Following</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack spacing="6">
                  <Stack spacing="5">
                    <Box margin={'30px'}>
                      <Card bg={useColorModeValue('green.700', 'gray.700')}>
                        <CardBody>
                          <Box display={'flex'} flexDirection={'column'} gap="20px">
                            {!profile?.followers?.length ? (
                              <Box
                                w={'100%'}
                                h={'500px'}
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                flexDirection={'column'}
                                textAlign={'center'}>
                                <Box w={'300px'}>
                                  <Text as="h1" fontWeight={'bold'} fontSize={'lg'} color={'white'}>
                                    No results
                                  </Text>
                                  <Text color="brand.secondary.500">
                                    Ooops Looks like still empty
                                  </Text>
                                </Box>
                              </Box>
                            ) : (
                              <>
                                {profile?.followers?.map(user => {
                                  return (
                                    <Box display={'flex'} marginTop={'20px'}>
                                      <Box flex={'1'}>
                                        <Picture url={user?.follower?.avatarUrl} />
                                      </Box>
                                      <Box flex={'5'}>
                                        <Text color={'white'}>{user?.follower?.username}</Text>
                                        <Text color={'brand.secondary.400'}>{user?.follower?.authorEmail}</Text>
                                      </Box>
                                      {/* <FollowButton followingId={3} user={user} /> */}
                                    </Box>
                                  );
                                })}
                              </>
                            )}
                          </Box>
                        </CardBody>
                      </Card>
                    </Box>
                  </Stack>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack spacing="6"></Stack>
                <Stack spacing="5">
                    <Box margin={'30px'}>
                      <Card bg={useColorModeValue('green.700', 'gray.700')}>
                        <CardBody>
                          <Box display={'flex'} flexDirection={'column'} gap="20px">
                            {!profileFollowing.length ? (
                              <Box
                                w={'100%'}
                                h={'500px'}
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                flexDirection={'column'}
                                textAlign={'center'}>
                                <Box w={'300px'}>
                                  <Text as="h1" fontWeight={'bold'} fontSize={'lg'} color={'white'}>
                                    No results
                                  </Text>
                                  <Text color="brand.secondary.500">
                                    Oops looks like still empty
                                  </Text>
                                </Box>
                              </Box>
                            ) : (
                              <>
                                {profileFollowing.map(user => {
                                  return (
                                    <Box display={'flex'} marginTop={'20px'}>
                                      <Box flex={'1'}>
                                        <Picture url={user?.following?.avatarUrl} />
                                      </Box>
                                      <Box flex={'5'}>
                                        <Text color={'white'}>{user?.following?.username}</Text>
                                        <Text color={'brand.secondary.400'}>{user?.following?.authorEmail}</Text>
                                      </Box>
                                      {/* <FollowButton2 followingId={user?.following?.id} user={user} /> */}
                                    </Box>
                                  );
                                })}
                              </>
                            )}
                          </Box>
                        </CardBody>
                      </Card>
                    </Box>
                  </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Stack>
    </Container>
  );
};

export default FollowPage;
