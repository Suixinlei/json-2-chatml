export type Message = {
    role: string;
    content: string;
};

export type Conversation = Message[];

export interface TemplateConfig {
    bosToken: string;
    eosToken: string;
    addBosToken?: boolean;
    addEosToken?: boolean;
    chatTemplate: string;
}

export interface Templates {
    [key: string]: TemplateConfig;
}