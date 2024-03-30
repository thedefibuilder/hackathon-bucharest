import React from 'react';

import type { Options } from 'react-markdown';

import ReactMarkdown from 'react-markdown';

function MessageMarkdown(properties: Options) {
  return <ReactMarkdown {...properties} />;
}

const MessageMarkdownMemorized = React.memo(
  MessageMarkdown,
  (previousProperties, nextProperties) =>
    previousProperties.children === nextProperties.children &&
    previousProperties.className === nextProperties.className
);

export default MessageMarkdownMemorized;
