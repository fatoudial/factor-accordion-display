
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, MessageSquare, Instagram } from 'lucide-react';

interface BookDesign {
  coverTitle: string;
  coverSubtitle: string;
  coverImage: string;
  coverColor: string;
  fontStyle: string;
  textColor: string;
  accentColor: string;
  useAIImages: boolean;
  pageLayout: string;
  networkSource?: string;
  bubbleColors?: {
    sender: string;
    receiver: string;
    background: string;
    text: string;
  };
}

interface StyleSelectorProps {
  design: BookDesign;
  onUpdate: (key: string, value: string | boolean | any) => void;
}

export const StyleSelector = ({ design, onUpdate }: StyleSelectorProps) => {
  const platforms = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      colors: {
        sender: '#E2FFC7',
        receiver: '#FFFFFF',
        background: '#E9EDEF',
        text: '#111B21'
      }
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      colors: {
        sender: '#8A33FD',
        receiver: '#F1F1F1',
        background: '#FFFFFF',
        text: '#000000'
      }
    },
    {
      id: 'facebook',
      name: 'Messenger',
      icon: MessageSquare,
      colors: {
        sender: '#0084FF',
        receiver: '#F1F0F0',
        background: '#FFFFFF',
        text: '#000000'
      }
    }
  ];

  const handlePlatformChange = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (platform) {
      onUpdate('networkSource', platformId);
      onUpdate('bubbleColors', platform.colors);
    }
  };

  const currentPlatform = platforms.find(p => p.id === design.networkSource) || platforms[0];

  const renderConversationPreview = () => {
    const colors = design.bubbleColors || currentPlatform.colors;
    
    const messages = [
      { text: "Salut ! Comment ça va ?", sender: false },
      { text: "Ça va super bien ! Et toi ?", sender: true },
      { text: "Très bien aussi 😊", sender: false },
      { text: "On se voit ce weekend ?", sender: true },
      { text: "Oui avec plaisir !", sender: false }
    ];

    return (
      <div 
        className="p-4 rounded-lg max-w-sm"
        style={{ backgroundColor: colors.background }}
      >
        <div className="space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] px-3 py-2 text-sm ${
                  design.networkSource === 'whatsapp' 
                    ? msg.sender 
                      ? 'rounded-lg rounded-br-sm' 
                      : 'rounded-lg rounded-bl-sm'
                    : 'rounded-2xl'
                }`}
                style={{
                  backgroundColor: msg.sender ? colors.sender : colors.receiver,
                  color: msg.sender && design.networkSource === 'instagram' ? 'white' : colors.text
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Sélection de plateforme */}
      <div className="space-y-6">
        <div>
          <Label className="text-lg mb-4 block">Choisissez votre plateforme</Label>
          <RadioGroup
            value={design.networkSource || 'whatsapp'}
            onValueChange={handlePlatformChange}
            className="space-y-3"
          >
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <div 
                  key={platform.id} 
                  className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handlePlatformChange(platform.id)}
                >
                  <RadioGroupItem value={platform.id} id={`platform-${platform.id}`} />
                  <div className="flex items-center gap-3 flex-1">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ 
                        backgroundColor: platform.id === 'whatsapp' ? '#25D366' : 
                                       platform.id === 'instagram' ? '#E4405F' : '#0084FF' 
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <Label htmlFor={`platform-${platform.id}`} className="font-medium text-base cursor-pointer">
                        {platform.name}
                      </Label>
                      <p className="text-sm text-gray-500">
                        Style de bulle {platform.name}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        <div className="pt-4 border-t">
          <div className="space-y-4">
            <Label className="text-lg block">Couleurs personnalisées (optionnel)</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm mb-2 block">Mes messages</Label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={design.bubbleColors?.sender || currentPlatform.colors.sender}
                    onChange={(e) => onUpdate('bubbleColors', {
                      ...design.bubbleColors,
                      sender: e.target.value
                    })}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">
                    {design.bubbleColors?.sender || currentPlatform.colors.sender}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm mb-2 block">Leurs messages</Label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={design.bubbleColors?.receiver || currentPlatform.colors.receiver}
                    onChange={(e) => onUpdate('bubbleColors', {
                      ...design.bubbleColors,
                      receiver: e.target.value
                    })}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">
                    {design.bubbleColors?.receiver || currentPlatform.colors.receiver}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aperçu de la conversation */}
      <div className="space-y-4">
        <Label className="text-lg block">Aperçu de la conversation</Label>
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h3 className="font-medium text-gray-800 mb-1">
                Conversation {currentPlatform.name}
              </h3>
              <p className="text-sm text-gray-500">
                Voici à quoi ressembleront vos messages
              </p>
            </div>
            
            <div className="flex justify-center">
              {renderConversationPreview()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
