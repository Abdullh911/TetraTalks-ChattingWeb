import { Store } from "./Store";
import { useContext,useEffect, useRef, useState } from "react";
import ChatBlock from "./ChatBlock";
import { usersCollection, query, where, getDocs,onSnapshot } from './database';
import { doc, updateDoc } from 'firebase/firestore';
const ChatList = (props) => {
    let store=useContext(Store);
    let [chatBlocks,setChatBlocks]=useState([]);
    let searchref=useRef("");
    let [altChatBlock,setAltChatBlock]=useState([]);
    useEffect(()=>{
        createChatblocks();
        // const fetchUserData = async () => {
        //     
        //     try {
        //         let userDocRef = doc(usersCollection, store.currUser.id);
        //         const unsubscribe = onSnapshot(userDocRef, (doc) => {
        //             if (doc.exists()) {
        //                 const userData = {
        //                     id: doc.id,
        //                     ...doc.data(),
        //                 };
        //                 //console.log("User data (real-time):", userData);
        //                 store.updateCurrUser(userData);
        //                 localStorage.setItem('currUser', JSON.stringify(userData));
        //                 //console.log(userData,"ahooooh");
        //                 //localStorage.setItem('currId', userData.id);
        //             } else {
        //                 console.log("User document not found");
        //             }
        //         }, (error) => {
        //             console.error("Error listening to user document:", error);
        //         });
        
        //         // Cleanup the listener when the component unmounts
        //         return () => unsubscribe();
        //     } catch (error) {
        //         console.error("Error getting user document:", error);
        //     }
        // };
        
        // fetchUserData();
        
    },[store.currUser]);

    function isBase64(str) {
        //console.log(str);
        try {
          return btoa(atob(str)) == str;
        } catch (err) {
          return false;
        }
      }

    function createChatblocks(){
        let chats=store.currUser.chats;
        //console.log(chats);
        if(chats){
        let temp=[];
        for(let i=0;i<chats.length;i++){
            let name=chats[i].name;
            let last="";
            let chatNum=chats[i].number;
            if(chats[i].messages.length>0){
                last=chats[i].messages[chats[i].messages.length-1].content;
            }
            //console.log(last);
            if(isBase64(last)){
                last="Voice Note"
            }
            temp.push(<ChatBlock name={name} last={last} key={i} number={chatNum}/>);
        }
        setChatBlocks(temp);
        setAltChatBlock(temp);

        //console.log(chatBlocks);
    }
        
    }
    function search(x){
        let temp=altChatBlock.filter((z)=>{
            return z.props.name.toLowerCase().includes(x) || z.props.name.toUpperCase().includes(x)
        })
        setChatBlocks(temp);
    }
    return ( 
        <div className="chatlist">
            <h1>Chats</h1>
            <div className="group">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
                    <g>
                    <path
                        d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"
                    ></path>
                    </g>
                </svg>
            <input ref={searchref} onChange={()=>{search(searchref.current.value)}} className="input" type="search" placeholder="Search" />
            </div>

            <div className="chats">
                {chatBlocks}
            </div>

        </div>
     );
}
 
export default ChatList;