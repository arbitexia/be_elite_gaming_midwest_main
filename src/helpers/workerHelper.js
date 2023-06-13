import { AWSProvider } from '@/provider';

export const dispatchJob = async (eventId, workerName) => {
  try {
    const awsProvider = new AWSProvider();
    await awsProvider.invokeLambdaWorker(eventId, workerName);
  } catch (error) {
    throw error;
  }
};
