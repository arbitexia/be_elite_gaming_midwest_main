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

const emailContentHelper = async ({
  template,
  hashCodes,
  userInfo,
  adminInfo,
  pointInfo,
  ...rest
}) => {
  const { subject, htmlBody } = { ...template };
  const regex = /{{.*?}}/g;
  const placeholders = htmlBody.match(regex)?.map((text) => text.replace(/{{|}}/g, ''));
  let emailContent = htmlBody;
  let token;

  if (placeholders.length > 0) {
    placeholders.forEach((placeholder) => {
      const hashCodeObj = hashCodes.find((obj) => obj.name === placeholder);
      if (hashCodeObj) {
        emailContent = emailContent.replace(
          `{{${placeholder}}}`,
          hashCodeObj.model[hashCodeObj.field]
        );
      }
    });
  }

  // const placeholders = getPlaceholders(htmlBody);
  // if (placeholders.includes('VERIFY_LINK')) {
  //   token = securityHelper.genRandomTokenString(40);
  //   const expression = /~VERIFY_LINK!/g;
  //   // const partialLink = getPartialLink(template.useFor);
  //   const partialLink = 'verify/email';
  //   const value = `<a href = ${config.FRONTEND_URL}/${partialLink}?token=${token}>Click here</a>`;
  //   emailContent = htmlBody.replace(expression, value);
  // }

  // if (placeholders.includes('USER_FULL_NAME')) {
  //   const expression = /~USER_FULL_NAME!/g;
  //   const value = `${userInfo.firstName} ${userInfo.lastName}`;
  //   emailContent = htmlBody.replace(expression, value);
  // }

  // if (placeholders.includes('TOTAL_POINT')) {
  //   const pointEx = /~POINT!/g;
  //   const totalPointEx = /~TOTAL_POINT!/g;
  //   const pointValue = pointInfo.point;
  //   const totalPointValue = pointInfo.totalPoint;
  //   htmlBody = htmlBody.replace(pointEx, pointValue);
  //   emailContent = htmlBody.replace(totalPointEx, totalPointValue);
  // }

  return { emailContent, subject, token };
};

export default emailContentHelper;
