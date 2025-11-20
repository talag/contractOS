import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase automatically handles the OAuth callback
    // We just need to check if the user is authenticated
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Failed to authenticate:', error);
        navigate('/login');
        return;
      }

      if (session) {
        // User is authenticated, check if profile exists
        supabase
          .from('users')
          .select('id')
          .eq('id', session.user.id)
          .single()
          .then(async ({ data, error }) => {
            if (error || !data) {
              // Profile doesn't exist, create it for Google OAuth users
              const username = session.user.user_metadata?.full_name ||
                               session.user.email?.split('@')[0] ||
                               'user';

              const { error: insertError } = await supabase
                .from('users')
                .insert([
                  {
                    id: session.user.id,
                    email: session.user.email,
                    username: username,
                    profile_picture: session.user.user_metadata?.avatar_url,
                    auth_provider: 'google',
                  },
                ]);

              if (insertError) {
                console.error('Failed to create user profile:', insertError);
              }
              navigate('/dashboard');
            } else {
              // Profile exists, navigate to dashboard
              navigate('/dashboard');
            }
          });
      } else {
        // No session, redirect to login
        navigate('/login');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
}
