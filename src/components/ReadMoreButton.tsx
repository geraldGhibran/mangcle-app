import { Button, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const ReadmoreButton = ({ postId, commentTotal }: ReadMoreButtonProps) => {
  return (
    <Link to={postId.toString()}>
      <Stack direction={'row'} justify="end" spacing={6}>
        <div>
          <Button
            flex={1}
            rounded="md"
            bg={useColorModeValue('green.600', 'gray.500')}
            color={'white'}
            boxShadow={'lg'}
            _hover={{
              bg: 'green.400',
              transform: 'translateY(-2px)',
              boxShadow: '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
            }}
            _focus={{
              bg: 'green.500'
            }}>
            Replies
            <Text as={'span'}> ({commentTotal})</Text>
          </Button>
        </div>
      </Stack>
    </Link>
  );
};
