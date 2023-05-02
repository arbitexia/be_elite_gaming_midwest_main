import { sendInBlue } from '@/helpers';
import { GetTransactionEmailTemplateById } from '@/helpers/sendInBlue';
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
    const emailTemplate = await emailService.getEmailTemplateById(id);
    if (emailTemplate) {
      const templateInfo = await GetTransactionEmailTemplateById({
        templateId: emailTemplate.templateId
      });
      res.status(200).json({
        ...emailTemplate,
        htmlBody: templateInfo.htmlContent,
        subject: templateInfo.subject
      });
      return;
    }
    res.status(200).json(emailTemplate);
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

export const sendTestEmail = async (req, res) => {
  try {
    const { id, to } = req.body;
    const result = await emailService.testEmail({ id, toEmail: to, user: req.user });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const getSendinBlueEmailTemplates = async (req, res) => {
  try {
    const result = await sendInBlue.GetTransactionEmailTemplates();
    res.status(200).json(result.templates);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
