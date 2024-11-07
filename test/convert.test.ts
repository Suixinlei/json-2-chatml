import { convert } from '../src/index';
import { Conversation } from '../src/types';

describe('Template Rendering Tests', () => {
    const baseConversation: Conversation = [
        { role: 'user', content: 'Hi there!' },
        { role: 'assistant', content: 'Nice to meet you!' },
        { role: 'user', content: 'Can I ask a question?' }
    ];

    const conversationWithSystem: Conversation = [
        { role: 'system', content: 'System prompt.' },
        ...baseConversation
    ];

    describe('chatML Template', () => {
        it.each([
            [
                'default',
                baseConversation,
                {
                    addGenerationPrompt: false,
                },
                `<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
`
            ],
            [
                'with generation prompt',
                baseConversation,
                { addGenerationPrompt: true },
                `<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
<|im_start|>assistant
`
            ],
            [
                'with system prompt with generation prompt',
                conversationWithSystem,
                { addGenerationPrompt: true },
                `<|im_start|>system
System prompt.<|im_end|>
<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
<|im_start|>assistant
`
            ]
        ])('should render %s', (_, conversation, config, expected) => {
            const result = convert(conversation, {
                templateKey: 'chatML',
                ...config
            });
            expect(result).toBe(expected);
        });
    });

    describe('chatMLTemplate Tests', () => {
        it('should throw an error for incorrect role sequence', () => {
            const badConversation: Conversation = [
                { role: 'user', content: 'Hi!' },
                { role: 'user', content: 'Still there?' } // Incorrect sequence
            ];

            expect(() => {
                convert(badConversation, { templateKey: 'chatML' });
            }).toThrow(
                /Conversation roles must alternate user\/assistant\/user\/assistant\//
            );
        });
    });

    describe('Qwen2.5 Template', () => {
        it.each([
            [
                'default',
                baseConversation,
                {
                    addGenerationPrompt: false,
                },
                `<|im_start|>system
You are Qwen, created by Alibaba Cloud. You are a helpful assistant.<|im_end|>
<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
`
            ],
            [
                'with generation prompt',
                baseConversation,
                { addGenerationPrompt: true },
                `<|im_start|>system
You are Qwen, created by Alibaba Cloud. You are a helpful assistant.<|im_end|>
<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
<|im_start|>assistant
`
            ],
            [
                'with system prompt with generation prompt',
                conversationWithSystem,
                { addGenerationPrompt: true },
                `<|im_start|>system
System prompt.<|im_end|>
<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
<|im_start|>assistant
`
            ]
        ])('should render %s', (_, conversation, config, expected) => {
            const result = convert(conversation, {
                templateKey: 'qwen25',
                ...config
            });
            expect(result).toBe(expected);
        });
    });
});