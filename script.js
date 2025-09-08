// Animated gradient on canvas (lightweight “shader”)
const canvas = document.getElementById('shader-bg');
const ctx = canvas.getContext('2d');
let t = 0;
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function draw() {
  const w = canvas.width, h = canvas.height;
  const g = ctx.createLinearGradient(0, 0, w, h);
  // shifting hues for motion
  const a = 0.5 + 0.5 * Math.sin(t * 0.0015);
  const b = 0.5 + 0.5 * Math.cos(t * 0.0012);
  g.addColorStop(0, `rgba(${40+60*a|0}, ${70+80*b|0}, 110, 0.28)`);
  g.addColorStop(1, `rgba(0, 220, 170, 0.18)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // subtle orbs
  for (let i=0;i<3;i++){
    const x = (w/2) + Math.sin(t*0.001 + i)*w*0.35;
    const y = (h/2) + Math.cos(t*0.0012 + i)*h*0.28;
    const r = 180 + 40*Math.sin(t*0.002+i);
    const rg = ctx.createRadialGradient(x,y,0,x,y,r);
    rg.addColorStop(0, `rgba(0,255,200,0.10)`);
    rg.addColorStop(1, `rgba(0,0,0,0)`);
    ctx.fillStyle = rg; ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
  t+=16;
  requestAnimationFrame(draw);
}
draw();

// --- FORM → PROMPT RECEIPT ---

const fields = [
  'name','email','linkedin','github','portfolio',
  'field','studying','favorite','activities','hobbies',
  'skills','tools','projects','goals','funfact'
];
const prefs = ['tone','emoji','sentences','jargon'];

const els = {};
fields.forEach(id => els[id] = document.getElementById(id));
prefs.forEach(id => els[id] = document.getElementById(id));
const receipt = document.getElementById('receipt');

function val(id){
  const el = els[id];
  return (el && el.value || '').trim();
}

// EXACT TEMPLATE — do not alter the header/body text below
function buildPrompt(){
  const meta =
`📄 GitHub Profile README Worksheet
Create a polished, upload-ready \`README.md\` for a GitHub profile using the data below. Use clean, valid GitHub-flavored Markdown. Do not use placeholders like \`[Your link here]\`; omit sections without content. Follow this structure exactly:

1. \`#\` H1 title with name
2. Contact block: Email and Markdown links to GitHub, LinkedIn, Portfolio
3. \`## 🧠 About Me\` – Write 3–5 sentence paragraph
4. \`## 🔍 Projects & Passions\` – Bullet list: \`- **[Project Name](link)** – 1-sentence summary\`
5. \`## ⚙️ Tools & Skills\` – Two bullets: \`**Skills:**\` and \`**Technologies:**\`
6. \`## 🎯 Goals\` – 1–2 bullets
7. \`## 🎉 Fun Fact\` – 1 bullet

Constraints:
- Do not invent facts or links.
- If a field is empty, omit that part in the final output.
- Respect the tone and style preferences specified.
- Return Markdown only (no explanation).

Style preferences:
- Tone: ${val('tone') || 'professional, friendly'}
- Emoji usage: ${val('emoji') || 'moderate'}
- Sentence length: ${val('sentences') || 'balanced'}
- Jargon tolerance: ${val('jargon') || 'low'}

### Input:
### Fill out and paste below:

1. Name: ${val('name')}
2. Email: ${val('email')}
3. LinkedIn URL: ${val('linkedin')}
4. GitHub URL: ${val('github')}
5. Personal site/portfolio URL (if any): ${val('portfolio')}
6. Field or major: ${val('field')}
7. What are you studying or learning now? ${val('studying')}
8. Favorite topic or class (and why): ${val('favorite')}
9. Co-curricular activities or jobs: ${val('activities')}
10. Hobbies/interests: ${val('hobbies')}
11. Technical or creative skills: ${val('skills')}
12. Tools or platforms used: ${val('tools')}
13. Projects you're proud of (name + 1-sentence summary + link if any):
${val('projects')}
14. Current goals: ${val('goals')}
15. Fun fact: ${val('funfact')}
`;

  return meta;
}

function updateReceipt(){ receipt.value = buildPrompt(); }
document.getElementById('ws-form').addEventListener('input', updateReceipt);
updateReceipt();

// Copy Prompt
document.getElementById('copyPrompt').addEventListener('click', async () => {
  const txt = receipt.value;
  try {
    await navigator.clipboard.writeText(txt);
    toast('Prompt copied to clipboard.');
  } catch {
    receipt.select();
    document.execCommand('copy');
    toast('Prompt copied (fallback).');
  }
});

// tiny toast
function toast(msg){
  const n = document.createElement('div');
  n.className = 'toast';
  n.textContent = msg;
  document.body.appendChild(n);
  requestAnimationFrame(()=> n.classList.add('show'));
  setTimeout(()=>{ n.classList.remove('show'); setTimeout(()=> n.remove(), 300); }, 1600);
}

// Add toast styles dynamically (keeps CSS file clean)
const style = document.createElement('style');
style.textContent = `
.toast{
  position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%) translateY(20px);
  background: linear-gradient(90deg, #6ddbae, #ffffff);
  color:#0b1014; padding:10px 14px; border-radius:10px; font-weight:800;
  opacity:0; transition: all .25s ease; z-index:9999; box-shadow:0 10px 26px rgba(0,0,0,.25);
}
.toast.show{opacity:1; transform: translateX(-50%) translateY(0)}
`;
document.head.appendChild(style);
