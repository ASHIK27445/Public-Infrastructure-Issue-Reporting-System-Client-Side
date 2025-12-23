import { use, useState } from 'react';
import { AuthContext } from '../AuthProvider/AuthContext';
import { toast } from 'react-toastify';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { RotatingTriangles } from 'react-loader-spinner';
import { GoEye, GoEyeClosed } from "react-icons/go";
import { ArrowRight, CheckCircle, Shield, LogIn, Mail, Lock, User, Key } from 'lucide-react';

const Login = () => {
    const {loginUser, user, signInWithGoogle} = use(AuthContext)
    const [loginloading, setLoginloading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    
    const handleLogin = (e) =>{
        e.preventDefault()
        
        const email = e.target.email.value
        const password = e.target.password.value
        if(!user){
          setLoginloading(true)
            loginUser(email, password)
                .then(res => {
                  e.target.reset()
                  setTimeout(()=>{
                    setLoginloading(false)
                    navigate(location?.state ? `${location?.state}` : '/')
                    toast.success(`Welcome back!`,{
                      autoClose: 1200
                    })
                  },2000)

                })
                .catch(e=> {
                  setLoginloading(false)
                  if(e.code === 'auth/invalid-credential'){
                    toast.error("Invalid email or password. Please try again.", {
                      autoClose: 1500
                    })
                  }
                }) 
        }
        else{
            toast.error('user is alredy logged in',{
              autoClose:1200
            })
        }
    }

    const handleGoogleISignIn = () => {
      if(!user){
        signInWithGoogle()
          .then((result)=>{
            toast.success("Welcome back")
          })
          .catch((error)=>{
            toast.error(error.message)
          })
       }else{
      toast("User Already Logged IN!")
      }
    }
    
    const handleForgetPassword = () => {
      navigate('/forgetPassword', {state: {email}})
    }
    
    const handleShowPassword = () => {
      setShowPassword(!showPassword)
    }
    
    if(loginloading){
      return (
        <div className="min-h-screen bg-linear-to-br from-zinc-950 to-zinc-900 flex justify-center items-center">
          <div className="text-center">
            <RotatingTriangles
              visible={true}
              height="80"
              width="80"
              color="#10b981"
              ariaLabel="rotating-triangles-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <p className="mt-6 text-lg text-emerald-400 font-semibold">Logging you in...</p>
          </div>
        </div>
      )
    }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 to-zinc-900 py-12 px-4 flex items-center justify-center">
      <title>CityInfra - Login</title>
      
      <div className="w-full max-w-md">
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          
          <div className="relative bg-linear-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 border border-zinc-700">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-linear-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                <p className="text-gray-400">Sign in to your account</p>
              </div>
            </div>

            <form onSubmit={handleLogin}>
              <div className="space-y-6 mb-6">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-gray-300 font-medium">
                    <Mail className="w-4 h-4 text-emerald-500" />
                    <span>Email Address</span>
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-zinc-700/50 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-gray-300 font-medium">
                      <Lock className="w-4 h-4 text-emerald-500" />
                      <span>Password</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleForgetPassword}
                      className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-1"
                    >
                      <Key className="w-3 h-3" />
                      <span>Forgot Password?</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-zinc-700/50 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors pr-12"
                      placeholder="Enter your password"
                    />
                    <button 
                      type="button"
                      onClick={handleShowPassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors p-2"
                    >
                      {showPassword ? <GoEyeClosed className="w-5 h-5" /> : <GoEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="text-gray-400">
                  Don't have an account?{' '}
                  <NavLink 
                    to="/register" 
                    className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                  >
                    Register here
                  </NavLink>
                </div>
              </div>

              <button 
                type="submit"
                className="group w-full px-8 py-4 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3 mb-6"
              >
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center mb-6">
                <div className="flex-1 h-px bg-zinc-700"></div>
                <span className="px-4 text-gray-500 text-sm">or continue with</span>
                <div className="flex-1 h-px bg-zinc-700"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleISignIn}
                className="group w-full px-8 py-3 bg-white/10 border border-zinc-600 rounded-2xl font-semibold text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <svg aria-label="Google logo" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <g>
                    <path d="m0 0H512V512H0" fill="#fff"></path>
                    <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                    <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                    <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                    <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
                  </g>
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-zinc-700">
              <div className="flex items-center justify-center space-x-4 text-gray-500 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>256-bit SSL Encryption</span>
                </div>
                <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Secure Login</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;