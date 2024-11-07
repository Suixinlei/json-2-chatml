import nunjucks from 'nunjucks';
import { Conversation } from './types';
import { templates } from './templates';
import { TemplateConfig } from './types';
import { strftime } from './util';

interface ApplyTemplateOptions {
  templateKey?: string;
  addGenerationPrompt?: boolean;
  isBeginningOfSequence?: boolean;
  isEndOfSequence?: boolean;
}

export const convert = (
  conversation: Conversation | Conversation[],
  options: ApplyTemplateOptions = {}
): string | string[] => {
  const {
    templateKey = 'default',
    addGenerationPrompt = false,
    isBeginningOfSequence,
    isEndOfSequence
  } = options;

  const nunjucksEnv = new nunjucks.Environment(null, { autoescape: false });

  nunjucksEnv.addGlobal('raise_exception', (message: string) => {
    throw new Error(`${message}`);
  });

  nunjucksEnv.addGlobal('strftime_now', (format: string) => {
    const now = new Date();
    return strftime(now, format);
  });

  const template: TemplateConfig = templates[templateKey];
  const templateString = template.chatTemplate;

  const renderTemplate = (chat: Conversation): string => {
    let result = nunjucksEnv.renderString(templateString, {
      messages: chat,
      add_generation_prompt: addGenerationPrompt,
      bos_token: template.bosToken,
      eos_token: template.eosToken
    });

    const shouldAddBosToken =
      isBeginningOfSequence !== undefined
        ? isBeginningOfSequence
        : template.addBosToken;

    const shouldAddEosToken =
      isEndOfSequence !== undefined ? isEndOfSequence : template.addEosToken;

    if (shouldAddBosToken && template.bosToken) {
      if (!result.startsWith(template.bosToken)) {
        result = template.bosToken + result;
      }
    }

    if (shouldAddEosToken && template.eosToken) {
      if (!result.endsWith(template.eosToken)) {
        result += template.eosToken;
      }
    }

    return result;
  };

  if (Array.isArray(conversation[0])) {
    return (conversation as Conversation[]).map(renderTemplate);
  } else {
    return renderTemplate(conversation as Conversation);
  }
};