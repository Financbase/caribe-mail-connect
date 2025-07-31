import { useState, useEffect } from 'react';

interface RoyaltyCalculation {
  id: string;
  franchise_id: string;
  franchise_name: string;
  period: string;
  gross_revenue: number;
  royalty_rate: number;
  royalty_amount: number;
  marketing_fee: number;
  technology_fee: number;
  total_fees: number;
  net_payment: number;
  status: 'pending' | 'calculated' | 'approved' | 'paid' | 'disputed';
  calculated_at: string;
  due_date: string;
  paid_date?: string;
}

interface PaymentTracking {
  id: string;
  franchise_id: string;
  franchise_name: string;
  amount: number;
  payment_method: 'bank_transfer' | 'credit_card' | 'check' | 'cash';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transaction_id: string;
  reference_number: string;
  payment_date: string;
  processed_date?: string;
  notes: string;
}

interface RevenueReport {
  id: string;
  franchise_id: string;
  franchise_name: string;
  period: string;
  total_revenue: number;
  service_breakdown: {
    service: string;
    revenue: number;
    percentage: number;
  }[];
  growth_rate: number;
  comparison_previous_period: number;
  generated_at: string;
}

interface FeeStructure {
  id: string;
  name: string;
  description: string;
  fee_type: 'royalty' | 'marketing' | 'technology' | 'training' | 'support';
  calculation_method: 'percentage' | 'fixed' | 'tiered' | 'volume_based';
  rate: number;
  min_amount?: number;
  max_amount?: number;
  tiers?: {
    min_revenue: number;
    max_revenue: number;
    rate: number;
  }[];
  effective_date: string;
  expiry_date?: string;
  is_active: boolean;
  applicable_franchises: string[];
}

interface DisputeCase {
  id: string;
  franchise_id: string;
  franchise_name: string;
  royalty_calculation_id: string;
  dispute_type: 'calculation_error' | 'fee_structure' | 'payment_issue' | 'service_dispute' | 'other';
  description: string;
  disputed_amount: number;
  evidence_files: string[];
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  created_at: string;
  resolved_at?: string;
  resolution?: string;
  resolution_amount?: number;
}

// Mock royalty calculations
const mockRoyaltyCalculations: RoyaltyCalculation[] = [
  {
    id: '1',
    franchise_id: '1',
    franchise_name: 'PRMCMS San Juan Centro',
    period: '2024-01',
    gross_revenue: 125000,
    royalty_rate: 8.5,
    royalty_amount: 10625,
    marketing_fee: 2500,
    technology_fee: 1500,
    total_fees: 14625,
    net_payment: 110375,
    status: 'paid',
    calculated_at: '2024-01-31',
    due_date: '2024-02-15',
    paid_date: '2024-02-10'
  },
  {
    id: '2',
    franchise_id: '2',
    franchise_name: 'PRMCMS Bayamón Express',
    period: '2024-01',
    gross_revenue: 98000,
    royalty_rate: 8.5,
    royalty_amount: 8330,
    marketing_fee: 1960,
    technology_fee: 1500,
    total_fees: 11790,
    net_payment: 86210,
    status: 'approved',
    calculated_at: '2024-01-31',
    due_date: '2024-02-15'
  },
  {
    id: '3',
    franchise_id: '3',
    franchise_name: 'PRMCMS Caguas Hub',
    period: '2024-01',
    gross_revenue: 110000,
    royalty_rate: 8.5,
    royalty_amount: 9350,
    marketing_fee: 2200,
    technology_fee: 1500,
    total_fees: 13050,
    net_payment: 96950,
    status: 'paid',
    calculated_at: '2024-01-31',
    due_date: '2024-02-15',
    paid_date: '2024-02-12'
  },
  {
    id: '4',
    franchise_id: '4',
    franchise_name: 'PRMCMS Ponce Sur',
    period: '2024-01',
    gross_revenue: 92000,
    royalty_rate: 8.5,
    royalty_amount: 7820,
    marketing_fee: 1840,
    technology_fee: 1500,
    total_fees: 11160,
    net_payment: 80840,
    status: 'disputed',
    calculated_at: '2024-01-31',
    due_date: '2024-02-15'
  },
  {
    id: '5',
    franchise_id: '6',
    franchise_name: 'PRMCMS Arecibo Norte',
    period: '2024-01',
    gross_revenue: 105000,
    royalty_rate: 8.5,
    royalty_amount: 8925,
    marketing_fee: 2100,
    technology_fee: 1500,
    total_fees: 12525,
    net_payment: 92475,
    status: 'calculated',
    calculated_at: '2024-01-31',
    due_date: '2024-02-15'
  }
];

// Mock payment tracking
const mockPaymentTracking: PaymentTracking[] = [
  {
    id: '1',
    franchise_id: '1',
    franchise_name: 'PRMCMS San Juan Centro',
    amount: 110375,
    payment_method: 'bank_transfer',
    status: 'completed',
    transaction_id: 'TXN-2024-001',
    reference_number: 'REF-2024-001',
    payment_date: '2024-02-10',
    processed_date: '2024-02-10',
    notes: 'Pago procesado exitosamente'
  },
  {
    id: '2',
    franchise_id: '3',
    franchise_name: 'PRMCMS Caguas Hub',
    amount: 96950,
    payment_method: 'credit_card',
    status: 'completed',
    transaction_id: 'TXN-2024-002',
    reference_number: 'REF-2024-002',
    payment_date: '2024-02-12',
    processed_date: '2024-02-12',
    notes: 'Pago con tarjeta de crédito'
  },
  {
    id: '3',
    franchise_id: '2',
    franchise_name: 'PRMCMS Bayamón Express',
    amount: 86210,
    payment_method: 'check',
    status: 'processing',
    transaction_id: 'TXN-2024-003',
    reference_number: 'REF-2024-003',
    payment_date: '2024-02-14',
    notes: 'Cheque en proceso de verificación'
  },
  {
    id: '4',
    franchise_id: '5',
    franchise_name: 'PRMCMS Mayagüez Oeste',
    amount: 0,
    payment_method: 'bank_transfer',
    status: 'pending',
    transaction_id: 'TXN-2024-004',
    reference_number: 'REF-2024-004',
    payment_date: '2024-02-15',
    notes: 'Pendiente de activación de franquicia'
  }
];

// Mock revenue reports
const mockRevenueReports: RevenueReport[] = [
  {
    id: '1',
    franchise_id: '1',
    franchise_name: 'PRMCMS San Juan Centro',
    period: '2024-01',
    total_revenue: 125000,
    service_breakdown: [
      { service: 'Apartados Postales', revenue: 45000, percentage: 36 },
      { service: 'Manejo de Paquetes', revenue: 35000, percentage: 28 },
      { service: 'Servicios Premium', revenue: 25000, percentage: 20 },
      { service: 'Almacenamiento', revenue: 15000, percentage: 12 },
      { service: 'Otros Servicios', revenue: 5000, percentage: 4 }
    ],
    growth_rate: 18,
    comparison_previous_period: 12,
    generated_at: '2024-01-31'
  },
  {
    id: '2',
    franchise_id: '2',
    franchise_name: 'PRMCMS Bayamón Express',
    period: '2024-01',
    total_revenue: 98000,
    service_breakdown: [
      { service: 'Apartados Postales', revenue: 35000, percentage: 36 },
      { service: 'Manejo de Paquetes', revenue: 28000, percentage: 29 },
      { service: 'Servicios Premium', revenue: 20000, percentage: 20 },
      { service: 'Almacenamiento', revenue: 12000, percentage: 12 },
      { service: 'Otros Servicios', revenue: 3000, percentage: 3 }
    ],
    growth_rate: 12,
    comparison_previous_period: 8,
    generated_at: '2024-01-31'
  },
  {
    id: '3',
    franchise_id: '3',
    franchise_name: 'PRMCMS Caguas Hub',
    period: '2024-01',
    total_revenue: 110000,
    service_breakdown: [
      { service: 'Apartados Postales', revenue: 40000, percentage: 36 },
      { service: 'Manejo de Paquetes', revenue: 30000, percentage: 27 },
      { service: 'Servicios Premium', revenue: 22000, percentage: 20 },
      { service: 'Almacenamiento', revenue: 14000, percentage: 13 },
      { service: 'Otros Servicios', revenue: 4000, percentage: 4 }
    ],
    growth_rate: 15,
    comparison_previous_period: 10,
    generated_at: '2024-01-31'
  }
];

// Mock fee structures
const mockFeeStructures: FeeStructure[] = [
  {
    id: '1',
    name: 'Regalía Base',
    description: 'Regalía estándar sobre ingresos brutos',
    fee_type: 'royalty',
    calculation_method: 'percentage',
    rate: 8.5,
    effective_date: '2024-01-01',
    is_active: true,
    applicable_franchises: ['1', '2', '3', '4', '5', '6', '7', '8']
  },
  {
    id: '2',
    name: 'Cuota de Marketing',
    description: 'Cuota para fondos de marketing corporativo',
    fee_type: 'marketing',
    calculation_method: 'percentage',
    rate: 2.0,
    effective_date: '2024-01-01',
    is_active: true,
    applicable_franchises: ['1', '2', '3', '4', '5', '6', '7', '8']
  },
  {
    id: '3',
    name: 'Cuota de Tecnología',
    description: 'Cuota fija para mantenimiento de sistemas tecnológicos',
    fee_type: 'technology',
    calculation_method: 'fixed',
    rate: 1500,
    effective_date: '2024-01-01',
    is_active: true,
    applicable_franchises: ['1', '2', '3', '4', '5', '6', '7', '8']
  },
  {
    id: '4',
    name: 'Regalía por Volumen',
    description: 'Regalía escalonada basada en volumen de ingresos',
    fee_type: 'royalty',
    calculation_method: 'tiered',
    rate: 0,
    tiers: [
      { min_revenue: 0, max_revenue: 50000, rate: 7.0 },
      { min_revenue: 50001, max_revenue: 100000, rate: 8.5 },
      { min_revenue: 100001, max_revenue: 200000, rate: 9.0 },
      { min_revenue: 200001, max_revenue: 999999, rate: 9.5 }
    ],
    effective_date: '2024-01-01',
    is_active: false,
    applicable_franchises: ['1', '2', '3', '4', '5', '6', '7', '8']
  }
];

// Mock dispute cases
const mockDisputeCases: DisputeCase[] = [
  {
    id: '1',
    franchise_id: '4',
    franchise_name: 'PRMCMS Ponce Sur',
    royalty_calculation_id: '4',
    dispute_type: 'calculation_error',
    description: 'Discrepancia en el cálculo de regalías. Los ingresos reportados no coinciden con los registros internos.',
    disputed_amount: 2500,
    evidence_files: ['facturas.pdf', 'registros_contables.xlsx'],
    status: 'under_review',
    priority: 'high',
    assigned_to: 'Departamento Financiero',
    created_at: '2024-02-01',
    resolution: 'Se encontró error en el cálculo. Ajuste aplicado.',
    resolution_amount: 1800
  },
  {
    id: '2',
    franchise_id: '7',
    franchise_name: 'PRMCMS Carolina Este',
    royalty_calculation_id: '6',
    dispute_type: 'fee_structure',
    description: 'Cuestionamiento sobre la aplicación de la cuota de tecnología en franquicia nueva.',
    disputed_amount: 1500,
    evidence_files: ['contrato_franquicia.pdf'],
    status: 'open',
    priority: 'medium',
    created_at: '2024-02-05'
  },
  {
    id: '3',
    franchise_id: '8',
    franchise_name: 'PRMCMS Aguadilla Costa',
    royalty_calculation_id: '7',
    dispute_type: 'service_dispute',
    description: 'Disputa sobre calidad de servicios de soporte técnico proporcionados.',
    disputed_amount: 3000,
    evidence_files: ['tickets_soporte.pdf', 'comunicaciones.pdf'],
    status: 'resolved',
    priority: 'low',
    assigned_to: 'Departamento de Servicios',
    created_at: '2024-01-25',
    resolved_at: '2024-02-10',
    resolution: 'Se acordó descuento del 50% en cuota de tecnología por 3 meses.',
    resolution_amount: 1500
  }
];

export function useRoyaltyManagement() {
  const [royaltyCalculations, setRoyaltyCalculations] = useState<RoyaltyCalculation[]>([]);
  const [paymentTracking, setPaymentTracking] = useState<PaymentTracking[]>([]);
  const [revenueReports, setRevenueReports] = useState<RevenueReport[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [disputeCases, setDisputeCases] = useState<DisputeCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoyaltyData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setRoyaltyCalculations(mockRoyaltyCalculations);
        setPaymentTracking(mockPaymentTracking);
        setRevenueReports(mockRevenueReports);
        setFeeStructures(mockFeeStructures);
        setDisputeCases(mockDisputeCases);
      } catch (error) {
        console.error('Error fetching royalty data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoyaltyData();
  }, []);

  const createDispute = async (dispute: Omit<DisputeCase, 'id' | 'created_at'>) => {
    const newDispute: DisputeCase = {
      ...dispute,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setDisputeCases(prev => [newDispute, ...prev]);
  };

  const updateDispute = async (id: string, updates: Partial<DisputeCase>) => {
    setDisputeCases(prev => 
      prev.map(dispute => 
        dispute.id === id 
          ? { ...dispute, ...updates }
          : dispute
      )
    );
  };

  const resolveDispute = async (id: string, resolution: string, resolutionAmount?: number) => {
    setDisputeCases(prev => 
      prev.map(dispute => 
        dispute.id === id 
          ? { 
              ...dispute, 
              status: 'resolved', 
              resolution, 
              resolution_amount: resolutionAmount,
              resolved_at: new Date().toISOString()
            }
          : dispute
      )
    );
  };

  const addPayment = async (payment: Omit<PaymentTracking, 'id' | 'transaction_id' | 'reference_number'>) => {
    const newPayment: PaymentTracking = {
      ...payment,
      id: Date.now().toString(),
      transaction_id: `TXN-${Date.now()}`,
      reference_number: `REF-${Date.now()}`
    };
    setPaymentTracking(prev => [newPayment, ...prev]);
  };

  const updatePaymentStatus = async (id: string, status: PaymentTracking['status'], processedDate?: string) => {
    setPaymentTracking(prev => 
      prev.map(payment => 
        payment.id === id 
          ? { 
              ...payment, 
              status, 
              processed_date: processedDate || payment.processed_date
            }
          : payment
      )
    );
  };

  const calculateRoyalty = async (franchiseId: string, period: string, grossRevenue: number) => {
    const franchise = royaltyCalculations.find(calc => calc.franchise_id === franchiseId);
    const feeStructure = feeStructures.find(fee => fee.fee_type === 'royalty' && fee.is_active);
    
    if (!feeStructure) return null;

    const royaltyRate = feeStructure.rate;
    const royaltyAmount = (grossRevenue * royaltyRate) / 100;
    const marketingFee = (grossRevenue * 2) / 100; // 2% marketing fee
    const technologyFee = 1500; // Fixed technology fee
    const totalFees = royaltyAmount + marketingFee + technologyFee;
    const netPayment = grossRevenue - totalFees;

    const newCalculation: RoyaltyCalculation = {
      id: Date.now().toString(),
      franchise_id: franchiseId,
      franchise_name: franchise?.franchise_name || 'Nueva Franquicia',
      period,
      gross_revenue: grossRevenue,
      royalty_rate: royaltyRate,
      royalty_amount: royaltyAmount,
      marketing_fee: marketingFee,
      technology_fee: technologyFee,
      total_fees: totalFees,
      net_payment: netPayment,
      status: 'calculated',
      calculated_at: new Date().toISOString(),
      due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setRoyaltyCalculations(prev => [newCalculation, ...prev]);
    return newCalculation;
  };

  const getCalculationsByStatus = (status: RoyaltyCalculation['status']) => {
    return royaltyCalculations.filter(calc => calc.status === status);
  };

  const getOverduePayments = () => {
    const today = new Date();
    return royaltyCalculations.filter(calc => 
      calc.status === 'approved' && new Date(calc.due_date) < today
    );
  };

  const getCompletedPayments = () => {
    return paymentTracking.filter(payment => payment.status === 'completed');
  };

  const getPendingPayments = () => {
    return paymentTracking.filter(payment => 
      payment.status === 'pending' || payment.status === 'processing'
    );
  };

  const getOpenDisputes = () => {
    return disputeCases.filter(dispute => 
      dispute.status === 'open' || dispute.status === 'under_review'
    );
  };

  const getTotalRoyalties = () => {
    return royaltyCalculations.reduce((sum, calc) => sum + calc.royalty_amount, 0);
  };

  const getTotalPayments = () => {
    return paymentTracking
      .filter(payment => payment.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  return {
    royaltyCalculations,
    paymentTracking,
    revenueReports,
    feeStructures,
    disputeCases,
    loading,
    createDispute,
    updateDispute,
    resolveDispute,
    addPayment,
    updatePaymentStatus,
    calculateRoyalty,
    getCalculationsByStatus,
    getOverduePayments,
    getCompletedPayments,
    getPendingPayments,
    getOpenDisputes,
    getTotalRoyalties,
    getTotalPayments
  };
} 