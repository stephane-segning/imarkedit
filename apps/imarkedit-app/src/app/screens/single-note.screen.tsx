import { Navigate, useParams } from 'react-router-dom';
import { EditorForm } from '../components/editor-form';
import { useFindUniqueNote, useUpdateNote } from '../services/api/hooks';
import { OutputData } from '@editorjs/editorjs';
import { useCallback } from 'react';

export function SingleNoteScreen() {
  const { noteId } = useParams();
  const { data: prevData, isLoading, error } = useFindUniqueNote({ where: { id: noteId! } });
  const { trigger: update } = useUpdateNote();
  const onChange = useCallback(async (data: OutputData) => {
    await update({ where: { id: noteId! }, data: { content: JSON.stringify(data) } });
  }, [noteId, update]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Navigate to={`/notes`} />;
  }

  return (
    <div>
        <EditorForm
          data={JSON.parse(prevData!.content)}
          noteId={noteId!}
          onChange={onChange}
        />
    </div>
  );
}
