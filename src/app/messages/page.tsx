"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Paperclip, Send } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

// Mock conversation data for four people
const initialConversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Hi there! How are you doing today?",
        time: "10:32 AM",
        status: "read",
      },
      {
        id: 2,
        sender: "me",
        text: "I'm doing well, thanks for asking! Just finishing up some paperwork for our new client.",
        time: "10:35 AM",
        status: "read",
      },
      {
        id: 3,
        sender: "them",
        text: "That's great to hear. Do you have the intake forms for Mei Zhang ready?",
        time: "10:36 AM",
        status: "read",
      },
    ],
  },
  {
    id: 2,
    name: "Emily Smith",
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Can you review the latest draft?",
        time: "Yesterday",
        status: "read",
      },
      {
        id: 2,
        sender: "me",
        text: "Sure thing, I'll have feedback by end of day.",
        time: "Yesterday",
        status: "read",
      },
      {
        id: 3,
        sender: "them",
        text: "Thank you!",
        time: "Yesterday",
        status: "delivered",
      },
    ],
  },
  {
    id: 3,
    name: "Michael Lee",
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Thanks for the update. Talk soon!",
        time: "2 days ago",
        status: "read",
      },
      {
        id: 2,
        sender: "me",
        text: "Will do, Michael. Have a great weekend!",
        time: "2 days ago",
        status: "read",
      },
      {
        id: 3,
        sender: "them",
        text: "You too!",
        time: "2 days ago",
        status: "delivered",
      },
    ],
  },
  {
    id: 4,
    name: "John Doe",
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Hey, can we reschedule our meeting?",
        time: "1 week ago",
        status: "read",
      },
      {
        id: 2,
        sender: "me",
        text: "Of course—what time works best for you?",
        time: "1 week ago",
        status: "read",
      },
      {
        id: 3,
        sender: "them",
        text: "How about Thursday at 3 PM?",
        time: "1 week ago",
        status: "delivered",
      },
    ],
  },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    const msg = {
      id: selectedConversation.messages.length + 1,
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };
    setConversations(
      conversations.map((conv) =>
        conv.id === selectedId
          ? { ...conv, messages: [...conv.messages, msg] }
          : conv
      )
    );
    setNewMessage("");
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard">
          <Button variant="outline">Back to dashboard</Button>
        </Link>
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>

      <div className="grid gap-4">
        {conversations.map((conv) => (
          <Dialog
            key={conv.id}
            open={selectedId === conv.id}
            onOpenChange={(open) => setSelectedId(open ? conv.id : null)}
          >
            <DialogTrigger asChild>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{conv.name}</span>
                    <span className="text-sm text-gray-500">
                      {conv.messages[conv.messages.length - 1].time}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">
                  {conv.messages[conv.messages.length - 1].text}
                </CardContent>
              </Card>
            </DialogTrigger>

            <DialogContent className="p-0 max-w-2xl">
              {/* Chat overlay */}
              <div className="flex h-[80vh] flex-col bg-gray-100">
                {/* Header */}
                <header className="flex items-center border-b bg-white p-4 shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedId(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Back</span>
                  </Button>
                  <Avatar className="ml-2 h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt={conv.name} />
                    <AvatarFallback>
                      {conv.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <h1 className="text-sm font-medium">{conv.name}</h1>
                    <p className="text-xs text-gray-500">
                      Case Manager • Online
                    </p>
                  </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {conv.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender === "me" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {msg.sender === "them" && (
                          <Avatar className="mr-2 h-8 w-8">
                            <AvatarImage
                              src="/placeholder.svg"
                              alt={conv.name}
                            />
                            <AvatarFallback>
                              {conv.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="max-w-[75%]">
                          <Card
                            className={`px-3 py-2 ${
                              msg.sender === "me"
                                ? "bg-blue-500 text-white"
                                : "bg-white"
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                          </Card>
                          <div
                            className={`mt-1 flex text-xs text-gray-500 ${
                              msg.sender === "me"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <span>{msg.time}</span>
                            {msg.sender === "me" && (
                              <span className="ml-2">
                                {msg.status === "read"
                                  ? "Read"
                                  : msg.status === "delivered"
                                  ? "Delivered"
                                  : "Sent"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input area */}
                <div className="border-t bg-white p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Paperclip className="h-5 w-5" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      } // missing handleSendMessage definition?
                      className="rounded-full"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      size="icon"
                      className="shrink-0 rounded-full bg-blue-500 hover:bg-blue-600"
                    >
                      <Send className="h-5 w-5 text-white" />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
