import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useReports } from '@/hooks/useReports';
import { Calendar } from 'lucide-react';

interface ReportScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
}

export function ReportScheduleDialog({ open, onOpenChange, reportId }: ReportScheduleDialogProps) {
  const { language } = useLanguage();
  const { createSchedule, isCreatingSchedule } = useReports();
  
  const [scheduleData, setScheduleData] = useState({
    name: '',
    schedule_type: 'daily' as const,
    recipients: '',
    format: 'pdf' as const,
    schedule_config: {},
    is_active: true,
    location_id: null,
    created_by: null,
    updated_by: null
  });

  const handleSubmit = async () => {
    if (!scheduleData.name) return;

    await createSchedule({
      ...scheduleData,
      report_id: reportId,
      recipients: scheduleData.recipients.split(',').map(email => email.trim()).filter(Boolean),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {language === 'en' ? 'Schedule Report' : 'Programar Informe'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'Set up automated report delivery'
              : 'Configurar entrega automatizada de informes'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schedule-name">
              {language === 'en' ? 'Schedule Name' : 'Nombre de Programación'}
            </Label>
            <Input
              id="schedule-name"
              value={scheduleData.name}
              onChange={(e) => setScheduleData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={language === 'en' ? 'Daily operations report' : 'Informe de operaciones diarias'}
            />
          </div>

          <div className="space-y-2">
            <Label>
              {language === 'en' ? 'Frequency' : 'Frecuencia'}
            </Label>
            <Select 
              value={scheduleData.schedule_type}
              onValueChange={(value: unknown) => setScheduleData(prev => ({ ...prev, schedule_type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{language === 'en' ? 'Daily' : 'Diario'}</SelectItem>
                <SelectItem value="weekly">{language === 'en' ? 'Weekly' : 'Semanal'}</SelectItem>
                <SelectItem value="monthly">{language === 'en' ? 'Monthly' : 'Mensual'}</SelectItem>
                <SelectItem value="quarterly">{language === 'en' ? 'Quarterly' : 'Trimestral'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              {language === 'en' ? 'Format' : 'Formato'}
            </Label>
            <Select 
              value={scheduleData.format}
              onValueChange={(value: unknown) => setScheduleData(prev => ({ ...prev, format: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipients">
              {language === 'en' ? 'Email Recipients' : 'Destinatarios de Email'}
            </Label>
            <Input
              id="recipients"
              value={scheduleData.recipients}
              onChange={(e) => setScheduleData(prev => ({ ...prev, recipients: e.target.value }))}
              placeholder="email1@example.com, email2@example.com"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {language === 'en' ? 'Cancel' : 'Cancelar'}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isCreatingSchedule || !scheduleData.name}
          >
            {isCreatingSchedule 
              ? (language === 'en' ? 'Creating...' : 'Creando...')
              : (language === 'en' ? 'Create Schedule' : 'Crear Programación')
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}