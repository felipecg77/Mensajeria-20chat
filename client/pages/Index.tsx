import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Utensils, Gamepad2, Send, MoreVertical, Phone, Video, Users, Settings, User, Info, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Message = {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
};

type PetMood = "happy" | "hungry" | "sleepy" | "playful" | "sad";

type PetStats = {
  happiness: number;
  hunger: number;
  energy: number;
  health: number;
};

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Soy tu TamaChatBot 🐣 ¿Cómo estás hoy?",
      timestamp: new Date(),
      isUser: false,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [petMood, setPetMood] = useState<PetMood>("happy");
  const [petStats, setPetStats] = useState<PetStats>({
    happiness: 85,
    hunger: 65,
    energy: 75,
    health: 90,
  });
  const [lastInteraction, setLastInteraction] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showPetInfo, setShowPetInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if dark mode is enabled
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    // Check sound preference
    const savedSound = localStorage.getItem("soundEnabled");
    if (savedSound === "false") {
      setIsSoundEnabled(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeDiff = now.getTime() - lastInteraction.getTime();
      const hoursSinceInteraction = timeDiff / (1000 * 60 * 60);

      if (hoursSinceInteraction > 0.5) {
        setPetStats(prev => ({
          ...prev,
          hunger: Math.max(0, prev.hunger - 2),
          energy: Math.max(0, prev.energy - 1),
          happiness: Math.max(0, prev.happiness - 1),
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
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setLastInteraction(new Date());

    // Auto-response from pet
    setTimeout(() => {
      const responses = [
        "¡Me encanta hablar contigo! 💕",
        "¿Quieres jugar conmigo? 🎮",
        "Tengo un poco de hambre... 🍎",
        "¡Eres el mejor cuidador! ⭐",
        "Cuéntame más sobre tu día 😊",
        "¿Me das un abrazo virtual? 🤗",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const petResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        timestamp: new Date(),
        isUser: false,
      };

      setMessages(prev => [...prev, petResponse]);
    }, 1000 + Math.random() * 2000);
  };

  const feedPet = () => {
    setPetStats(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 20),
      happiness: Math.min(100, prev.happiness + 10),
    }));
    setLastInteraction(new Date());

    const feedMessage: Message = {
      id: Date.now().toString(),
      text: "¡Mmm, delicioso! ¡Gracias por alimentarme! 🍎✨",
      timestamp: new Date(),
      isUser: false,
    };
    setMessages(prev => [...prev, feedMessage]);
  };

  const playWithPet = () => {
    setPetStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
      energy: Math.max(0, prev.energy - 10),
    }));
    setLastInteraction(new Date());

    const playMessage: Message = {
      id: Date.now().toString(),
      text: "¡Que divertido! ¡Me encanta jugar contigo! 🎮🎉",
      timestamp: new Date(),
      isUser: false,
    };
    setMessages(prev => [...prev, playMessage]);
  };

  const giveLove = () => {
    setPetStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 20),
      health: Math.min(100, prev.health + 5),
    }));
    setLastInteraction(new Date());

    const loveMessage: Message = {
      id: Date.now().toString(),
      text: "¡Aww! ¡Me siento muy querido! ¡Te amo! 💖✨",
      timestamp: new Date(),
      isUser: false,
    };
    setMessages(prev => [...prev, loveMessage]);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleSound = () => {
    const newSoundState = !isSoundEnabled;
    setIsSoundEnabled(newSoundState);
    localStorage.setItem("soundEnabled", newSoundState.toString());
  };

  const handleShowProfile = () => {
    alert("Perfil: TamaChatBot v1.0\nDesarrollado con ❤️ para cuidar mascotas virtuales");
  };

  const handleShowInfo = () => {
    setShowPetInfo(!showPetInfo);
  };

  const getPetEmoji = () => {
    switch (petMood) {
      case "happy": return "😊";
      case "hungry": return "😋";
      case "sleepy": return "😴";
      case "playful": return "🤗";
      case "sad": return "😢";
      default: return "🐣";
    }
  };

  const getStatColor = (value: number) => {
    if (value > 70) return "bg-tama-500";
    if (value > 40) return "bg-chat-500";
    return "bg-destructive";
  };

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto border-x border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground border-b border-border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt="TamaChatBot" />
            <AvatarFallback className="text-2xl">{getPetEmoji()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-lg">TamaChatBot</h1>
            <p className="text-xs opacity-90 capitalize">{petMood}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/20">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/20">
            <Phone className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/20">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Opciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleShowProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShowInfo}>
                <Info className="mr-2 h-4 w-4" />
                <span>Info de Mascota</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleDarkMode}>
                {isDarkMode ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                <span>{isDarkMode ? "Modo Claro" : "Modo Oscuro"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleSound}>
                {isSoundEnabled ? (
                  <VolumeX className="mr-2 h-4 w-4" />
                ) : (
                  <Volume2 className="mr-2 h-4 w-4" />
                )}
                <span>{isSoundEnabled ? "Silenciar" : "Activar Sonido"}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Pet Info Modal */}
      {showPetInfo && (
        <div className="p-3 bg-accent/10 border-b border-accent/20">
          <div className="text-center mb-2">
            <h3 className="font-semibold text-sm">Información de tu TamaChatBot</h3>
          </div>
          <div className="text-xs space-y-1 text-muted-foreground">
            <p><strong>Nombre:</strong> TamaChatBot</p>
            <p><strong>Edad:</strong> {Math.floor(Math.random() * 10) + 1} días</p>
            <p><strong>Personalidad:</strong> Amigable y juguetón</p>
            <p><strong>Comida favorita:</strong> Manzanas 🍎</p>
            <p><strong>Actividad favorita:</strong> Chatear contigo</p>
            <p><strong>Estado actual:</strong> {petMood === "happy" ? "Feliz" : petMood === "hungry" ? "Hambriento" : petMood === "sleepy" ? "Cansado" : petMood === "playful" ? "Juguetón" : "Triste"}</p>
          </div>
          <div className="text-center mt-2">
            <Button variant="outline" size="sm" onClick={() => setShowPetInfo(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      )}

      {/* Pet Stats */}
      <div className="p-3 bg-secondary/50 border-b border-border">
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
                message.isUser
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border rounded-bl-md"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.isUser ? "text-primary-foreground/70" : "text-muted-foreground"
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
            onClick={giveLove}
            className="flex items-center space-x-1 bg-red-50 hover:bg-red-100 border-red-200"
          >
            <Heart className="h-4 w-4 text-red-500" />
            <span>Amor</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={feedPet}
            className="flex items-center space-x-1 bg-orange-50 hover:bg-orange-100 border-orange-200"
          >
            <Utensils className="h-4 w-4 text-orange-500" />
            <span>Comida</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={playWithPet}
            className="flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 border-blue-200"
          >
            <Gamepad2 className="h-4 w-4 text-blue-500" />
            <span>Jugar</span>
          </Button>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex items-center space-x-2 mb-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
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

        {/* Multiplayer Button */}
        <div className="text-center">
          <Link to="/pet-selection">
            <Button variant="outline" className="w-full">
              <Users className="h-4 w-4 mr-2" />
              ¡Jugar con Amigos!
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
