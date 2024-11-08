import { Outlet } from 'react-router-dom';
import ProfilesActions from './ProfilesActions';
import { Box, useColorModeValue } from '@chakra-ui/react';

const ProfilesLayout = () => {
  return (
    <Box bg={useColorModeValue('green.700', 'gray.700')}>
      <ProfilesActions />
      <Outlet />
    </Box>
  );
};

export default ProfilesLayout;