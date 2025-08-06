import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Utensils, Gamepad2, Send, ArrowLeft, Users, Crown, Copy, Share } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { TamagotchiType } from "./TamagotchiSelection";

type Message = {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
  userName?: string;
  isPetMessage?: boolean;
  actionType?: "feed" | "play" | "love";
};

type PetMood = "happy" | "hungry" | "sleepy" | "playful" | "sad";

type PetStats = {
  happiness: number;
  hunger: number;
  energy: number;
  health: number;
};

type Room = {
  id: string;
  name: string;
  hostName: string;
  petType: string;
  petEmoji: string;
  playerCount: number;
  maxPlayers: number;
  isPrivate: boolean;
  roomCode?: string;
};

type ConnectedUser = {
  id: string;
  name: string;
  isHost: boolean;
  lastSeen: Date;
};

export default function MultiplayerChat() {
  const navigate = useNavigate();
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [selectedTamagotchi, setSelectedTamagotchi] = useState<TamagotchiType | null>(null);
  const [userName, setUserName] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [petMood, setPetMood] = useState<PetMood>("happy");
  const [petStats, setPetStats] = useState<PetStats>({
    happiness: 85,
    hunger: 65,
    energy: 75,
    health: 90,
  });
  const [lastInteraction, setLastInteraction] = useState(new Date());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load data from localStorage
    const savedRoom = localStorage.getItem("currentRoom");
    const savedTamagotchi = localStorage.getItem("selectedTamagotchi");
    const savedUserName = localStorage.getItem("userName");
    const savedIsHost = localStorage.getItem("isHost");

    if (savedRoom) setCurrentRoom(JSON.parse(savedRoom));
    if (savedTamagotchi) setSelectedTamagotchi(JSON.parse(savedTamagotchi));
    if (savedUserName) setUserName(savedUserName);
    if (savedIsHost) setIsHost(savedIsHost === "true");

    // Mock connected users
    const mockUsers: ConnectedUser[] = [
      { id: "1", name: savedUserName || "Tú", isHost: savedIsHost === "true", lastSeen: new Date() },
    ];

    if (savedRoom) {
      const room = JSON.parse(savedRoom);
      if (room.playerCount > 1) {
        mockUsers.push(
          { id: "2", name: room.hostName, isHost: true, lastSeen: new Date() }
        );
      }
    }

    setConnectedUsers(mockUsers);

    // Welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      text: `¡Bienvenido a la sala! Ahora puedes cuidar tu Tamagotchi junto con otros usuarios. 🎉`,
      timestamp: new Date(),
      isUser: false,
      isPetMessage: true,
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    // Pet stats degradation and mood updates
    const interval = setInterval(() => {
      const now = new Date();
      const timeDiff = now.getTime() - lastInteraction.getTime();
      const hoursSinceInteraction = timeDiff / (1000 * 60 * 60);

      if (hoursSinceInteraction > 0.5) {
        setPetStats(prev => ({
          ...prev,
          hunger: Math.max(0, prev.hunger - 1),
          energy: Math.max(0, prev.energy - 0.5),
          happiness: Math.max(0, prev.happiness - 0.5),
        }));
      }

      // Update mood based on stats
      const avgMood = (petStats.happiness + petStats.energy) / 2;
      if (petStats.hunger < 30) {
        setPetMood("hungry");
      } else if (avgMood > 80) {
        setPetMood("happy");
      } else if (petStats.energy < 30) {
        setPetMood("sleepy");
      } else if (avgMood < 40) {
        setPetMood("sad");
      } else {
        setPetMood("playful");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [lastInteraction, petStats]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      timestamp: new Date(),
      isUser: true,
      userName: userName,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setLastInteraction(new Date());

    // Auto-response from pet (simulating shared experience)
    setTimeout(() => {
      const responses = [
        "¡Me encanta cuando todos hablan conmigo! 💕",
        "¿Todos quieren jugar juntos? 🎮",
        "¡Somos una gran familia! 👨‍👩‍👧‍👦",
        "¡Gracias por cuidarme entre todos! ⭐",
        "¡Es más divertido con amigos! 🎉",
        "¿Alguien quiere darme un abrazo grupal? 🤗",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const petResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        timestamp: new Date(),
        isUser: false,
        isPetMessage: true,
      };

      setMessages(prev => [...prev, petResponse]);
    }, 1000 + Math.random() * 2000);
  };

  const handlePetAction = (action: "feed" | "play" | "love") => {
    let statUpdate = {};
    let actionMessage = "";

    switch (action) {
      case "feed":
        statUpdate = {
          hunger: Math.min(100, petStats.hunger + 20),
          happiness: Math.min(100, petStats.happiness + 10),
        };
        actionMessage = `¡${userName} me alimentó! ¡Mmm, delicioso! 🍎✨`;
        break;
      case "play":
        statUpdate = {
          happiness: Math.min(100, petStats.happiness + 15),
          energy: Math.max(0, petStats.energy - 10),
        };
        actionMessage = `¡${userName} jugó conmigo! ¡Que divertido! 🎮🎉`;
        break;
      case "love":
        statUpdate = {
          happiness: Math.min(100, petStats.happiness + 20),
          health: Math.min(100, petStats.health + 5),
        };
        actionMessage = `¡${userName} me dio amor! ¡Me siento muy querido! 💖✨`;
        break;
    }

    setPetStats(prev => ({ ...prev, ...statUpdate }));
    setLastInteraction(new Date());

    const actionPetMessage: Message = {
      id: Date.now().toString(),
      text: actionMessage,
      timestamp: new Date(),
      isUser: false,
      isPetMessage: true,
      actionType: action,
    };
    setMessages(prev => [...prev, actionPetMessage]);
  };

  const getPetEmoji = () => {
    if (!selectedTamagotchi) return "🐣";
    
    switch (petMood) {
      case "happy": return selectedTamagotchi.moods.happy;
      case "hungry": return selectedTamagotchi.moods.hungry;
      case "sleepy": return selectedTamagotchi.moods.sleepy;
      case "playful": return selectedTamagotchi.moods.playful;
      case "sad": return selectedTamagotchi.moods.sad;
      default: return selectedTamagotchi.emoji;
    }
  };

  const getStatColor = (value: number) => {
    if (value > 70) return "bg-tama-500";
    if (value > 40) return "bg-chat-500";
    return "bg-destructive";
  };

  const handleShareRoom = () => {
    if (currentRoom?.roomCode) {
      navigator.clipboard.writeText(currentRoom.roomCode);
      alert(`Código copiado: ${currentRoom.roomCode}`);
    }
  };

  if (!currentRoom || !selectedTamagotchi) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🤔</div>
          <h2 className="text-xl font-semibold mb-2">Error de configuración</h2>
          <Link to="/pet-selection">
            <Button>Volver a empezar</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto border-x border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground border-b border-border">
        <div className="flex items-center space-x-3">
          <Link to="/room-selection">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-2xl">{getPetEmoji()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-lg">{currentRoom.name}</h1>
            <p className="text-xs opacity-90 capitalize flex items-center gap-1">
              <Users className="h-3 w-3" />
              {connectedUsers.length} jugadores • {petMood}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {currentRoom.roomCode && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary/20"
              onClick={handleShareRoom}
            >
              <Share className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Connected Users */}
      <div className="p-3 bg-secondary/30 border-b border-border">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs font-medium text-muted-foreground">Usuarios conectados:</span>
        </div>
        <div className="flex space-x-2">
          {connectedUsers.map((user) => (
            <div key={user.id} className="flex items-center space-x-1">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{user.name}</span>
              {user.isHost && <Crown className="h-3 w-3 text-yellow-500" />}
            </div>
          ))}
        </div>
      </div>

      {/* Pet Stats */}
      <div className="p-3 bg-secondary/50 border-b border-border">
        <div className="text-center mb-2">
          <div className="text-4xl mb-1">{getPetEmoji()}</div>
          <div className="text-sm font-medium">{selectedTamagotchi.name}</div>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <div className="text-red-500 mb-1">❤️</div>
            <div className={`h-2 rounded-full ${getStatColor(petStats.health)}`} 
                 style={{ width: `${petStats.health}%` }}></div>
            <span className="text-muted-foreground">{petStats.health}%</span>
          </div>
          <div className="text-center">
            <div className="text-yellow-500 mb-1">😊</div>
            <div className={`h-2 rounded-full ${getStatColor(petStats.happiness)}`} 
                 style={{ width: `${petStats.happiness}%` }}></div>
            <span className="text-muted-foreground">{petStats.happiness}%</span>
          </div>
          <div className="text-center">
            <div className="text-orange-500 mb-1">🍎</div>
            <div className={`h-2 rounded-full ${getStatColor(petStats.hunger)}`} 
                 style={{ width: `${petStats.hunger}%` }}></div>
            <span className="text-muted-foreground">{petStats.hunger}%</span>
          </div>
          <div className="text-center">
            <div className="text-blue-500 mb-1">⚡</div>
            <div className={`h-2 rounded-full ${getStatColor(petStats.energy)}`} 
                 style={{ width: `${petStats.energy}%` }}></div>
            <span className="text-muted-foreground">{petStats.energy}%</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.isPetMessage
                  ? "bg-accent text-accent-foreground rounded-bl-md border border-accent/50"
                  : message.isUser
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border rounded-bl-md"
              }`}
            >
              {message.userName && !message.isPetMessage && (
                <p className="text-xs font-medium mb-1 opacity-70">{message.userName}</p>
              )}
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.isPetMessage
                  ? "text-accent-foreground/70"
                  : message.isUser 
                  ? "text-primary-foreground/70" 
                  : "text-muted-foreground"
              }`}>
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Action Buttons */}
      <div className="p-3 border-t border-border bg-secondary/30">
        <div className="flex justify-center space-x-4 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePetAction("love")}
            className="flex items-center space-x-1 bg-red-50 hover:bg-red-100 border-red-200"
          >
            <Heart className="h-4 w-4 text-red-500" />
            <span>Amor</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePetAction("feed")}
            className="flex items-center space-x-1 bg-orange-50 hover:bg-orange-100 border-orange-200"
          >
            <Utensils className="h-4 w-4 text-orange-500" />
            <span>Comida</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePetAction("play")}
            className="flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 border-blue-200"
          >
            <Gamepad2 className="h-4 w-4 text-blue-500" />
            <span>Jugar</span>
          </Button>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex items-center space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Mensaje al grupo..."
            className="flex-1 rounded-full border-border"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="rounded-full"
            disabled={!inputMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
