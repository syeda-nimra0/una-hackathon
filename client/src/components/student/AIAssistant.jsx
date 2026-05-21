import { useState, useRef, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Send, Upload, FileText, Sparkles, BookOpen, ClipboardList,
  History, X, ChevronDown, Mic, MicOff, Trash2, Download,
  RotateCcw, CheckCircle, XCircle, Clock, Brain, Plus, Search
} from 'lucide-react'
import toast from 'react-hot-toast'
import './AIAssistant.css'

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`

const SITE_CONTEXT = `
You are NEXUS AI — the official smart assistant for NEXUS LMS, Pakistan's #1 learning platform.

PLATFORM INFO:
- Three course categories: Development & Programming, Business, Design
- Features: Courses (free & paid), Hackathons, Workshops, Competitions, Assignments, Quizzes
- Teachers can create courses, set quizzes, review assignments
- Students can enroll, submit assignments with hosting links + screenshots, join hackathons
- Upcoming events: National Web Dev Hackathon (PKR 500K prize), AI Innovation Challenge (PKR 300K), Design Sprint 2025
- Pricing: Free plan (5 courses), Builder PKR 2499/mo (all courses), Team PKR 9999/mo
- Teachers earn per enrollment and can host workshops
- Platform supports Stripe payments, Cloudinary file uploads, JWT authentication

BEHAVIOR:
- Be helpful, concise, and encouraging
- Help with programming (React, Node, MongoDB, Python, etc.)
- Generate summaries, notes, and quizzes from provided content
- If asked about platform features, answer accurately from the info above
- Always respond in the same language the user writes in (Urdu or English)
- Keep responses well-structured with headings when appropriate
`

const TABS = [
  { id: 'chat', icon: Brain, label: 'AI Chat' },
  { id: 'upload', icon: Upload, label: 'Upload & Summarize' },
  { id: 'quiz', icon: ClipboardList, label: 'Quiz Generator' },
  { id: 'history', icon: History, label: 'History' },
]

const SUGGESTIONS = [
  'Summarize my uploaded notes',
  'Create 10 MCQs from my syllabus',
  'Explain React hooks simply',
  'When is the next hackathon?',
  'Generate study notes on MongoDB',
  'What courses are free on NEXUS?',
]

async function callGemini(messages, systemExtra = '') {
  if (!GEMINI_KEY) {
    return "⚠️ No Gemini API key set. Add VITE_GEMINI_API_KEY to your client/.env file.\n\nGet a free key at: https://aistudio.google.com/apikey"
  }
  try {
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SITE_CONTEXT + systemExtra }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
      })
    })
    const data = await res.json()
    if (data.error) return `Error: ${data.error.message}`
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.'
  } catch (err) {
    return `Connection error: ${err.message}`
  }
}

const STORAGE_KEY = 'nexus_ai_history'
const loadHistory = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] } }
const saveHistory = (h) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(h.slice(-50))) } catch {} }

export default function AIAssistant() {
  const [tab, setTab] = useState('chat')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '**Assalam o Alaikum!** 👋\n\nMain NEXUS AI hoon — aapka personal study assistant.\n\n**Main kya kar sakta hoon:**\n- 📄 PDF/notes upload karke summary banao\n- 🧠 Kisi bhi topic par notes generate karo\n- ❓ Automatically MCQ quiz banao\n- 🏆 Platform ke hackathons, courses info do\n- 💬 Programming questions mein help karo\n\nKoi bhi sawaal pocho! 🚀', id: 1, time: new Date() }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [fileContent, setFileContent] = useState('')
  const [history, setHistory] = useState(loadHistory)
  const [searchHistory, setSearchHistory] = useState('')
  const [quiz, setQuiz] = useState(null)
  const [quizState, setQuizState] = useState({ active: false, answers: {}, submitted: false, score: 0 })
  const [difficulty, setDifficulty] = useState('medium')
  const [qCount, setQCount] = useState(5)
  const [qType, setQType] = useState('mcq')
  const [generatingQuiz, setGeneratingQuiz] = useState(false)
  const [summarizing, setSummarizing] = useState(false)
  const [summary, setSummary] = useState('')
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { saveHistory(history) }, [history])

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SR()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'
      recognitionRef.current.onresult = (e) => { setInput(prev => prev + e.results[0][0].transcript); setIsListening(false) }
      recognitionRef.current.onerror = () => setIsListening(false)
      recognitionRef.current.onend = () => setIsListening(false)
    }
  }, [])

  const toggleVoice = () => {
    if (!recognitionRef.current) return toast.error('Voice not supported in this browser')
    if (isListening) { recognitionRef.current.stop(); setIsListening(false) }
    else { recognitionRef.current.start(); setIsListening(true) }
  }

  const onDrop = useCallback(async (files) => {
    const file = files[0]
    if (!file) return
    setUploadedFiles(prev => [...prev, { name: file.name, size: file.size, type: file.type, id: Date.now() }])
    if (file.type === 'text/plain') {
      const text = await file.text()
      setFileContent(prev => prev + '\n\n--- ' + file.name + ' ---\n' + text)
      toast.success(`${file.name} loaded!`)
    } else if (file.type === 'application/pdf') {
      toast.success(`${file.name} attached! AI will process it.`)
      setFileContent(prev => prev + `\n\n[PDF File: ${file.name} - ${(file.size/1024).toFixed(0)}KB uploaded]`)
    } else {
      const text = await file.text().catch(() => `[File: ${file.name}]`)
      setFileContent(prev => prev + '\n\n--- ' + file.name + ' ---\n' + text)
      toast.success(`${file.name} loaded!`)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.txt'], 'application/pdf': ['.pdf'], 'application/msword': ['.doc'], 'text/markdown': ['.md'] },
    maxSize: 10 * 1024 * 1024,
  })

  const sendMessage = async (text = input) => {
    const msg = text.trim()
    if (!msg || loading) return
    setInput('')
    const userMsg = { role: 'user', content: msg, id: Date.now(), time: new Date() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)
    const extra = fileContent ? `\n\nUPLOADED CONTENT FROM STUDENT:\n${fileContent.slice(0, 8000)}` : ''
    const reply = await callGemini(newMessages, extra)
    const assistantMsg = { role: 'assistant', content: reply, id: Date.now() + 1, time: new Date() }
    const finalMessages = [...newMessages, assistantMsg]
    setMessages(finalMessages)
    setHistory(prev => [{ id: Date.now(), title: msg.slice(0, 60), messages: finalMessages, time: new Date().toISOString() }, ...prev.filter(h => h.title !== msg.slice(0, 60)).slice(0, 49)])
    setLoading(false)
  }

  const handleSummarize = async () => {
    if (!fileContent) return toast.error('Upload a file first')
    setSummarizing(true)
    setSummary('')
    const result = await callGemini([{ role: 'user', content: `Please create a comprehensive, well-structured summary of the following study material. Include key points, important concepts, and create a quick-reference cheat sheet at the end.\n\n${fileContent.slice(0, 8000)}` }])
    setSummary(result)
    setHistory(prev => [{ id: Date.now(), title: 'Summary: ' + (uploadedFiles[0]?.name || 'Uploaded content'), content: result, type: 'summary', time: new Date().toISOString() }, ...prev.slice(0, 49)])
    setSummarizing(false)
  }

  const handleGenerateQuiz = async () => {
    setGeneratingQuiz(true)
    setQuiz(null)
    setQuizState({ active: false, answers: {}, submitted: false, score: 0 })
    const prompt = `Generate exactly ${qCount} ${qType === 'mcq' ? 'multiple choice (4 options each)' : 'True/False'} questions at ${difficulty} difficulty level from this content.\n\n${fileContent ? fileContent.slice(0, 6000) : 'Topic: General Web Development & Programming'}\n\nIMPORTANT: Return ONLY valid JSON, no markdown, no explanation. Format:\n{"questions":[{"id":1,"question":"...","type":"${qType}","options":["A) ...","B) ...","C) ...","D) ..."],"answer":"A","explanation":"..."}]}`
    const raw = await callGemini([{ role: 'user', content: prompt }])
    try {
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
      setQuiz(parsed.questions)
      setQuizState({ active: true, answers: {}, submitted: false, score: 0 })
      toast.success(`${parsed.questions.length} questions generated!`)
      setHistory(prev => [{ id: Date.now(), title: `Quiz: ${qCount} ${qType.toUpperCase()} (${difficulty})`, quiz: parsed.questions, type: 'quiz', time: new Date().toISOString() }, ...prev.slice(0, 49)])
    } catch { toast.error('Could not parse quiz. Try again.') }
    setGeneratingQuiz(false)
  }

  const submitQuiz = () => {
    const score = quiz.reduce((acc, q) => {
      const userAns = quizState.answers[q.id]
      return acc + ((q.type === 'truefalse' ? userAns === q.answer : userAns?.startsWith(q.answer)) ? 1 : 0)
    }, 0)
    setQuizState(prev => ({ ...prev, submitted: true, score }))
  }

  const renderMessage = (text) => text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^#{1,3} (.+)$/gm, '<h4>$1</h4>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br/>')

  const filteredHistory = history.filter(h => h.title.toLowerCase().includes(searchHistory.toLowerCase()))

  return (
    <div className="ai-assistant page-enter">
      <div className="ai-header">
        <div className="ai-header-left">
          <div className="ai-logo"><Sparkles size={18} /></div>
          <div>
            <h1>NEXUS AI Assistant</h1>
            <p className="page-sub">Powered by Gemini 1.5 Flash — your personal study companion</p>
          </div>
        </div>
        {tab === 'chat' && <button className="ai-clear-btn" onClick={() => setMessages([{ role: 'assistant', content: 'Chat cleared!', id: Date.now(), time: new Date() }])}><Trash2 size={14} /> Clear Chat</button>}
      </div>

      <div className="ai-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`ai-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'chat' && (
        <div className="ai-chat-wrap">
          <div className="ai-messages">
            {messages.map(m => (
              <div key={m.id} className={`ai-msg ${m.role}`}>
                {m.role === 'assistant' && <div className="ai-msg-avatar"><Sparkles size={14} /></div>}
                <div className="ai-msg-bubble">
                  <div className="ai-msg-text" dangerouslySetInnerHTML={{ __html: renderMessage(m.content) }} />
                  <span className="ai-msg-time">{new Date(m.time).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="ai-msg assistant">
                <div className="ai-msg-avatar"><Sparkles size={14} /></div>
                <div className="ai-msg-bubble ai-typing"><span /><span /><span /></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {messages.length <= 1 && (
            <div className="ai-suggestions">
              {SUGGESTIONS.map(s => <button key={s} className="ai-suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>)}
            </div>
          )}
          <div className="ai-input-row">
            {fileContent && (
              <div className="ai-file-indicator">
                <FileText size={12} />
                <span>{uploadedFiles.length} file(s) attached</span>
                <button onClick={() => { setFileContent(''); setUploadedFiles([]) }}><X size={11} /></button>
              </div>
            )}
            <div className="ai-input-wrap">
              <textarea ref={inputRef} className="ai-input" placeholder="Ask anything..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }} rows={1} />
              <button className={`ai-voice-btn ${isListening ? 'listening' : ''}`} onClick={toggleVoice}>{isListening ? <MicOff size={16} /> : <Mic size={16} />}</button>
              <button className="ai-send-btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}><Send size={16} /></button>
            </div>
          </div>
        </div>
      )}

      {tab === 'upload' && (
        <div className="ai-upload-wrap">
          <div className="ai-two-col">
            <div className="ai-panel">
              <div className="ai-panel-title">Upload Study Material</div>
              <div {...getRootProps()} className={`ai-dropzone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                <Upload size={32} />
                <p>{isDragActive ? 'Drop it here!' : 'Drag & drop PDF, TXT, DOC or click to browse'}</p>
                <span>Max 10MB per file</span>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="ai-file-list">
                  {uploadedFiles.map(f => (
                    <div key={f.id} className="ai-file-item">
                      <FileText size={14} /><span className="ai-file-name">{f.name}</span>
                      <span className="ai-file-size">{(f.size/1024).toFixed(0)}KB</span>
                      <button onClick={() => setUploadedFiles(prev => prev.filter(x => x.id !== f.id))}><X size={12} /></button>
                    </div>
                  ))}
                </div>
              )}
              <div className="ai-action-group">
                <button className="ai-action-btn primary" onClick={handleSummarize} disabled={!fileContent || summarizing}>
                  {summarizing ? <><span className="btn-spinner" /> Summarizing...</> : <><BookOpen size={14} /> Generate Summary</>}
                </button>
                <button className="ai-action-btn outline" onClick={() => setTab('quiz')} disabled={!fileContent}><ClipboardList size={14} /> Generate Quiz from This</button>
                <button className="ai-action-btn ghost" onClick={() => { sendMessage('Summarize my uploaded content and create detailed study notes'); setTab('chat') }} disabled={!fileContent}><Brain size={14} /> Ask AI about this</button>
              </div>
            </div>
            <div className="ai-panel">
              <div className="ai-panel-title">
                Summary
                {summary && <button className="ai-copy-btn" onClick={() => { navigator.clipboard.writeText(summary); toast.success('Copied!') }}><Download size={12} /> Copy</button>}
              </div>
              {summary
                ? <div className="ai-summary-output" dangerouslySetInnerHTML={{ __html: renderMessage(summary) }} />
                : <div className="ai-empty-state"><BookOpen size={36} /><p>Upload a file and click "Generate Summary"</p></div>
              }
            </div>
          </div>
        </div>
      )}

      {tab === 'quiz' && (
        <div className="ai-quiz-wrap">
          {!quiz || !quizState.active ? (
            <div className="ai-quiz-setup">
              <div className="ai-panel" style={{ maxWidth: 560, margin: '0 auto' }}>
                <div className="ai-panel-title">Quiz Generator</div>
                <div className="quiz-setup-form">
                  <div className="form-field">
                    <label>Question Type</label>
                    <div className="role-toggle">
                      <label className={`role-option ${qType === 'mcq' ? 'active' : ''}`}><input type="radio" value="mcq" checked={qType === 'mcq'} onChange={() => setQType('mcq')} />MCQ (4 options)</label>
                      <label className={`role-option ${qType === 'truefalse' ? 'active' : ''}`}><input type="radio" value="truefalse" checked={qType === 'truefalse'} onChange={() => setQType('truefalse')} />True / False</label>
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Difficulty Level</label>
                    <div className="difficulty-group">
                      {['easy', 'medium', 'hard'].map(d => <button key={d} className={`diff-btn ${difficulty === d ? 'active' : ''}`} onClick={() => setDifficulty(d)}>{d.charAt(0).toUpperCase() + d.slice(1)}</button>)}
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Number of Questions: {qCount}</label>
                    <input type="range" min="3" max="20" value={qCount} onChange={e => setQCount(Number(e.target.value))} className="ai-range" />
                  </div>
                  {!fileContent && <div className="ai-quiz-note"><FileText size={13} /><span>No file uploaded — quiz will be on general programming topics.</span></div>}
                  <button className="ai-action-btn primary" style={{ width: '100%' }} onClick={handleGenerateQuiz} disabled={generatingQuiz}>
                    {generatingQuiz ? <><span className="btn-spinner" /> Generating...</> : <><Sparkles size={14} /> Generate {qCount} Questions</>}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="ai-quiz-active">
              {!quizState.submitted ? (
                <>
                  <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{ width: `${(Object.keys(quizState.answers).length / quiz.length) * 100}%` }} /></div>
                  <div className="quiz-meta-row">
                    <span>{Object.keys(quizState.answers).length}/{quiz.length} answered</span>
                    <span className="quiz-difficulty-tag">{difficulty.toUpperCase()}</span>
                  </div>
                  <div className="quiz-questions-list">
                    {quiz.map((q, i) => (
                      <div key={q.id} className={`quiz-q-card ${quizState.answers[q.id] ? 'answered' : ''}`}>
                        <div className="quiz-q-num">Q{i + 1}</div>
                        <div className="quiz-q-body">
                          <p className="quiz-q-text">{q.question}</p>
                          <div className="quiz-options">
                            {(q.type === 'truefalse' ? ['True', 'False'] : q.options || []).map(opt => (
                              <button key={opt} className={`quiz-option ${quizState.answers[q.id] === opt ? 'selected' : ''}`} onClick={() => setQuizState(prev => ({ ...prev, answers: { ...prev.answers, [q.id]: opt } }))}>{opt}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="quiz-submit-row">
                    <button className="ai-action-btn outline" onClick={() => setQuizState(prev => ({ ...prev, active: false }))}><X size={14} /> Cancel</button>
                    <button className="ai-action-btn primary" onClick={submitQuiz} disabled={Object.keys(quizState.answers).length < quiz.length}><CheckCircle size={14} /> Submit Quiz</button>
                  </div>
                </>
              ) : (
                <div className="quiz-results">
                  <div className="quiz-score-circle">
                    <span className="quiz-score-num">{quizState.score}</span>
                    <span className="quiz-score-total">/{quiz.length}</span>
                  </div>
                  <h3>{quizState.score === quiz.length ? '🎉 Perfect Score!' : quizState.score >= quiz.length * 0.7 ? '✅ Well Done!' : '📚 Keep Studying!'}</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>{Math.round((quizState.score / quiz.length) * 100)}% correct</p>
                  <div className="quiz-answers-review">
                    {quiz.map((q, i) => {
                      const userAns = quizState.answers[q.id]
                      const correct = q.type === 'truefalse' ? userAns === q.answer : userAns?.startsWith(q.answer)
                      return (
                        <div key={q.id} className={`quiz-review-item ${correct ? 'correct' : 'wrong'}`}>
                          <div className="quiz-review-icon">{correct ? <CheckCircle size={15} /> : <XCircle size={15} />}</div>
                          <div>
                            <p className="quiz-review-q">Q{i + 1}: {q.question}</p>
                            <p className="quiz-review-ans">Your: <strong>{userAns || 'Unanswered'}</strong>{!correct && <> · Correct: <strong>{q.answer}</strong></>}</p>
                            {q.explanation && <p className="quiz-review-exp">{q.explanation}</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
                    <button className="ai-action-btn outline" onClick={() => setQuizState({ active: true, answers: {}, submitted: false, score: 0 })}><RotateCcw size={14} /> Retry</button>
                    <button className="ai-action-btn primary" onClick={() => { setQuiz(null); setQuizState({ active: false, answers: {}, submitted: false, score: 0 }) }}><Plus size={14} /> New Quiz</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="ai-history-wrap">
          <div className="ai-history-toolbar">
            <div className="search-box" style={{ flex: 1 }}><Search size={14} /><input placeholder="Search history..." value={searchHistory} onChange={e => setSearchHistory(e.target.value)} /></div>
            <button className="ai-action-btn ghost" onClick={() => { setHistory([]); toast.success('History cleared') }}><Trash2 size={13} /> Clear All</button>
          </div>
          {filteredHistory.length === 0 ? (
            <div className="ai-empty-state"><History size={40} /><p>{history.length === 0 ? 'No history yet. Start a chat!' : 'No results found'}</p></div>
          ) : (
            <div className="ai-history-list">
              {filteredHistory.map(h => (
                <div key={h.id} className="ai-history-item" onClick={() => { if (h.messages) { setMessages(h.messages); setTab('chat') } else if (h.content) { setSummary(h.content); setTab('upload') } else if (h.quiz) { setQuiz(h.quiz); setQuizState({ active: true, answers: {}, submitted: false, score: 0 }); setTab('quiz') } }}>
                  <div className="ai-history-icon">{h.type === 'summary' ? <BookOpen size={14} /> : h.type === 'quiz' ? <ClipboardList size={14} /> : <Brain size={14} />}</div>
                  <div className="ai-history-info">
                    <span className="ai-history-title">{h.title}</span>
                    <span className="ai-history-time">{new Date(h.time).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className={`ai-history-type-badge ${h.type || 'chat'}`}>{h.type || 'chat'}</div>
                  <button className="ai-history-delete" onClick={e => { e.stopPropagation(); setHistory(prev => prev.filter(x => x.id !== h.id)) }}><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}