import DragDrop from 'editorjs-drag-drop';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import List from '@editorjs/list';
import Warning from '@editorjs/warning';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
import Image from '@editorjs/image';
import Raw from '@editorjs/raw';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import CheckList from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import SimpleImage from '@editorjs/simple-image';
import Paragraph from '@editorjs/paragraph';

import { memo, Ref, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { ensuredForwardRef, useMount, useUnmount } from 'react-use';

export const EDITOR_JS_TOOLS = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: true
  },
  embed: Embed,
  table: Table,
  list: List,
  warning: Warning,
  code: Code,
  linkTool: LinkTool,
  image: Image,
  raw: Raw,
  header: Header,
  quote: Quote,
  marker: Marker,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage
};

interface EditorProps {
  data?: OutputData;
  onChange: (data: any) => void;
  editorblock: string;
}

const EditorFn = ensuredForwardRef<unknown, EditorProps>(({
                                                            data,
                                                            onChange,
                                                            editorblock
                                                          }: EditorProps, extRef: Ref<any>) => {
  const ref = useRef<EditorJS>();

  useMount(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        onReady: () => {
          new DragDrop(editor);
        },
        holder: editorblock,
        tools: EDITOR_JS_TOOLS,
        data: data ?? undefined,
        async onChange(api, event) {
          const outputData = await api.saver.save();
          onChange(outputData);
        }
      });
      ref.current = editor;
    }
  });

  useUnmount(() => {
    if (ref.current?.destroy) {
      ref.current.destroy();
    }
  });

  return <div ref={extRef} id={editorblock} />;
});

export const Editor = memo(EditorFn);
