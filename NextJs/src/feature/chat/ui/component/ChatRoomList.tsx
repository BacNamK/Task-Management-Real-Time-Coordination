import type { RoomType } from '../../service/chat.type';

type ChatRoomListProps = {
    chatRooms: RoomType[];
    selectedRoom?: RoomType;
    onSelectRoom: (room: RoomType) => void;
};

const ChatRoomList = ({
    chatRooms,
    selectedRoom,
    onSelectRoom,
}: ChatRoomListProps) => (
    <section className="w-1/4 h-full p-4">
        <div className="flex h-full w-full flex-col gap-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
            {chatRooms.map((room) => (
                <div
                    key={room.id}
                    onClick={() => onSelectRoom(room)}
                    className={`flex h-10 cursor-pointer items-center rounded-xl px-3 text-sm font-medium text-slate-600 transition-colors ${selectedRoom?.id === room.id ? 'bg-amber-100 ' : ''}`}
                >
                    <span># {room.name}</span>
                </div>
            ))}
        </div>
    </section>
);

export default ChatRoomList;
