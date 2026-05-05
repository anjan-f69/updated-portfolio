// ═══════════════════════════════════════════
// ANJAN SHARMA — PORTFOLIO INTERACTIONS
// ═══════════════════════════════════════════

// ── LOADER ──
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const loaderText = document.getElementById('loader-text');
  if (!loader || !loaderText) return;
  const steps = [
    '$ resolving anjansharma7.com.np...',
    '→ DNS query sent',
    '→ 104.21.xx.xx resolved',
    '→ TLS 1.3 handshake ✓',
    '→ connection established'
  ];
  let i = 0;
  const interval = setInterval(() => {
    i++;
    if (i < steps.length) { loaderText.textContent = steps[i]; }
    else { clearInterval(interval); loader.classList.add('hidden'); setTimeout(() => loader.remove(), 600); }
  }, 150);
});

// ── NAV ──
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => { if (nav) nav.classList.toggle('scrolled', window.scrollY > 60); });

navToggle?.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  mobileMenu?.classList.toggle('active');
  document.body.style.overflow = mobileMenu?.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link,.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle?.classList.remove('active');
    mobileMenu?.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal,.reveal-left').forEach(el => revealObserver.observe(el));

// ── STAT COUNTER ──
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target);
    if (!target) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const timer = setInterval(() => { current += step; if (current >= target) { current = target; clearInterval(timer); } el.textContent = current; }, 40);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number[data-target]').forEach(el => statObserver.observe(el));

// ── CTF FLAG ──
let flagTimeout;
document.addEventListener('contextmenu', e => {
  e.preventDefault();
  const toast = document.getElementById('flag-toast');
  if (!toast) return;
  clearTimeout(flagTimeout);
  toast.classList.add('show');
  flagTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
});

// ══════════════════════════════════════════════
// TERMINAL — FULLSCREEN + WORKING CONTROLS
// ══════════════════════════════════════════════

const overlay = document.getElementById('terminal-overlay');
const termWindow = document.getElementById('terminal-window');
const termInput = document.getElementById('term-input');
const termBody = document.getElementById('term-body');
const termClose = document.getElementById('term-close');
const termMinimize = document.getElementById('term-minimize');
const termMaximize = document.getElementById('term-maximize');

let isTerminalOpen = false;
let isMinimized = false;
let isFullscreen = false;

function openTerminal() {
  if (!overlay) return;
  overlay.classList.add('active');
  isTerminalOpen = true;
  // Auto-fullscreen
  termWindow?.classList.add('fullscreen');
  isFullscreen = true;
  termInput?.focus();
  document.body.style.overflow = 'hidden';
  // Show welcome on first open
  if (!termBody.querySelector('.terminal__line')) showWelcome();
}

function closeTerminal() {
  overlay?.classList.remove('active');
  isTerminalOpen = false;
  isMinimized = false;
  isFullscreen = false;
  termWindow?.classList.remove('fullscreen', 'minimized');
  document.body.style.overflow = '';
}

function toggleMinimize() {
  isMinimized = !isMinimized;
  termWindow?.classList.toggle('minimized', isMinimized);
  if (!isMinimized) termInput?.focus();
}

function toggleMaximize() {
  isFullscreen = !isFullscreen;
  termWindow?.classList.toggle('fullscreen', isFullscreen);
}

// Button handlers
termClose?.addEventListener('click', e => { e.stopPropagation(); closeTerminal(); });
termMinimize?.addEventListener('click', e => { e.stopPropagation(); toggleMinimize(); });
termMaximize?.addEventListener('click', e => { e.stopPropagation(); toggleMaximize(); });

// Open terminal triggers
document.getElementById('hero-terminal-btn')?.addEventListener('click', openTerminal);
document.addEventListener('keydown', e => {
  if (e.key === '`' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); isTerminalOpen ? closeTerminal() : openTerminal(); }
  if (e.key === 'Escape' && isTerminalOpen) closeTerminal();
});
overlay?.addEventListener('click', e => { if (e.target === overlay) closeTerminal(); else termInput?.focus(); });

// ── VIRTUAL FILE SYSTEM ──
let currentPath = '/home/anjan';
let commandHistory = [];
let historyIndex = -1;

const vfs = {
  '/home/anjan': { type: 'dir', children: ['README.md','about.txt','skills.json','contact.md','projects/','logs/'] },
  '/home/anjan/README.md': { type: 'file', content: '# Anjan Sharma\nSOC Analyst | Cybersecurity Professional\nISO/IEC 27001:2022 Lead Auditor\nCryptoGen Nepal\n\nType `help` for available commands.' },
  '/home/anjan/about.txt': { type: 'file', content: 'Name:    Anjan Sharma\nRole:    Associate SOC Analyst L1\nOrg:     CryptoGen Nepal\nLocal:   Nepal\nFocus:   Threat Detection & Incident Response' },
  '/home/anjan/skills.json': { type: 'file', content: '{\n  "security": ["SIEM","Threat Detection","Incident Response","Log Analysis"],\n  "compliance": ["ISO 27001","Vulnerability Assessment"],\n  "cloud": ["AWS"],\n  "tools": ["Wireshark","Linux","Python"]\n}' },
  '/home/anjan/contact.md': { type: 'file', content: '## Contact\n- email:    anjan7sharma@gmail.com\n- web:      anjansharma7.com.np\n- linkedin: linkedin.com/in/anjansharma7\n- github:   github.com/anjan-f69\n- medium:   medium.com/@anjan7sharma' },
  '/home/anjan/projects/': { type: 'dir', children: ['soc_reports/','ctf_notes.txt'] },
  '/home/anjan/projects/ctf_notes.txt': { type: 'file', content: '# CTF Notes\n[*] Try right-clicking on the portfolio page...\n[*] Or open the terminal and dig around.' },
  '/home/anjan/logs/': { type: 'dir', children: ['access.log','incident_001.log'] },
  '/home/anjan/logs/access.log': { type: 'file', content: '2026-04-17 22:00:01 [INFO]  Visitor from 103.22.x.x — GET /\n2026-04-17 22:00:04 [INFO]  TLS 1.3 session established\n2026-04-17 22:00:05 [OK]    Page loaded successfully' },
  '/home/anjan/logs/incident_001.log': { type: 'file', content: '[CRITICAL] 2026-04-01 03:14:22 — Brute-force attempt detected\nSource IP: 45.33.32.156 — 347 authentication failures\nAction: Blocked via firewall rule #88 — alert forwarded to SIEM' },
};

function resolvePath(t) {
  if (!t) return currentPath;
  if (t === '~') return '/home/anjan';
  if (t.startsWith('/')) return t.replace(/\/$/, '') || '/';
  const p = currentPath.split('/').filter(Boolean);
  t.split('/').forEach(s => { if (s === '..') { if (p.length) p.pop(); } else if (s !== '.') p.push(s); });
  return '/' + p.join('/');
}
function displayPath() { return currentPath.replace('/home/anjan', '~') || '~'; }

function showWelcome() {
  const lines = [
    { text: '╔══════════════════════════════════════════════════════════════╗', cls: 'welcome' },
    { text: '║  Welcome to Anjan\'s Terminal — SOC Analyst Portfolio        ║', cls: 'welcome' },
    { text: '║  Type "help" to see all available commands                  ║', cls: 'welcome' },
    { text: '╚══════════════════════════════════════════════════════════════╝', cls: 'welcome' },
    { text: '', cls: 'output' },
  ];
  lines.forEach(l => appendLine(l.text, l.cls));
}

const commands = {
  help: () =>
`╔══════════════════════════════════════════════════════════════╗
║                    AVAILABLE COMMANDS                        ║
╚══════════════════════════════════════════════════════════════╝

  NAVIGATION
  ─────────────────────────────────────────────────────────────
  cd <dir>       Change directory (cd ~, cd .., cd logs/)
  ls [dir]       List files and directories
  pwd            Print current working directory

  FILES
  ─────────────────────────────────────────────────────────────
  cat <file>     Display full file contents
  head <file>    Show first lines of a file
  tail <file>    Show last lines of a file
  wc <file>      Count lines, words, bytes in a file
  touch <file>   Create an empty file
  rm <file>      Remove a file (use -r for directories)
  mkdir <dir>    Create a new directory
  cp <s> <d>     Copy a file
  mv <s> <d>     Move/rename a file

  SEARCH
  ─────────────────────────────────────────────────────────────
  grep <pat> <f> Search for pattern in a file
  find [dir]     Find files (use -name <pattern>)

  SYSTEM
  ─────────────────────────────────────────────────────────────
  whoami         Display current user
  uname [-a]     System information
  uptime         How long the system has been running
  ps             List running processes
  date           Show current date/time
  cal            Display a calendar

  NETWORK
  ─────────────────────────────────────────────────────────────
  ping <host>    Send ICMP ping to a host
  curl <url>     Fetch content from a URL
  ifconfig       Display network interfaces

  UTILITIES
  ─────────────────────────────────────────────────────────────
  echo <text>    Print text to terminal
  printenv       Show environment variables
  history        Show command history
  clear          Clear the terminal screen
  exit           Close the terminal

  PORTFOLIO SHORTCUTS
  ─────────────────────────────────────────────────────────────
  about          Display personal information
  skills         Show technical skills (JSON)
  certs          List certifications
  contact        Show contact details`,

  pwd: () => currentPath,
  ls: (args) => {
    let path = resolvePath(args[0]);
    let node = vfs[path] || vfs[path + '/'];
    if (!node && args[0]) { const full = resolvePath(args[0]); node = vfs[full] || vfs[full + '/']; }
    if (!node) return `ls: cannot access '${args[0] || path}': No such file or directory`;
    if (node.type === 'file') return args[0] || path;
    return (node.children || []).join('  ');
  },
  cd: (args) => {
    const t = args[0];
    if (!t || t === '~') { currentPath = '/home/anjan'; updatePrompt(); return ''; }
    const full = resolvePath(t);
    const node = vfs[full] || vfs[full + '/'];
    if (!node) return `bash: cd: ${t}: No such file or directory`;
    if (node.type === 'file') return `bash: cd: ${t}: Not a directory`;
    currentPath = full; updatePrompt(); return '';
  },
  cat: (args) => {
    if (!args[0]) return 'Usage: cat <file>';
    const node = vfs[resolvePath(args[0])];
    if (!node) return `cat: ${args[0]}: No such file or directory`;
    if (node.type === 'dir') return `cat: ${args[0]}: Is a directory`;
    return node.content;
  },
  head: (args) => { let n=10,f=args[0]; if(args[0]==='-n'){n=parseInt(args[1])||10;f=args[2]} if(!f) return 'Usage: head [-n N] <file>'; const nd=vfs[resolvePath(f)]; if(!nd) return `head: ${f}: No such file or directory`; return nd.content.split('\n').slice(0,n).join('\n'); },
  tail: (args) => { let n=10,f=args[0]; if(args[0]==='-n'){n=parseInt(args[1])||10;f=args[2]} if(!f) return 'Usage: tail [-n N] <file>'; const nd=vfs[resolvePath(f)]; if(!nd) return `tail: ${f}: No such file or directory`; return nd.content.split('\n').slice(-n).join('\n'); },
  wc: (args) => { if(!args[0]) return 'Usage: wc <file>'; const nd=vfs[resolvePath(args[0])]; if(!nd) return `wc: ${args[0]}: No such file or directory`; const l=nd.content.split('\n').length,w=nd.content.split(/\s+/).filter(Boolean).length,b=new TextEncoder().encode(nd.content).length; return ` ${l} ${w} ${b} ${args[0]}`; },
  grep: (args) => { if(!args[0]||!args[1]) return 'Usage: grep <pattern> <file>'; const nd=vfs[resolvePath(args[1])]; if(!nd) return `grep: ${args[1]}: No such file or directory`; const re=new RegExp(args[0],'i'); return nd.content.split('\n').filter(l=>re.test(l)).join('\n')||''; },
  find: (args) => { const base=args[0]?resolvePath(args[0]):currentPath; const ni=args.indexOf('-name'); const pat=ni>=0?args[ni+1]:null; const r=[]; Object.keys(vfs).forEach(p=>{if(!p.startsWith(base))return;if(pat){const bn=p.split('/').pop();const re=new RegExp(pat.replace(/\*/g,'.*'),'i');if(!re.test(bn))return}r.push(p)}); return r.join('\n'); },
  mkdir: (args) => { if(!args[0]) return 'mkdir: missing operand'; const full=resolvePath(args[0])+'/'; if(vfs[full]) return `mkdir: '${args[0]}': File exists`; vfs[full]={type:'dir',children:[]}; const p=vfs[currentPath]||vfs[currentPath+'/']; if(p?.children) p.children.push(args[0]+'/'); return ''; },
  touch: (args) => { if(!args[0]) return 'touch: missing file operand'; const full=resolvePath(args[0]); vfs[full]=vfs[full]||{type:'file',content:''}; const p=vfs[currentPath]||vfs[currentPath+'/']; if(p?.children&&!p.children.includes(args[0])) p.children.push(args[0]); return ''; },
  rm: (args) => { if(!args[0]) return 'rm: missing operand'; const full=resolvePath(args[args.length-1]); if(!vfs[full]&&!vfs[full+'/']) return `rm: '${args[args.length-1]}': No such file or directory`; if((vfs[full]||vfs[full+'/'])?.type==='dir'&&!args.includes('-r')&&!args.includes('-rf')) return `rm: '${args[args.length-1]}': Is a directory`; if(args.includes('-rf')||args.includes('-r')){Object.keys(vfs).filter(k=>k.startsWith(full)).forEach(k=>delete vfs[k])}else{delete vfs[full]} return ''; },
  cp: (args) => { if(args.length<2) return 'Usage: cp <src> <dest>'; const s=vfs[resolvePath(args[0])]; if(!s) return `cp: '${args[0]}': No such file or directory`; if(s.type!=='file') return `cp: '${args[0]}': Is a directory`; vfs[resolvePath(args[1])]={type:'file',content:s.content}; return ''; },
  mv: (args) => { if(args.length<2) return 'Usage: mv <src> <dest>'; const full=resolvePath(args[0]); const s=vfs[full]; if(!s) return `mv: '${args[0]}': No such file or directory`; vfs[resolvePath(args[1])]=s; delete vfs[full]; return ''; },
  echo: (args) => args.join(' '),
  whoami: () => 'anjan',
  uname: (args) => { const i={sys:'Linux',node:'soc-workstation',rel:'6.8.0-soc',ver:'#1 SMP',arch:'x86_64'}; if(args.includes('-a')) return `${i.sys} ${i.node} ${i.rel} ${i.ver} ${i.arch} GNU/Linux`; return i.sys; },
  uptime: () => { const h=Math.floor(Math.random()*24+1),m=Math.floor(Math.random()*60),now=new Date().toLocaleTimeString('en-US',{hour12:false,hour:'2-digit',minute:'2-digit'}); return ` ${now} up ${h}:${String(m).padStart(2,'0')}, 1 user, load average: 0.12, 0.08, 0.05`; },
  ps: () => `  PID TTY          TIME CMD\n 1234 pts/0    00:00:00 bash\n 1337 pts/0    00:00:01 siem-agent\n 2048 pts/0    00:00:00 ps`,
  date: (args) => { const now=new Date(); if(args[0]==='+%Y-%m-%d') return now.toISOString().split('T')[0]; if(args[0]==='+%s') return Math.floor(now.getTime()/1000).toString(); return now.toString(); },
  cal: () => { const now=new Date(),y=now.getFullYear(),mo=now.getMonth(); const days=['Su','Mo','Tu','We','Th','Fr','Sa']; const months=['January','February','March','April','May','June','July','August','September','October','November','December']; const first=new Date(y,mo,1).getDay(),total=new Date(y,mo+1,0).getDate(); let out=`    ${months[mo]} ${y}\n${days.join(' ')}\n`; let row='   '.repeat(first); for(let d=1;d<=total;d++){row+=String(d).padStart(2)+' ';if((first+d)%7===0){out+=row.trimEnd()+'\n';row=''}} if(row.trim())out+=row.trimEnd(); return out.trimEnd(); },
  ping: (args) => { const h=args[0]||'localhost'; return `PING ${h}: 56 bytes\n64 bytes from ${h}: icmp_seq=0 ttl=64 time=${(Math.random()*10+1).toFixed(3)} ms\n64 bytes from ${h}: icmp_seq=1 ttl=64 time=${(Math.random()*10+1).toFixed(3)} ms\n--- ${h} ping statistics ---\n2 packets transmitted, 2 received, 0% loss`; },
  curl: (args) => { const u=args[0]; if(!u) return 'Usage: curl <url>'; if(u.includes('anjansharma7')) return '<!DOCTYPE html><html><!-- Portfolio by Anjan Sharma -->\n<!-- You found the source! --></html>'; return `curl: (6) Could not resolve host: ${u.replace(/https?:\/\//,'')}`; },
  ifconfig: () => `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.42  netmask 255.255.255.0\n        ether 02:42:ac:11:00:02\nlo:   flags=73<UP,LOOPBACK,RUNNING>  mtu 65536\n        inet 127.0.0.1  netmask 255.0.0.0`,
  sort: (args) => { if(!args[0]) return 'Usage: sort <file>'; const nd=vfs[resolvePath(args[0])]; if(!nd) return `sort: ${args[0]}: No such file or directory`; return nd.content.split('\n').sort().join('\n'); },
  uniq: (args) => { if(!args[0]) return 'Usage: uniq <file>'; const nd=vfs[resolvePath(args[0])]; if(!nd) return `uniq: ${args[0]}: No such file or directory`; return [...new Set(nd.content.split('\n'))].join('\n'); },
  printenv: () => `HOME=/home/anjan\nUSER=anjan\nSHELL=/bin/bash\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin\nTERM=xterm-256color`,
  history: () => commandHistory.map((c,i) => `  ${String(i+1).padStart(3)}  ${c}`).join('\n'),
  clear: () => '__CLEAR__',
  exit: () => { appendLine('Closing session...', 'accent'); setTimeout(() => { window.close(); closeTerminal(); }, 500); return ''; },
  about: () => vfs['/home/anjan/about.txt'].content,
  skills: () => vfs['/home/anjan/skills.json'].content,
  certs: () => '• ISO/IEC 27001:2022 Lead Auditor — Mastermind\n• AWS Academy Cloud Foundations — AWS\n• Google Cyber Security Professional — Google',
  contact: () => vfs['/home/anjan/contact.md'].content,
};

const allCmds = Object.keys(commands);

function updatePrompt() {
  const label = termBody?.querySelector('.term-prompt-label');
  if (label) label.textContent = `anjan@portfolio:${displayPath()}$ `;
}

function appendLine(text, type) {
  const div = document.createElement('div');
  div.className = `terminal__line terminal__line--${type}`;
  div.textContent = text;
  const inputLine = termBody?.querySelector('.terminal__input-line');
  if (inputLine) termBody.insertBefore(div, inputLine);
}

// Init prompt label
(function initPrompt() {
  const inputLine = termBody?.querySelector('.terminal__input-line');
  if (!inputLine) return;
  let label = inputLine.querySelector('.term-prompt-label');
  if (!label) { label = document.createElement('span'); label.className = 'term-prompt-label'; inputLine.insertBefore(label, termInput); }
  label.textContent = `anjan@portfolio:~$ `;
})();

// Terminal input handling
termInput?.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') { e.preventDefault(); if (historyIndex < commandHistory.length - 1) { historyIndex++; termInput.value = commandHistory[commandHistory.length - 1 - historyIndex]; } return; }
  if (e.key === 'ArrowDown') { e.preventDefault(); if (historyIndex > 0) { historyIndex--; termInput.value = commandHistory[commandHistory.length - 1 - historyIndex]; } else { historyIndex = -1; termInput.value = ''; } return; }

  if (e.key === 'Tab') {
    e.preventDefault();
    const parts = termInput.value.split(' ');
    const last = parts[parts.length - 1];
    if (parts.length === 1) { const m = allCmds.filter(c => c.startsWith(last)); if (m.length === 1) termInput.value = m[0] + ' '; else if (m.length > 1) appendLine(m.join('  '), 'output'); }
    else { const node = vfs[currentPath] || vfs[currentPath + '/']; if (node?.children) { const m = node.children.filter(f => f.startsWith(last)); if (m.length === 1) { parts[parts.length - 1] = m[0]; termInput.value = parts.join(' '); } else if (m.length > 1) appendLine(m.join('  '), 'output'); } }
    return;
  }

  if (e.key === 'Enter') {
    const raw = termInput.value.trim();
    termInput.value = '';
    historyIndex = -1;
    if (!raw) return;
    commandHistory.push(raw);
    appendLine(`${displayPath()}$ ${raw}`, 'prompt');

    let result = '';
    const pipes = raw.split('|').map(s => s.trim());
    let pipeIn = null;
    for (const seg of pipes) {
      const parts = seg.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);
      if (pipeIn !== null) {
        if (cmd === 'grep') { const re = new RegExp(args[0] || '', 'i'); result = pipeIn.split('\n').filter(l => re.test(l)).join('\n'); }
        else result = pipeIn;
        pipeIn = result; continue;
      }
      if (commands[cmd]) { result = commands[cmd](args); pipeIn = result; }
      else { result = `bash: ${cmd}: command not found`; break; }
    }

    if (result === '__CLEAR__') { termBody.querySelectorAll('.terminal__line').forEach(l => l.remove()); }
    else if (result != null && result !== '') { result.split('\n').forEach(line => appendLine(line, 'output')); }
    termBody.scrollTop = termBody.scrollHeight;
  }
});
