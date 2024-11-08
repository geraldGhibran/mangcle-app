import { Outlet } from 'react-router-dom';
import PostActions from '../components/PostActions';
import { LeftBar } from './components/left-bar';
import { RightBar } from './components/right-bar';
import { Box, useColorModeValue } from '@chakra-ui/react';

const ProfileLayout = () => {
  return (
    <Box display={'flex'} bg={useColorModeValue('green.900', 'gray.900')}>
      <LeftBar />
      {/* <PostActions /> */}
      <Box bg={useColorModeValue('green.900', 'gray.900')} w={'1061px'} p={'30px'}>
        <Outlet />
      </Box>
      <RightBar />
    </Box>
  );
};

export default ProfileLayout;
