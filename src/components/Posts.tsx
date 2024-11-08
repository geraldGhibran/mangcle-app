import { Link } from 'react-router-dom';
import {
  Avatar,
  Box,
  Center,
  Container,
  Divider,
  Flex,
  Progress,
  Stack,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import moment from 'moment';
import { truncate } from '../utils/functions';
import { ReadmoreButton } from './ReadMoreButton';
import LikeButton from './LikeButton';
import ProfileAvatar from './ProfileAvatar';
import PostImage from './PostImage';

function Posts({ posts }: any) {
  const color = useColorModeValue('green.900', 'gray.900');

  return (
    <Box bg={useColorModeValue('green.700', 'gray.700')}>
      <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
        {posts.map(({ id, createdAt, title, content, profile, likes, postPicture, comments }: any, i: number) => (
          <Center key={i} py={6}>
            <Box maxW={'800px'} w={'full'} bg={color} boxShadow={'2xl'} rounded={'md'} p={6} overflow={'hidden'}>
              <Stack>
                <Text color={'gray.500'}>{title}</Text>
                <Divider />
                <Text color={'gray.500'}>{content}</Text>
                {/* <Image  */}
              </Stack>
              <Stack maxW={'sm'}>{postPicture?.length > 0 && <PostImage url={postPicture[0]?.url} />}</Stack>
              <Stack mt={10} direction={'row'} spacing={4} align={'center'}>
                <ProfileAvatar url={profile?.avatarUrl} avatarName={truncate(profile?.authorEmail)} />
                <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                  <Text fontWeight={600}>{profile?.authorEmail}</Text>
                  <Text color={'gray.500'}>{moment(createdAt).format('Do MMMM YYYY')}</Text>
                </Stack>
              </Stack>
              <Stack direction={'row'} justify={'center'} spacing={6}>
                <Stack spacing={0} align={'center'}></Stack>
              </Stack>
              <Stack justify={'end'} mt={8} direction={'row'} spacing={4}>
                <LikeButton isDisabled={true} likesCount={likes?.length} />
                <ReadmoreButton commentTotal={comments?.length} postId={id} />
              </Stack>
            </Box>
          </Center>
        ))}
      </Container>
    </Box>
  );
}

export default Posts;
