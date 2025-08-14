import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Fingerprint, 
  Eye, 
  Smartphone, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Plus,
  Trash2 
} from 'lucide-react';
import { toast } from 'sonner';

interface BiometricDevice {
  id: string;
  userId: string;
  deviceType: 'fingerprint' | 'face' | 'voice' | 'touch_id' | 'face_id';
  deviceName: string;
  registeredAt: string;
  lastUsed: string;
  isActive: boolean;
  trustScore: number;
}

interface BiometricSettings {
  enabled: boolean;
  allowFingerprint: boolean;
  allowFaceId: boolean;
  allowTouchId: boolean;
  requireFallback: boolean;
  maxDevices: number;
  trustThreshold: number;
}

export function BiometricAuthManager() {
  const [settings, setSettings] = useState<BiometricSettings>({
    enabled: true,
    allowFingerprint: true,
    allowFaceId: true,
    allowTouchId: true,
    requireFallback: true,
    maxDevices: 3,
    trustThreshold: 85,
  });

  const [devices, setDevices] = useState<BiometricDevice[]>([
    {
      id: '1',
      userId: 'user1',
      deviceType: 'touch_id',
      deviceName: 'iPhone 14 Pro',
      registeredAt: '2024-01-15T10:30:00Z',
      lastUsed: '2024-01-25T08:15:00Z',
      isActive: true,
      trustScore: 95,
    },
    {
      id: '2',
      userId: 'user1',
      deviceType: 'fingerprint',
      deviceName: 'Samsung Galaxy S23',
      registeredAt: '2024-01-10T14:20:00Z',
      lastUsed: '2024-01-24T16:45:00Z',
      isActive: true,
      trustScore: 88,
    },
  ]);

  const [supportedMethods, setSupportedMethods] = useState<string[]>([]);

  useEffect(() => {
    checkBiometricSupport();
  }, [checkBiometricSupport]);

  const checkBiometricSupport = async () => {
    const supported = [];
    
    // Check for Web Authentication API support
    if (window.navigator && 'credentials' in navigator) {
      supported.push('webauthn');
    }

    // Check for Touch ID / Face ID (iOS Safari)
    if (window.navigator.userAgent.includes('Safari') && 
        window.navigator.userAgent.includes('Mobile')) {
      supported.push('touch_id', 'face_id');
    }

    // Check for Android biometrics
    if (window.navigator.userAgent.includes('Android')) {
      supported.push('fingerprint');
    }

    setSupportedMethods(supported);
  };

  const updateSettings = (field: keyof BiometricSettings, value: unknown) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const saveSettings = async () => {
    try {
      // Implementation would save to database
      toast.success('Configuración biométrica actualizada');
    } catch (error) {
      toast.error('Error al actualizar configuración');
    }
  };

  const registerNewDevice = async () => {
    try {
      if (!window.navigator.credentials) {
        toast.error('Autenticación biométrica no soportada en este navegador');
        return;
      }

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: { name: 'PRMCMS' },
          user: {
            id: new Uint8Array(16),
            name: 'user@example.com',
            displayName: 'Usuario',
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
        },
      } as CredentialCreationOptions);

      if (credential) {
        const newDevice: BiometricDevice = {
          id: Math.random().toString(36).substr(2, 9),
          userId: 'current-user',
          deviceType: 'fingerprint',
          deviceName: navigator.userAgent.includes('iPhone') ? 'iPhone' : 'Dispositivo',
          registeredAt: new Date().toISOString(),
          lastUsed: new Date().toISOString(),
          isActive: true,
          trustScore: 90,
        };

        setDevices(prev => [...prev, newDevice]);
        toast.success('Dispositivo biométrico registrado exitosamente');
      }
    } catch (error) {
      toast.error('Error al registrar dispositivo biométrico');
    }
  };

  const removeDevice = async (deviceId: string) => {
    try {
      setDevices(prev => prev.filter(d => d.id !== deviceId));
      toast.success('Dispositivo removido exitosamente');
    } catch (error) {
      toast.error('Error al remover dispositivo');
    }
  };

  const toggleDevice = async (deviceId: string) => {
    try {
      setDevices(prev => 
        prev.map(d => 
          d.id === deviceId ? { ...d, isActive: !d.isActive } : d
        )
      );
      toast.success('Estado del dispositivo actualizado');
    } catch (error) {
      toast.error('Error al actualizar dispositivo');
    }
  };

  const getDeviceIcon = (type: BiometricDevice['deviceType']) => {
    switch (type) {
      case 'fingerprint':
        return <Fingerprint className="h-4 w-4" />;
      case 'face':
      case 'face_id':
        return <Eye className="h-4 w-4" />;
      case 'touch_id':
        return <Fingerprint className="h-4 w-4" />;
      default:
        return <Smartphone className="h-4 w-4" />;
    }
  };

  const getTrustBadge = (score: number) => {
    if (score >= 90) return <Badge variant="default" className="bg-green-100 text-green-800">Alta</Badge>;
    if (score >= 70) return <Badge variant="secondary">Media</Badge>;
    return <Badge variant="destructive">Baja</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Configuración de Autenticación Biométrica
          </CardTitle>
          <CardDescription>
            Gestionar métodos de autenticación biométrica para mayor seguridad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label>Autenticación Biométrica Habilitada</Label>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSettings('enabled', checked)}
            />
          </div>

          {settings.enabled && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Permitir Huella Dactilar</Label>
                    <Switch
                      checked={settings.allowFingerprint}
                      onCheckedChange={(checked) => updateSettings('allowFingerprint', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Permitir Face ID</Label>
                    <Switch
                      checked={settings.allowFaceId}
                      onCheckedChange={(checked) => updateSettings('allowFaceId', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Permitir Touch ID</Label>
                    <Switch
                      checked={settings.allowTouchId}
                      onCheckedChange={(checked) => updateSettings('allowTouchId', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Requerir Método de Respaldo</Label>
                    <Switch
                      checked={settings.requireFallback}
                      onCheckedChange={(checked) => updateSettings('requireFallback', checked)}
                    />
                  </div>

                  <div>
                    <Label>Umbral de Confianza Mínimo: {settings.trustThreshold}%</Label>
                    <input
                      type="range"
                      min="60"
                      max="99"
                      value={settings.trustThreshold}
                      onChange={(e) => updateSettings('trustThreshold', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Métodos Soportados</h4>
                <div className="flex flex-wrap gap-2">
                  {supportedMethods.length > 0 ? (
                    supportedMethods.map((method) => (
                      <Badge key={method} variant="outline">
                        {method === 'webauthn' && 'WebAuthn'}
                        {method === 'touch_id' && 'Touch ID'}
                        {method === 'face_id' && 'Face ID'}
                        {method === 'fingerprint' && 'Huella Dactilar'}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="secondary">Detectando...</Badge>
                  )}
                </div>
              </div>
            </>
          )}

          <Button onClick={saveSettings} className="w-full">
            Guardar Configuración
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dispositivos Registrados</CardTitle>
              <CardDescription>
                {devices.length} dispositivos biométricos registrados
              </CardDescription>
            </div>
            <Button onClick={registerNewDevice}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Dispositivo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay dispositivos biométricos registrados
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Dispositivo</TableHead>
                  <TableHead>Registrado</TableHead>
                  <TableHead>Último Uso</TableHead>
                  <TableHead>Confianza</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(device.deviceType)}
                        <span className="capitalize">{device.deviceType.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{device.deviceName}</TableCell>
                    <TableCell>
                      {new Date(device.registeredAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(device.lastUsed).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getTrustBadge(device.trustScore)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDevice(device.id)}
                      >
                        {device.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDevice(device.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {!settings.enabled && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-medium">Autenticación biométrica deshabilitada</p>
                <p className="text-sm">Los usuarios solo podrán usar métodos tradicionales de autenticación</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}