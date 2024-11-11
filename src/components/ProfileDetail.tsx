import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Container, FormControl, FormLabel, HStack, Input, Progress, Stack, Tag, TagLabel, Text, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import { User } from '@supabase/supabase-js';
import { AxiosResponse } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { createProfile, getProfileByAuthorEmail, publishProfile, saveProfile } from '../api';
import { supabaseClient } from '../config/supabase-client';
import { EditIcon } from '@chakra-ui/icons'
import { FaAddressBook, FaCheck } from 'react-icons/fa';
import { AsyncSelect, MultiValue } from 'chakra-react-select';
import { pickListOptions } from '../config/pickListOptions';
import { getRandomColor } from '../utils/functions';

const mappedColourOptions = pickListOptions.map(option => ({
  ...option,
  colorScheme: option.color
}));

interface Props {
  isPublished?: boolean;
  childToParent(success: boolean): any;
}

const ProfileDetail = ({ childToParent }: Props) => {
  const [username, setUsername] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>();
  const [profileId, setProfileId] = useState<number>()
  const [user, setUser] = useState<User | null>();
  const [newParams, setNewParams] = useState<any[]>([]);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // declare the data fetching function
    const fetchUserData = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser()
      setUser(user)

      // we refetch here?
      //if (user) refetch()
    }
    // call the function
    fetchUserData()
      // make sure to catch any error
      .catch(console.error);
  }, [])

  // console.log("woyy",user?.email!)

  const fetchProfile = async () => {
    const res: AxiosResponse<ApiDataType> = await getProfileByAuthorEmail(user?.email!)
    return res.data;
  };

  const { isLoading: isFetchingProfile, data: profileData, refetch } = useQuery(['profile'], fetchProfile, {
    enabled: false, onSuccess(res: IProfile) {
      if (res != null) {
        setUsername(res.username)
        setWebsite(res.website)
        setBio(res.bio)
        setProfileId(res.id)
        childToParent(res.isPublic ? true : false);
        setIsPublic(res.isPublic)
      } 
    },
    onError: (error) => {
      console.log(error)
    },
  });

  const postCreateProfile = async (): Promise<AxiosResponse> => {
    const profile: Omit<IProfile, 'id'> = {
      website: website,
      username: username,
      bio: bio,
      authorEmail: user?.email!,
    };
    return await createProfile(profile);
  }

  const { isLoading: isCreatingProfile, mutate: postProfile } = useMutation(postCreateProfile, {
    onSuccess(res) {
      toast({
        title: 'Profile created.',
        position: 'top',
        variant: 'subtle',
        description: '',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      refetch()
    }
  });

  const postUpdateProfile = async (): Promise<AxiosResponse> => {
    const profile: IProfile = {
      website: website,
      username: username,
      bio: bio,
      authorEmail: user?.email!,
      id: profileId!,
    };
    return await saveProfile(profile);
  }

  const { isLoading: isUpdatingProfile, mutate: updateProfile } = useMutation(
    postUpdateProfile,
    {
      onSuccess: (res) => {
        toast({
          title: 'Profile updated.',
          position: 'top',
          variant: 'subtle',
          description: '',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        refetch()
      },
      onError: (err) => {
        console.log(err)
      },
      //onMutate: () => console.log('mutating')
    }
  );

  const postPublishProfile = async (): Promise<AxiosResponse> => {
    return await publishProfile(profileId!);
  }

  const { isLoading: isPublishingProfile, mutate: publish } = useMutation(
    postPublishProfile,
    {
      onSuccess: (res) => {
        toast({
          title: 'Profile published.',
          position: 'top',
          variant: 'subtle',
          description: '',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        refetch()
      },
      onError: (err) => {
        console.log(err)
      },
      //onMutate: () => console.log('mutating')
    }
  );

  function publishMe() {
    onClose()
    publish();
  }

  function postData() {
    try {
      if (profileId) {
        updateProfile()
      } else {
        postProfile()
      }
    } catch (err) {
      //setPostResult(fortmatResponse(err));
    }
  }


  function handleLanguages(e: MultiValue<{ colorScheme: string; value: string; label: string; color: string; }>) {
    let newParams: any[] = []
    for (let i = 0; i < e.length; i += 1) {
      const obje = e[i].value
      newParams.push(obje)
    }

  }

  const editLanguage = () => {
    setNewParams([])
  }

  function handleUserNameChange(e: any) {
    setUsername(e.target.value);
  }

  const color = useColorModeValue('gray.800', 'gray.200')
  const bgColor = useColorModeValue('gray.100', 'gray.600')
  const bgColorFocus = useColorModeValue('gray.200', 'gray.800')

  return (
    <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
      <Accordion allowToggle={true}>
        <AccordionItem>
          <AccordionButton _expanded={{ bgGradient: 'linear(to-r, teal.500, blue.500)', color: 'white' }} onClick={() => refetch()}>
            <Box flex='1' textAlign='left'>
              Show profile
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={6} px={6}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  type={'text'}
                  value={username || ''}
                  onChange={(e: any) => setUsername(e.target.value)}
                  placeholder={username || 'username'}
                  color={color}
                  bg={bgColor}
                  rounded={'full'}
                  border={0}
                  _focus={{
                    bg: bgColorFocus,
                    outline: 'none'
                  }}
                />
              </FormControl>
            </Stack>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={6} px={6}>
              <FormControl>
                <FormLabel>Website</FormLabel>
                <Input
                  type={'text'}
                  value={website || ''}
                  onChange={(e: any) => setWebsite(e.target.value)}
                  placeholder={website || 'website'}
                  color={color}
                  bg={bgColor}
                  rounded={'full'}
                  border={0}
                  _focus={{
                    bg: bgColorFocus,
                    outline: 'none'
                  }}
                />
              </FormControl>
            </Stack>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={6} px={6}>
              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Input
                  type={'text'}
                  value={bio || ''}
                  onChange={(e: any) => setBio(e.target.value)}
                  placeholder={bio || 'bio'}
                  color={color}
                  bg={bgColor}
                  rounded={'full'}
                  border={0}
                  _focus={{
                    bg: bgColorFocus,
                    outline: 'none'
                  }}
                />
              </FormControl>
            </Stack>
            <Stack spacing={8} mx={'auto'} maxW={'xl'} py={12} px={6} direction={['column', 'row']}>
              {!isPublic && profileId && <Button
                onClick={onOpen}
                leftIcon={<FaAddressBook />}
                fontFamily={'heading'}
                w={'full'}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={'white'}
                _hover={{
                  bgGradient: 'linear(to-r, red.400,pink.400)',
                  boxShadow: 'xl',
                }}>
                Publish profile
              </Button>}
              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Publish Profile
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        spinnerPlacement="start"
                        isLoading={isPublishingProfile}
                        colorScheme='blue'
                        onClick={() => publishMe()} ml={3}>
                        {isPublishingProfile || 'Publish'}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
              <Button
                leftIcon={<FaCheck />}
                isLoading={isCreatingProfile || isUpdatingProfile}
                loadingText={profileId ? `Updating` : `Creating`}
                onClick={postData}
                disabled={!username || !website || !bio}
                bg={'blue.400'}
                color={'white'}
                w="full"
                _hover={{
                  bg: 'blue.500',
                }}>
                {profileId ? `Update` : `Save`}
              </Button>
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Container>
  )
};

export default ProfileDetail;
