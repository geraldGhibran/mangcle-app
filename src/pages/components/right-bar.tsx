import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { MyProfile } from './left-bar/my-profile';
import { Credit } from './left-bar/credit';
import { FollowerList } from './left-bar/followerList';

export function RightBar() {
  return (
    <Box w={'422.25px'} h={'100vh'} bg={useColorModeValue('blue.900', 'gray.900')}>
      <MyProfile />

      <FollowerList />
      <Credit />
    </Box>
  );
}
