import React,{useState, lazy, Suspense, Loader, Provider} from 'react';
import axios from "axios"
import {useNavigate} from 'react-router-dom';

import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');  

    async function login(userName, password) {
        axios.post('http://localhost:8000/login', {
            user_name : userName,
            password : password
        }).then( res => {
            if (res.data.result === true) {
                localStorage.setItem("JWT", res.data.tohken);
                localStorage.setItem("JWT_expires_time", res.data.tohken_expires_time);
                navigate('/')
            }
        }).catch(
            err => console.log(err)
        );
    }

  return (
    <div>
    <section class="container forms">
            <div class="form login">
                <div class="form-content">
                    <header>Login</header>
                    {/* <form> */}
                        <div class="field input-field">
                            <input type="text" name="user_name" placeholder="User Name" class="input"
                            onChange={(event)=> setUserName(event.target.value)}/>
                        </div>
                        <div class="field input-field">
                            <input type="password" name="password" placeholder="Password" class="password"
                            onChange={(event)=> setPassword(event.target.value)}/>
                            <i class='bx bx-hide eye-icon'></i>
                        </div>
                        <div class="form-link">
                            <a href="#" class="forgot-pass">Forgot password?</a>
                        </div>
                        <div class="field button-field">
                            <button onClick={ () => { login(userName, password)} }>Login</button>
                        </div>
                    {/* </form> */}
                    <div class="form-link">
                        <span>Don't have an account? <a href="#" class="link signup-link">Signup</a></span>
                    </div>
                </div>
                {/* <div class="line"></div> */}
            </div>
            {/* <!-- Signup Form --> */}
            <div class="form signup">
                <div class="form-content">
                    <header>Signup</header>
                    <form action="#">
                        <div class="field input-field">
                            <input type="email" placeholder="Email" class="input"/>
                        </div>
                        <div class="field input-field">
                            <input type="password" placeholder="Create password" class="password"/>
                        </div>
                        <div class="field input-field">
                            <input type="password" placeholder="Confirm password" class="password"/>
                            <i class='bx bx-hide eye-icon'></i>
                        </div>
                        <div class="field button-field">
                            <button>Signup</button>
                        </div>
                    </form>
                    <div class="form-link">
                        <span>Already have an account? <a href="#" class="link login-link">Login</a></span>
                    </div>
                </div>
                <div class="line"></div>
                <div class="media-options">
                    <a href="#" class="field facebook">
                        <i class='bx bxl-facebook facebook-icon'></i>
                        <span>Login with Facebook</span>
                    </a>
                </div>
                <div class="media-options">
                    <a href="#" class="field google">
                        <img src="#" alt="" class="google-img"/>
                        <span>Login with Google</span>
                    </a>
                </div>
            </div>
        </section>
        </div>
  )
}

export default Login;