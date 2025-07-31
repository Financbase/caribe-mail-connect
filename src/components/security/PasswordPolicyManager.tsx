import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventReuse: number;
  maxAge: number;
  complexityScore: number;
  isActive: boolean;
}

export function PasswordPolicyManager() {
  const [policy, setPolicy] = useState<PasswordPolicy>({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventReuse: 5,
    maxAge: 90,
    complexityScore: 70,
    isActive: true,
  });

  const updatePolicy = (field: keyof PasswordPolicy, value: boolean | number) => {
    setPolicy(prev => ({ ...prev, [field]: value }));
  };

  const savePolicy = async () => {
    try {
      // Implementation would save to database
      toast.success('Política de contraseñas actualizada');
    } catch (error) {
      toast.error('Error al actualizar política');
    }
  };

  const getStrengthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStrengthLabel = (score: number) => {
    if (score >= 80) return 'Fuerte';
    if (score >= 60) return 'Moderada';
    return 'Débil';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Política de Contraseñas
          </CardTitle>
          <CardDescription>
            Configurar requisitos de seguridad para contraseñas de usuarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label>Política Activa</Label>
            <Switch
              checked={policy.isActive}
              onCheckedChange={(checked) => updatePolicy('isActive', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Longitud Mínima</Label>
                <Input
                  type="number"
                  value={policy.minLength}
                  onChange={(e) => updatePolicy('minLength', parseInt(e.target.value))}
                  min={6}
                  max={20}
                />
              </div>

              <div>
                <Label>Prevenir Reutilización (últimas N contraseñas)</Label>
                <Input
                  type="number"
                  value={policy.preventReuse}
                  onChange={(e) => updatePolicy('preventReuse', parseInt(e.target.value))}
                  min={0}
                  max={20}
                />
              </div>

              <div>
                <Label>Expiración (días)</Label>
                <Input
                  type="number"
                  value={policy.maxAge}
                  onChange={(e) => updatePolicy('maxAge', parseInt(e.target.value))}
                  min={30}
                  max={365}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Requerir Mayúsculas</Label>
                <Switch
                  checked={policy.requireUppercase}
                  onCheckedChange={(checked) => updatePolicy('requireUppercase', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Requerir Minúsculas</Label>
                <Switch
                  checked={policy.requireLowercase}
                  onCheckedChange={(checked) => updatePolicy('requireLowercase', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Requerir Números</Label>
                <Switch
                  checked={policy.requireNumbers}
                  onCheckedChange={(checked) => updatePolicy('requireNumbers', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Requerir Caracteres Especiales</Label>
                <Switch
                  checked={policy.requireSpecialChars}
                  onCheckedChange={(checked) => updatePolicy('requireSpecialChars', checked)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Puntuación Mínima de Complejidad: {policy.complexityScore}%</Label>
            <Slider
              value={[policy.complexityScore]}
              onValueChange={(value) => updatePolicy('complexityScore', value[0])}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <Badge className={getStrengthColor(policy.complexityScore)}>
                {getStrengthLabel(policy.complexityScore)}
              </Badge>
            </div>
          </div>

          <Button onClick={savePolicy} className="w-full">
            Guardar Política
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vista Previa de Política</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Mínimo {policy.minLength} caracteres
            </div>
            {policy.requireUppercase && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Al menos una letra mayúscula
              </div>
            )}
            {policy.requireLowercase && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Al menos una letra minúscula
              </div>
            )}
            {policy.requireNumbers && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Al menos un número
              </div>
            )}
            {policy.requireSpecialChars && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Al menos un carácter especial
              </div>
            )}
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Expira cada {policy.maxAge} días
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              No reutilizar las últimas {policy.preventReuse} contraseñas
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}