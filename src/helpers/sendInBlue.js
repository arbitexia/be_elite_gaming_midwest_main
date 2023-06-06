import config from '@/config';
const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.SEND_IN_BLUE.EMAIL_API_KEY;
const transactionApiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const contactsApiInstance = new SibApiV3Sdk.ContactsApi();

export const GetTransactionEmailTemplates = async () => {
  const opts = {
    templateStatus: true,
    limit: 1000,
    offset: 0
  };
  const ret = await transactionApiInstance.getSmtpTemplates(opts);
  return ret;
};

export const GetTransactionEmailTemplateById = async ({ templateId }) => {
  const ret = await transactionApiInstance.getSmtpTemplate(templateId);
  return ret;
};

export const CreateContactEmail = async ({ email, firstName, lastName }) => {
  const createContact = new SibApiV3Sdk.CreateContact();
  createContact.email = email;
  if (firstName && lastName) {
    createContact.attributes = { FIRSTNAME: firstName, LASTNAME: lastName };
  }
  const { body } = await contactsApiInstance.createContact(createContact);
  return body; // return id
};

export const GetContactEmails = async () => {
  try {
    const opts = {
      limit: 1000,
      offset: 0
    };
    const { contacts } = await contactsApiInstance.getContacts(opts);
    return contacts;
  } catch (error) {
    return 'failed';
  }
};

export const SendEmailSendinBlue = async ({ email, name, templateId, pointInfo, token }) => {
  try {
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.templateId = templateId;
    let params = { FULLNAME: name, EMAIL: email };
    if (pointInfo) {
      params = { ...params, TOTAL_POINT: pointInfo.totalPoint, POINT_COUNT: pointInfo.point };
    }
    if (token) {
      const resetPwdLink = `${config.FRONTEND_URL}/reset-password?token=${token}`;
      params = { ...params, RESET_PASSWORD_LINK: resetPwdLink };
    }

    sendSmtpEmail.params = params;
    await transactionApiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    throw new Error('failed');
  }
};
