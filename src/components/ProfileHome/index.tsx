import { useAuthStore } from '../../store/auth';
import { BGProfileCover } from '../../assets';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  useColorModeValue,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Progress
} from '@chakra-ui/react';
import Picture from '../../components/Picture';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchPostsByProfileId } from '../../api';
import Posts from '../Posts';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import MediaGallery from '../MediaGallery';



export function ProfileHome() {
  const { profile, profileFollowing } = useAuthStore();

  const navigate = useNavigate();
  const fetchPost = async (): Promise<AxiosResponse> => fetchPostsByProfileId(Number(profile?.id));

  const { data, error, isError, isLoading } = useQuery('postsProfile', fetchPost, { enabled: true, retry: 0 });

  // Create a state variable to hold the array
  const [postArray, setPostArray] = useState<any>([]);


  return (
    <Box margin={'30px'}>
      <Card bg={useColorModeValue('blue.700', 'gray.700')}>
        <CardBody>
          <Text as="h1" color={'white'} fontWeight={'bold'} mb="10px">
            Profile
          </Text>
          <Box>
            <Picture url={profile?.picture?.avatarUrl} bgUrl={profile?.backgroundPicture?.url} isBg={true} />
            <Box mt={'20px'} display={'flex'} justifyContent={'flex-end'}>
              <Button variant={'outline'} onClick={() => navigate('/edit-profile')} color={'white'} fontSize={'sm'}>
                Edit Profile
              </Button>
            </Box>
            <Box>
              <Text as="h1" color={'white'} fontWeight={'bold'} fontSize={'xl'}></Text>
              <Text as="h1" color={'brand.secondary.500'}>
                @{profile?.username}
              </Text>
              <Text as="h1" color={'white'}>
                {profile?.name}
              </Text>
              <Text as="h1" color={'white'}>
                {profile?.bio}
              </Text>
              <Box display={'flex'} gap="20px" mt="10px">
                <Text as="h1" color={'white'}>
                  <Text as="span" fontWeight={'bold'}>
                    {profileFollowing?.length}
                  </Text>
                  Following
                </Text>
                <Text as="h1" color={'white'}>
                  <Text as="span" fontWeight={'bold'}>
                    {profile?.followers?.length}
                  </Text>
                  Followers
                </Text>
              </Box>
            </Box>
          </Box>
        </CardBody>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={useColorModeValue('blue.900', 'gray.900')}
          boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}>
          <Tabs align="center" isFitted>
            <TabList mb="1em">
              <Tab>All Post</Tab>
              <Tab>Media</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack spacing="6">
                  <Stack spacing="5">
                    <Box margin={'30px'}>
                      <Card bg={useColorModeValue('blue.700', 'gray.700')}>
                        <CardBody>
                          <Box display={'flex'} flexDirection={'column'} gap="20px">
                            {!data?.data?.length ? (
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
                                  <Text color="brand.secondary.500">Oops looks like still empty</Text>
                                </Box>
                              </Box>
                            ) : (
                              <Posts posts={data && data?.data} />
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
                    <Card bg={useColorModeValue('blue.700', 'gray.700')}>
                      <CardBody>
                        <Box display={'flex'} flexDirection={'column'} gap="20px">
                        {!data?.data?.length ? (
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
                                  <Text color="brand.secondary.500">Oops looks like still empty</Text>
                                </Box>
                              </Box>
                            ) : (
                              <MediaGallery posts={data && data?.data} />
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
      </Card>
    </Box>
  );
}
