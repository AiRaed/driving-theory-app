export class LearningCardsNotMigratedError extends Error {
  readonly code = 'LEARNING_CARDS_NOT_MIGRATED';
  constructor(message = 'Learning Cards tables are not migrated yet (0009 unapplied).') {
    super(message);
    this.name = 'LearningCardsNotMigratedError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isLearningCardsNotMigratedError(
  error: unknown
): error is LearningCardsNotMigratedError {
  return (
    error instanceof LearningCardsNotMigratedError ||
    (typeof error === 'object' &&
      error !== null &&
      ((error as { name?: string }).name === 'LearningCardsNotMigratedError' ||
        (error as { code?: string }).code === 'LEARNING_CARDS_NOT_MIGRATED'))
  );
}

export function isMissingLearningCardsTable(
  error: { message?: string; code?: string; details?: string } | null | undefined
): boolean {
  if (!error) return false;
  const code = String(error.code || '');
  const msg = `${error.message || ''} ${error.details || ''}`.toLowerCase();
  if (code === 'PGRST205' || code === '42P01' || code === 'PGRST204') return true;
  return (
    msg.includes('schema cache') ||
    msg.includes('does not exist') ||
    msg.includes('could not find the table') ||
    /keyword_cards|explanation_cards|explanation_card_recommendations|saved_cards|keyword_terms/.test(
      msg
    )
  );
}
