import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth"
import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import { auth } from "../../Firebase/firebase.init"
import axios from "axios"
import useAxios from "../../Hooks/useAxios"

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const [mUser, setMUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [mLoading, setMLoading] = useState(false)
    const axiosInstance = useAxios()
    const loginUser = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }
    const createUserEP = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }
    const logoutUser = () => {
        return signOut(auth)
    }
    const profileUpdate = async(name, photoURL) => {
        const profile = {
            displayName: name,
            photoURL: photoURL
        }
        return await updateProfile(auth.currentUser, profile)
    }
    useEffect(()=> {
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setLoading(false)
            setUser(currentUser)
        })

        return () => unsubscribe();
    }, [])

    useEffect(()=>{
        if(!user){return}
        setMLoading(true)
        axios.get(`http://localhost:3000/user/role/${user?.email}`)
            .then((res)=>{
            //     console.log('Full response:', res.data)  // Check this
            // console.log('Role value:', res.data.role)
                setMUser(res.data)
                setRole(res.data.role)
            })
            .catch(err=> console.log(err))
            .finally(()=> {setMLoading(false)})
    },[user])

    // useEffect(()=>{
    //     axios.get()
    // })

    // console.log(role, mUser, user)
    const googleProvider = new GoogleAuthProvider()
    const signInWithGoogle = () => {
        return signInWithPopup(auth, googleProvider)
    }
    const authInfo = {
        loginUser,
        signInWithGoogle,
        user,
        createUserEP,
        logoutUser,
        profileUpdate,
        loading, setUser, role, setRole, mUser, mLoading
    }
    return(
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    )
}
export default AuthProvider