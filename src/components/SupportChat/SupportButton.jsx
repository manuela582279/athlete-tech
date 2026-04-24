import {useContext, useEffect, useState} from 'react';
import io from "socket.io-client";
import {useAuth} from '../../context/AuthContext';
import Chat from './Chat';
import styles from './SupportButton.module.css';
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

const socket = io.connect("http://localhost:3001")

const SupportButton = () => {
    const [isOpen, setIsOpen] = useState(false)

    //para usar os dados do user
    const {user} = useAuth()
    useEffect(() => {
    //nome e outros dados
    if (user) {
        const userName = user.name || user.email || "Usuário Logado";
        socket.emit("set_username", userName);
        console.log(`Conectado ${userName}`)
      }
    }, [user]); //

  return (
    <div className={styles.widget_container}>
      {isOpen && (
        <div className={styles.chat_wrapper}>
            <Chat socket={socket} />
        </div>
      )}

{/* meio q um interruptor */}
      <button className={styles.float_button}  onClick={() => setIsOpen(!isOpen)}> 
 {isOpen ? <CloseIcon /> : <ChatIcon /> }     
      </button>
    </div> 
  )
}

export default SupportButton
