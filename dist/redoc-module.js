"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedocModule = void 0;
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const express_handlebars_1 = require("express-handlebars");
const path_1 = __importDefault(require("path"));
const options_model_1 = require("./model/options.model");
const posix_1 = require("path/posix");
class RedocModule {
    static setup(path, app, document, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _options = yield this.validateOptionsObject(options, document);
                const redocDocument = this.addVendorExtensions(_options, document);
                const httpAdapter = app.getHttpAdapter();
                if (httpAdapter &&
                    httpAdapter.constructor &&
                    httpAdapter.constructor.name === 'FastifyAdapter') {
                    return this.setupFastify();
                }
                return yield this.setupExpress(path, app, redocDocument, _options);
            }
            catch (error) {
                throw error;
            }
        });
    }
    static setupFastify() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Fastify is not implemented yet');
        });
    }
    static validateOptionsObject(options, document) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (0, options_model_1.schema)(document).validateAsync(options);
            }
            catch (error) {
                throw new TypeError(error.message);
            }
        });
    }
    static setupExpress(path, app, document, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const httpAdapter = app.getHttpAdapter();
            const finalPath = this.normalizePath(path);
            const resolvedPath = finalPath.slice(-1) !== '/' ? finalPath + '/' : finalPath;
            const docUrl = (0, posix_1.join)(resolvedPath, `${options.docName}.json`);
            const hbs = (0, express_handlebars_1.create)({
                helpers: {
                    toJSON: function (object) {
                        return JSON.stringify(object);
                    },
                },
            });
            const { title, favicon, theme, redocVersion } = options, otherOptions = __rest(options, ["title", "favicon", "theme", "redocVersion"]);
            const renderData = {
                data: Object.assign({ title,
                    docUrl,
                    favicon,
                    redocVersion, options: otherOptions }, (theme && {
                    theme: Object.assign({}, theme),
                })),
            };
            const redocFilePath = path_1.default.join(__dirname, '..', 'views', 'redoc.handlebars');
            const redocHTML = yield hbs.render(redocFilePath, renderData);
            httpAdapter.get(finalPath, (req, res) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const sendPage = () => {
                    res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; child-src * 'unsafe-inline' 'unsafe-eval' blob:; worker-src * 'unsafe-inline' 'unsafe-eval' blob:; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';");
                    res.send(redocHTML);
                };
                if ((_a = options.auth) === null || _a === void 0 ? void 0 : _a.enabled) {
                    const { user, password } = options.auth;
                    (0, express_basic_auth_1.default)({ users: { [user]: password }, challenge: true })(req, res, () => {
                        sendPage();
                    });
                }
                else {
                    sendPage();
                }
            }));
            httpAdapter.get(docUrl, (req, res) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(document);
            });
        });
    }
    static normalizePath(path) {
        return path.charAt(0) !== '/' ? '/' + path : path;
    }
    static addVendorExtensions(options, document) {
        if (options.logo) {
            const logoOption = Object.assign({}, options.logo);
            document.info['x-logo'] = logoOption;
        }
        if (options.tagGroups) {
            document['x-tagGroups'] = options.tagGroups;
        }
        return document;
    }
}
exports.RedocModule = RedocModule;
