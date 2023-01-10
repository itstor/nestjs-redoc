export interface RedocOptions {
    redocVersion?: string;
    title?: string;
    favicon?: string;
    logo?: LogoOptions;
    theme?: any;
    untrustedSpec?: boolean;
    supressWarnings?: boolean;
    hideHostname?: boolean;
    expandResponses?: string;
    requiredPropsFirst?: boolean;
    sortPropsAlphabetically?: boolean;
    showExtensions?: boolean | string;
    noAutoAuth?: boolean;
    pathInMiddlePanel?: boolean;
    hideLoading?: boolean;
    nativeScrollbars?: boolean;
    hideDownloadButton?: boolean;
    disableSearch?: boolean;
    onlyRequiredInSamples?: boolean;
    docName?: string;
    auth?: {
        enabled: boolean;
        user: string;
        password: string;
    };
    tagGroups?: TagGroupOptions[];
}
export interface LogoOptions {
    url?: string;
    backgroundColor?: string;
    altText?: string;
    href?: string;
}
export interface TagGroupOptions {
    name: string;
    tags: string[];
}
