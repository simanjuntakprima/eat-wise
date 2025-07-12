import React, { use } from 'react';

import { googleLoginAction } from '../action';
import { Button } from '@/components/ui/button';

export const SocialLogin = () => {
  return (
    <form action={googleLoginAction}>
      <Button className="flex w-full items-center justify-center gap-2 rounded-lg border p-3">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
        Continue with Google
      </Button>
    </form>
  );
};
