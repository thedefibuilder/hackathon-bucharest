import React from 'react';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import MessageCodeBlockMemorized from './code-block';
import MessageMarkdownMemorized from './markdown-memorized';

type TMessageMarkdown = {
  content: string;
};

export default function MessageMarkdown({ content }: TMessageMarkdown) {
  return (
    <MessageMarkdownMemorized
      className='prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6 break-words'
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        p({ children }) {
          return <p className='mb-2 last:mb-0'>{children}</p>;
        },
        code({ className, children, ...properties }) {
          const childArray = React.Children.toArray(children);
          const firstChild = childArray[0] as React.ReactElement;
          let firstChildAsString: React.ReactNode;

          if (React.isValidElement(firstChild)) {
            const childProperties = firstChild.props as { children?: React.ReactNode };
            firstChildAsString =
              childProperties.children === undefined ? '' : childProperties.children;
          } else {
            firstChildAsString = firstChild;
          }

          if (firstChildAsString === '▍') {
            return <span className='mt-1 animate-pulse cursor-default'>▍</span>;
          }

          if (typeof firstChildAsString === 'string') {
            childArray[0] = firstChildAsString.replace('`▍`', '▍');
          }

          const match = /language-(\w+)/.exec(className ?? '');

          if (typeof firstChildAsString === 'string' && !firstChildAsString.includes('\n')) {
            return (
              <code className={className} {...properties}>
                {childArray}
              </code>
            );
          }

          return (
            <MessageCodeBlockMemorized
              key={Math.random()}
              language={match?.[1] ?? ''}
              content={String(childArray).replace(/\n$/, '')}
              {...properties}
            />
          );
        }
      }}
    >
      {content}
    </MessageMarkdownMemorized>
  );
}
