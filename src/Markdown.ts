import { createElement, Fragment } from 'react';
import { Lexer, marked } from 'marked';

import ReactParser from './ReactParser';
import ReactRenderer, { ReactRendererOptions } from './ReactRenderer';

interface LexerOptions {
  breaks?: marked.MarkedOptions['breaks'];
  gfm?: marked.MarkedOptions['gfm'];
}

export interface MarkdownProps extends ReactRendererOptions, LexerOptions {
  value?: string;
  children?: string;
  isInline?: boolean;
}

const validateComponentProps = (props: MarkdownProps) => {
  if (props.value && typeof props.value !== 'string') {
    throw new TypeError(`[marked-react]: Expected value to be of type string but got ${typeof props.value}`);
  }

  if (props.children && typeof props.children !== 'string') {
    throw new TypeError(`[marked-react]: Expected children to be of type string but got ${typeof props.children}`);
  }
};

const Markdown = (props: MarkdownProps) => {
  const {
    isInline = false,
    breaks = false,
    gfm = true,
    baseURL = undefined,
    openLinksInNewTab = true,
    langPrefix = 'language-',
    renderer = undefined,
  } = props;

  validateComponentProps(props);

  // lexer options
  const lexerOptions = {
    breaks,
    gfm,
  };

  // convert input markdown into tokens
  const markdownString = props.value ?? props.children ?? '';
  const tokens = isInline ? Lexer.lexInline(markdownString, lexerOptions) : Lexer.lex(markdownString, lexerOptions);

  // parser options
  const parserOptions = {
    renderer: new ReactRenderer({
      renderer,
      baseURL,
      openLinksInNewTab,
      langPrefix,
    }),
  };

  const parser = new ReactParser(parserOptions);
  const children = isInline ? parser.parseInline(tokens) : parser.parse(tokens);

  return createElement(Fragment, null, children);
};

export default Markdown;
