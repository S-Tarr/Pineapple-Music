import { MessageSharp } from '@material-ui/icons';
import { useAuth } from '../contexts/AuthContext'


// function ChatMessage(props) {
//     console.log("props: ", props)
//     const text = []

//     props.array.forEach(element => {
//         text.push(<p>{element[1].text}</p>)
//     }); 

//     console.log("text: ", text)
//     return text
// }

// function ChatRoom() {
    
//     const { GetChatMessages } = useAuth();
//     const messages = GetChatMessages();
//     const messageData = null
//     messages.then(function(data) {
//         messageData = data;
//     });

//     return (
//         <>
//           <div>
//             {<ChatMessage props={messageData}/>}
//           </div>
//           <div>

//           </div>
//         </>
//     )
// }

function ChatRoom() {
    const { GetChatMessages } = useAuth();
    const messages = GetChatMessages();

    return (
        <>
            <div>
                {messages.map(message => (
                    <li key={message.id}>{message.text}</li>
                ))}
            </div>
            <div>

            </div>
        </>
    )
}

export default ChatRoom;