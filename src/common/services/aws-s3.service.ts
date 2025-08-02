import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
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

  async checkFileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      if (
        error.name === 'NotFound' ||
        error.$metadata?.httpStatusCode === 404
      ) {
        return false;
      }
      // Log other errors but don't throw
      console.error('Error checking file existence:', error);
      return false;
    }
  }

  async checkFileExistsByUrl(fileUrl: string): Promise<boolean> {
    try {
      const url = new URL(fileUrl);
      const key = url.pathname.substring(1); // Remove leading '/'
      return await this.checkFileExists(key);
    } catch (error) {
      console.error('Error parsing file URL:', error);
      return false;
    }
  }

  async uploadFile(
    file: Buffer,
    fileName: string,
    mimeType: string,
    folder?: string,
    overwrite: boolean = false,
  ): Promise<string> {
    try {
      const key = folder ? `${folder}/${fileName}` : fileName;

      console.log('S3 Upload Config:', {
        bucketName: this.bucketName,
        region: this.configService.get('AWS_REGION'),
        key: key,
        mimeType: mimeType,
        fileSize: file.length,
        overwrite,
      });

      // Check if file already exists
      if (!overwrite) {
        const fileExists = await this.checkFileExists(key);
        if (fileExists) {
          console.log('File already exists on S3:', key);
          const existingUrl = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
          return existingUrl;
        }
      }

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: mimeType,
        ACL: 'public-read', // Cho phép public access
      });

      console.log('Sending command to S3...');
      const result = await this.s3Client.send(command);
      console.log('S3 response:', result);

      // Trả về URL của file
      const url = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
      console.log('Generated URL:', url);

      return url;
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw error;
    }
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

  async getFileMetadata(key: string) {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      return {
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        lastModified: response.LastModified,
        etag: response.ETag,
      };
    } catch (error) {
      console.error('Error getting file metadata:', error);
      return null;
    }
  }

  async getFileMetadataByUrl(fileUrl: string) {
    try {
      const url = new URL(fileUrl);
      const key = url.pathname.substring(1); // Remove leading '/'
      return await this.getFileMetadata(key);
    } catch (error) {
      console.error('Error parsing file URL for metadata:', error);
      return null;
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

  sanitizeFolderName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-') // Replace multiple dashes with single dash
      .trim(); // Remove leading/trailing spaces
  }
}
