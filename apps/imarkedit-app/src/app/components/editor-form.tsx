import { Editor } from './editor';
import { StorageConsumer } from './storage-consumer';
import { OutputData } from '@editorjs/editorjs';

export interface EditorFormProps {
  noteId: string;
  data?: OutputData;
  onChange?: (data: OutputData) => void;
}

export function EditorForm({ noteId, onChange, data }: EditorFormProps) {
  return (
    <div className="editor-w-full">
      <StorageConsumer<OutputData> defaultData={data} storageKey="editor-notes" getKey={noteId}>
        {(setValue, value) => (
          <Editor
            editorblock={`note-editor-${noteId}`}
            data={value}
            onChange={async (data) => Promise.all([
              (async () => setValue(data))(),
              (async () => onChange && onChange(data))()
            ])}
          />
        )}
      </StorageConsumer>
    </div>
  );
}
