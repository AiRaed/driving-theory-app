/** Learners do not see review status. The prop stays so call sites do not change. */
export default function ArabicDraftNote({ show }: { show: boolean }) {
  void show;
  return null;
}
