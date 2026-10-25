export type SubmissionResult = 'success' | 'rejected' | 'error';

// Formspark checks this reserved field server-side, including for direct POSTs
// that contain it. A bot can still bypass this by omitting the field entirely.
export async function submitForm(
  endpoint: string,
  data: Record<string, string | string[]>,
  formData: FormData,
  send: typeof fetch = fetch,
): Promise<SubmissionResult> {
  const honeypot = String(formData.get('_honeypot') ?? '');
  if (honeypot) return 'rejected';

  try {
    const response = await send(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...data, _honeypot: honeypot }),
      signal: AbortSignal.timeout(15000),
    });
    if (response.status === 403) return 'rejected';
    return response.ok ? 'success' : 'error';
  } catch {
    return 'error';
  }
}
