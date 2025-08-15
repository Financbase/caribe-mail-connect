import React, { useState } from 'react';
import { Calendar, Package, Users, FileText, Search, Upload, AlertTriangle } from 'lucide-react';

// Untitled UI Components
import { Modal } from '../application/modals/modal';
import { Table } from '../application/table/table';
import { DatePicker } from '../application/date-picker/date-picker';
import { FileUpload } from '../application/file-upload/file-upload-base';
import { CommandMenu } from '../application/command-menus/command-menu-users-menu-stacked';
import { EmptyState } from '../application/empty-state/empty-state';
import { LoadingIndicator } from '../application/loading-indicator/loading-indicator';

// PRMCMS Components for comparison
import { CaribeFeaturedIcon } from '../ui/featured-icon';
import { LanguageToggle } from '../LanguageToggle';

interface Package {
  id: string;
  trackingNumber: string;
  customer: string;
  status: 'pending' | 'delivered' | 'pickup';
  arrivalDate: string;
  mailbox: string;
}

interface UntitledUIIntegrationShowcaseProps {
  language?: 'es' | 'en';
}

const translations = {
  es: {
    title: "Integración Untitled UI - PRMCMS",
    subtitle: "Componentes profesionales con diseño caribeño",
    sections: {
      modals: "Modales Modernas",
      tables: "Tablas de Datos",
      datePickers: "Selectores de Fecha",
      fileUploads: "Carga de Archivos",
      commandMenus: "Menús de Comando",
      emptyStates: "Estados Vacíos",
      loadingIndicators: "Indicadores de Carga"
    },
    buttons: {
      openModal: "Abrir Modal",
      uploadDocument: "Subir Documento",
      searchPackages: "Buscar Paquetes",
      viewEmpty: "Ver Estado Vacío",
      startLoading: "Iniciar Carga"
    },
    modal: {
      title: "Procesando Paquete",
      description: "Complete la información del paquete para continuar",
      customer: "Cliente",
      trackingNumber: "Número de Rastreo",
      deliveryDate: "Fecha de Entrega",
      specialInstructions: "Instrucciones Especiales",
      submit: "Procesar Paquete",
      cancel: "Cancelar"
    },
    table: {
      headers: {
        tracking: "Rastreo",
        customer: "Cliente",
        status: "Estado",
        arrival: "Llegada",
        mailbox: "Buzón"
      },
      statuses: {
        pending: "Pendiente",
        delivered: "Entregado",
        pickup: "Recoger"
      }
    },
    empty: {
      title: "No hay paquetes hoy",
      description: "Todos los paquetes han sido procesados. ¡Excelente trabajo!",
      action: "Agregar Paquete"
    },
    loading: "Cargando datos de paquetes..."
  },
  en: {
    title: "Untitled UI Integration - PRMCMS",
    subtitle: "Professional components with Caribbean design",
    sections: {
      modals: "Modern Modals",
      tables: "Data Tables",
      datePickers: "Date Pickers",
      fileUploads: "File Uploads",
      commandMenus: "Command Menus",
      emptyStates: "Empty States",
      loadingIndicators: "Loading Indicators"
    },
    buttons: {
      openModal: "Open Modal",
      uploadDocument: "Upload Document",
      searchPackages: "Search Packages",
      viewEmpty: "View Empty State",
      startLoading: "Start Loading"
    },
    modal: {
      title: "Processing Package",
      description: "Complete the package information to continue",
      customer: "Customer",
      trackingNumber: "Tracking Number",
      deliveryDate: "Delivery Date",
      specialInstructions: "Special Instructions",
      submit: "Process Package",
      cancel: "Cancel"
    },
    table: {
      headers: {
        tracking: "Tracking",
        customer: "Customer",
        status: "Status",
        arrival: "Arrival",
        mailbox: "Mailbox"
      },
      statuses: {
        pending: "Pending",
        delivered: "Delivered",
        pickup: "Pickup"
      }
    },
    empty: {
      title: "No packages today",
      description: "All packages have been processed. Great work!",
      action: "Add Package"
    },
    loading: "Loading package data..."
  }
};

const mockPackages: Package[] = [
  {
    id: '1',
    trackingNumber: 'CMC-2024-001',
    customer: 'María González',
    status: 'pending',
    arrivalDate: '2024-01-15',
    mailbox: 'A-101'
  },
  {
    id: '2',
    trackingNumber: 'CMC-2024-002',
    customer: 'Carlos Rivera',
    status: 'delivered',
    arrivalDate: '2024-01-14',
    mailbox: 'B-205'
  },
  {
    id: '3',
    trackingNumber: 'CMC-2024-003',
    customer: 'Ana Rodríguez',
    status: 'pickup',
    arrivalDate: '2024-01-13',
    mailbox: 'C-315'
  }
];

export function UntitledUIIntegrationShowcase({ 
  language = 'es' 
}: UntitledUIIntegrationShowcaseProps) {
  const [currentLang, setCurrentLang] = useState<'es' | 'en'>(language);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const t = translations[currentLang];

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  const getStatusColor = (status: Package['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pickup':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-green-50 p-6">
      {/* Header with Language Toggle */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <CaribeFeaturedIcon
              icon={Package}
              size="lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-ocean-800">{t.title}</h1>
              <p className="text-ocean-600 mt-1">{t.subtitle}</p>
            </div>
          </div>
          <LanguageToggle
            currentLanguage={currentLang}
            onLanguageChange={setCurrentLang}
          />
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setModalOpen(true)}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-orange-200"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{t.buttons.openModal}</span>
            </div>
          </button>

          <button
            onClick={() => setCommandOpen(true)}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-200"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{t.buttons.searchPackages}</span>
            </div>
          </button>

          <button
            onClick={() => setShowEmpty(!showEmpty)}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-green-200"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{t.buttons.viewEmpty}</span>
            </div>
          </button>

          <button
            onClick={handleLoadingDemo}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-purple-200"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Upload className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{t.buttons.startLoading}</span>
            </div>
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border">
            <LoadingIndicator />
            <p className="text-center text-gray-600 mt-4">{t.loading}</p>
          </div>
        )}

        {/* Empty State */}
        {showEmpty ? (
          <div className="mb-8">
            <EmptyState
              title={t.empty.title}
              description={t.empty.description}
              icon={<Package className="w-12 h-12 text-gray-400" />}
              action={
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  {t.empty.action}
                </button>
              }
            />
          </div>
        ) : (
          /* Data Table */
          <div className="mb-8 bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-gradient-to-r from-ocean-50 to-sunrise-50">
              <h2 className="text-lg font-semibold text-ocean-800 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                {t.sections.tables}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      {t.table.headers.tracking}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      {t.table.headers.customer}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      {t.table.headers.status}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      {t.table.headers.arrival}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      {t.table.headers.mailbox}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-900">
                        {pkg.trackingNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {pkg.customer}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(pkg.status)}`}>
                          {t.table.statuses[pkg.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(pkg.arrivalDate).toLocaleDateString(currentLang === 'es' ? 'es-PR' : 'en-US')}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-900">
                        {pkg.mailbox}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}

        {/* Date Picker Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-ocean-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {t.sections.datePickers}
            </h3>
            <DatePicker
              selected={selectedDate}
              onSelect={setSelectedDate}
              placeholder={currentLang === 'es' ? 'Seleccionar fecha' : 'Select date'}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-ocean-800 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              {t.sections.fileUploads}
            </h3>
            <FileUpload
              accept="image/*,.pdf"
              multiple
              onUpload={(files) => console.log('Files uploaded:', files)}
              placeholder={t.buttons.uploadDocument}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CaribeFeaturedIcon
              icon={Package}
              variant="sunrise"
              size="md"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{t.modal.title}</h2>
              <p className="text-gray-600">{t.modal.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.modal.customer}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="María González"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.modal.trackingNumber}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="CMC-2024-004"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.modal.deliveryDate}
              </label>
              <DatePicker
                selected={selectedDate}
                onSelect={setSelectedDate}
                placeholder={currentLang === 'es' ? 'Seleccionar fecha' : 'Select date'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.modal.specialInstructions}
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                rows={3}
                placeholder={currentLang === 'es' ? 'Instrucciones adicionales...' : 'Additional instructions...'}
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 font-medium"
            >
              {t.modal.submit}
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t.modal.cancel}
            </button>
          </div>
        </div>
      </Modal>

      {/* Command Menu */}
      <CommandMenu
        open={commandOpen}
        onOpenChange={setCommandOpen}
        placeholder={t.buttons.searchPackages}
      />
    </div>
  );
}

export default UntitledUIIntegrationShowcase;
