import config from '@/config';
import { securityHelper } from '@/helpers';
import { EMAIL_SPECIAL_FIELD, EMAIL_TEMPLATE_CATEGORY, HASH_CODE_MODEL } from '@/constants';

const getPartialLink = (category) => {
  if (category === EMAIL_TEMPLATE_CATEGORY.CONFIRM_USER_REGISTER) return 'verify/email';
  if (category === EMAIL_TEMPLATE_CATEGORY.VERIFY_FORGOT_PASSWORD) return 'reset-password';
  return null;
};

const emailContentHelper = async ({ template, hashCodes, userInfo, adminInfo, pointInfo }) => {
  const { subject, htmlBody } = { ...template };
  const regex = /{{.*?}}/g;
  const placeholders = htmlBody.match(regex)?.map((text) => text.replace(/{{|}}/g, ''));
  let emailContent = htmlBody;
  let token;

  if (placeholders.length > 0) {
    placeholders.forEach((placeholder) => {
      const splittedText = placeholder.split('.');
      const model = splittedText[0];
      const field = splittedText[1];
      const hashCodeObj = hashCodes.find((obj) => obj.model === model && obj.field === field);
      if (hashCodeObj) {
        switch (hashCodeObj.model) {
          case HASH_CODE_MODEL.USER:
            if (field === EMAIL_SPECIAL_FIELD.LINK) {
              token = securityHelper.genRandomTokenString(40);
              const partialLink = getPartialLink(template.category);
              const value = `<a href = ${config.FRONTEND_URL}/${partialLink}?token=${token}>Click here</a>`;
              emailContent = emailContent.replace(`{{${placeholder}}}`, value);
            } else {
              emailContent = emailContent.replace(`{{${placeholder}}}`, userInfo[field]);
            }
            break;
          case HASH_CODE_MODEL.POINT:
            if (field === EMAIL_SPECIAL_FIELD.TOTAL_POINT) {
              const totalPointValue = pointInfo.totalPoint;
              emailContent = emailContent.replace(`{{${placeholder}}}`, totalPointValue);
            } else {
              emailContent = emailContent.replace(
                `{{${placeholder}}}`,
                userInfo[hashCodeObj.field]
              );
            }
            break;
          default:
            break;
        }
      }
    });
  }

  return { htmlBody: emailContent, subject, token };
};

export default emailContentHelper;
