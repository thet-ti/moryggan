import { S3 } from 'aws-sdk';
import { getContentTypeFromBase64, getUniqueFilename } from '../utils/file';
import { logger } from '../utils/logger';
import { env } from '../utils/env';

export interface IAWSS3Return {
  ETag: string;
  Location: string;
  Key: string;
  Bucket: string;
}

export class AwsService {
  static async upload(file : any) {
    const { originalName } = file;
    const bucketS3 = env.AWS_BUCKET;
    await this.uploadS3(file.buffer, bucketS3, originalName);
  }

  static async uploadS3(
    file: any,
    bucket: string,
    name: string,
    contentType?: any,
  ): Promise<S3.ManagedUpload.SendData> {

    const s3 = this.getS3();
    let params : any = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };

    if (contentType) {
      params = {
        ...params,
        ContentType: contentType,
      };
    }

    return new Promise((resolve, reject) => {
      s3.upload(params, (err : Error, data: S3.ManagedUpload.SendData) => {
        if (err) {
          logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  static async uploadBase64(base64: string): Promise<S3.ManagedUpload.SendData> {
    const contentType = getContentTypeFromBase64(base64);

    let buffer = Buffer.from(
      base64.replace(/data:\w+\/\w+;base64,/, ''),
      'base64',
    );

    if (contentType.includes('svg')) {
      buffer = Buffer.from(
        base64.replace(/^data:image\/[a-zA-Z+]+;base64,/, ''),
        'base64',
      );
    }

    const extension = base64.split(';')[0].split('/')[1];

    return this.uploadS3(
      buffer,
      env.AWS_BUCKET,
      getUniqueFilename(extension || ''),
      contentType,
    )
      .then((res) => res)
      .catch((err) => {
        throw new Error(err);
      });
  }

  static getS3() {
    return new S3({
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      signatureVersion: 'v4',
    });
  }
}
