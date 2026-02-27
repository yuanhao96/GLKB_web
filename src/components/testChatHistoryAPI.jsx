import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE = '/api/v1';

const box = {
  maxWidth: '1080px',
  margin: '20px auto',
  padding: '20px',
  border: '1px solid #d9d9d9',
  borderRadius: '10px',
  fontFamily: 'Arial, sans-serif',
};

const row = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginTop: '10px',
};

const input = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #bfbfbf',
  borderRadius: '6px',
  marginBottom: '10px',
};

const logStyle = {
  whiteSpace: 'pre-wrap',
  background: '#f7f7f7',
  border: '1px solid #e8e8e8',
  borderRadius: '8px',
  padding: '12px',
  marginTop: '14px',
  maxHeight: '420px',
  overflowY: 'auto',
  fontFamily: 'Menlo, Monaco, Consolas, monospace',
  fontSize: '12px',
  lineHeight: 1.45,
};

const pretty = (value) => JSON.stringify(value, null, 2);

const defaultQuestions = [
  'What is BRCA1 and why is it important?',
  'How does BRCA1 relate to homologous recombination?',
  'Summarize in 3 short bullet points for a medical student.',
].join('\n');

const splitQuestions = (raw) =>
  raw
    .split('\n')
    .map((v) => v.trim())
    .filter(Boolean);

const getAccessToken = () => localStorage.getItem('access_token') || '';
const getTokenType = () => localStorage.getItem('token_type') || 'bearer';

const TestChatHistoryAPI = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [questionsInput, setQuestionsInput] = useState(defaultQuestions);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);

  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [tokenSnapshot, setTokenSnapshot] = useState('');
  const [lastHid, setLastHid] = useState(null);

  const tokenPresent = useMemo(() => !!tokenSnapshot, [tokenSnapshot]);

  useEffect(() => {
    setTokenSnapshot(getAccessToken());
  }, []);

  const addLog = (label, payload) => {
    const at = new Date().toISOString();
    const line =
      payload === undefined
        ? `[${at}] ${label}`
        : `[${at}] ${label}\n${typeof payload === 'string' ? payload : pretty(payload)}`;
    setLogs((prev) => [...prev, line]);
    console.log(line);
  };

  const clearLogs = () => setLogs([]);

  const refreshTokenStatus = () => {
    const token = getAccessToken();
    setTokenSnapshot(token);
    return token;
  };

  const requireJwt = () => {
    const token = refreshTokenStatus();
    if (!token) {
      addLog('ERROR: No JWT found. Verify code first.');
      return false;
    }
    return true;
  };

  const clearJwt = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user');
    setVerified(false);
    setCodeSent(false);
    refreshTokenStatus();
    addLog('Cleared JWT and auth-related localStorage keys');
  };

  // API 1: POST /email-auth/send-code
  const sendCode = async () => {
    if (!email.trim()) {
      addLog('ERROR: email is required for send-code');
      return;
    }

    try {
      setRunning(true);
      addLog('POST /email-auth/send-code (start)', { email: email.trim() });
      const res = await axios.post(`${API_BASE}/email-auth/send-code`, { email: email.trim() });
      setCodeSent(true);
      addLog('POST /email-auth/send-code (success)', res.data);
    } catch (error) {
      setCodeSent(false);
      addLog('POST /email-auth/send-code (failed)', error.response?.data || { detail: error.message });
    } finally {
      setRunning(false);
      refreshTokenStatus();
    }
  };

  // API 2: POST /email-auth/verify
  const verify = async () => {
    if (!email.trim() || !code.trim()) {
      addLog('ERROR: email and verification code are required');
      return;
    }

    try {
      setRunning(true);
      addLog('POST /email-auth/verify (start)', { email: email.trim(), code: code.trim() });
      const res = await axios.post(`${API_BASE}/email-auth/verify`, {
        email: email.trim(),
        code: code.trim(),
      });

      const { access_token, token_type, user } = res.data || {};
      if (access_token) {
        localStorage.setItem('access_token', access_token);
      }
      if (token_type) {
        localStorage.setItem('token_type', token_type);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      setVerified(!!access_token);
      addLog('POST /email-auth/verify (success)', res.data);
    } catch (error) {
      setVerified(false);
      addLog('POST /email-auth/verify (failed)', error.response?.data || { detail: error.message });
    } finally {
      setRunning(false);
      refreshTokenStatus();
    }
  };

  // API: POST /new-llm-agent/stream
  // Runs one question against one history and parses SSE until completion.
  const runOneStreamQuestion = async (historyId, question, idx) => {
    addLog(`POST /new-llm-agent/stream Q${idx + 1} (start)`, {
      history_id: historyId,
      question,
    });

    const events = [];
    let buffer = '';
    let processedLength = 0;

    const processSseChunk = (chunk) => {
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || !line.startsWith('data:')) {
          continue;
        }
        const payload = line.replace(/^data:\s*/, '');
        try {
          const evt = JSON.parse(payload);
          events.push(evt);
        } catch {
          addLog(`SSE parse skipped Q${idx + 1}`, payload);
        }
      }
    };

    await axios.post(
      `${API_BASE}/new-llm-agent/stream`,
      {
        question,
        messages: [],
        max_articles: 5,
        history_id: historyId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        responseType: 'text',
        onDownloadProgress: (progressEvent) => {
          const xhr = progressEvent?.event?.target || progressEvent?.target;
          const responseText = xhr?.responseText;
          if (!responseText) {
            return;
          }
          const chunk = responseText.slice(processedLength);
          if (!chunk) {
            return;
          }
          processedLength = responseText.length;
          processSseChunk(chunk);
        },
      }
    );

    const complete = events.find((e) => e.step === 'Complete');
    const saved = events.find((e) => e.step === 'Saved');

    addLog(`POST /new-llm-agent/stream Q${idx + 1} (done)`, {
      eventCount: events.length,
      hasComplete: !!complete,
      savedHistoryId: saved?.history_id ?? null,
      answerPreview: complete?.response?.slice?.(0, 140) || '',
    });

    if (!complete) {
      throw new Error(`Q${idx + 1}: missing SSE Complete event`);
    }
    if (!saved || saved.history_id !== historyId) {
      throw new Error(`Q${idx + 1}: missing/invalid Saved event history_id`);
    }

    return { complete, saved, events };
  };

  // Full scenario based on CHAT_HISTORY_API typical frontend flow.
  const runScenario = async () => {
    const questions = splitQuestions(questionsInput);
    if (!questions.length) {
      addLog('ERROR: add at least one question in the question list');
      return;
    }

    if (!requireJwt()) {
      return;
    }

    setRunning(true);
    let createdHid = null;
    let secondHid = null;

    try {
      addLog('Scenario start', { questionCount: questions.length });

      // 1) GET /new-llm-agent/history -> should be no history for this test case
      const listBefore = await axios.get(`${API_BASE}/new-llm-agent/history`, {
        params: { offset: 0, limit: 100 },
      });
      const initialTotal = listBefore.data?.total ?? 0;
      addLog('GET /new-llm-agent/history (before)', listBefore.data);
      
      if (initialTotal !== 0) {
        addLog('NO-HISTORY TEST FAIL', {
          expected: 0,
          actual: initialTotal,
          note: 'User already has history. Continue test anyway.',
        });
      } else {
        addLog('NO-HISTORY TEST PASS', { total: initialTotal });
      }

      // 2) POST /new-llm-agent/history
      const createTitle = `Scenario test ${Date.now()}`;
      const created = await axios.post(`${API_BASE}/new-llm-agent/history`, {
        leading_title: createTitle,
      });
      createdHid = created.data?.hid;
      setLastHid(createdHid);
      addLog('POST /new-llm-agent/history (created)', created.data);

      // 3) Negative tests with made-up hid for hid-based APIs
      const nonExistingHid = createdHid + 999999;

      try {
        await axios.get(`${API_BASE}/new-llm-agent/history/${nonExistingHid}`);
        addLog('GET non-existing history FAIL', {
          hid: nonExistingHid,
          note: 'Expected 404 but got success',
          
        });
      } catch (error) {
        addLog('GET non-existing history result', error.response?.data || { detail: error.message });
      }

      try {
        await axios.patch(`${API_BASE}/new-llm-agent/history/${nonExistingHid}`, {
          leading_title: `Invalid hid ${Date.now()}`,
        });
        addLog('PATCH non-existing history FAIL', {
          hid: nonExistingHid,
          note: 'Expected 404 but got success',
        });
      } catch (error) {
        addLog('PATCH non-existing history result', error.response?.data || { detail: error.message });
      }

      try {
        const tokenType = getTokenType();
        const token = getAccessToken();
        const invalidStreamRes = await fetch(`${API_BASE}/new-llm-agent/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            Authorization: `${tokenType} ${token}`,
          },
          body: JSON.stringify({
            question: questions[0],
            messages: [],
            max_articles: 5,
            history_id: nonExistingHid,
          }),
        });

        if (invalidStreamRes.ok) {
          addLog('STREAM non-existing history FAIL', {
            hid: nonExistingHid,
            note: 'Expected non-2xx but got success',
            status: invalidStreamRes.status,
          });
        } else {
          const bodyText = await invalidStreamRes.text();
          let bodyData = bodyText;
          try {
            bodyData = JSON.parse(bodyText);
          } catch {
            // Keep plain text if not JSON.
          }
          addLog('STREAM non-existing history result', bodyData);
        }
      } catch (error) {
        addLog('STREAM non-existing history result', { detail: error.message });
      }

      try {
        await axios.delete(`${API_BASE}/new-llm-agent/history/${nonExistingHid}`);
        addLog('DELETE non-existing history FAIL', {
          hid: nonExistingHid,
          note: 'Expected 404 but got success',
        });
      } catch (error) {
        addLog('DELETE non-existing history result', error.response?.data || { detail: error.message });
      }

      // 4) POST /new-llm-agent/stream for each user-provided question
      for (let i = 0; i < questions.length; i += 1) {
        await runOneStreamQuestion(createdHid, questions[i], i);
      }

      // 5) GET /new-llm-agent/history/{hid} and validate messages are saved
      const detail = await axios.get(`${API_BASE}/new-llm-agent/history/${createdHid}`);
      const messages = detail.data?.messages || [];
      const userCount = messages.filter((m) => m.role === 'user').length;
      const assistantCount = messages.filter((m) => m.role === 'assistant').length;
      const expectedPairs = questions.length;

      addLog('GET /new-llm-agent/history/{hid} (after streams)', detail.data);

      if (userCount < expectedPairs || assistantCount < expectedPairs) {
        addLog('SAVE-VERIFICATION FAIL', {
          expectedAtLeast: expectedPairs,
          userCount,
          assistantCount,
        });
      } else {
        addLog('SAVE-VERIFICATION PASS', {
          userCount,
          assistantCount,
        });
      }

      // 5.5) Test /new-llm-agent/history Get to update leading_title
      const overallHistory = await axios.get(`${API_BASE}/new-llm-agent/history`);
      addLog('GET /new-llm-agent/history (after update)', overallHistory.data);

      // 5.6) PATCH existing history title
      const patched = await axios.patch(`${API_BASE}/new-llm-agent/history/${createdHid}`, {
        leading_title: 'IChangedChatHistory',
      });
      addLog('PATCH existing history result', patched.data);

      // 5.7) Create a second chat history and ask the same questions
      const secondCreated = await axios.post(`${API_BASE}/new-llm-agent/history`, {
        leading_title: `Scenario test second ${Date.now()}`,
      });
      secondHid = secondCreated.data?.hid;
      setLastHid(secondHid);
      addLog('POST /new-llm-agent/history (second created)', secondCreated.data);

      for (let i = 0; i < questions.length; i += 1) {
        await runOneStreamQuestion(secondHid, questions[i], i);
      }

      const listAfterSecondHistory = await axios.get(`${API_BASE}/new-llm-agent/history`, {
        params: { offset: 0, limit: 100 },
      });
      addLog('GET /new-llm-agent/history (after second chat)', listAfterSecondHistory.data);

      const historyIds = (listAfterSecondHistory.data?.histories || []).map((h) => h.hid);
      const hasFirst = historyIds.includes(createdHid);
      const hasSecond = historyIds.includes(secondHid);
      addLog('TWO-HISTORY CHECK', {
        firstHid: createdHid,
        secondHid,
        hasFirst,
        hasSecond,
        pass: hasFirst && hasSecond,
      });

      
      const patchedDetail = await axios.get(`${API_BASE}/new-llm-agent/history/${createdHid}`);
      addLog('GET patched history detail', patchedDetail.data);

      // 6) DELETE /new-llm-agent/history/{hid} existing chats
      const secondDeleted = await axios.delete(`${API_BASE}/new-llm-agent/history/${secondHid}`);
      addLog('DELETE second existing history result', secondDeleted.data);

      const deleted = await axios.delete(`${API_BASE}/new-llm-agent/history/${createdHid}`);
      addLog('DELETE first existing history result', deleted.data);

      // 7) GET /new-llm-agent/history/{hid} after delete (expect 404)
      try {
        await axios.get(`${API_BASE}/new-llm-agent/history/${secondHid}`);
        addLog('POST-DELETE CHECK FAIL (second)', {
          hid: secondHid,
          note: 'Expected detail 404 after delete but got success',
        });
      } catch (error) {
        addLog('POST-DELETE CHECK result (second)', error.response?.data || { detail: error.message });
      }

      try {
        await axios.get(`${API_BASE}/new-llm-agent/history/${createdHid}`);
        addLog('POST-DELETE CHECK FAIL', {
          hid: createdHid,
          note: 'Expected detail 404 after delete but got success',
        });
      } catch (error) {
        addLog('POST-DELETE CHECK result', error.response?.data || { detail: error.message });
      }

      createdHid = null;
      secondHid = null;
      addLog('Scenario complete');
    } catch (error) {
      addLog('Scenario failed', error.response?.data || { detail: error.message });
    } finally {
      // Cleanup only if failure happened before explicit delete.
      if (secondHid) {
        try {
          await axios.delete(`${API_BASE}/new-llm-agent/history/${secondHid}`);
          addLog('Cleanup delete succeeded (second)', { hid: secondHid });
        } catch {
          addLog('Cleanup delete failed (second)', { hid: secondHid });
        }
      }
      if (createdHid) {
        try {
          await axios.delete(`${API_BASE}/new-llm-agent/history/${createdHid}`);
          addLog('Cleanup delete succeeded', { hid: createdHid });
        } catch {
          addLog('Cleanup delete failed', { hid: createdHid });
        }
      }

      setRunning(false);
      refreshTokenStatus();
    }
  };

  return (
    <div style={box}>
      <h2 style={{ marginTop: 0 }}>Chat History API Scenario Tester</h2>
      <p style={{ marginBottom: '12px' }}>
        This page runs a sequential test flow based on the CHAT_HISTORY API doc.
      </p>

      <h3 style={{ marginBottom: '8px' }}>1) Email Auth</h3>
      <label htmlFor="test-email">Email</label>
      <input
        id="test-email"
        style={input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        disabled={running}
      />

      <label htmlFor="test-code">Verification Code</label>
      <input
        id="test-code"
        style={input}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="6-digit code"
        disabled={running}
      />

      <div style={row}>
        <button type="button" onClick={sendCode} disabled={running}>
          Send Code
        </button>
        <button type="button" onClick={verify} disabled={running}>
          Verify Code
        </button>
        <button type="button" onClick={clearJwt} disabled={running}>
          Clear JWT
        </button>
      </div>

      <div style={{ marginTop: '10px', fontSize: '13px' }}>
        <div>
          <strong>Code Sent:</strong> {codeSent ? 'yes' : 'no'}
        </div>
        <div>
          <strong>Verified:</strong> {verified ? 'yes' : 'no'}
        </div>
        <div>
          <strong>JWT Present:</strong> {tokenPresent ? 'yes' : 'no'}
        </div>
        <div>
          <strong>JWT Accuracy Check:</strong>{' '}
          {verified && tokenPresent
            ? 'PASS (verify succeeded and token exists)'
            : !verified && !tokenPresent
            ? 'PASS (not verified and no token)'
            : 'CHECK (state mismatch; re-verify or clear old token)'}
        </div>
      </div>

      <h3 style={{ marginTop: '18px', marginBottom: '8px' }}>2) Question List For Stream</h3>
      <label htmlFor="questions">One question per line</label>
      <textarea
        id="questions"
        style={{ ...input, minHeight: '140px', resize: 'vertical' }}
        value={questionsInput}
        onChange={(e) => setQuestionsInput(e.target.value)}
        disabled={running}
      />

      <div style={row}>
        <button type="button" onClick={runScenario} disabled={running}>
          Run Full Scenario Test
        </button>
        <button type="button" onClick={clearLogs} disabled={running}>
          Clear Logs
        </button>
      </div>

      <div style={{ marginTop: '10px', fontSize: '13px' }}>
        <div>
          <strong>Last Created hid:</strong> {lastHid ?? 'none'}
        </div>
      </div>

      <div style={logStyle}>{logs.length ? logs.join('\n\n') : 'No logs yet.'}</div>
    </div>
  );
};

export default TestChatHistoryAPI;
