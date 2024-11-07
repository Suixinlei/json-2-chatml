import { chatMLTemplate } from './chatMLTemplate';
import { qwen25Template } from './qwen25Template';

import { Templates } from '../types';

export const templates: Templates = {
    chatML: chatMLTemplate,
    qwen25: qwen25Template,
};