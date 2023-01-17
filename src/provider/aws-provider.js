import AWS from 'aws-sdk';
import uniqid from 'uniqid';
import mime from 'mime';
import config from '@/config';

class AWSProvider {
  constructor() {
    const PRODUCTION = config.NODE_ENV === 'production';
    if (!PRODUCTION) {
      AWS.config.update({
        accessKeyId: config.AWS.ACCESS_KEY_ID,
        accessSecretKey: config.AWS.ACCESS_SECRET_KEY,
        region: config.AWS.REGION
      });
    }

    this.s3 = new AWS.S3({
      region: config.AWS.REGION,
      signatureVersion: 'v4'
    });

    this.sesv2 = new AWS.SESV2({
      region: config.AWS.REGION
    });

    this.lambdaClient = new AWS.Lambda({
      region: config.REGION
    });
  }

  invokeLambdaWorker(jobId, workerName) {
    return new Promise((resolve, reject) => {
      const params = {
        FunctionName: workerName,
        InvocationType: 'Event',
        Payload: JSON.stringify({ jobId })
      };
      this.lambdaClient.invoke(params, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  sendEmail(to, subject, body) {
    return new Promise((resolve, reject) => {
      const params = {
        FromEmailAddress: config.AWS.SES.SUPPORT_EMAIL,
        Destination: {
          ToAddresses: [to]
        },
        Content: {
          Simple: {
            Body: {
              Text: {
                Charset: 'UTF-8',
                Data: body
              }
            },
            Subject: {
              Charset: 'UTF-8',
              Data: subject
            }
          }
        }
      };

      this.sesv2.sendEmail(params, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  createPresignedPostData(fileName, bucketName, key) {
    return new Promise((resolve, reject) => {
      const contentType = mime.getType(fileName);

      const params = {
        Bucket: bucketName,
        Expires: 900,
        Fields: {
          'Content-Type': contentType,
          key: key || `${uniqid()}_${fileName}`,
          acl: 'public-read'
        }
      };

      this.s3.createPresignedPost(params, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
}

export default AWSProvider;
