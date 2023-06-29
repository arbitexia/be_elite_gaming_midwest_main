import { checkOpenedEmailHandler } from '@/services/webhook.service';

export const CheckFirstOpeningEmail = async (req, res) => {
  try {
    const result = await checkOpenedEmailHandler(req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
