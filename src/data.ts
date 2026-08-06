export const NAV_LINKS = ['About', 'Skills', 'Projects', 'Experience', 'Contact']

export const HERO_STATS = [
  { value: '95%+', label: 'Model Accuracy', color: '#1E293B' },
  { value: '9.0',  label: 'CGPA',           color: '#8B5CF6' },
  { value: '3×',   label: 'Hackathon Wins', color: '#F472B6' },
  { value: '8',    label: 'Projects Built', color: '#34D399' },
]

export const MARQUEE_ROW1 = [
  { text: 'PyTorch',         style: 'violet' },
  { text: 'LangChain',       style: 'pink'   },
  { text: 'Transformers',    style: 'yellow' },
  { text: 'Computer Vision', style: 'emerald'},
  { text: 'Generative AI',   style: 'violet' },
  { text: 'OpenCV',          style: 'pink'   },
  { text: 'React.js',        style: 'yellow' },
  { text: 'Flask',           style: 'emerald'},
  { text: 'Groq',            style: 'violet' },
  { text: 'Deep Learning',   style: 'pink'   },
  { text: 'NLP',             style: 'white'  },
  { text: 'RAG',             style: 'yellow' },
]

export const MARQUEE_ROW2 = [
  { text: 'Ollama',        style: 'emerald'},
  { text: 'LLaMA 2',      style: 'violet' },
  { text: 'Socket.io',    style: 'pink'   },
  { text: 'Raspberry Pi', style: 'yellow' },
  { text: 'Docker',       style: 'violet' },
  { text: 'MQTT',         style: 'emerald'},
  { text: 'Hugging Face', style: 'pink'   },
  { text: 'Streamlit',    style: 'white'  },
  { text: 'Node.js',      style: 'yellow' },
  { text: 'Gemini',       style: 'violet' },
  { text: 'Tailwind CSS', style: 'pink'   },
  { text: 'MongoDB',      style: 'emerald'},
]

export const SKILLS = [
  {
    icon: '🧠', label: 'Core AI / ML', color: '#8B5CF6',
    tags: ['PyTorch', 'Transformers', 'LangChain', 'Scikit-learn', 'OpenCV', 'NLTK', 'RAG'],
    highlight: ['PyTorch', 'Transformers', 'LangChain'],
    shadow: '4px 4px 0px #8B5CF6',
  },
  {
    icon: '🎯', label: 'AI Domains', color: '#F472B6',
    tags: ['Generative AI', 'Computer Vision', 'NLP', 'LLM Fine-tuning', 'Face Recognition', 'Agentic AI'],
    highlight: ['Generative AI', 'Computer Vision', 'NLP'],
    shadow: '4px 4px 0px #F472B6',
  },
  {
    icon: '⚡', label: 'MLOps & Deploy', color: '#D97706',
    tags: ['Flask', 'Groq', 'Docker', 'Hugging Face Hub', 'REST APIs', 'n8n'],
    highlight: ['Flask', 'Groq', 'Docker'],
    shadow: '4px 4px 0px #FBBF24',
  },
  {
    icon: '💻', label: 'Languages', color: '#059669',
    tags: ['Python', 'JavaScript', 'C', 'C++', 'NumPy', 'Pandas'],
    highlight: ['Python', 'JavaScript'],
    shadow: '4px 4px 0px #34D399',
  },
  {
    icon: '🌐', label: 'Frontend & Web', color: '#8B5CF6',
    tags: ['React.js', 'Node.js', 'Tailwind CSS', 'Streamlit', 'Socket.io', 'HTML'],
    highlight: ['React.js', 'Tailwind CSS'],
    shadow: '4px 4px 0px #8B5CF6',
  },
  {
    icon: '🛠️', label: 'Tools & Hardware', color: '#db2777',
    tags: ['Jupyter', 'Git', 'VS Code', 'Ollama', 'Raspberry Pi', 'MQTT'],
    highlight: ['Jupyter', 'Git'],
    shadow: '4px 4px 0px #F472B6',
  },
]

export const PROJECTS = [
  {
    num: '01',
    cat: 'IoT & AI',
    name: 'Medelite — Smart Vending Machine',
    desc: 'A smart vending machine capable of dispensing medication based on prescriptions, tracking inventory in real-time, and providing live updates to users. Combines IoT, basic AI, and secure data handling to ensure accuracy and patient safety.',
    stack: ['React.js', 'Tailwind CSS', 'JavaScript', 'Raspberry Pi', 'IoT'],
    badges: [
      { text: 'IoT',           bg: 'rgba(52,211,153,0.15)',  border: '#34D399', color: '#059669' },
      { text: 'Patient Safety',bg: 'rgba(139,92,246,0.10)',  border: '#8B5CF6', color: '#8B5CF6' },
      { text: 'Real-time',     bg: 'rgba(251,191,36,0.15)',  border: '#FBBF24', color: '#D97706' },
    ],
    shadow: '8px 8px 0px #34D399',
    links: [{ label: 'GitHub ↗', href: 'https://github.com/Devendar04/Medelite' }],
  },
  {
    num: '02',
    cat: 'Web Platform',
    name: 'SOEN — Website Builder Platform',
    desc: 'A dynamic website builder platform that enables users to design and deploy customizable websites without writing code. Features drag-and-drop components, template selection, and live previews to streamline the entire creation process.',
    stack: ['React.js', 'Node.js', 'Tailwind CSS', 'JavaScript', 'HTML'],
    badges: [
      { text: 'No-Code',      bg: 'rgba(244,114,182,0.10)', border: '#F472B6', color: '#db2777' },
      { text: 'Drag & Drop',  bg: 'rgba(139,92,246,0.10)',  border: '#8B5CF6', color: '#8B5CF6' },
      { text: 'Live Preview', bg: 'rgba(251,191,36,0.15)',  border: '#FBBF24', color: '#D97706' },
    ],
    shadow: '8px 8px 0px #F472B6',
    links: [{ label: 'GitHub ↗', href: 'https://github.com/Devendar04/deploy-dreamer' }],
  },
  {
    num: '03',
    cat: 'Deep Learning',
    name: 'Deepfake Detection Web App',
    desc: 'Trained a CNN (Xception) model on 100K+ samples achieving 95%+ accuracy for real vs AI-generated face detection. Full-stack deployment with real-time inference under 2 seconds per video frame via REST API and React.js frontend.',
    stack: ['PyTorch', 'Xception CNN', 'OpenCV', 'React.js', 'Node.js'],
    badges: [
      { text: '95%+ accuracy', bg: 'rgba(52,211,153,0.15)',  border: '#34D399', color: '#059669' },
      { text: '<2s inference', bg: 'rgba(139,92,246,0.10)',  border: '#8B5CF6', color: '#8B5CF6' },
      { text: '100K+ samples', bg: 'rgba(251,191,36,0.15)', border: '#FBBF24', color: '#D97706' },
    ],
    shadow: '8px 8px 0px #8B5CF6',
    links: [{ label: 'GitHub ↗', href: 'https://github.com/Devendar04/deepfake-sentinel' }],
  },
  {
    num: '04',
    cat: 'Conversational AI',
    name: 'Voice-Enabled AI Chatbot (Gemini)',
    desc: 'A voice + text chatbot using LangChain + Gemini 2.5 Flash with real-time speech input via Google Speech Recognition. Streams LLM responses through a custom prompt chain and deployed as an interactive Streamlit app with LangSmith tracing for full observability.',
    stack: ['Python', 'LangChain', 'Gemini 2.5 Flash', 'Streamlit', 'SpeechRecognition'],
    badges: [
      { text: 'Voice Input',    bg: 'rgba(244,114,182,0.10)', border: '#F472B6', color: '#db2777' },
      { text: 'LangSmith',      bg: 'rgba(139,92,246,0.10)',  border: '#8B5CF6', color: '#8B5CF6' },
      { text: 'Streaming LLM',  bg: 'rgba(52,211,153,0.15)',  border: '#34D399', color: '#059669' },
    ],
    shadow: '8px 8px 0px #FBBF24',
    links: [{ label: 'GitHub ↗', href: 'https://github.com/Devendar04/Langchain' }],
  },
  {
    num: '05',
    cat: 'Conversational AI',
    name: 'Indian Voice Chatbot (Local LLM)',
    desc: 'Fully offline conversational AI using LLaMA 2 7B via Ollama with LangChain prompt orchestration. Zero cloud API dependency, Indian-accented neural TTS (Edge-TTS), end-to-end voice interaction under 3 seconds on consumer hardware.',
    stack: ['LLaMA 2 7B', 'Ollama', 'LangChain', 'Edge-TTS', 'Streamlit'],
    badges: [
      { text: '100% Offline', bg: 'rgba(52,211,153,0.15)',  border: '#34D399', color: '#059669' },
      { text: '<3s latency',  bg: 'rgba(244,114,182,0.10)', border: '#F472B6', color: '#db2777' },
      { text: 'Indian TTS',   bg: 'rgba(251,191,36,0.15)',  border: '#FBBF24', color: '#D97706' },
    ],
    shadow: '8px 8px 0px #8B5CF6',
    links: [],
  },
  {
    num: '06',
    cat: 'Robotics & Vision',
    name: 'Sara — Agentic AI Robot',
    desc: 'Flask-based agentic intelligence with a Hinglish NLP pipeline covering 15+ intent classes, Groq LLM multi-key rotation, and mood-aware response generation. Multimodal vision with real-time face recognition (SFace + YuNet) streamed over MQTT via HiveMQ.',
    stack: ['Flask', 'Groq LLM', 'RAG', 'OpenCV', 'MQTT', 'Raspberry Pi'],
    badges: [
      { text: '15+ intents', bg: 'rgba(251,191,36,0.15)',  border: '#FBBF24', color: '#D97706' },
      { text: 'Multimodal',  bg: 'rgba(139,92,246,0.10)',  border: '#8B5CF6', color: '#8B5CF6' },
      { text: 'Edge AI',     bg: 'rgba(52,211,153,0.15)',  border: '#34D399', color: '#059669' },
    ],
    shadow: '8px 8px 0px #F472B6',
    links: [{ label: 'GitHub ↗', href: 'https://github.com/Devendar04/SARA-Brain' }],
  },
  {
    num: '07',
    cat: 'Computer Vision',
    name: 'Automated Attendance System',
    desc: 'Real-time face recognition–based attendance system using webcam input to automatically detect and mark student presence in a CSV file. Supports face encoding, matching, and subject-wise attendance tracking with dynamic columns for different classes (DSA, TOC, DBMS).',
    stack: ['Python', 'OpenCV', 'face_recognition', 'NumPy', 'Pandas'],
    badges: [
      { text: 'Real-time',     bg: 'rgba(52,211,153,0.15)',  border: '#34D399', color: '#059669' },
      { text: 'Face Encoding', bg: 'rgba(244,114,182,0.10)', border: '#F472B6', color: '#db2777' },
      { text: 'CSV Tracking',  bg: 'rgba(251,191,36,0.15)',  border: '#FBBF24', color: '#D97706' },
    ],
    shadow: '8px 8px 0px #34D399',
    links: [{ label: 'GitHub ↗', href: 'https://github.com/Devendar04/Attendance-System' }],
  },
  {
    num: '08',
    cat: 'Multiplayer Game',
    name: 'Chess Master — Online Chess',
    desc: 'A real-time multiplayer chess game with user registration, a game lobby, Elo rating system, and social features. Ensures a smooth experience through efficient WebSocket communication using Socket.io for instant move synchronization.',
    stack: ['React.js', 'Socket.io', 'Tailwind CSS', 'JavaScript', 'HTML'],
    badges: [
      { text: 'Real-time',   bg: 'rgba(139,92,246,0.10)',  border: '#8B5CF6', color: '#8B5CF6' },
      { text: 'Elo Rating',  bg: 'rgba(251,191,36,0.15)',  border: '#FBBF24', color: '#D97706' },
      { text: 'WebSockets',  bg: 'rgba(244,114,182,0.10)', border: '#F472B6', color: '#db2777' },
    ],
    shadow: '8px 8px 0px #FBBF24',
    links: [],
  },
]

export const EXPERIENCE = [
  {
    emoji: '🤖',
    color: '#F472B6',
    date: 'Jun 2025 – Aug 2025',
    duration: '3 months',
    current: false,
    role: 'AI and Machine Learning Intern',
    company: 'GRRAS Solutions Pvt. Ltd. · Udaipur',
    points: [
      'Developed predictive ML models using Python, NumPy, and Pandas.',
      'Integrated AI logic into automation tools for production deployment.',
    ],
  },
  {
    emoji: '⚙️',
    color: '#FBBF24',
    date: 'Oct 2025 – Mar 2026',
    duration: '6 months',
    current: false,
    role: 'Agentic AI and Web Development Intern',
    company: 'P2N Automation · Udaipur, Rajasthan',
    points: [
      'Developed and deployed agentic AI and workflow automation solutions using Python, JavaScript, REST APIs, and automation frameworks to streamline business processes and reduce manual workflows.',
      'Contributed to end-to-end application development, including requirement analysis, API integration, testing, debugging, and deployment of AI-powered web and automation solutions.',
    ],
  },
  {
    emoji: '💻',
    color: '#8B5CF6',
    date: 'Apr 2026 – Present',
    duration: 'Ongoing',
    current: true,
    role: 'Web & Agentic Developer Intern',
    company: 'Team #9 Productions · Remote',
    points: [
      'Building web platforms AI4Marketers and Brand Therapy from scratch.',
      'Deploying autonomous agentic workflows for marketing automation.',
    ],
  },
]

export const EDUCATION = [
  {
    icon: '🎓',
    degree: 'B.Tech in Computer Science',
    school: 'Geetanjali Institute of Technical Studies, Udaipur',
    period: 'Sep 2023 – May 2027',
    grade: 'CGPA: 9.0 / 10',
  },
  {
    icon: '📚',
    degree: 'Class XII — RBSE (PCM)',
    school: 'Saint Venus Sr. Sec. School, Bikaner',
    period: 'Jul 2021 – May 2022',
    grade: '81.20%',
  },
]

export const ACHIEVEMENTS = [
  {
    trophy: '🏆',
    title: 'Tie-U Ideathon 2025',
    sub: '1st place at the prestigious national-level ideathon',
    winner: true,
  },
  {
    trophy: '🥉',
    title: 'SIH Internal 2025',
    sub: '3rd place — Smart India Hackathon internal round',
    winner: false,
  },
  {
    trophy: '🥉',
    title: 'SIH Internal 2024',
    sub: '3rd place — Smart India Hackathon internal round',
    winner: false,
  },
]

export const CONTACT_LINKS = [
  { label: '📧 Email Me',       href: 'mailto:parjapatsunny12@gmail.com' },
  // { label: '📞 +91 96025 31511',href: 'tel:+919602531511'                },
  { label: '💼 LinkedIn',       href: 'https://www.linkedin.com/in/devendra-prajapat-/' },
  { label: '🐙 GitHub',         href: 'https://github.com/Devendar04'     },
  { label: '🤗 HuggingFace',    href: 'https://huggingface.co/Devendra174' },
  { label: '📄 Resume',          href: 'https://drive.google.com/file/d/1_-O-Po5TjpmTLoYOajtGI897drv5QcSZ/view?usp=sharing', download: 'Devendra_Prajapat_Resume.pdf' },
]