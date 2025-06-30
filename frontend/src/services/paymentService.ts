
import apiClient from './api';

interface InitializePaymentResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

const initializePayment = async (projectId: number): Promise<InitializePaymentResponse> => {
  const response = await apiClient.post('/payments/initialize/', {
    project_id: projectId,
  });
  return response.data;
};

export default {
  initializePayment,
};
