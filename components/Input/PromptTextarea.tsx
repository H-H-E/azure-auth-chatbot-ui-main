import React, { DetailedHTMLProps, useCallback, useState } from 'react';

interface Props {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  rows?: number;
}

export const PromptTextarea = ({
  textareaRef,
  rows,
  onChange,
  onKeyDown,
  ...restProps
}: Props &
  DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >) => {
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.call(e, e);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (isTyping || e.key !== 'Enter') {
        return;
      }
      onKeyDown?.call(e, e);
    },
    [isTyping, onKeyDown],
  );

  return (
    <textarea
      ref={textareaRef}
      rows={rows}
      onCompositionStart={() => setIsTyping(true)}
      onCompositionEnd={() => setIsTyping(false)}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...restProps}
    />
  );
};
