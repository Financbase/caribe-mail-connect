import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { CaribbeanButton, ButtonGroup } from '@/components/ui/caribbean-button';
import { EnhancedCard, CardContent } from '@/components/ui/enhanced-card';
import { FormLayout, FormSection, FormFieldGroup } from '@/components/forms/FormLayout';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<WizardStepProps>;
  validation?: (data: any) => boolean | string[];
  optional?: boolean;
}

export interface WizardStepProps {
  data: any;
  updateData: (updates: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStep: number;
  totalSteps: number;
}

export interface PackageIntakeWizardProps {
  onComplete: (data: PackageIntakeData) => void;
  onCancel: () => void;
  initialData?: Partial<PackageIntakeData>;
  className?: string;
}

export interface PackageIntakeData {
  // Step 1: Package Identification
  trackingNumber?: string;
  carrier?: string;
  packageType?: string;
  
  // Step 2: Customer Information
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  mailboxNumber?: string;
  
  // Step 3: Package Details
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  description?: string;
  value?: number;
  
  // Step 4: Special Instructions
  fragile?: boolean;
  requiresSignature?: boolean;
  deliveryInstructions?: string;
  priority?: 'normal' | 'urgent' | 'express';
  
  // Step 5: Storage & Notification
  storageLocation?: string;
  notificationMethod?: 'email' | 'sms' | 'both';
  estimatedDelivery?: string;
}

/**
 * Generic Wizard Component for complex multi-step forms
 */
export const Wizard: React.FC<{
  steps: WizardStep[];
  onComplete: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  className?: string;
}> = ({ steps, onComplete, onCancel, initialData = {}, className }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<string[]>([]);
  const { t } = useLanguage();

  const updateData = (updates: any) => {
    setData(prev => ({ ...prev, ...updates }));
    setErrors([]);
  };

  const nextStep = () => {
    const step = steps[currentStep];
    if (step.validation) {
      const validationResult = step.validation(data);
      if (validationResult === true || (Array.isArray(validationResult) && validationResult.length === 0)) {
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          onComplete(data);
        }
      } else {
        setErrors(Array.isArray(validationResult) ? validationResult : []);
      }
    } else {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        onComplete(data);
      }
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setErrors([]);
    }
  };

  const CurrentStepComponent = steps[currentStep]?.component;

  if (!CurrentStepComponent) {
    return null;
  }

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 caribbean-text">
            {steps[currentStep].title}
          </h2>
          <span className="text-sm text-gray-500">
            {currentStep + 1} {t('of', 'de')} {steps.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary-ocean to-primary-sunrise h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        
        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={cn(
                'flex flex-col items-center text-xs',
                index === currentStep ? 'text-primary-ocean' : 
                index < currentStep ? 'text-primary-palm' : 'text-gray-400'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center mb-2 font-medium',
                index === currentStep ? 'bg-primary-ocean text-white' :
                index < currentStep ? 'bg-primary-palm text-white' : 'bg-gray-200 text-gray-500'
              )}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className="text-center leading-tight max-w-20">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Description */}
      {steps[currentStep].description && (
        <p className="text-gray-600 mb-6 leading-relaxed">
          {steps[currentStep].description}
        </p>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">
            {t('please_fix_errors', 'Por favor corrige los siguientes errores:')}
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-700 text-sm">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step Content */}
      <EnhancedCard variant="caribbean" className="mb-8">
        <CardContent className="p-6">
          <CurrentStepComponent
            data={data}
            updateData={updateData}
            nextStep={nextStep}
            previousStep={previousStep}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === steps.length - 1}
            currentStep={currentStep}
            totalSteps={steps.length}
          />
        </CardContent>
      </EnhancedCard>

      {/* Navigation Buttons */}
      <ButtonGroup className="justify-between">
        <CaribbeanButton
          variant="ghost"
          hierarchy="secondary"
          onClick={onCancel}
        >
          {t('cancel', 'Cancelar')}
        </CaribbeanButton>
        
        <ButtonGroup>
          {currentStep > 0 && (
            <CaribbeanButton
              variant="secondary"
              hierarchy="secondary"
              onClick={previousStep}
            >
              {t('previous', 'Anterior')}
            </CaribbeanButton>
          )}
          
          <CaribbeanButton
            variant="primary"
            hierarchy="primary"
            onClick={nextStep}
          >
            {currentStep === steps.length - 1 
              ? t('complete', 'Completar')
              : t('next', 'Siguiente')
            }
          </CaribbeanButton>
        </ButtonGroup>
      </ButtonGroup>
    </div>
  );
};

/**
 * Step 1: Package Identification
 */
const PackageIdentificationStep: React.FC<WizardStepProps> = ({ data, updateData }) => {
  const { t } = useLanguage();
  const scannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus scanner input for quick barcode scanning
    if (scannerRef.current) {
      scannerRef.current.focus();
    }
  }, []);

  return (
    <FormSection 
      title={t('package_identification', 'Identificación del Paquete')}
      description={t('scan_or_enter_tracking', 'Escanea o ingresa el número de seguimiento del paquete')}
    >
      <FormFieldGroup orientation="vertical">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('tracking_number', 'Número de Seguimiento')} *
            </label>
            <div className="relative">
              <input
                ref={scannerRef}
                type="text"
                value={data.trackingNumber || ''}
                onChange={(e) => updateData({ trackingNumber: e.target.value })}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary-ocean focus:outline-none text-lg font-mono"
                placeholder={t('scan_or_type_tracking', 'Escanea o escribe aquí...')}
                autoComplete="off"
              />
              <div className="absolute right-3 top-3 text-gray-400">
                📷
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('carrier', 'Transportista')} *
            </label>
            <select
              value={data.carrier || ''}
              onChange={(e) => updateData({ carrier: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary-ocean focus:outline-none"
            >
              <option value="">{t('select_carrier', 'Seleccionar transportista')}</option>
              <option value="ups">UPS</option>
              <option value="fedex">FedEx</option>
              <option value="dhl">DHL</option>
              <option value="usps">USPS</option>
              <option value="amazon">Amazon</option>
              <option value="other">{t('other', 'Otro')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('package_type', 'Tipo de Paquete')}
            </label>
            <select
              value={data.packageType || 'package'}
              onChange={(e) => updateData({ packageType: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary-ocean focus:outline-none"
            >
              <option value="package">{t('package', 'Paquete')}</option>
              <option value="letter">{t('letter', 'Carta')}</option>
              <option value="document">{t('document', 'Documento')}</option>
              <option value="box">{t('box', 'Caja')}</option>
              <option value="envelope">{t('envelope', 'Sobre')}</option>
            </select>
          </div>
        </div>
      </FormFieldGroup>
    </FormSection>
  );
};

/**
 * Step 2: Customer Information
 */
const CustomerInformationStep: React.FC<WizardStepProps> = ({ data, updateData }) => {
  const { t } = useLanguage();

  return (
    <FormSection 
      title={t('customer_information', 'Información del Cliente')}
      description={t('identify_package_recipient', 'Identifica al destinatario del paquete')}
    >
      <FormFieldGroup orientation="vertical">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('mailbox_number', 'Número de Buzón')} *
            </label>
            <input
              type="text"
              value={data.mailboxNumber || ''}
              onChange={(e) => updateData({ mailboxNumber: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary-ocean focus:outline-none"
              placeholder={t('enter_mailbox_number', 'Ingresa el número de buzón')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('customer_name', 'Nombre del Cliente')} *
            </label>
            <input
              type="text"
              value={data.customerName || ''}
              onChange={(e) => updateData({ customerName: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary-ocean focus:outline-none"
              placeholder={t('customer_full_name', 'Nombre completo del cliente')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('email_address', 'Correo Electrónico')}
            </label>
            <input
              type="email"
              value={data.customerEmail || ''}
              onChange={(e) => updateData({ customerEmail: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary-ocean focus:outline-none"
              placeholder="cliente@ejemplo.com"
            />
          </div>
        </div>
      </FormFieldGroup>
    </FormSection>
  );
};

/**
 * Step 3: Package Details
 */
const PackageDetailsStep: React.FC<WizardStepProps> = ({ data, updateData }) => {
  const { t } = useLanguage();

  return (
    <FormSection 
      title={t('package_details', 'Detalles del Paquete')}
      description={t('record_package_measurements', 'Registra las medidas y características del paquete')}
    >
      <FormFieldGroup orientation="vertical">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('weight', 'Peso')} (lbs)
              </label>
              <input
                type="number"
                step="0.1"
                value={data.weight || ''}
                onChange={(e) => updateData({ weight: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary-ocean focus:outline-none"
                placeholder="0.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('value', 'Valor')} ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={data.value || ''}
                onChange={(e) => updateData({ value: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary-ocean focus:outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('dimensions', 'Dimensiones')} (pulgadas)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                step="0.1"
                value={data.dimensions?.length || ''}
                onChange={(e) => updateData({ 
                  dimensions: { 
                    ...data.dimensions, 
                    length: parseFloat(e.target.value) || 0 
                  }
                })}
                className="p-3 border-2 border-gray-300 rounded-lg focus:border-primary-ocean focus:outline-none"
                placeholder={t('length', 'Largo')}
              />
              <input
                type="number"
                step="0.1"
                value={data.dimensions?.width || ''}
                onChange={(e) => updateData({ 
                  dimensions: { 
                    ...data.dimensions, 
                    width: parseFloat(e.target.value) || 0 
                  }
                })}
                className="p-3 border-2 border-gray-300 rounded-lg focus:border-primary-ocean focus:outline-none"
                placeholder={t('width', 'Ancho')}
              />
              <input
                type="number"
                step="0.1"
                value={data.dimensions?.height || ''}
                onChange={(e) => updateData({ 
                  dimensions: { 
                    ...data.dimensions, 
                    height: parseFloat(e.target.value) || 0 
                  }
                })}
                className="p-3 border-2 border-gray-300 rounded-lg focus:border-primary-ocean focus:outline-none"
                placeholder={t('height', 'Alto')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('description', 'Descripción')}
            </label>
            <textarea
              value={data.description || ''}
              onChange={(e) => updateData({ description: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary-ocean focus:outline-none"
              rows={3}
              placeholder={t('package_description_placeholder', 'Describe el contenido del paquete...')}
            />
          </div>
        </div>
      </FormFieldGroup>
    </FormSection>
  );
};

/**
 * Package Intake Wizard - Main Component
 */
export const PackageIntakeWizard: React.FC<PackageIntakeWizardProps> = ({
  onComplete,
  onCancel,
  initialData = {},
  className
}) => {
  const { t } = useLanguage();

  const wizardSteps: WizardStep[] = [
    {
      id: 'identification',
      title: t('identification', 'Identificación'),
      description: t('scan_package_barcode', 'Escanea el código de barras del paquete'),
      component: PackageIdentificationStep,
      validation: (data) => {
        const errors = [];
        if (!data.trackingNumber) {
          errors.push(t('tracking_number_required', 'El número de seguimiento es requerido'));
        }
        if (!data.carrier) {
          errors.push(t('carrier_required', 'El transportista es requerido'));
        }
        return errors;
      }
    },
    {
      id: 'customer',
      title: t('customer', 'Cliente'),
      description: t('identify_recipient', 'Identifica al destinatario'),
      component: CustomerInformationStep,
      validation: (data) => {
        const errors = [];
        if (!data.mailboxNumber) {
          errors.push(t('mailbox_number_required', 'El número de buzón es requerido'));
        }
        if (!data.customerName) {
          errors.push(t('customer_name_required', 'El nombre del cliente es requerido'));
        }
        return errors;
      }
    },
    {
      id: 'details',
      title: t('details', 'Detalles'),
      description: t('record_package_info', 'Registra la información del paquete'),
      component: PackageDetailsStep,
      optional: true
    }
  ];

  return (
    <Wizard
      steps={wizardSteps}
      onComplete={onComplete}
      onCancel={onCancel}
      initialData={initialData}
      className={className}
    />
  );
};

export default PackageIntakeWizard;
