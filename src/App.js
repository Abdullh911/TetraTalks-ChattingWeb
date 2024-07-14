import './App.css';
import SideBar from './SideBar';
import ChatList from './ChatList';
import Chat from './Chat';
import ChatBlock from './ChatBlock';
import SignUpLogin from './SignUpLogin';
import { useEffect } from 'react';
import {useState } from 'react';
import SignUp from './SignUp';

function App() {
  let nums=[1,2,3,4,5,3,3,3,3,3,3,3,3];
  let chats=nums.map((m)=>{
    return <ChatBlock/>
  });
  const [user, setUser] = useState(localStorage.getItem('currUser'));
  let [signLogin,setSignLogin] = useState(false);
  useEffect(()=>{
    const handleStorageChange = () => {
      setUser(localStorage.getItem('currUser'));
      localStorage.removeItem('currUser');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  },[])
  function goSignUp(){
    setSignLogin(!signLogin);
  }
  return (
    <div className="App">

        {user===null &&!signLogin&& 
        <div>
          <button className='signlogin' onClick={goSignUp}>Sign up</button>
          <SignUpLogin/>
        </div>
        }

        {user===null &&signLogin&&
        <div>
          <button id='gologin' className='signlogin' onClick={goSignUp}>Login</button>
          <SignUp/>
        </div>  
        }
        {user!==null && 
        <div className='logged'>
          <SideBar/>
          <ChatList chats={chats}/>
          <Chat/> 
        </div>}

    </div>
  );
}

export default App;
