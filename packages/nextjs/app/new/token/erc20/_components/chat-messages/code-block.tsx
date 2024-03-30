import React from 'react';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type TLanguageMap = Record<string, string | undefined>;

export const programmingLanguages: TLanguageMap = {
  javascript: '.js',
  python: '.py',
  java: '.java',
  c: '.c',
  cpp: '.cpp',
  'c++': '.cpp',
  'c#': '.cs',
  ruby: '.rb',
  php: '.php',
  swift: '.swift',
  'objective-c': '.m',
  kotlin: '.kt',
  typescript: '.ts',
  go: '.go',
  perl: '.pl',
  rust: '.rs',
  scala: '.scala',
  haskell: '.hs',
  lua: '.lua',
  shell: '.sh',
  sql: '.sql',
  html: '.html',
  css: '.css'
};

type TMessageCodeBlock = {
  language: string;
  content: string;
};

function MessageCodeBlock({ language, content }: TMessageCodeBlock) {
  return (
    <div className='relative w-full rounded-md bg-zinc-950 font-sans'>
      <div className='flex w-full items-center justify-between rounded-t-md bg-muted px-2 py-1 text-muted-foreground'>
        <span className='text-sm lowercase'>{language}</span>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          width: '100%',
          background: 'transparent'
        }}
        codeTagProps={{
          style: {
            fontSize: '14px',
            fontFamily: 'var(--font-mono)'
          }
        }}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
}

const MessageCodeBlockMemorized = React.memo(MessageCodeBlock);

export default MessageCodeBlockMemorized;
