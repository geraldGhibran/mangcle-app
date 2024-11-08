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
  Text
} from '@chakra-ui/react';
import Picture from '../../components/Picture';
import { useNavigate } from 'react-router-dom';

export function ProfileHome() {
  const { profile, profileFollowing } = useAuthStore();

  const navigate = useNavigate();

  return (
    <Box margin={'30px'}>
      <Card bg={useColorModeValue('green.700', 'gray.700')}>
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
          bg={useColorModeValue('green.900', 'gray.900')}
          boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
          >
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
                                  <Text color="brand.secondary.500">Ooops Looks like still empty</Text>
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
                                <Text color="brand.secondary.500">Oops looks like still empty</Text>
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
      </Card>
    </Box>
  );
}
