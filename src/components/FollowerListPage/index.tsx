import { Avatar, Box, Card, CardBody, Spacer, Text, useColorModeValue } from '@chakra-ui/react';
import { FollowButton } from '../../components/FollowButton';
import { useSearchUser } from '../../hooks/use-search-user';
import Picture from '../../components/Picture';
import { useEffect, useState } from 'react';

export function FollowerListPage(follower: Follower | undefined) {

  return (
    <Box margin={'30px'}>
      <Card bg={useColorModeValue('blue.700', 'gray.700')}>
        <CardBody>
          {/* <Box display={'flex'} flexDirection={'column'} gap="20px">
             {!follower?.follower?.length ? (
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
                  No results for
                </Text>
                <Text color="brand.secondary.500">
                  Try searching for something else or check the spelling of what you typed.
                </Text>
              </Box>
            </Box>
          ) : (
            <>
              {follower?.follower?.map(user => {
                return (
                  <Box display={'flex'} marginTop={'20px'}>
                    <Box flex={'1'}>
                      <Picture url={user?.picture?.avatarUrl} />
                    </Box>
                    <Box flex={'5'}>
                      <Text color={'white'}>{user?.username}</Text>
                      <Text color={'brand.secondary.400'}>{user?.authorEmail}</Text>
                    </Box>
                    <FollowButton followingId={user?.id} user={user}/>
                  </Box>
                );
              })}
            </>
          )}
          </Box> */}
        </CardBody>
      </Card>
    </Box>
  );
}
