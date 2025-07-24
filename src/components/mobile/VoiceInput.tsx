import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/useMobile';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  language?: string;
}

export function VoiceInput({ 
  onTranscription, 
  placeholder = "Mantén presionado para hablar",
  disabled = false,
  language = 'es-ES'
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const { hapticFeedback } = useMobile();
  const { toast } = useToast();

  // Check if speech recognition is supported
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const startListening = () => {
    if (!SpeechRecognition) {
      setIsSupported(false);
      toast({
        title: 'No soportado',
        description: 'Tu navegador no soporta reconocimiento de voz',
        variant: 'destructive',
      });
      return;
    }

    if (disabled || isListening) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      hapticFeedback.medium();
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscription(transcript);
      hapticFeedback.success();
      toast({
        title: 'Transcripción completa',
        description: transcript,
      });
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      hapticFeedback.error();
      
      let errorMessage = 'Error en el reconocimiento de voz';
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No se detectó voz. Intenta de nuevo.';
          break;
        case 'audio-capture':
          errorMessage = 'No se pudo acceder al micrófono';
          break;
        case 'not-allowed':
          errorMessage = 'Permiso de micrófono denegado';
          break;
        case 'network':
          errorMessage = 'Error de conexión de red';
          break;
      }
      
      toast({
        title: 'Error de voz',
        description: errorMessage,
        variant: 'destructive',
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      hapticFeedback.light();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant={isListening ? "destructive" : "outline"}
        size="sm"
        disabled={disabled}
        onMouseDown={startListening}
        onMouseUp={stopListening}
        onMouseLeave={stopListening}
        onTouchStart={startListening}
        onTouchEnd={stopListening}
        className={cn(
          "transition-all duration-200 touch-target",
          isListening && "animate-pulse"
        )}
      >
        {isListening ? (
          <>
            <Square className="w-4 h-4 mr-2" />
            Grabando...
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 mr-2" />
            Voz
          </>
        )}
      </Button>
      
      {isListening && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-destructive rounded-full animate-ping" />
          <span className="text-sm text-muted-foreground">Escuchando...</span>
        </div>
      )}
    </div>
  );
}