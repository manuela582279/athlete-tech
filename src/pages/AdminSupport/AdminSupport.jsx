import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useAuth } from "../../context/AuthContext";
import style from "./AdminSupport.module.css"; //  

const socket = io.connect("http://localhost:3001");

const AdminSupport = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState({}); // Guarda mensagens separadas por ID de aluno
  const [activeChat, setActiveChat] = useState(null); // Qual aluno você está atendendo agora

  useEffect(() => {
    // Se identifica como ADM para entrar na sala "admins"
    socket.emit("set_username", { name: user.name, role: "admin" });

    socket.on("receive_message", (data) => {
      // data vem com: { text, author, fromClientId }
      const studentId = data.fromClientId || data.authorId;

      setChats((prev) => ({
        ...prev,
        [studentId]: {
          name: data.author,
          messages: [...(prev[studentId]?.messages || []), data],
        },
      }));
    });

    return () => socket.off("receive_message");
  }, [user]);

  const enviarResposta = (texto) => {
    if (!activeChat) return;

    const payload = {
      text: texto,
      toClientId: activeChat, // O segredo está aqui: enviamos para o ID do aluno
    };

    socket.emit("message", payload);
    
    // Adiciona na sua própria tela para você ver o que mandou
    setChats(prev => ({
        ...prev,
        [activeChat]: {
            ...prev[activeChat],
            messages: [...prev[activeChat].messages, { text: texto, author: "Você", authorId: socket.id }]
        }
    }));
  };

  return (
    <div className={style.admin_wrapper}>
      {/* Lateral com a lista de alunos que mandaram mensagem */}
      <div className={style.sidebar}>
        {Object.keys(chats).map((id) => (
          <div key={id} onClick={() => setActiveChat(id)} className={activeChat === id ? style.active : ""}>
            {chats[id].name}
          </div>
        ))}
      </div>

      {/* Área de chat similar ao que você já tem, mas filtrada por aluno */}
      <div className={style.chat_area}>
        {activeChat ? (
          <>
            <h3>Atendendo: {chats[activeChat].name}</h3>
            <div className={style.messages_box}>
               {chats[activeChat].messages.map((m, i) => (
                 <p key={i}><b>{m.author}:</b> {m.text}</p>
               ))}
            </div>
            {/* Aqui você usaria um input similar ao seu Chat.jsx */}
            <button onClick={() => enviarResposta("Olá, como posso ajudar?")}>
                Enviar Resposta Padrão (Teste)
            </button>
          </>
        ) : (
          <p>Selecione um aluno para iniciar o suporte</p>
        )}
      </div>
    </div>
  );
};

export default AdminSupport;