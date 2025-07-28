import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsS3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION', ''),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
          '',
        ),
      },
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME', '');
  }

  async uploadFile(
    file: Buffer,
    fileName: string,
    mimeType: string,
    folder?: string,
  ): Promise<string> {
    const key = folder ? `${folder}/${fileName}` : fileName;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: mimeType,
      ACL: 'public-read', // Cho phép public access
    });

    await this.s3Client.send(command);

    // Trả về URL của file
    return `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      // Extract key from URL
      const url = new URL(fileUrl);
      const key = url.pathname.substring(1); // Remove leading '/'

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      return false;
    }
  }

  async getSignedUrl(
    fileUrl: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const url = new URL(fileUrl);
      const key = url.pathname.substring(1);

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }

  generateFileName(originalName: string, prefix?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();

    return prefix
      ? `${prefix}_${timestamp}_${random}.${extension}`
      : `${timestamp}_${random}.${extension}`;
  }
}
