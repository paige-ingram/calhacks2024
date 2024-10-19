import PrintChats from "@/components/PrintChats";

export default function ChatsPage() {
  const accessToken = process.env.NEXT_PUBLIC_HUME_API_KEY || '';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Messages</h1>
      <PrintChats accessToken={accessToken} />
    </div>
  );
}
