import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Heart, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export type TamagotchiType = {
  id: string;
  name: string;
  emoji: string;
  personality: string;
  specialAbility: string;
  rarity: "common" | "rare" | "legendary";
  moods: {
    happy: string;
    hungry: string;
    sleepy: string;
    playful: string;
    sad: string;
  };
};

const TAMAGOTCHI_PETS: TamagotchiType[] = [
  {
    id: "classic",
    name: "Mametchi",
    emoji: "🐣",
    personality: "Amigable y curioso",
    specialAbility: "Aprende rápido nuevas palabras",
    rarity: "common",
    moods: { happy: "😊", hungry: "😋", sleepy: "😴", playful: "🤗", sad: "😢" }
  },
  {
    id: "cat",
    name: "Nyatchi",
    emoji: "🐱",
    personality: "Independiente y juguetón",
    specialAbility: "Detecta el estado de ánimo",
    rarity: "common",
    moods: { happy: "😸", hungry: "😿", sleepy: "😴", playful: "😺", sad: "🙀" }
  },
  {
    id: "dog",
    name: "Pochitchi",
    emoji: "🐶",
    personality: "Leal y energético",
    specialAbility: "Protege a sus amigos",
    rarity: "common",
    moods: { happy: "🐕", hungry: "🍖", sleepy: "😴", playful: "🎾", sad: "😔" }
  },
  {
    id: "dragon",
    name: "Ryutchi",
    emoji: "🐲",
    personality: "Sabio y misterioso",
    specialAbility: "Magia de curación",
    rarity: "rare",
    moods: { happy: "🐉", hungry: "🔥", sleepy: "💤", playful: "⚡", sad: "🌧️" }
  },
  {
    id: "angel",
    name: "Angelitchi",
    emoji: "👼",
    personality: "Puro y bondadoso",
    specialAbility: "Bendiciones de suerte",
    rarity: "rare",
    moods: { happy: "😇", hungry: "🤍", sleepy: "☁️", playful: "✨", sad: "💧" }
  },
  {
    id: "unicorn",
    name: "Unitchi",
    emoji: "🦄",
    personality: "Mágico y elegante",
    specialAbility: "Crea arcoíris de felicidad",
    rarity: "legendary",
    moods: { happy: "🌈", hungry: "🌸", sleepy: "🌙", playful: "⭐", sad: "🌧️" }
  },
  {
    id: "alien",
    name: "Spacetchi",
    emoji: "👽",
    personality: "Curioso del espacio",
    specialAbility: "Comunicación telepática",
    rarity: "legendary",
    moods: { happy: "🛸", hungry: "🌌", sleepy: "🌕", playful: "🚀", sad: "💫" }
  },
  {
    id: "robot",
    name: "Robotchi",
    emoji: "🤖",
    personality: "Lógico y eficiente",
    specialAbility: "Análisis de datos avanzado",
    rarity: "rare",
    moods: { happy: "🔋", hungry: "⚙️", sleepy: "🔌", playful: "💻", sad: "🔧" }
  }
];

export default function TamagotchiSelection() {
  const [selectedPet, setSelectedPet] = useState<TamagotchiType | null>(null);
  const navigate = useNavigate();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800 border-gray-300";
      case "rare": return "bg-blue-100 text-blue-800 border-blue-300";
      case "legendary": return "bg-purple-100 text-purple-800 border-purple-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "rare": return <Star className="h-3 w-3" />;
      case "legendary": return <Heart className="h-3 w-3" />;
      default: return null;
    }
  };

  const handleSelectPet = () => {
    if (selectedPet) {
      // Store selected pet in localStorage for now (in real app, this would be in shared state)
      localStorage.setItem("selectedTamagotchi", JSON.stringify(selectedPet));
      navigate("/room-selection");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-primary text-primary-foreground p-4 border-b border-border">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Elige tu Tamagotchi</h1>
              <p className="text-xs opacity-90">Selecciona tu compañero virtual</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Instructions */}
        <div className="mb-6 text-center">
          <div className="text-4xl mb-2">🎮</div>
          <h2 className="text-xl font-semibold mb-2">¡Elige tu Tamagotchi!</h2>
          <p className="text-muted-foreground text-sm">
            Cada Tamagotchi tiene una personalidad única y habilidades especiales. 
            Podrás cuidarlo junto con tus amigos.
          </p>
        </div>

        {/* Pet Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {TAMAGOTCHI_PETS.map((pet) => (
            <Card
              key={pet.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedPet?.id === pet.id
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedPet(pet)}
            >
              <CardHeader className="pb-2">
                <div className="text-center">
                  <div className="text-4xl mb-2">{pet.emoji}</div>
                  <CardTitle className="text-base">{pet.name}</CardTitle>
                  <Badge variant="outline" className={`text-xs ${getRarityColor(pet.rarity)}`}>
                    <div className="flex items-center gap-1">
                      {getRarityIcon(pet.rarity)}
                      {pet.rarity === "common" && "Común"}
                      {pet.rarity === "rare" && "Raro"}
                      {pet.rarity === "legendary" && "Legendario"}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs text-center">
                  {pet.personality}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Pet Details */}
        {selectedPet && (
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{selectedPet.emoji}</div>
                <div>
                  <CardTitle className="text-lg">{selectedPet.name}</CardTitle>
                  <CardDescription>{selectedPet.personality}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">Habilidad Especial:</h4>
                  <p className="text-sm text-muted-foreground">{selectedPet.specialAbility}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Estados de ánimo:</h4>
                  <div className="flex justify-around text-center">
                    <div>
                      <div className="text-lg">{selectedPet.moods.happy}</div>
                      <div className="text-xs text-muted-foreground">Feliz</div>
                    </div>
                    <div>
                      <div className="text-lg">{selectedPet.moods.playful}</div>
                      <div className="text-xs text-muted-foreground">Juguetón</div>
                    </div>
                    <div>
                      <div className="text-lg">{selectedPet.moods.hungry}</div>
                      <div className="text-xs text-muted-foreground">Hambriento</div>
                    </div>
                    <div>
                      <div className="text-lg">{selectedPet.moods.sleepy}</div>
                      <div className="text-xs text-muted-foreground">Cansado</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Continue Button */}
        <Button
          onClick={handleSelectPet}
          disabled={!selectedPet}
          className="w-full py-6 text-lg"
          size="lg"
        >
          <Users className="h-5 w-5 mr-2" />
          Continuar al Modo Multijugador
        </Button>

        <div className="mt-4 text-center">
          <Link to="/">
            <Button variant="outline" className="text-sm">
              Volver al modo individual
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
