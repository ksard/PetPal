import './Login.scss'
import googleButton from '../../assets/google-sign-in-buttons/web_light_rd_ctn@1x.png'
import useAuth from '../../hooks/useAuth';
import { useSearchParams } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

const  handleLoginClick=()=> {
  const state = searchParams?.get('state');

  login(state);
}

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome</h1>
        <button type='button' onClick={()=>handleLoginClick()} className='login-button'>
          <img src={googleButton} alt="google sign in" className='login-button-image' />
      </button>
      </div>
    </div>
  )
}

export default Login