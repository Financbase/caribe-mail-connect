import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Phone, 
  Video, 
  MoreHorizontal, 
  Search,
  Bell,
  Star,
  User,
  Package,
  Clock,
  Check,
  CheckCheck,
  Image,
  FileText,
  Mic,
  Smile
} from 'lucide-react';

interface Message {
  id: string;
  type: 'text' | 'image' | 'file' | 'system';
  content: string;
  timestamp: Date;
  sender: 'customer' | 'staff' | 'system';
  senderName: string;
  status?: 'sent' | 'delivered' | 'read';
  metadata?: {
    packageId?: string;
    fileUrl?: string;
    imageUrl?: string;
  };
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  lastSeen: Date;
  isOnline: boolean;
  language: 'es' | 'en';
  vip: boolean;
  packages: number;
}

interface MessagingCenterProps {
  language?: 'es' | 'en';
  currentUser: string;
  customers: Customer[];
  onSendMessage?: (customerId: string, message: string) => void;
  onSendFile?: (customerId: string, file: File) => void;
}

const translations = {
  es: {
    title: "Centro de Mensajería",
    searchPlaceholder: "Buscar conversaciones...",
    typeMessage: "Escribir mensaje...",
    send: "Enviar",
    online: "En línea",
    lastSeen: "Visto por última vez",
    vipCustomer: "Cliente VIP",
    packages: "paquetes",
    today: "Hoy",
    yesterday: "Ayer",
    delivered: "Entregado",
    read: "Leído",
    sent: "Enviado",
    attachFile: "Adjuntar archivo",
    callCustomer: "Llamar cliente",
    videoCall: "Videollamada",
    customerInfo: "Info del cliente",
    quickReplies: {
      packageReady: "Su paquete está listo para recoger",
      packageArrived: "Su paquete ha llegado",
      thankYou: "Gracias por contactarnos",
      willHelp: "Estaremos encantados de ayudarle"
    },
    systemMessages: {
      packageDelivered: "Paquete entregado exitosamente",
      customerJoined: "Cliente se conectó",
      fileShared: "Archivo compartido"
    }
  },
  en: {
    title: "Messaging Center",
    searchPlaceholder: "Search conversations...",
    typeMessage: "Type a message...",
    send: "Send",
    online: "Online",
    lastSeen: "Last seen",
    vipCustomer: "VIP Customer",
    packages: "packages",
    today: "Today",
    yesterday: "Yesterday",
    delivered: "Delivered",
    read: "Read",
    sent: "Sent",
    attachFile: "Attach file",
    callCustomer: "Call customer",
    videoCall: "Video call",
    customerInfo: "Customer info",
    quickReplies: {
      packageReady: "Your package is ready for pickup",
      packageArrived: "Your package has arrived",
      thankYou: "Thank you for contacting us",
      willHelp: "We'll be happy to help you"
    },
    systemMessages: {
      packageDelivered: "Package delivered successfully",
      customerJoined: "Customer joined",
      fileShared: "File shared"
    }
  }
};

const mockMessages: Message[] = [
  {
    id: '1',
    type: 'text',
    content: '¡Hola! ¿Ha llegado mi paquete CMC-2024-001?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    sender: 'customer',
    senderName: 'María González',
    status: 'read'
  },
  {
    id: '2',
    type: 'text',
    content: 'Sí, María. Su paquete llegó esta mañana y está listo para recoger.',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    sender: 'staff',
    senderName: 'Carlos Rivera',
    status: 'read'
  },
  {
    id: '3',
    type: 'system',
    content: 'Paquete CMC-2024-001 marcado como entregado',
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    sender: 'system',
    senderName: 'Sistema PRMCMS'
  }
];

export function PRMCMSMessagingCenter({
  language = 'es',
  currentUser = 'Carlos Rivera',
  customers,
  onSendMessage,
  onSendFile
}: MessagingCenterProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString(language === 'es' ? 'es-PR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 48) {
      return t.yesterday;
    } else {
      return date.toLocaleDateString(language === 'es' ? 'es-PR' : 'en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedCustomer) return;

    const message: Message = {
      id: Date.now().toString(),
      type: 'text',
      content: newMessage,
      timestamp: new Date(),
      sender: 'staff',
      senderName: currentUser,
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    onSendMessage?.(selectedCustomer.id, newMessage);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedCustomer) return;

    const message: Message = {
      id: Date.now().toString(),
      type: 'file',
      content: `${t.systemMessages.fileShared}: ${file.name}`,
      timestamp: new Date(),
      sender: 'staff',
      senderName: currentUser,
      status: 'sent',
      metadata: {
        fileUrl: URL.createObjectURL(file)
      }
    };

    setMessages(prev => [...prev, message]);
    onSendFile?.(selectedCustomer.id, file);
  };

  const handleQuickReply = (reply: string) => {
    setNewMessage(reply);
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Customer List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-ocean-50 to-orange-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t.title}</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
            />
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              onClick={() => setSelectedCustomer(customer)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedCustomer?.id === customer.id ? 'bg-ocean-50 border-ocean-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-ocean-400 to-orange-400 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  {customer.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                  {customer.vip && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                      <Star className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {customer.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(customer.lastSeen)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 flex items-center mt-1">
                    <Package className="w-3 h-3 mr-1" />
                    {customer.packages} {t.packages}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {customer.isOnline ? t.online : `${t.lastSeen} ${formatTime(customer.lastSeen)}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedCustomer ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-ocean-400 to-orange-400 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                {selectedCustomer.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center">
                  {selectedCustomer.name}
                  {selectedCustomer.vip && (
                    <Star className="w-4 h-4 text-orange-500 ml-2" />
                  )}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedCustomer.isOnline ? t.online : `${t.lastSeen} ${formatTime(selectedCustomer.lastSeen)}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title={t.callCustomer}
              >
                <Phone className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title={t.videoCall}
              >
                <Video className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title={t.customerInfo}
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'staff' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'system'
                      ? 'bg-gray-200 text-gray-700 text-center text-sm mx-auto'
                      : message.sender === 'staff'
                      ? 'bg-gradient-to-r from-ocean-500 to-orange-500 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  {message.sender !== 'system' && (
                    <div className="text-xs opacity-75 mb-1">
                      {message.senderName}
                    </div>
                  )}
                  <div>{message.content}</div>
                  <div className={`flex items-center justify-between mt-1 text-xs ${
                    message.sender === 'staff' ? 'text-white opacity-75' : 'text-gray-500'
                  }`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {message.sender === 'staff' && getStatusIcon(message.status)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex space-x-2 mb-3 overflow-x-auto">
              {Object.entries(t.quickReplies).map(([key, reply]) => (
                <button
                  key={key}
                  onClick={() => handleQuickReply(reply)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap hover:bg-gray-200 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title={t.attachFile}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t.typeMessage}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                  <Smile className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-gradient-to-r from-ocean-600 to-orange-600 text-white rounded-lg hover:from-ocean-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === 'es' ? 'Selecciona una conversación' : 'Select a conversation'}
            </h3>
            <p className="text-gray-600">
              {language === 'es' 
                ? 'Elige un cliente para comenzar a chatear' 
                : 'Choose a customer to start chatting'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PRMCMSMessagingCenter;
