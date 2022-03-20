interface EmberTemplateLintOptions {
    hasResultData: true;
    workingDirectory: string;
    rule: string;
}
declare const _default: {
    new (options: EmberTemplateLintOptions): {
        options: EmberTemplateLintOptions;
        format(): string;
    };
};

export { _default as default };
