import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth"
import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import { auth } from "../../Firebase/firebase.init"
import axios from "axios"

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)
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
        axios.get(`https://piirms.vercel.app/user/role/${user?.email}`)
            .then((res)=>{
                console.log('Full response:', res.data)  // Check this
            console.log('Role value:', res.data.role)
                setRole(res.data.role)
            })
            .catch(err=> console.log(err))
    },[user])

    console.log(role)
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
        loading, setUser, role, setRole
    }
    return(
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    )
}
export default AuthProvider