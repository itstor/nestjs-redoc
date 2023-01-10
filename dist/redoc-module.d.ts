import { INestApplication } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';
import { RedocOptions } from './interfaces';
export declare class RedocModule {
    static setup(path: string, app: INestApplication, document: OpenAPIObject, options: RedocOptions): Promise<void>;
    private static setupFastify;
    private static validateOptionsObject;
    private static setupExpress;
    private static normalizePath;
    private static addVendorExtensions;
}
