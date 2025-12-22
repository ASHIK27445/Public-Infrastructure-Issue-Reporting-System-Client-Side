import { use, useState,  } from 'react';
import { AuthContext } from '../AuthProvider/AuthContext';
import { toast } from 'react-toastify';
import { NavLink, useNavigate} from 'react-router';
import { RotatingTriangles } from 'react-loader-spinner';
import { GoEye, GoEyeClosed } from "react-icons/go";
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
            newPassWordError.push('Password Must have an lowercaseletter')
        }
        if(passWD.length < 6){
            newPassWordError.push('Lenth must be at least 6 character')
        }

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
        const role = e.target.role.value
        if(user){
          toast.error("Logout first!")
        }else{
        
        //imgbb url
        const imgbb = await axios.post(`https://api.imgbb.com/1/upload?&key=ca33ef6ed0c09fd575db21260a8a8185`, {image:file}, {
          headers:{
            'Content-Type': 'multipart/form-data'
          }
        })

        console.log(imgbb.data)

        const mainPhoto = imgbb.data.data.display_url
        const formData = {
          name, email, role, password, photoURL: mainPhoto
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
                          .catch(error => toast.error(error.mesaage))
            })
            .then(()=> {
                toast("Create User Successfully!", {
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
            })}
        }
    }
    if(loading){
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
    const handleShowPassword = () =>{
      setShowPassword(!showPassword)
    }
  return (
    <div className="w-11/12 mx-auto">
      <title>Toy Topia Store - Register</title>
      <div className="hero bg-base-200 min-h-screen rounded-2xl">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl ">
            <div className="card-body border border-dotted px-16 rounded-2xl">
              <h1 className="text-4xl font-bold mt-4">Register now!</h1>
                <form onSubmit={handleRegister}>
                    <fieldset className="fieldset">
                        <label className="label text-blue-800 font-semibold">Name</label>
                        <input type="text" className="input input-ghost border-b-blue-800 mb-2" placeholder="Name" name="name" required />
                        <label className="label text-blue-800 font-semibold">PhotoURL</label>
                        <input type="file" className="input input-ghost border-b-blue-800 mb-2" placeholder="photoURL" name='photoURL' required />
                        <label className="label text-blue-800 font-semibold">Choose your role</label>
                        <select name='role' defaultValue="Choose Role" className="select appearance-none">
                          <option disabled={true}>Choose Role</option>
                          <option>Manager</option>
                          <option>Citizen</option>
                        </select>
                        <label className="label text-blue-800 font-semibold">Email</label>
                        <input type="email" className="input input-ghost border-b-blue-800 mb-2" placeholder="Email" name='email' required />
                        <label className="label text-blue-800 font-semibold">Password</label>
                        <div className="relative">
                            <input
                            type={showPassword ? 'text' : 'password'}
                            className="input input-ghost border-b-blue-800 mb-2"
                            placeholder="Password"
                            name='password'
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            />
                            {
                              <button type="button" className="absolute btn right-0 bg-transparent hover:border-none h-9 hover:shadow-none" onClick={handleShowPassword}>
                                {
                                  showPassword ?   <GoEyeClosed></GoEyeClosed> : <GoEye color='red'></GoEye>
                                }
                              </button>
                            }
                        </div>

                        { passError.length > 0 && (
                          <div>
                            {
                              passError.map((error, index)=> <p key={index} className='text-red-700'>
                                #{error}
                              </p>)
                            }
                          </div>
                        )}
                        {
                          passError === 0 && passError.length > 0 ? <div><p className='text-green-700 font-semibold'>*Password requirements met successfully!</p></div> : ''
                        }
                        <div>Already have an account? 
                        <NavLink to="/login" className="link link-hover text-blue-700 font-semibold"> Login here!</NavLink>
                        </div>
                        <button className="btn btn-neutral mt-4 mb-4">Register</button>
                    </fieldset>
                </form>  
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;