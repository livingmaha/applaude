import apiClient from './api';

interface InitializePaymentResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

const initializePayment = async (projectId: number, planType: 'ONETIME' | 'MONTHLY' | 'YEARLY'): Promise<InitializePaymentResponse> => {
  const response = await apiClient.post('/payments/initialize/', {
    project_id: projectId,
    plan_type: planType,
  });
  return response.data;
};

export default {
  initializePayment,
};
