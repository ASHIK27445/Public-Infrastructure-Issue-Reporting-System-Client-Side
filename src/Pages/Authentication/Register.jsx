import { use, useState } from 'react';
import { AuthContext } from '../AuthProvider/AuthContext';
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router';
import { RotatingTriangles } from 'react-loader-spinner';
import { GoEye, GoEyeClosed } from "react-icons/go";
import { ArrowRight, CheckCircle, Shield, UserPlus, Mail, Lock, User, MapPin, Image } from 'lucide-react';
import axios from 'axios';
import { auth } from '../../Firebase/firebase.init';

const Register = () => {
    const {user, logoutUser} = use(AuthContext)
    const {createUserEP, profileUpdate, setUser} = use(AuthContext)
    const [password, setPassword] = useState('')
    const [passError, setPassError] = useState([])
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    
    const passwordVerification = (passWD)=>{
        const newPassWordError = []
        if(!/[A-Z]/.test(passWD)){
            newPassWordError.push('Password Must have an Uppercase letter')
        }
        if(!/[a-z]/.test(passWD)){
            newPassWordError.push('Password Must have a lowercase letter')
        }
        if(passWD.length < 6){
            newPassWordError.push('Length must be at least 6 characters')
        }
        // if(!/[0-9]/.test(passWD)){
        //     newPassWordError.push('Password Must have at least one number')
        // }
        // if(!/[!@#$%^&*]/.test(passWD)){
        //     newPassWordError.push('Password Must have at least one special character')
        // }

        setPassError(newPassWordError)
    }
    
    const handlePasswordChange = (e) =>{
        setPassword(e.target.value)
        passwordVerification(e.target.value)
    }
    
    const handleRegister = async(e) =>{
        e.preventDefault()
        
        const name = e.target.name.value
        const photoURL = e.target.photoURL
        const file = photoURL.files[0]
        const email = e.target.email.value
        const password = e.target.password.value
        
        if(user){
          toast.error("Please logout first to create a new account!")
        } else {
          //imgbb url
          const imgbb = await axios.post(`https://api.imgbb.com/1/upload?&key=ca33ef6ed0c09fd575db21260a8a8185`, {image:file}, {
            headers:{
              'Content-Type': 'multipart/form-data'
            }
          })

          console.log(imgbb.data)

          const mainPhoto = imgbb.data.data.display_url
          const formData = {
            name, email, password, photoURL: mainPhoto
          }

          if(imgbb.data.success == true){
            setLoading(true)
            createUserEP(email, password)
              .then(res=> {
                console.log(res.user)
                  return profileUpdate(name, mainPhoto)
                            .then(()=>{
                              setUser({...auth.currentUser})
                              axios.post('http://localhost:3000/users', formData)
                                .then(res=>console.log(res.data))
                                .catch(err=>console.log(err))
                            })
                            .catch(error => toast.error(error.message))
              })
              .then(()=> {
                  toast.success("Account created successfully!", {
                      autoClose: 1200
                  })
                  //reset everything
                  setPassword('')
                  setPassError([])
                  e.target.reset()
                  setLoading(false)
                  logoutUser()
                  navigate('/login')
              })
              .catch(e=> {
                setLoading(false)
                toast.error(e.message)
              })
          }
        }
    }
    
    if(loading){
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
            <p className="mt-6 text-lg text-emerald-400 font-semibold">Creating your account...</p>
          </div>
        </div>
      )
    }
    
    const handleShowPassword = () =>{
      setShowPassword(!showPassword)
    }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 to-zinc-900 py-12 px-4 flex items-center justify-center">
      <title>CityInfra - Register</title>
      
      <div className="w-full max-w-2xl">
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          
          <div className="relative bg-linear-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 border border-zinc-700">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-linear-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Create Account</h2>
                <p className="text-gray-400">Fill in your details to get started</p>
              </div>
            </div>

            <form onSubmit={handleRegister}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-gray-300 font-medium">
                    <User className="w-4 h-4 text-emerald-500" />
                    <span>Full Name</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    className="w-full bg-zinc-700/50 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-gray-300 font-medium">
                    <Mail className="w-4 h-4 text-emerald-500" />
                    <span>Email Address</span>
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    className="w-full bg-zinc-700/50 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-gray-300 font-medium">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>Address (Optional)</span>
                  </label>
                  <input 
                    type="text" 
                    name="address"
                    className="w-full bg-zinc-700/50 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Your address"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-gray-300 font-medium">
                    <Image className="w-4 h-4 text-emerald-500" />
                    <span>Profile Photo</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="file" 
                      name="photoURL"
                      required
                      className="w-full bg-zinc-700/50 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="flex items-center space-x-2 text-gray-300 font-medium">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className="w-full bg-zinc-700/50 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors pr-12"
                    placeholder="Create a strong password"
                  />
                  <button 
                    type="button"
                    onClick={handleShowPassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors p-2"
                  >
                    {showPassword ? <GoEyeClosed className="w-5 h-5" /> : <GoEye className="w-5 h-5" />}
                  </button>
                </div>
                
                {passError.length > 0 && (
                  <div className="mt-4 p-4 bg-linear-to-r from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-emerald-500" />
                      Password Requirements
                    </h4>
                    <ul className="space-y-1">
                      {passError.map((error, index) => (
                        <li key={index} className="text-sm text-red-400 flex items-center">
                          <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {passError.length === 0 && password.length > 0 && (
                  <div className="mt-4 p-4 bg-linear-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/30">
                    <p className="text-emerald-400 font-semibold flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      All password requirements met!
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="text-gray-400">
                  Already have an account?{' '}
                  <NavLink 
                    to="/login" 
                    className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                  >
                    Login here
                  </NavLink>
                </div>
              </div>

              <button 
                type="submit"
                className="group w-full px-8 py-4 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3"
              >
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                  <span>No Credit Card Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;