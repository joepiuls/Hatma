import React from 'react';
import useAuthStore from '../store/useAuthStore';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { trackEvent } from '../utils/trackEvent';

const GoogleLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle, user } = useAuthStore();

  return (
    <div>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const tokenId = credentialResponse.credential;
            const result = await loginWithGoogle(tokenId);

            if (result.success) {
              trackEvent('session', { session: 'Login', userId: user?._id });
              toast.success(result.message);
              const redirectTo = new URLSearchParams(location.search).get('redirectTo') || '/';
              navigate(redirectTo);
            } else {
              toast.error(result.message);
            }
          }}
          onError={() => {
            toast.error('Google login failed');
          }}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleLogin;
