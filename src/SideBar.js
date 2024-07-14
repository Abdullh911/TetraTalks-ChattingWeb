// import { useState } from 'react';
import pic from './userPic.jpg'
import { useContext, useEffect, useRef, useState } from 'react';
import logo from './logo.png';
import { Store } from './Store';
import { usersCollection, query, where, getDocs,onSnapshot } from './database';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from './database';
import getUpdates from './LiveUpdate'
const SideBar = () => {
    // let [folders,setFolders]=useState([]);
    let [showModal,setShowModal]=useState(false);
    let [showProf,setShowProf]=useState(false);
    let numberRef=useRef('');
    let store=useContext(Store);
    function enableModal(){
        setShowModal(true);
    }
    function disableModal(){
        setShowModal(false);
    }
    useEffect(()=>{
        // init();  
        // getCurrUserObj();
        // console.log("sidebar fetch");
        const fetchUserData = async () => {
            try {
                let userDocRef = doc(usersCollection, await getCurrUserId());
                const unsubscribe = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists()) {
                        const userData = {
                            id: doc.id,
                            ...doc.data(),
                        };
                        //console.log("User data (real-time):", userData);
                        store.updateCurrUser(userData);
                        localStorage.setItem('currUser', JSON.stringify(userData));
                        //console.log(userData,"ahooooh");
                        //localStorage.setItem('currId', userData.id);
                    } else {
                        console.log("User document not found");
                    }
                }, (error) => {
                    console.error("Error listening to user document:", error);
                });
                return () => unsubscribe();
            } catch (error) {
                console.error("Error getting user document:", error);
            }
        };
        
        fetchUserData();
    },[])
    // useEffect(()=>{
    //     const intervalId = setInterval(() => {
    //         getCurrUserObj();
    //         console.log('Performing action at regular interval');
    //       }, 100);
    //       return () => clearInterval(intervalId);
    // })
    async function  init(){
        //console.log(store.currUser);
        await getCurrUserId();
        // console.log(store.currUserid);
        let currUser=store.currUser;
        let currUserId=localStorage.getItem('currUserId');
        //console.log(currUserId);
        store.updateCurrUser(currUser);
    }
    function logout(){
        //console.log(store.currUser);
        localStorage.removeItem('currUser');
        localStorage.removeItem('currId');
        window.location.reload();
    }
    function getTime(){
        const currentDate = new Date();
        let hours = currentDate.getHours();
        let minutes = currentDate.getMinutes();
        let seconds = currentDate.getSeconds();
        const amOrPm = hours >= 12 ? 'PM' : 'AM';
        if(hours>=12){
            hours-=12;
        }
        let time=hours+":"+minutes+" "+amOrPm;
        return time;
    }
    const getCurrUserId = async () => {
        try {
            let phoneNumber=store.currUser.number;
            const q = query(usersCollection, where('number', '==', phoneNumber));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.size > 0) {
                const userDoc = querySnapshot.docs[0];
                const userData = {
                    id: userDoc.id,
                    ...userDoc.data(),
                };
                // store.updateCurrUserId(userData.id);
                // localStorage.setItem('currUserId', userData.id);
                // localStorage.setItem('currUser', JSON.stringify(userData));
                return userData.id;
                
            } else {
                console.log('User not found');
                
            }
        } catch (error) {
            console.error('Error getting user by phone number:', error);
            
        }
    };

    const getCurrUserObj = async () => {
        try {
            let phoneNumber=store.currUser.number;
            const q = query(usersCollection, where('number', '==', phoneNumber));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.size > 0) {
                const userDoc = querySnapshot.docs[0];
                const userData = {
                    id: userDoc.id,
                    ...userDoc.data(),
                };
                store.updateCurrUser(userData);
                return userData;
                // localStorage.setItem('currUser', userData);
                //console.log('User Data:', userData);
                
            } else {
                console.log('User not found');
                
            }
        } catch (error) {
            console.error('Error getting user by phone number:', error);
            
        }
    };
    const getUserByPhoneNumber = async () => {
        try {
            let currUser=store.currUser;
            const phoneNumber = numberRef.current.value;
            console.log(phoneNumber);
            const q = query(usersCollection, where('number', '==', phoneNumber));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.size > 0) {
                const userDoc = querySnapshot.docs[0];
                const userData = {
                    id: userDoc.id,
                    ...userDoc.data(),
                };
                console.log(userData);
                let newChat={
                    messages:[],
                    number:userData.number,
                    name:userData.name
                }
                console.log(currUser);
                let newChat2={
                    messages:[],
                    number:currUser.number,
                    name:currUser.name
                }
                console.log("userData");
                 let dup = userData.chats.some(chat => chat.number === currUser.number);
                
                if(!dup){
                    addChat(newChat,await getCurrUserId(),currUser);
                    addChat(newChat2,userData.id,userData);
                    await getCurrUser();
                }
            } else {
                console.log('User not found');
            }
        } catch (error) {
            console.error('Error getting user by phone number:', error);
        }
    };
    const getCurrUser = async () => {
        try {
            let currUser=JSON.parse(localStorage.getItem('currUser'));
            const phoneNumber = currUser.number;
            const q = query(usersCollection, where('number', '==', phoneNumber));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.size > 0) {
                const userDoc = querySnapshot.docs[0];
                const userData = {
                    id: userDoc.id,
                    ...userDoc.data(),
                };
                //console.log(userData,"ahoh");
                localStorage.removeItem('currUser');
                localStorage.setItem('currUser', JSON.stringify(userData));
                store.updateCurrUser(userData);
                //console.log('User Data:', store.currUser);
            } else {
                console.log('User not found');
                
            }
        } catch (error) {
            console.error('Error getting user by phone number:', error);
            
        }
    };
    function enableProf(){
        setShowProf(true);
    }
    function disableProf(){
        setShowProf(false);
    }
    function addChat(newChat, id, user) {
        console.log(newChat, id, user);
        try {
            const userRef = doc(firestore, 'users', id);
    
            if (newChat === null) {
                updateDoc(userRef, {
                    chats: [],
                });
                //console.log("ew3a");
            } else {
                let temp = [...user.chats];
                temp.push(newChat);
                updateDoc(userRef, {
                    chats: temp,
                });
                getCurrUser();
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }
    return ( 
        <div className="sidebar">
            {showModal && <div className='allmodal'>
                <div className='modal'>
                    <i onClick={disableModal} id='exitmodal' className="fa-solid fa-x fa-xl"></i>
                    <br />
                    <label htmlFor="">Number</label>
                    <br />
                    <input ref={numberRef} className='addinput' type="text" />
                    <br />
                    <button className='addbtn' onClick={getUserByPhoneNumber}>ADD</button>
                </div>
                <div onClick={disableModal} className='backdrop'>

                </div>
            </div>}

            {showProf && <div className='allmodal'>
                <div className='profmodal'>
                    <i onClick={disableProf} id='exitprof' className="fa-solid fa-x fa-xl"></i>
                    <img className='userpic' src={pic} alt="" />
                    <h1>Name: {store.currUser.name}</h1>
                    <h1>Phone Number: {store.currUser.number}</h1>
                </div>
                <div onClick={disableProf} className='backdrop'>

                </div>
            </div>}
            <img onClick={()=>{
                window.location.reload();
            }} className='logo' src={logo} alt="hi" />
            {/* folders */}
            <br />
            <br />
            <div className='opts'>
                <div>
                    <i onClick={enableModal} id='addnum' className="fa-solid fa-user-plus fa-2xl"></i>
                    <p style={{color:"white"}}>Add Number</p>
                </div>
                <div>
                    <button onClick={enableProf} className='profile'><i className="fa-solid fa-user fa-2xl"></i><br /><br /> Profile</button>
                </div>
                <div>
                    <i onClick={logout} id='logout' className="fa-solid fa-right-from-bracket fa-2xl"></i>
                    <p style={{color:"white"}}>Log Out</p>
                </div>
                
            </div>
            
            {/* <div className='prof'>
                <hr width="100%" />
                <br />
                
                <br />
                <br />
                
            </div> */}
        </div>
     );
}
 
export default SideBar;