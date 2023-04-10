import React from 'react'
import { useState } from 'react';
import {v4 as uuidv4} from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate=useNavigate();
    const [roomId,setRoomid]=useState("");
    const [username,setUsername]=useState("");

    const createNewRoom=(e)=>{
        e.preventDefault();
        const id=uuidv4();
        console.log(id);
        setRoomid(id);
        toast.success('Created a new room');
    };

    const joinButtonClick=()=>{
        if(!username || !roomId){
            toast.error("Username and UserId required")
            return;
        }
        navigate(`/editor/${roomId}`,{
        state:{
            username,
        }})
    };

    const handleEnter=(e)=>{
        //or this one will also work--->console.log(e.code)
        if(e.key=='Enter'){
            joinButtonClick()
        }
    }


  return (
    <div className='homePageWrapper'>
        <div className='formWrapper'>
            <img className="homePageLogo" src="/code-sync.png" alt="code-sync-logo" />
            <h4 className='mainLabel'>Paste Invitation ROOM ID</h4>
            <div className="inputGroup">
                <input type="text" className='inputBox' placeholder='ROOM ID' onKeyUp={handleEnter} onChange={(e)=>{setRoomid(e.target.value)}} value={roomId}/>
                <input type="text" className='inputBox' placeholder='USER NAME' onKeyUp={handleEnter} onChange={(e)=>{setUsername(e.target.value)}} value={username}/>
                <button onClick={joinButtonClick} className='btn joinBtn'>Join</button>
                <span className='createInfo'>
                    If you don't have an invite then create  &nbsp;
                    <a onClick={createNewRoom} href="" className='createNewBtn'>new room</a>
                </span>
            </div>
        </div>
        <footer>
            <h4>Built with 💛 by <a href="https://github.com/Debendrapanigrahi768233">Debendra</a></h4>
        </footer>
    </div>
  )
}

export default Home
