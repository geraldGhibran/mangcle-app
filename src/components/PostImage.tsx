import { Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../config/supabase-client';

interface PostImageProps {
  url: string | undefined;
  avatarSize?: string;
}

const PostImage = ({ url, avatarSize }: PostImageProps) => {
  const [postImageUrl, setPostImageUrl] = useState<string>();

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: any) {
    try {
      const { data, error }: any = await supabaseClient.storage.from('images').download(path);
      if (error) {
        throw error;
      }
      const url: any = URL.createObjectURL(data);
      setPostImageUrl(url);
    } catch (error: any) {
      console.log('Error downloading image: ', error.message);
    }
  }

  return <Image height={'200px'} src={postImageUrl} />;
};

export default PostImage;
