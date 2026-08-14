import QuestionEditor from '@/components/admin/QuestionEditor';

export default function EditQuestionPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { preview?: string };
}) {
  const id = decodeURIComponent(params.id);
  return (
    <QuestionEditor
      mode="edit"
      questionId={id}
      initialPreview={searchParams?.preview === '1'}
    />
  );
}
