import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import UseAxiosPublic from '../../../Hooks/UseAxiosPublic';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "./login.css"

const Login = () => {
    const { signInUser, googleSignIn } = useContext(AuthContext);
  const axiosPublic = UseAxiosPublic()
  const navigate = useNavigate();
  const location = useLocation();
  const [disabled, setDisabled] = useState(true);
  const from = location.state?.from?.pathname || "/";
  
  

  
    
  const handleGoogleSignin = () =>{
      googleSignIn()
      .then(result => {
          console.log(result.user)
          const userInfo = {
            name: result.user?.displayName,
            email: result.user?.email
          }
          axiosPublic.post('/users', userInfo)
          .then(res => {
            console.log(res.data)
            navigate('/')
          })

      })
  }

  const handleLogin = (e) => {
    e.preventDefault();

    const form = e.target;

    const email = form.email.value;
    const password = form.password.value;
    console.log(email, password);

    signInUser(email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        navigate(location?.state ? location?.state : "/");
        Swal.fire({
          title: "Logged in!",
          text: "Successfully logged in.",
          imageUrl: "https://i.ibb.co/ZTS831h/logo.png",
          imageWidth: 100,
          imageHeight: 100,
          imageAlt: "Custom image",
        });
        navigate(from, { replace: true });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "You have put wrong credentials!",
        });
      });
    }
    return (
        <div className="login-section">
      <div className="h-screen flex justify-evenly items-center max-w-7xl mx-auto">
        {/* <div className="">
          <img src={loginImg} alt="" />
        </div> */}
        <div className="card shadow-2xl glass w-1/2">
          <h2 className="text-center text-3xl font-bold mt-10">TECHMED | LOGIN</h2>
          <form onSubmit={handleLogin} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                name="email"
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                name="password"
                className="input input-bordered"
              />
            </div>
            {/* <div className="form-control">
              <label className="label">
                <LoadCanvasTemplate />
              </label>
              <input
                onBlur={handleValidateCaptcha}
                type="text"
                placeholder="type captcha"
                name="captcha"
                className="input input-bordered"
              />
              <button className="btn btn-outline btn-xs mt-4">
                Validate Captcha
              </button>
            </div> */}
            <div className="form-control mt-6">
              <input
                className="btn bg-cyan-400 btn-block border-none"
                type="submit"
                value="login"
              />
            </div>
            <p>
              New here?{" "}
              <Link
                to="/signup"
                className="text-orange-400 underline font-semibold"
              >
                Create a new Account
              </Link>
            </p>
          </form>
          <div className="p-4">
            <div className="divider">OR</div>
            <button onClick={handleGoogleSignin} className="btn bg-cyan-400 btn-block border-none">Google Signin</button>
          </div>
        </div>
      </div>
    </div>
    );
};

export default Login;