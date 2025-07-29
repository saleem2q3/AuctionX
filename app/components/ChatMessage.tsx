interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`${
          isUser
            ? 'bg-blue-500 text-white rounded-l-lg rounded-br-lg'
            : 'bg-gray-200 text-gray-800 rounded-r-lg rounded-bl-lg'
        } px-4 py-2 max-w-[70%] break-words`}
      >
        {message}
      </div>
    </div>
  );
} 