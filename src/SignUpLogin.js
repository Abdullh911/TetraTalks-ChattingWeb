import { useState } from "react";
import { useRef } from 'react';
import { usersCollection, query, where, getDocs } from './database';
const SignUpLogin = () => {
    let numberRef=useRef("");
    let passRef=useRef("");
    let [wrong,setWrong]=useState(false);

    const getUserByPhoneNumber = async () => {
        try {
            const phoneNumber = numberRef.current.value;
            const password = passRef.current.value;
    
            if (!phoneNumber || !password) {
                setWrong(true);
                return;
            }
    
            const q = query(usersCollection, where('number', '==', phoneNumber));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.size > 0) {
                const userDoc = querySnapshot.docs[0];
                const userData = {
                    id: userDoc.id,
                    ...userDoc.data(),
                };
    
                console.log('User Data:', userData);
    
                if (userData.password === password) {
                    localStorage.setItem('currUser', JSON.stringify(userData));
                    window.location.reload();
                } else {
                    setWrong(true);
                }
            } else {
                console.log('User not found');
                setWrong(true);
            }
        } catch (error) {
            console.error('Error getting user by phone number:', error);
            setWrong(true);
        }
    };
    
    // const getAllUsers = async () => {
    //     try {
    //         console.log(getUserByPhoneNumber(numberRef.current.value));
    //         const querySnapshot = await getDocs(usersCollection);
    //         const usersData = querySnapshot.docs.map((doc) => ({
    //             id: doc.id,
    //             ...doc.data(),
    //         }));
    //         let found=false;
    //         let index;
    //         for(let i=0;i<usersData.length;i++){
    //             if(usersData[i].number===numberRef.current.value){
    //                 found=true;
    //                 index=i;
    //                 break;
    //             }
    //         }
    //         if(found){
    //             if(usersData[index].password===passRef.current.value){
    //                 localStorage.setItem('currUser',usersData[index]);
    //                 //window.location.reload();
    //             }
    //             else{
    //                 setWrong(true);
    //             }
    //         }
    //         else{
    //             setWrong(true);
    //         }
            
    //     } catch (error) {
    //         console.error('Error fetching all users:', error);
    //         throw error;
    //     }
    // };
    return ( 
        <div>
            <div className="login-box">
            <p>Login</p>
            {wrong && <p style={{color:'red'}}>Wrong Credentials</p>}
            <form>
                <div className="user-box">
                    <input required="" name="" type="text" ref={numberRef}/>
                    <label>Number</label>
                </div>

                <div className="user-box">
                    <input required="" name="" type="password" ref={passRef}/>
                    <label>Password</label>
                </div>
                <button type="button" onClick={getUserByPhoneNumber}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Submit
                </button>
            </form>
                
            </div>
        </div>
     );
}
 
export default SignUpLogin;