import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/useMobile';
import { useToast } from '@/hooks/use-toast';
import { pipeline, env } from '@huggingface/transformers';

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
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const transcribeRef = useRef<any>(null);
  const { hapticFeedback } = useMobile();
  const { toast } = useToast();

  // Configure transformers.js
  env.allowLocalModels = false;
  env.useBrowserCache = true;

  const initializeTranscriber = useCallback(async () => {
    if (!transcribeRef.current) {
      try {
        const transcriber = await pipeline(
          'automatic-speech-recognition',
          'onnx-community/whisper-tiny-multilingual',
          { device: 'webgpu' }
        );
        transcribeRef.current = transcriber;
      } catch (error) {
        console.log('WebGPU not available, falling back to CPU');
        const transcriber = await pipeline(
          'automatic-speech-recognition',
          'onnx-community/whisper-tiny-multilingual'
        );
        transcribeRef.current = transcriber;
      }
    }
    return transcribeRef.current;
  }, []);

  const startListening = async () => {
    if (disabled || isListening || isLoading) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsListening(false);
        setIsLoading(true);
        
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const transcriber = await initializeTranscriber();
          
          const result = await transcriber(audioBlob);
          const transcript = result.text.trim();
          
          if (transcript) {
            onTranscription(transcript);
            hapticFeedback.success();
            toast({
              title: 'Transcripción completa',
              description: transcript,
            });
          } else {
            toast({
              title: 'No se detectó voz',
              description: 'Intenta hablar más claro',
              variant: 'destructive',
            });
          }
        } catch (error) {
          console.error('Transcription error:', error);
          hapticFeedback.error();
          toast({
            title: 'Error de transcripción',
            description: 'No se pudo procesar el audio',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };

      setIsListening(true);
      hapticFeedback.medium();
      mediaRecorderRef.current.start();
      
    } catch (error) {
      console.error('Microphone access error:', error);
      hapticFeedback.error();
      toast({
        title: 'Error de micrófono',
        description: 'No se pudo acceder al micrófono',
        variant: 'destructive',
      });
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      hapticFeedback.light();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant={isListening ? "destructive" : "outline"}
        size="sm"
        disabled={disabled || isLoading}
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
        {isLoading ? (
          <>
            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Procesando...
          </>
        ) : isListening ? (
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
      
      {(isListening || isLoading) && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-destructive rounded-full animate-ping" />
          <span className="text-sm text-muted-foreground">
            {isLoading ? 'Procesando...' : 'Escuchando...'}
          </span>
        </div>
      )}
    </div>
  );
}