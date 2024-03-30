import React, { useEffect, useState } from 'react';

import type { Message as TAiMessage } from 'ai';
import type { UseChatHelpers } from 'ai/react';
import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import fetchImageFromIpfs from '~~/lib/fetch-image';
import { cn } from '~~/lib/utils';
import { Bot, User } from 'lucide-react';
import Image from 'next/image';

import MessageMarkdown from './markdown';

type TMessage = ComponentProps<'div'> &
  Pick<UseChatHelpers, 'isLoading'> & {
    message: TAiMessage;
  };

const isEditButtonDisabled = true;

function Message({ message, isLoading, className, ...otherProperties }: TMessage) {
  const { role, content } = message;
  const isUser = role === 'user';

  const [isImage, setIsImage] = useState(false);
  const [imageBase64, setImagebase64] = useState('');

  useEffect(() => {
    console.log('content', content);
  }, [content]);

  useEffect(() => {
    const isImage = content.includes('imageURI');

    async function convertBufferToImage() {
      setIsImage(isImage);

      const imageBase64 = await fetchImageFromIpfs(content);
      setImagebase64(imageBase64 ?? '');
    }

    if (isImage) {
      convertBufferToImage();
    }
  }, [content]);

  useEffect(() => {
    console.log('isImage', isImage);
  }, [isImage]);

  useEffect(() => {
    console.log('imageBase64', imageBase64);
  }, [imageBase64]);

  if (isUser) {
    return (
      <MessageContainer className={cn('group justify-end', className)} {...otherProperties}>
        <div className='flex flex-col items-end gap-y-1.5'>
          <ContentContainer>{content}</ContentContainer>
        </div>

        <Icon icon={User} />
      </MessageContainer>
    );
  }

  return (
    <MessageContainer className={cn('group', className)} {...otherProperties}>
      <Icon icon={Bot} />

      <div className='flex flex-col gap-y-1.5'>
        <ContentContainer>
          {isImage && imageBase64 !== '' ? (
            <Image
              src={imageBase64}
              width={200}
              height={113}
              alt='AI Generated Image'
              className='aspect-auto'
            />
          ) : (
            <MessageMarkdown content={content} />
          )}
        </ContentContainer>
      </div>
    </MessageContainer>
  );
}

type TMessageContainer = ComponentProps<'div'>;

function MessageContainer({ children, className, ...otherProperties }: TMessageContainer) {
  return (
    <div className={cn('flex items-start gap-x-2.5', className)} {...otherProperties}>
      {children}
    </div>
  );
}

type TIcon = {
  icon: LucideIcon;
};

function Icon({ icon: Icon }: TIcon) {
  return (
    <div className='flex flex-col items-center justify-center rounded-md bg-secondary/50 p-2.5'>
      <Icon size={25} />
    </div>
  );
}

type TContentContainer = ComponentProps<'div'>;

function ContentContainer({ children, className, ...otherProperties }: TContentContainer) {
  return (
    <div className={cn('rounded-md bg-secondary/50 p-2.5', className)} {...otherProperties}>
      {children}
    </div>
  );
}

const MemorizedMessage = React.memo(Message);

export default MemorizedMessage;
