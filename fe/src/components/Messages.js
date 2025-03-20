import classes from './Messages.module.css';

export default function Messages({ messages, mySocketId }) {
    return (
        <div className={classes.messages}>
            {
                messages.map((chat) => {
                    return (
                        <div style={{ textAlign: chat.clientId === mySocketId ? 'left' : 'right' }}>
                            <span>{chat.clientId === mySocketId ? chat.clientId : chat.message}</span>
                            <span> : </span>
                            <span>{chat.clientId === mySocketId ? chat.message : chat.clientId}</span>
                        </div>
                    )
                })
            }
            {messages.length === 0 && <div>Messages will be displayed here...</div>}
        </div>
    )
}