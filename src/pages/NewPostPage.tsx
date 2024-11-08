import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../config/supabase-client';
import { useMutation, useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { addPost, createPicture, createPostPicture, getProfileByAuthorEmail } from '../api';
import { Session, User } from '@supabase/supabase-js';
import {
  Button,
  Container,
  Flex,
  FormControl,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import PostPicture from '../components/PostPicture';
import eventBus from '../eventBus';
import { set } from 'react-hook-form';
import { useAuthStore } from '../store/auth';

function NewPostPage() {
  const { profileId } = useAuthStore();
  const [postTitle, setPostTitle] = useState('');
  const [postPictureUrl, setPostPictureUrl] = useState<string>('');
  const [isUrlUploaded, setIsUrlUploaded] = useState<boolean>();
  const [picture, setPicture] = useState<IPostPicture>();

  const [postContent, setPostContent] = useState('');
  const [postId, setPostId] = useState<number>();
  const [session, setSession] = useState<Session | null>();
  const [user, setUser] = useState<User | null>();
  const [state, setState] = useState<'initial' | 'submitting' | 'success'>('initial');
  const [error, setError] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<IProfile>();

  const postCreatePostPicture = async (): Promise<AxiosResponse> => {
    const picture: Omit<IPostPicture, 'id'> = {
      profileId: profileId!,
      postId: postId!,
      url: postPictureUrl!
    };
    return await createPostPicture(picture, session?.access_token!);
  };

  const { isLoading: isCreatingProfileUrl, mutate: createNewPostPicture } = useMutation(postCreatePostPicture, {
    onSuccess: res => {
      console.log(res);
      toast({
        title: 'Picture created.',
        position: 'top',
        variant: 'subtle',
        description: '',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      eventBus.dispatch('profileUpdated', true);
    },
    onError: (err: any) => {
      toast({
        title: 'Error uploading picture',
        position: 'top',
        variant: 'subtle',
        description: err.response.data.error,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  const setData = async () => {
    const {
      data: { session },
      error
    } = await supabaseClient.auth.getSession();
    if (error) throw error;
    setSession(session);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user }
      } = await supabaseClient.auth.getUser();
      setUser(user);
    };
    setData();
    fetchUserData().catch(console.error);
  }, [profile]);

  const createPost = async (): Promise<AxiosResponse> => {
    const post: Omit<IPost, 'id'> = {
      title: postTitle,
      content: postContent,
      profileId: profileId!
    };
    return await addPost(post, session?.access_token!);
  };

  const { isLoading: isPostingTutorial, mutate: postTutorial } = useMutation(createPost, {
    onSuccess(res) {
      setPostId(res.data.id);
      toast({
        title: 'Post created.',
        position: 'top',
        variant: 'subtle',
        description: '',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    }
  });

  async function handlePostPicture() {
    try {
      createNewPostPicture();
    } catch (error: any) {
      alert(error.message);
    }
  }

  function postData() {
    try {
      postTutorial();
      setTimeout(() => {
        handlePostPicture();
      }, 3000);
    } catch (err) {
      //setPostResult(fortmatResponse(err));
    }
  }

  return (
    <Flex minH={'20vh'} align={'center'} justify={'center'} mt={8}>
      <Container maxW={'lg'} bg={useColorModeValue('white', 'whiteAlpha.100')} boxShadow={'xl'} rounded={'lg'} p={6}>
        <Heading as={'h2'} fontSize={{ base: 'xl', sm: '2xl' }} textAlign={'center'} mb={5}>
          What do you have in mind?
        </Heading>
        <Stack
          as={'form'}
          spacing={'30'}
          onSubmit={async (e: FormEvent) => {
            e.preventDefault();
            try {
              if (postTitle.length < 1 || postContent.length < 1) {
                setError(true);
                toast({
                  position: 'top',
                  title: 'An error occured',
                  description: `${error}`,
                  status: 'error',
                  duration: 5000,
                  isClosable: true
                });
                return;
              }
            } catch (error) {
              toast({
                position: 'top',
                title: 'An error occured',
                description: `${error}`,
                duration: 5000,
                status: 'error',
                isClosable: true
              });
            }

            setError(false);
            setState('submitting');

            setTimeout(() => {
              setState('success');
            }, 1000);
            setTimeout(() => {
              navigate('/posts');
            }, 2000);
          }}>
          <FormControl>
            <Input
              variant={'solid'}
              borderWidth={1}
              color={'white.800'}
              _placeholder={{ color: 'gray.400' }}
              borderColor={useColorModeValue('gray.300', 'gray.700')}
              id={'text'}
              type={'text'}
              required
              placeholder={'your title here'}
              aria-label={'your title here'}
              value={postTitle}
              disabled={state !== 'initial' && state !== 'success'}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPostTitle(e.target.value)}></Input>
          </FormControl>
          <FormControl>
            <Input
              variant={'solid'}
              borderWidth={1}
              color={'white.800'}
              _placeholder={{ color: 'gray.400' }}
              borderColor={useColorModeValue('gray.300', 'gray.700')}
              id={'text'}
              type={'text'}
              required
              placeholder={'your content here'}
              aria-label={'your content here'}
              value={postContent}
              disabled={state !== 'initial' && state !== 'success'}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPostContent(e.target.value)}></Input>
          </FormControl>
          <FormControl>
            <PostPicture
              onUpload={(url: any) => {
                setPostPictureUrl(url);
                setIsUrlUploaded(true);
              }}
            />
          </FormControl>
          <FormControl w={{ base: '100%', md: '40%' }}>
            <Button
              colorScheme={state === 'success' ? 'green' : 'blue'}
              isLoading={state === 'submitting'}
              w={'100%'}
              type={state === 'success' ? 'button' : 'submit'}
              onClick={postData}>
              {state === 'success' ? <CheckIcon /> : 'Submit'}
            </Button>
          </FormControl>
        </Stack>
      </Container>
    </Flex>
  );
}

export default NewPostPage;
