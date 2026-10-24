import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Use the project's existing compiler; no additional test dependency required.
const source = await readFile(new URL('../src/formSubmission.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { submitForm } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

for (const [form, data] of Object.entries({
  contact: { name: '李', email: 'person@example.com', message: '123', interests: ['one', 'two', 'three'] },
  newsletter: { email: 'person+dispatch@example.com' },
})) {
  test(`${form}: legitimate payload preserved, honeypot sent, correct request`, async () => {
    const fields = new FormData();
    fields.set('_honeypot', '');
    let calls = 0;
    const result = await submitForm('https://example.invalid/form', data, fields, async (url, options) => {
      calls++;
      assert.equal(url, 'https://example.invalid/form');
      assert.equal(options.method, 'POST');
      assert.equal(options.headers.Accept, 'application/json');
      assert.equal(options.headers['Content-Type'], 'application/json');
      assert.deepEqual(JSON.parse(options.body), { ...data, _honeypot: '' });
      assert.ok(options.signal instanceof AbortSignal);
      return new Response('{}', { status: 200 });
    });
    assert.equal(result, 'success');
    assert.equal(calls, 1);
  });

  test(`${form}: filled honeypot rejected without network call`, async () => {
    for (const value of ['spam', ' ', '0']) {
      const fields = new FormData();
      fields.set('_honeypot', value);
      assert.equal(await submitForm('unused', data, fields, () => assert.fail('must not POST')), 'rejected');
    }
  });

  test(`${form}: provider rejection is not success`, async () => {
    assert.equal(await submitForm('unused', data, new FormData(), async () => new Response('Rejected by spam protection', { status: 403 })), 'rejected');
  });

  test(`${form}: server/rate-limit errors and network/timeout failures allow retry`, async () => {
    for (const status of [400, 429, 500]) {
      assert.equal(await submitForm('unused', data, new FormData(), async () => new Response('', { status })), 'error');
    }
    for (const error of [new TypeError('offline'), new DOMException('timed out', 'TimeoutError')]) {
      assert.equal(await submitForm('unused', data, new FormData(), async () => { throw error; }), 'error');
    }
    assert.equal(await submitForm('unused', data, new FormData(), async () => new Response('{}')), 'success');
  });
}
