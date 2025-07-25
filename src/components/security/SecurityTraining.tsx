import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BookOpen, 
  Target, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  TrendingUp,
  Mail,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completionRate: number;
  isRequired: boolean;
  category: 'phishing' | 'password' | 'social_engineering' | 'data_protection' | 'compliance';
}

interface PhishingSimulation {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'social_media' | 'phone';
  difficulty: 'low' | 'medium' | 'high';
  targetAudience: string;
  clickRate: number;
  reportRate: number;
  lastRun: string;
  status: 'active' | 'completed' | 'scheduled';
}

interface UserProgress {
  userId: string;
  userName: string;
  completedModules: number;
  totalModules: number;
  lastActivity: string;
  phishingScore: number;
  certificationsEarned: number;
}

export function SecurityTraining() {
  const [activeTab, setActiveTab] = useState<'modules' | 'simulations' | 'progress'>('modules');
  
  const [trainingModules] = useState<TrainingModule[]>([
    {
      id: '1',
      title: 'Reconocimiento de Phishing',
      description: 'Aprende a identificar correos electrónicos maliciosos',
      duration: 30,
      difficulty: 'beginner',
      completionRate: 85,
      isRequired: true,
      category: 'phishing',
    },
    {
      id: '2',
      title: 'Seguridad de Contraseñas',
      description: 'Mejores prácticas para crear contraseñas seguras',
      duration: 20,
      difficulty: 'beginner',
      completionRate: 92,
      isRequired: true,
      category: 'password',
    },
    {
      id: '3',
      title: 'Ingeniería Social Avanzada',
      description: 'Técnicas sofisticadas de manipulación y cómo defenderse',
      duration: 45,
      difficulty: 'advanced',
      completionRate: 68,
      isRequired: false,
      category: 'social_engineering',
    },
    {
      id: '4',
      title: 'Protección de Datos GDPR',
      description: 'Cumplimiento de regulaciones de privacidad',
      duration: 60,
      difficulty: 'intermediate',
      completionRate: 73,
      isRequired: true,
      category: 'compliance',
    },
  ]);

  const [phishingSimulations] = useState<PhishingSimulation[]>([
    {
      id: '1',
      name: 'Phishing Bancario',
      type: 'email',
      difficulty: 'medium',
      targetAudience: 'Todos los empleados',
      clickRate: 12,
      reportRate: 78,
      lastRun: '2024-01-20T10:00:00Z',
      status: 'completed',
    },
    {
      id: '2',
      name: 'SMS Fraudulento',
      type: 'sms',
      difficulty: 'high',
      targetAudience: 'Gerentes',
      clickRate: 8,
      reportRate: 85,
      lastRun: '2024-01-15T14:30:00Z',
      status: 'completed',
    },
    {
      id: '3',
      name: 'Llamada de Soporte Técnico',
      type: 'phone',
      difficulty: 'high',
      targetAudience: 'Personal IT',
      clickRate: 15,
      reportRate: 70,
      lastRun: '2024-01-25T09:15:00Z',
      status: 'active',
    },
  ]);

  const [userProgress] = useState<UserProgress[]>([
    {
      userId: '1',
      userName: 'Ana García',
      completedModules: 4,
      totalModules: 4,
      lastActivity: '2024-01-24T16:30:00Z',
      phishingScore: 95,
      certificationsEarned: 2,
    },
    {
      userId: '2',
      userName: 'Carlos López',
      completedModules: 3,
      totalModules: 4,
      lastActivity: '2024-01-23T11:45:00Z',
      phishingScore: 88,
      certificationsEarned: 1,
    },
    {
      userId: '3',
      userName: 'María Rivera',
      completedModules: 2,
      totalModules: 4,
      lastActivity: '2024-01-22T14:20:00Z',
      phishingScore: 76,
      certificationsEarned: 1,
    },
  ]);

  const startTrainingModule = (moduleId: string) => {
    toast.success('Módulo de entrenamiento iniciado');
  };

  const launchPhishingSimulation = (simulationId: string) => {
    toast.success('Simulación de phishing lanzada');
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge variant="secondary">Principiante</Badge>;
      case 'intermediate':
        return <Badge variant="default">Intermedio</Badge>;
      case 'advanced':
        return <Badge variant="destructive">Avanzado</Badge>;
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  const getCategoryIcon = (category: TrainingModule['category']) => {
    switch (category) {
      case 'phishing':
        return <Mail className="h-4 w-4" />;
      case 'password':
        return <Shield className="h-4 w-4" />;
      case 'social_engineering':
        return <Users className="h-4 w-4" />;
      case 'data_protection':
        return <Shield className="h-4 w-4" />;
      case 'compliance':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getSimulationIcon = (type: PhishingSimulation['type']) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <Target className="h-4 w-4" />;
      case 'phone':
        return <Target className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b">
        <Button
          variant={activeTab === 'modules' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('modules')}
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Módulos de Entrenamiento
        </Button>
        <Button
          variant={activeTab === 'simulations' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('simulations')}
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          <Target className="h-4 w-4 mr-2" />
          Simulaciones de Phishing
        </Button>
        <Button
          variant={activeTab === 'progress' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('progress')}
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Progreso de Usuarios
        </Button>
      </div>

      {activeTab === 'modules' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Módulos de Entrenamiento Disponibles</CardTitle>
              <CardDescription>
                Cursos interactivos de seguridad para todo el personal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {trainingModules.map((module) => (
                  <Card key={module.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(module.category)}
                          <div>
                            <h3 className="font-medium">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {getDifficultyBadge(module.difficulty)}
                              {module.isRequired && <Badge variant="outline">Obligatorio</Badge>}
                              <Badge variant="outline">
                                <Clock className="h-3 w-3 mr-1" />
                                {module.duration} min
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <Progress value={module.completionRate} className="w-20" />
                            <span className="text-sm">{module.completionRate}%</span>
                          </div>
                          <Button onClick={() => startTrainingModule(module.id)}>
                            Iniciar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'simulations' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Simulaciones de Phishing</CardTitle>
                  <CardDescription>
                    Pruebas de seguridad para evaluar la preparación del personal
                  </CardDescription>
                </div>
                <Button>
                  <Target className="h-4 w-4 mr-2" />
                  Nueva Simulación
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Simulación</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Dificultad</TableHead>
                    <TableHead>Audiencia</TableHead>
                    <TableHead>Tasa de Click</TableHead>
                    <TableHead>Tasa de Reporte</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {phishingSimulations.map((simulation) => (
                    <TableRow key={simulation.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSimulationIcon(simulation.type)}
                          {simulation.name}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{simulation.type}</TableCell>
                      <TableCell>{getDifficultyBadge(simulation.difficulty)}</TableCell>
                      <TableCell>{simulation.targetAudience}</TableCell>
                      <TableCell>
                        <Badge variant={simulation.clickRate > 10 ? 'destructive' : 'default'}>
                          {simulation.clickRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={simulation.reportRate > 70 ? 'default' : 'secondary'}>
                          {simulation.reportRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          simulation.status === 'active' ? 'default' : 
                          simulation.status === 'completed' ? 'secondary' : 'outline'
                        }>
                          {simulation.status === 'active' ? 'Activa' : 
                           simulation.status === 'completed' ? 'Completada' : 'Programada'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => launchPhishingSimulation(simulation.id)}
                        >
                          Lanzar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progreso de Entrenamiento</CardTitle>
              <CardDescription>
                Seguimiento del progreso de seguridad por usuario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead>Última Actividad</TableHead>
                    <TableHead>Puntuación Phishing</TableHead>
                    <TableHead>Certificaciones</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userProgress.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell className="font-medium">{user.userName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(user.completedModules / user.totalModules) * 100} 
                            className="w-20" 
                          />
                          <span className="text-sm">
                            {user.completedModules}/{user.totalModules}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(user.lastActivity).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.phishingScore > 85 ? 'default' : 'secondary'}>
                          {user.phishingScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {user.certificationsEarned}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.completedModules === user.totalModules ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}