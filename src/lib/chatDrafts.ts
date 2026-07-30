const PREFIX = "muninn.chat.draft.";

export function chatDraftKey(scope: string, conversationId: string | null | undefined): string {
  return `${PREFIX}${scope}:${conversationId ?? "new"}`;
}

export function loadChatDraft(key: string): string {
  try {
    return sessionStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

export function saveChatDraft(key: string, value: string): void {
  try {
    if (!value.trim()) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearChatDraft(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
