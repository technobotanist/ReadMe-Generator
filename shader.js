// Animated gradient on canvas (lightweight “shader”)
const canvas = document.getElementById('shader-bg');
if (canvas) {
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
}
