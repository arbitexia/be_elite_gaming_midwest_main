import config from '@/config';
import { securityHelper } from '@/helpers';
import { EMAIL_TEMPLATE_MAPPER } from '@/constants';

const getPlaceholders = (html) => {
  const placeholderLocations = [];
  html.split(' ').forEach((el) => {
    if (el.includes('~')) {
      let tmp = { word: el };
      Array.from(el).forEach((elc, index) => {
        if (elc === '~') tmp = { ...tmp, startAt: index };
        if (elc === '!') tmp = { ...tmp, endAt: index };
      });
      placeholderLocations.push(tmp);
    }
  });

  const placeholders = placeholderLocations.map((el) =>
    el.word.substring(el.startAt + 1, el.endAt)
  );
  return placeholders;
};

const getPartialLink = (useFor) => {
  if (useFor === EMAIL_TEMPLATE_MAPPER.VERIFY_EMAIL_USER_REGISTER) return 'verify/email';
  if (useFor === EMAIL_TEMPLATE_MAPPER.VERIFY_EMAIL_FORGOT_PASSWORD) return 'reset-password';
  return null;
};

const placeholderHelper = async ({ template, userInfo, adminInfo, ...rest }) => {
  let htmlBody = template.body;
  let token;
  const { subject } = template;
  const placeholders = getPlaceholders(template.body);

  if (placeholders.includes('VERIFY_LINK')) {
    token = securityHelper.genRandomTokenString(40);
    const expression = /~VERIFY_LINK!/g;
    const partialLink = getPartialLink(template.useFor);
    const value = `${config.FRONTEND_URL}/${partialLink}?token=${token}`;
    htmlBody = htmlBody.replace(expression, value);
  }

  if (placeholders.includes('USER_FULL_NAME')) {
    const expression = /~USER_FULL_NAME!/g;
    const value = `${userInfo.firstName} ${userInfo.lastName}`;
    htmlBody = htmlBody.replace(expression, value);
  }

  return { htmlBody, subject, token };
};

export default placeholderHelper;
