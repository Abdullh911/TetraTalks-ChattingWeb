// import { useContext, useEffect } from 'react';
import pic from './userPic.jpg'
import { Store } from './Store';
import { useContext,useEffect, useState } from 'react';
// import { useState } from 'react';
const ChatBlock = (props) => {
    let [last,setlast]=useState(props.last);
    // let [isSeen,setIsSeen]=useState(false);
    // function change(){
    //     let x=!isSeen
    //     setIsSeen(x);
    // }
    let store=useContext(Store)
    function chatIsClicked(){
        store.updateClickedChat(props.number);
        store.updateChatClicked(true);
        localStorage.setItem('clickedNum',props.number);
        let num=localStorage.getItem('clickedNum');
    }
    useEffect(()=>{
        
    },[])
    
    // useEffect(() => {
    //     console.log('Clicked Chat Changed:', store.clickedChat);
    // }, [store.clickedChat]);
    return ( 
        <div onClick={chatIsClicked} className='chatblock'>
            <div>
                <img className='userpic' src={pic} alt="hi" />  
            </div>
            <div className='namelast'>
                <h3>{props.name}</h3>
                <p>{props.last}</p>
            </div>
            <div>
                <i className="fa-solid fa-check" style={{color:'black'}}></i>
            </div>
        </div>
     );
}
 
export default ChatBlock;