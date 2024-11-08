import { useAuthStore } from '../../../store/auth';
import { BGProfileCover } from '../../../assets';
import { Avatar, Box, Button, Card, CardBody, Text, useColorModeValue } from '@chakra-ui/react';
import Picture from '../../../components/Picture';
import { useNavigate } from 'react-router-dom';

export function MyProfile() {
  const { profile, profileFollowing } = useAuthStore();

  const navigate = useNavigate();


  return (
    <Box margin={'30px'}>
      <Card bg={useColorModeValue('green.700', 'gray.700')}>
        <CardBody>
          <Text as="h1" color={'white'} fontWeight={'bold'} mb="10px">
            My Profile
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
                {profile?.username}
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
      </Card>
    </Box>
  );
}
