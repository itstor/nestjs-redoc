import Joi = require('joi');
import { OpenAPIObject } from '@nestjs/swagger';
export declare const schema: (document: OpenAPIObject) => Joi.ObjectSchema<any>;
