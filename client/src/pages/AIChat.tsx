import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Send, 
  Image as ImageIcon, 
  Mic, 
  Settings, 
  History,
  Sparkles,
  MessageSquare,
  Upload,
  RefreshCw
} from "lucide-react";
import type { ChatMessage, ChatSession } from "@shared/schema";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function AIChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("/assets/swami-vivekananda.jpg");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch chat sessions
  const { data: sessions = [] } = useQuery<ChatSession[]>({
    queryKey: ['/api/chat/sessions'],
    enabled: !!user,
  });

  // Fetch messages for current session
  const { data: messages = [], isLoading: messagesLoading } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/messages', currentSessionId],
    enabled: !!currentSessionId,
  });

  // Fetch quick actions
  const { data: quickActions = [] } = useQuery<string[]>({
    queryKey: ['/api/chat/quick-actions'],
    enabled: !!user,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, sessionId }: { content: string; sessionId?: string }) => {
      return apiRequest(`/api/chat/send`, {
        method: 'POST',
        body: { content, sessionId }
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chat/sessions'] });
      if (data.sessionId && !currentSessionId) {
        setCurrentSessionId(data.sessionId);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Create new session mutation
  const newSessionMutation = useMutation({
    mutationFn: async () => apiRequest('/api/chat/new-session', { method: 'POST' }),
    onSuccess: (data) => {
      setCurrentSessionId(data.sessionId);
      queryClient.invalidateQueries({ queryKey: ['/api/chat/sessions'] });
    }
  });

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (base64Image: string) => {
      return apiRequest('/api/chat/analyze-image', {
        method: 'POST',
        body: { image: base64Image, sessionId: currentSessionId }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages'] });
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || sendMessageMutation.isPending) return;
    
    const messageToSend = message;
    setMessage("");
    
    sendMessageMutation.mutate({ 
      content: messageToSend, 
      sessionId: currentSessionId || undefined 
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    setMessage(action);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const base64Data = base64.split(',')[1]; // Remove data:image/jpeg;base64, prefix
      uploadImageMutation.mutate(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice not supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
    };

    recognition.onerror = () => {
      toast({
        title: "Voice error",
        description: "Could not recognize speech. Please try again.",
        variant: "destructive"
      });
      setIsListening(false);
    };

    recognition.start();
  };

  const defaultQuickActions: QuickAction[] = [
    { id: "careers", label: "Suggest careers for me", icon: <Sparkles className="w-4 h-4" /> },
    { id: "courses", label: "Find relevant courses", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "resume", label: "Analyze my resume", icon: <Upload className="w-4 h-4" /> },
    { id: "trends", label: "Show job market trends", icon: <RefreshCw className="w-4 h-4" /> },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Sign in to Chat</h2>
            <p className="text-muted-foreground">Please sign in to access the AI Chat feature.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <div className="relative z-10 min-h-screen flex">
        {/* Chat History Sidebar */}
        <div className="hidden md:flex w-80 bg-background/95 backdrop-blur border-r flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <History className="w-5 h-5" />
                Chat History
              </h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() => newSessionMutation.mutate()}
                data-testid="button-new-chat"
              >
                New Chat
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Prompts used: {user.monthlyPromptCount}/100</span>
              <Badge variant="secondary">{100 - user.monthlyPromptCount} left</Badge>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-2">
            {sessions.map((session) => (
              <Button
                key={session.id}
                variant={currentSessionId === session.id ? "secondary" : "ghost"}
                className="w-full justify-start mb-1 h-auto p-3"
                onClick={() => setCurrentSessionId(session.id)}
                data-testid={`button-session-${session.id}`}
              >
                <div className="text-left">
                  <div className="font-medium truncate">{session.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </Button>
            ))}
          </ScrollArea>

          <div className="p-4 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => fileInputRef.current?.click()}
              data-testid="button-change-background"
            >
              <Settings className="w-4 h-4" />
              Change Background
            </Button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-background/95 backdrop-blur border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-semibold">AI Career Mentor</h1>
                  <p className="text-sm text-muted-foreground">
                    Your personal career guidance assistant
                  </p>
                </div>
              </div>
              
              <div className="md:hidden">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => newSessionMutation.mutate()}
                >
                  New Chat
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            {currentSessionId && !messagesLoading ? (
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium mb-2 text-white">Start a conversation</h3>
                    <p className="text-white/80 mb-6">Ask me anything about careers, skills, or education.</p>
                    
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                      {defaultQuickActions.map((action) => (
                        <Button
                          key={action.id}
                          variant="outline"
                          className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={() => handleQuickAction(action.label)}
                          data-testid={`button-quick-${action.id}`}
                        >
                          {action.icon}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            AI
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-white/90 text-foreground'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <div className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      
                      {msg.role === 'user' && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Welcome to AI Chat</h3>
                  <p className="opacity-80">Start a new conversation to begin!</p>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="bg-background/95 backdrop-blur border-t p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about careers, skills, education..."
                    className="pr-24"
                    disabled={sendMessageMutation.isPending}
                    data-testid="input-chat-message"
                  />
                  
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadImageMutation.isPending}
                      data-testid="button-upload-image"
                      className="h-8 w-8"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={startVoiceRecording}
                      disabled={isListening}
                      data-testid="button-voice"
                      className="h-8 w-8"
                    >
                      <Mic className={`w-4 h-4 ${isListening ? 'text-red-500' : ''}`} />
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {user.monthlyPromptCount >= 100 && (
                <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded">
                  You've reached your monthly limit of 100 prompts. Limit resets next month.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}