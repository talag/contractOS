import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokenAndFetchUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Store token and fetch user info
      setTokenAndFetchUser(token).then(() => {
        navigate('/dashboard');
      }).catch((error) => {
        console.error('Failed to authenticate:', error);
        localStorage.removeItem('token');
        navigate('/login');
      });
    } else {
      // No token, redirect to login
      navigate('/login');
    }
  }, [searchParams, navigate, setTokenAndFetchUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
}
