# json-2-chatml

A lightweight utility to convert JSON conversation format to ChatML format and Qwen2.5 format.

## Installation

```bash
npm install json-2-chatml
```

## Usage

This package exports a single `convert` function that transforms conversation objects into ChatML or Qwen2.5 format strings.

```typescript
import { convert } from 'json-2-chatml';

const conversation = [
  { role: 'user', content: 'Hi there!' },
  { role: 'assistant', content: 'Nice to meet you!' },
  { role: 'user', content: 'Can I ask a question?' }
];

// Basic usage with ChatML format
const chatMLResult = convert(conversation, { templateKey: 'chatML' });

// Basic usage with Qwen2.5 format
const qwenResult = convert(conversation, { templateKey: 'qwen25' });
```

## API

### convert(conversation, config)

#### Parameters

- `conversation`: Array of message objects with the following structure:
  ```typescript
  interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }
  ```

- `config`: Configuration object with the following options:
  ```typescript
  interface Config {
    templateKey: 'chatML' | 'qwen25';  // Required: Template format to use
    addGenerationPrompt?: boolean;      // Optional: Add assistant prompt at the end (default: false)
    isBeginningOfSequence?: boolean;    // Optional: Add BOS token (default: false)
    isEndOfSequence?: boolean;          // Optional: Add EOS token (default: false)
  }
  ```

#### Returns

Returns a string in the specified template format.

## Examples

### ChatML Format

```typescript
const conversation = [
  { role: 'user', content: 'Hi there!' },
  { role: 'assistant', content: 'Nice to meet you!' }
];

// Basic conversion
const result = convert(conversation, { templateKey: 'chatML' });
// Output:
// <|im_start|>user
// Hi there!<|im_end|>
// <|im_start|>assistant
// Nice to meet you!<|im_end|>

// With generation prompt
const resultWithPrompt = convert(conversation, { 
  templateKey: 'chatML',
  addGenerationPrompt: true 
});
// Output:
// <|im_start|>user
// Hi there!<|im_end|>
// <|im_start|>assistant
// Nice to meet you!<|im_end|>
// <|im_start|>assistant
```

### Qwen2.5 Format

```typescript
// Basic conversion
const result = convert(conversation, { templateKey: 'qwen25' });
// Output includes default system prompt:
// <|im_start|>system
// You are Qwen, created by Alibaba Cloud. You are a helpful assistant.<|im_end|>
// <|im_start|>user
// Hi there!<|im_end|>
// <|im_start|>assistant
// Nice to meet you!<|im_end|>

// With custom system prompt
const conversationWithSystem = [
  { role: 'system', content: 'Custom system prompt.' },
  ...conversation
];
const resultWithSystem = convert(conversationWithSystem, { templateKey: 'qwen25' });
```

## Rules and Validation

- The conversation must follow a valid role sequence (user/assistant/user/assistant)
- An error will be thrown if the role sequence is invalid
- System messages are optional and must appear at the beginning of the conversation

## License

MIT