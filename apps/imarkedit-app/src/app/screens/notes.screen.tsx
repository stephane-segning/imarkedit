import { EditorForm } from '../components/editor-form';
import { useCallback } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { useNavigate } from 'react-router-dom';
import { useCreateNote } from '@imarkedit/lib/imarkedit-client';
import { useAuth } from '../services/auth';

export function NotesScreen() {
  const navigate = useNavigate();
  const { trigger: create } = useCreateNote();
  const { accountId } = useAuth();
  const onChange = useCallback(
    async (data: OutputData) => {
      const note = await create({
        data: {
          content: JSON.stringify(data),
          title: 'Note of ' + data.time,
          ownerId: accountId!
        }
      });
      navigate(`/notes/${note!.id}`);
    },
    [create, navigate, accountId]
  );

  return (
    <div>
      <EditorForm noteId="prev_data" onChange={onChange} />
    </div>
  );
}
