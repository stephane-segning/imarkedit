import { Editor } from '../components/editor';
import { StorageConsumer } from '../components/storage-consumer';
import { OutputData } from '@editorjs/editorjs';

export function NotesScreen() {
  return (
    <div>
      Editor
      <StorageConsumer<OutputData> storageKey="editor-notes" getKey="prev_data">
        {(setValue, value) => (
          <Editor
            editorblock="note-editor"
            data={value}
            onChange={(data) => {
              setValue(data);
              console.log(data);
            }}
          />
        )}
      </StorageConsumer>
    </div>
  );
}
