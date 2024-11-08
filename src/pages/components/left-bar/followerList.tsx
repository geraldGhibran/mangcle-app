import { Avatar, Box, Card, CardBody, Spacer, Text, useColorModeValue } from '@chakra-ui/react';
import { FollowButton } from '../../../components/FollowButton';
import { useSearchUser } from '../../../hooks/use-search-user';
import Picture from '../../../components/Picture';
import { useEffect, useState } from 'react';

export function FollowerList() {
  const { users } = useSearchUser();

  return (
    <Box margin={'30px'}>
      <Card bg={useColorModeValue('green.700', 'gray.700')}>
        <CardBody>
          <Box display={'flex'} flexDirection={'column'} gap="20px">
            {!users?.length ? (
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
                {users?.map(user => {
                  return (
                    <Box display={'flex'} marginTop={'20px'}>
                      <Box flex={'1'}>
                        <Picture url={user?.avatarUrl} />
                      </Box>
                      <Box flex={'5'}>
                        <Text color={'white'}>{user?.username}</Text>
                        <Text color={'brand.secondary.400'}>{user.authorEmail}</Text>
                      </Box>
                      <FollowButton followingId={user?.id} user={user} />
                    </Box>
                  );
                })}
              </>
            )}
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}
