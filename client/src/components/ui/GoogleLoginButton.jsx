import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
const GoogleLoginButton = () => {
      const setAuthUser = useAuthStore((state) => state.setAuthUser);
    const navigate = useNavigate();
  
  
    const handleSuccess = async (credentialResponse) => {
 
   try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/auth/google`, {
        credential: credentialResponse.credential,
      }, { withCredentials: true });
      toast.success('Google Login Successful');
      setAuthUser(res.data.user); 
      navigate('/');
    } catch (error) {
      toast.error('Google Login Failed');
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => alert('Google Login Failed')}
      size='medium'
     text="continue_with" 
     
    />
  );
};

export default GoogleLoginButton;