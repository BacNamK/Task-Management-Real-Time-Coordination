const BoxChat = () => {
    return (
        <div className="h-full w-full flex flex-col">
            <div className="h-[90%]">display message</div>
            <div className="h-[10%]">
                <input type="text" placeholder="Type a message..." />
            </div>
        </div>
    );
};

export default BoxChat;
