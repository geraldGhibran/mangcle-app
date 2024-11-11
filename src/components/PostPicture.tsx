import { Avatar, Box, Button, Flex, Grid, Image, Input, keyframes, Spinner, Tooltip, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../config/supabase-client';
import { UPLOAD_PICTURE_DISABLED_TEXT } from '../utils/constants';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ImageViewer from 'react-simple-image-viewer';

const uploadImage = async (file: any) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `${fileName}.${fileExt}`;

  const { error } = await supabaseClient.storage.from('images').upload(filePath, file);
  if (error) throw error;

  // Get the public URL of the uploaded image
  const { data } = supabaseClient.storage.from('images').getPublicUrl(filePath);
  return data.publicUrl;
};

const fetchImages = async () => {
  const { data, error } = await supabaseClient.storage.from('images').list('', { limit: 100 });
  if (error) throw error;

  // Get the public URLs for each image
  return data.map(item => {
    const { data: urlData } = supabaseClient.storage.from('images').getPublicUrl(item.name);
    return urlData.publicUrl;
  });
};

const PostPicture = ({ url, onUpload, disabled }: any) => {
  const [avatarUrl, setAvatarUrl] = useState<any>(null);
  const [postImageUrl, setPostImageUrl] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: images, isLoading: isLoadingImages } = useQuery(['images'], fetchImages);

  // Mutation to upload images
  const uploadMutation = useMutation(
    async (files: any) => {
      const uploadedImages = [];
      for (const file of files) {
        const imageUrl = await uploadImage(file);
        uploadedImages.push(imageUrl);
      }
      return uploadedImages;
    },
    {
      onSuccess: (uploadedImages: any) => {
        queryClient.invalidateQueries(['images']); // Refresh image list
        toast({
          title: 'Upload successful',
          description: `Uploaded ${uploadedImages.length} image(s) successfully.`,
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      },
      onError: (error: Error) => {
        toast({
          title: 'Upload failed',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    }
  );

  // Handle file selection
  const handleFileChange = (event: any) => {
    setSelectedFiles([...event.target.files]);
  };

  // Upload selected files
  const handleUpload = () => {
    uploadMutation.mutate(selectedFiles);
    setSelectedFiles([]);
  };

  const size = '96px';
  const color = 'teal';

  const pulseRing = keyframes`
	0% {
    transform: scale(0.33);
  }
  40%,
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
  `;

  useEffect(() => {
    if (postImageUrl) downloadImage(postImageUrl);
  }, [postImageUrl]);

  async function downloadImage(path: any) {
    try {
      const { data, error }: any = await supabaseClient.storage.from('images').download(path);
      if (error) {
        throw error;
      }
      const url: any = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error: any) {
      console.log('Error downloading image: ', error.message);
    }
  }

  async function uploadAvatar(event: any) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabaseClient.storage.from('images').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      setPostImageUrl(filePath);

      onUpload(filePath);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <Flex justifyContent="center" alignItems="center" h="120px" w="full" overflow="hidden">
        {/* <Box
          as="div"
          position="relative"
          w={size}
          h={size}
          _before={{
            content: "''",
            position: 'relative',
            display: 'block',
            width: '300%',
            height: '300%',
            boxSizing: 'border-box',
            marginLeft: '-100%',
            marginTop: '-100%',
            borderRadius: '50%',
            bgColor: color,
            animation: `2.25s ${pulseRing} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`
          }}>

        <Avatar src={avatarUrl} size="full" position="absolute" top={0} />
          </Box> */}
        <Image height="200px" src={avatarUrl} width={'70%'} />
      </Flex>
      {/* <ImageViewer src={avatarUrl} /> */}

      <Box textAlign={'center'} overflow="hidden">
        <Tooltip placement="left" hasArrow label={"Click to upload images"} bg={'blue.600'}>
          <Button
            size="sm"
            flex={1}
            mb={4}
            fontSize={'sm'}
            rounded={'full'}
            _focus={{
              bg: 'gray.200'
            }}>
            <label className="button primary block" htmlFor="single">
              {uploading ? 'Uploading ...' : 'Upload'}
            </label>
          </Button>
        </Tooltip>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
            cursor: 'pointer'
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading || disabled}
        />
      </Box>
    </>
  );
};

export default PostPicture;
