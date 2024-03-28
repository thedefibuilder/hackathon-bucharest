'use client';

import { useRouter } from 'next/navigation';

export const BackButton = () => {
  const router = useRouter();
  return (
    <button className='btn btn-primary btn-sm' onClick={() => router.back()}>
      Back
    </button>
  );
};
