import { EditorForm } from '../components/editor-form';
import { useCreateNote } from '../services/api/hooks';
import { useCallback } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { useNavigate } from 'react-router-dom';

export function NotesScreen() {
  const navigate = useNavigate();
  const { trigger: create } = useCreateNote();
  const onChange = useCallback(async (data: OutputData) => {
    const note = await create({
      data: {
        content: JSON.stringify(data),
        title: 'miaou',
        ownerId: 'xmiaou'
      }
    });
    navigate(`/notes/${note!.id}`);
  }, [create, navigate]);

  return (
    <div>
      <EditorForm
        noteId="prev_data"
        onChange={onChange}
      />
    </div>
  );
}
