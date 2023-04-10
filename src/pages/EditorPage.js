import React, { useEffect, useRef, useState } from 'react'
import ACTIONS from '../Actions'
import Client from '../components/Client'
import Editor from '../components/Editor'
import { initSocket } from '../socket'
import { useLocation,useNavigate,Navigate,useParams} from 'react-router-dom'
import { toast } from 'react-hot-toast'

const EditorPage = () => {
  const socketRef=useRef(null)
  const codeRef=useRef(null)
  const location=useLocation()
  const {roomId}=useParams()   //This roomId name we get from App.js router path="/editor/:roomId"

  const reactNavigator=useNavigate()

  const [clients,setClients]=useState([])

  useEffect(()=>{
    const init=async ()=>{
      socketRef.current= await initSocket();
      socketRef.current.on('connect_error',(err)=>handleErrors(err))
      socketRef.current.on('connect_failed',(err)=>handleErrors(err))

      function handleErrors(e){
        // console.log('socket error',e);
        toast.error('Socket connection failed,try again later')
        reactNavigator('/')
      }

      //Sends a message or signal to the server
      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username:location.state?.username
      })

      socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId})=>{
        if(username!==location.state?.username){
          toast.success(`${username} joined the room`)
          // console.log(`${username} joined`)
        }
        setClients(clients)
        socketRef.current.emit(ACTIONS.SYNC_CODE,{
          code:codeRef.current,
          socketId
        })
      })

      socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
        toast.success(`${username} left the room`)
        setClients((prev) => {
          return prev.filter(
              (client) => client.socketId !== socketId
          );
        });
      })
    }
    init();

    //return a function to unsubscribe the listeners
    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
  };
  },[])

  async function copyRoomId(){
    try{
      await navigator.clipboard.writeText(roomId)
      toast.success('Copied room Id')
    }catch(err){
      toast.error('Could not copy the roomId')
      // console.log(err)
    }
  }
  const leaveBtn=()=>{
    reactNavigator('/')
  }

  if(!location.state){
    return <Navigate to="/"/>
  }

  
  return (
    <div className='mainWrap'>
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img src="/code-sync.png" className='logoImage' alt="logo" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {
              clients.map((client)=>{
                return(
                  <Client key={client.sockedtId} username={client.username}/>
                )
              })
            }
          </div>
        </div>
        <button className='btn copyBtn' onClick={copyRoomId}>Copy Room Id</button>
        <button className='btn leaveBtn' onClick={leaveBtn}>Leave</button>
      </div>
      <div className="editorWrap">
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{
          codeRef.current=code
        }}/>
      </div>
    </div>
  )
}

export default EditorPage
