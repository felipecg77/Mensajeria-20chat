import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Plus, Search, Crown, Globe, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { TamagotchiType } from "./TamagotchiSelection";

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

const MOCK_ROOMS: Room[] = [
  {
    id: "1",
    name: "Aventuras con Mametchi",
    hostName: "Ana García",
    petType: "Mametchi",
    petEmoji: "🐣",
    playerCount: 2,
    maxPlayers: 4,
    isPrivate: false,
  },
  {
    id: "2",
    name: "Dragones Mágicos",
    hostName: "Carlos López",
    petType: "Ryutchi",
    petEmoji: "🐲",
    playerCount: 1,
    maxPlayers: 3,
    isPrivate: false,
  },
  {
    id: "3",
    name: "Gatos Espaciales",
    hostName: "María Torres",
    petType: "Nyatchi",
    petEmoji: "🐱",
    playerCount: 3,
    maxPlayers: 4,
    isPrivate: false,
  },
  {
    id: "4",
    name: "Club Unicornio VIP",
    hostName: "Luis Rodríguez",
    petType: "Unitchi",
    petEmoji: "🦄",
    playerCount: 2,
    maxPlayers: 2,
    isPrivate: true,
    roomCode: "UNI123",
  },
];

export default function RoomSelection() {
  const [selectedTamagotchi, setSelectedTamagotchi] = useState<TamagotchiType | null>(null);
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const navigate = useNavigate();

  useEffect(() => {
    // Load selected Tamagotchi from localStorage
    const saved = localStorage.getItem("selectedTamagotchi");
    if (saved) {
      setSelectedTamagotchi(JSON.parse(saved));
    }

    // Generate random username if not set
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setUserName(savedName);
    } else {
      const randomNames = ["TamaFan", "PetLover", "VirtualPal", "DigitalFriend", "TamaCarer"];
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)] + Math.floor(Math.random() * 1000);
      setUserName(randomName);
      localStorage.setItem("userName", randomName);
    }
  }, []);

  const handleJoinRoom = (room: Room) => {
    // Store room info and navigate to multiplayer chat
    localStorage.setItem("currentRoom", JSON.stringify(room));
    localStorage.setItem("isHost", "false");
    navigate("/multiplayer");
  };

  const handleCreateRoom = () => {
    if (!newRoomName.trim() || !selectedTamagotchi) return;

    const newRoom: Room = {
      id: Date.now().toString(),
      name: newRoomName,
      hostName: userName,
      petType: selectedTamagotchi.name,
      petEmoji: selectedTamagotchi.emoji,
      playerCount: 1,
      maxPlayers: 4,
      isPrivate: false,
    };

    // Store room info and navigate to multiplayer chat
    localStorage.setItem("currentRoom", JSON.stringify(newRoom));
    localStorage.setItem("isHost", "true");
    navigate("/multiplayer");
  };

  const handleJoinWithCode = () => {
    if (!roomCode.trim()) return;
    
    // Find room by code
    const room = rooms.find(r => r.roomCode === roomCode.toUpperCase());
    if (room) {
      handleJoinRoom(room);
    } else {
      alert("Código de sala no válido");
    }
  };

  if (!selectedTamagotchi) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🤔</div>
          <h2 className="text-xl font-semibold mb-2">No has seleccionado un Tamagotchi</h2>
          <Link to="/pet-selection">
            <Button>Seleccionar Tamagotchi</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-primary text-primary-foreground p-4 border-b border-border">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <Link to="/pet-selection">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Salas Multijugador</h1>
              <p className="text-xs opacity-90">Conecta con otros usuarios</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* User Info */}
        <Card className="mb-4 bg-secondary/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="text-2xl">{selectedTamagotchi.emoji}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium">{userName}</h3>
                <p className="text-sm text-muted-foreground">
                  Con {selectedTamagotchi.name} {selectedTamagotchi.emoji}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const newName = prompt("Cambiar nombre de usuario:", userName);
                  if (newName) {
                    setUserName(newName);
                    localStorage.setItem("userName", newName);
                  }
                }}
              >
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Join with Code */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Unirse con Código
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Código de sala (ej: UNI123)"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button onClick={handleJoinWithCode} disabled={!roomCode.trim()}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create Room */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Crear Nueva Sala
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showCreateRoom ? (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowCreateRoom(true)}
              >
                Crear Sala
              </Button>
            ) : (
              <div className="space-y-3">
                <Input
                  placeholder="Nombre de la sala"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleCreateRoom} disabled={!newRoomName.trim()}>
                    Crear
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateRoom(false);
                      setNewRoomName("");
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Rooms */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Salas Públicas</h3>
            <Badge variant="secondary">{rooms.filter(r => !r.isPrivate).length}</Badge>
          </div>

          {rooms.filter(room => !room.isPrivate).map((room) => (
            <Card key={room.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-2xl">{room.petEmoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{room.name}</h4>
                        {room.playerCount === 1 && (
                          <Crown className="h-3 w-3 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Host: {room.hostName} • {room.petType}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {room.playerCount}/{room.maxPlayers} jugadores
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleJoinRoom(room)}
                    disabled={room.playerCount >= room.maxPlayers}
                  >
                    {room.playerCount >= room.maxPlayers ? "Llena" : "Unirse"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {rooms.filter(r => !r.isPrivate).length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🤷‍♀️</div>
            <p className="text-muted-foreground">No hay salas públicas disponibles</p>
            <p className="text-sm text-muted-foreground mt-1">¡Crea la primera!</p>
          </div>
        )}
      </div>
    </div>
  );
}
