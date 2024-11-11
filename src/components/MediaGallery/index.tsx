import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Progress,
  Stack,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import moment from 'moment';
import { truncate } from '../../utils/functions';
import { ReadmoreButton } from '../ReadMoreButton';
import LikeButton from '../LikeButton';
import ProfileAvatar from '../ProfileAvatar';
import PostImage from '../PostImage';

function MediaGallery({ posts }: any) {
  const color = useColorModeValue('blue.900', 'gray.900');

  return (
    <Box bg={useColorModeValue('blue.700', 'gray.700')}>
      <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {posts.map(({ id, createdAt, title, content, profile, likes, postPicture, comments }: any, i: number) => (
            <>
              <Link to={`/posts/${id}`}>
                <Stack maxW={'sm'}>{postPicture?.length > 0 && <PostImage url={postPicture[0]?.url} />}</Stack>
              </Link>
            </>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default MediaGallery;
