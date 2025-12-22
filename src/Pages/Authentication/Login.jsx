import { use, useState } from 'react';
import { AuthContext } from '../AuthProvider/AuthContext';
import { toast } from 'react-toastify';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { RotatingTriangles } from 'react-loader-spinner';
const Login = () => {
    const {loginUser, user, signInWithGoogle} = use(AuthContext)
    const [loginloading, setLoginloading] = useState(false)
    const [email, setEmail] = useState('')
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
    if(loginloading ){
      return <div className="my-40 flex justify-center items-center"><RotatingTriangles
                    visible={true}
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="rotating-triangles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""/> 
                </div>
    } 


    
  return (
    <div className="w-11/12 mx-auto">
      <title>Toy Topia Store - Login</title>
      <div className="hero bg-base-200 min-h-screen rounded-2xl">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl ">
            <div className="card-body border border-dotted px-16 rounded-2xl">
              <h1 className="text-4xl font-bold mt-4">Login now!</h1>
                <form onSubmit={handleLogin}>
                    <fieldset className="fieldset">
                        <label className="label text-blue-800 font-semibold">Email</label>
                        <input type="email" 
                        className="input input-ghost border-b-blue-800 mb-2" 
                        placeholder="Email" 
                        name='email' 
                        value={email}
                        onChange={(e)=> {setEmail(e.target.value)}}
                        required />
                        <label className="label text-blue-800 font-semibold">Password</label>
                        <input
                        type="password"
                        className="input input-ghost border-b-blue-800 mb-2"
                        placeholder="Password"
                        name='password'
                        required
                        />
                        <div>New user? 
                        <NavLink to="/register" className="link link-hover text-blue-700 font-semibold"> Register here!</NavLink>
                        </div>
                        <div>
                           <p onClick={handleForgetPassword} className='hover:underline hover:text-blue-700 hover:cursor-pointer'>Forget Password?</p>
                        </div>
                        <button className="btn btn-neutral mt-2 mb-4">Login</button>
                    </fieldset>
                </form>
                <div className='mb-10'>
                    <div className=' flex items-center mb-5'>
                      <p className='border-b border-dashed border-gray-700'></p>
                      <span className='text-center inline-block text-gray-600 text-lg text-shadow-2xs font-medium font-baina px-1'>or</span> 
                      <p className='border-b border-dashed border-gray-700'></p>
                    </div>
                    <div onClick={handleGoogleISignIn}>
                      <button className="btn bg-white text-black border-[#e5e5e5]">
                        <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                        Login with Google
                      </button>  
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
