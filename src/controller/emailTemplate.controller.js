import { emailService } from '@/services';

export const getEmailTemplates = async (req, res) => {
  try {
    const { filterBy, cursor } = req.query;
    const result = await emailService.getEmailTemplates(filterBy, cursor);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const getEmailTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await emailService.getEmailTemplateById(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const saveEmailTemplate = async (req, res) => {
  try {
    const { input } = req.body;
    const result = await emailService.saveEmailTemplate(input);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const deleteEmailTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await emailService.deleteEmailTemplate(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const testEmail = async (req, res) => {
  try {
    const { id, to } = req.body;
    const result = await emailService.testEmail({ id, toEmail: to, user: req.user });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
