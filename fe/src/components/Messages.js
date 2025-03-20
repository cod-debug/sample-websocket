import classes from './Messages.module.css';

export default function Messages({ messages, mySocketId }) {
    return (
        <div className={classes.messages}>
            {
                messages.map((chat) => {
                    return (
                        <div style={{ textAlign: chat.clientId === mySocketId ? 'left' : 'right' }}>
                            <strong>{chat.clientId}</strong>:
                            <span>{chat.message}</span>
                        </div>
                    )
                })
            }
            {messages.length === 0 && <p>Your messages will be displayed here...</p>}
        </div>
    )
}