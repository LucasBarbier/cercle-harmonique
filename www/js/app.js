/* Interface : cercle, grille, lecture, son, vue Étude (partition + défilement), import d'image. Dépend de HT et ET */
/* ======================= Interface ======================= */
(()=>{
const H=window.HT,AC=window.AC,mod=H.mod;
const $=s=>document.querySelector(s);
const SVGNS='http://www.w3.org/2000/svg';
const sv=(tag,attrs={},parent)=>{const e=document.createElementNS(SVGNS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const PRESETS=[
 {name:'Autumn Leaves',sub:'Sol mineur · II–V, subV',text:`titre: Autumn Leaves
tonalité: Gm
tempo: 132

A: | Cm7 | F7 | Bbmaj7 | Ebmaj7 | Am7b5 | D7 | Gm6 | % |
A: | Cm7 | F7 | Bbmaj7 | Ebmaj7 | Am7b5 | D7 | Gm6 | % |
B: | Am7b5 | D7 | Gm6 | % | Cm7 | F7 | Bbmaj7 | Ebmaj7 |
C: | Am7b5 | D7b9 | Gm7 Gb7 | Fm7 E7 | Ebmaj7 | Am7b5 D7 | Gm6 | % |`},
 {name:'Tears',sub:'Django Reinhardt · Do mineur / Do majeur',text:`titre: Tears
tonalité: Cm
tempo: 170

Intro: | Cm/Eb | Ddim G7 | Cm/Eb | Ddim G7 |
A: | Cm/Eb | Ddim G7 | Cm/Eb | Ddim G7 | C7/Db | Fm/C | Bdim7 | Eb/Bb |
| Adim7 | Dm7b5/Ab | G7 | Cm G7 |
A: | Cm/Eb | Ddim G7 | Cm/Eb | Ddim G7 | C7/Db | Fm/C | Bdim7 | Eb/Bb |
| Adim7 | Dm7b5/Ab | G7 | Cm G7 |
B: | C/E Ab7/Eb | G7/D G7 | C/E Ab7/Eb | G7/D G7 | C7 | F | D7 | Abm6 G7 |
| C/E Ab7/Eb | G7/D G7 | C/E Ab7/Eb | G7/D G7 | C7 | F | Db G7 | C G7 |`},
 {name:'Djangology',sub:'Django Reinhardt · Sol majeur',text:`titre: Djangology
tonalité: G
tempo: 120

A: | C#m7b5 | Cm6 | Gmaj9 | Bbdim7 | C6/9 | D7 | G6 | % |
A: | C#m7b5 | Cm6 | Gmaj9 | Bbdim7 | C6/9 | D7 | G6 | % |
B: | Ab7 Eb7 | Ab7 | A7 E7 | A7 |`},
 {name:'Douce Ambiance',sub:'Django Reinhardt · Sol mineur',text:`titre: Douce Ambiance
tonalité: Gm
tempo: 160

A: | Gm6 | Am6 D7 | Gm6 | Am6 D7 | Bb6 | Cm6 | Bb6 Ab7 | D7 |
A: | Gm6 | Am6 D7 | Gm6 | Am6 D7 | Bb6 | Cm6 | A7 D7 | Gm6 |
B: | Abm6 | Am6 | F6 | E6 Eb6 | D6 | % | D7 | % |
A: | Gm6 | Am6 D7 | Gm6 | Am6 D7 | Bb6 Bm6 | Cm6 | A7 D7 | Gm6 |`},
 {name:'Songe d\'automne',sub:'A. Joyce · Do mineur · swing',text:`titre: Songe d'automne
tonalité: Cm
tempo: 120

A: | Cm | CmMaj7 | Cm7 | Cm6 | Fm | % | F#dim7 | G7 |
| Cm | CmMaj7 | Cm7 | C7 | Fm | Bb7 | Eb | G7 |
B: | Cm | G7 | % | Cm | Bbm | Eb7 | Ab | Db7 |
| Cm | Ab7 | Cm | Fm | F#dim7 | G7 | Cm | % |
C: | Fm | % | Cm | % | Dm7b5 | G7 | Cm | C7 |
| Fm | % | Cm | % | Dm7b5 | G7 | Cm | C7 |`},
 {name:'II–V–I',sub:'Do majeur · cadences de base',text:`titre: II–V–I en Do
tonalité: C
tempo: 96

A: | Dm7 | G7 | Cmaj7 | % |
B: | Em7 A7 | Dm7 G7 | Cmaj7 A7 | Dm7 Db7 |
C: | Cmaj7 | Dm7b5 G7b9 | Cm6 | % |`},
 {name:'Blue Bossa',sub:'Do mineur · II–V vers ♭II',text:`titre: Blue Bossa
tonalité: Cm
tempo: 150

A: | Cm7 | % | Fm7 | % | Dm7b5 | G7b9 | Cm7 | % |
B: | Ebm7 | Ab7 | Dbmaj7 | % | Dm7b5 | G7b9 | Cm7 | Dm7b5 G7b9 |`},
 {name:'Blues jazz en Fa',sub:'12 mesures · dominantes secondaires',text:`titre: Blues en Fa
tonalité: F
tempo: 140

| F7 | Bb7 | F7 | Cm7 F7 |
| Bb7 | Bdim7 | F7 | Am7 D7 |
| Gm7 | C7 | F7 D7 | Gm7 C7 |`},
 {name:'Rhythm Changes',sub:'Si♭ majeur · section A',text:`titre: Rhythm Changes (A)
tonalité: Bb
tempo: 200

A: | Bbmaj7 G7 | Cm7 F7 | Dm7 G7 | Cm7 F7 | Fm7 Bb7 | Ebmaj7 Ab7 | Dm7 G7 | Cm7 F7 |`},
 {name:'Canon pop',sub:'Ré majeur · I–V–vi–iii–IV',text:`titre: Progression du canon
tonalité: D
tempo: 88

| D | A/C# | Bm | F#m/A | G | D/F# | G | A7 |`},
 {name:'Notation française',sub:'Do majeur · emprunts',text:`titre: Exemple en Do Ré Mi
tempo: 100

A: | Do | Lam7 | Rém7 | Sol7 |
B: | Fa | Fam6 | Do/Mi | La7 |
C: | Rém7 | Sol7sus4 Sol7 | Do . . Sib7 | Do |`},
 {name:'Valse modale',sub:'3/4 · dorien',text:`titre: Valse en Ré dorien
tonalité: Dm
mesure: 3/4
tempo: 160

| Dm7 | % | Em7 | % | Fmaj7 | G7 | Dm7 | % |`}
];

const S={theme:'auto',mtab:'grid',gridSimple:false,show:{circle:true,detail:true},etBoxOpen:true,view:'grid',et:{sub:2,motif:'random',fill:'mix',start:'near',range:'mid',mix:'both',ten:true,app:true,seed:1,preset:'phrase',inst:'c',disp:'score',cursor:'center',aid:true,rhy:'phrase',swing:.58,slur:true},abs:0,mel:{cur:null,prev:null},melKey:-1,notes:[],slot:-1,notation:'en',circle:'chroma',layers:{next:true,moves:true,scale:true,key:true},keyChoice:'auto',bpm:120,bpb:4,
  loop:true,sound:false,playing:false,beatPos:0,cur:0,sheet:null,tl:[],total:0,bars:0,key:{tonic:0,mode:'major'},autoKey:null,src:'',
  acc:{comp:'guitar',bass:'two'},arr:{chords:[],bass:[]},accSeed:1,region:null,selMode:false,selAnchor:null};
const LS='cercle-harmonique-v1';
try{const d=JSON.parse(localStorage.getItem(LS)||'null');if(d){Object.assign(S.layers,d.layers||{});if(d.acc)Object.assign(S.acc,d.acc);S.notation=d.notation||S.notation;S.circle=d.circle||S.circle;S.src=d.src||'';if(d.et){Object.assign(S.et,d.et);if(!d.et.inst)S.et.inst=d.et.trans==='bb'?'clb':'c'}if(d.show)Object.assign(S.show,d.show);if(d.etBoxOpen===false)S.etBoxOpen=false;if(d.view)S.view=d.view;if(d.mtab)S.mtab=d.mtab;S.gridSimple=!!d.gridSimple;if(d.theme)S.theme=d.theme}}catch(e){}
const save=()=>{try{localStorage.setItem(LS,JSON.stringify({acc:S.acc,layers:S.layers,notation:S.notation,circle:S.circle,src:S.src,et:S.et,view:S.view,show:S.show,etBoxOpen:S.etBoxOpen,mtab:S.mtab,gridSimple:S.gridSimple,theme:S.theme}))}catch(e){}};

/* ---------- cercle ---------- */
const svg=$('#circle');const CX=250,CY=250,R=180,NR=21,RK=134;
const posK=pc=>S.circle==='fifths'?mod(pc*7):mod(pc);
const xy=(k,r)=>{const a=(k*30-90)*Math.PI/180;return [CX+r*Math.cos(a),CY+r*Math.sin(a)]};
let nodes=[],gKey,gDyn,gMel,cSym,cNum,cScale;
function buildCircle(){
  svg.innerHTML='';
  const defs=sv('defs',{},svg);
  for(const [id,cls] of [['ah-soft','ah-soft'],['ah-next','ah-next']]){const m=sv('marker',{id,viewBox:'0 0 10 10',refX:'7',refY:'5',markerWidth:'6',markerHeight:'6',orient:'auto-start-reverse'},defs);sv('path',{d:'M0,0 L10,5 L0,10 z',class:cls},m)}
  sv('circle',{class:'track',cx:CX,cy:CY,r:R},svg);
  sv('circle',{class:'track',cx:CX,cy:CY,r:RK+14},svg);
  gKey=sv('g',{},svg);
  gDyn=sv('g',{id:'g-dyn'},svg);
  gMel=sv('g',{},svg);
  const gN=sv('g',{},svg);
  nodes=[];
  for(let pc=0;pc<12;pc++){
    const g=sv('g',{class:'node','data-pc':pc,role:'button','aria-label':'Note'},gN);
    sv('circle',{class:'mring',r:33},g);sv('circle',{class:'halo',r:28},g);sv('circle',{class:'body',r:NR},g);
    const lbl=sv('text',{class:'lbl'},g);const deg=sv('text',{class:'deg'},g);
    g.addEventListener('click',()=>playNote(pc));
    nodes.push({g,lbl,deg});
  }
  const gc=sv('g',{},svg);
  cSym=sv('text',{class:'c-sym',x:CX,y:CY+4},gc);
  cNum=sv('text',{class:'c-num',x:CX,y:CY+34},gc);
  cScale=sv('text',{class:'c-scale',x:CX,y:CY+54},gc);
  placeNodes();
}
function placeNodes(){
  nodes.forEach((n,pc)=>{const k=posK(pc);const [x,y]=xy(k,R);n.g.style.transform=`translate(${x}px,${y}px)`;
    const a=(k*30-90)*Math.PI/180;n.deg.setAttribute('x',(Math.cos(a)*41).toFixed(1));n.deg.setAttribute('y',(Math.sin(a)*41).toFixed(1))});
}
function arc(k,r,half){const a0=(k*30-90-half)*Math.PI/180,a1=(k*30-90+half)*Math.PI/180;
  return `M${CX+r*Math.cos(a0)},${CY+r*Math.sin(a0)} A${r},${r} 0 0 1 ${CX+r*Math.cos(a1)},${CY+r*Math.sin(a1)}`}
function shorten(x,y,tx,ty,d){const dx=tx-x,dy=ty-y,L=Math.hypot(dx,dy)||1;return [x+dx/L*d,y+dy/L*d]}

function renderCircle(){
  const ev=S.tl[S.cur];const c=ev?.chord;const N=S.tl.length;
  const ni=AC.nextIdx(S.cur,N,S.loop,S.region),n=N>1&&ni>=0?S.tl[ni].chord:null;
  const flat=H.keyFlat(S.key);
  // tonalité
  gKey.innerHTML='';
  if(S.layers.key){const ks=H.keyScaleSet(S.key);
    const base=S.key.mode==='major'?[0,2,4,5,7,9,11]:[0,2,3,5,7,8,10];
    base.forEach(x=>{const pc=mod(x+S.key.tonic);sv('path',{class:'karc'+(x===0?' tonic':''),d:arc(posK(pc),RK+14,11)},gKey)});
    const [lx,ly]=xy(posK(S.key.tonic),RK-2);
    const t=sv('text',{class:'klabel',x:lx,y:ly+3,'text-anchor':'middle'},gKey);t.textContent=H.keyShort(S.key);
  }
  // classes
  const inCur=new Map(),inNext=new Map();
  if(c)c.tones.forEach(t=>{if(!t.ext||true)inCur.set(t.pc,t)});
  if(n&&S.layers.next)n.core.forEach(t=>inNext.set(t.pc,t));
  const vl=c&&n?H.voiceLeading(c,n):[];
  const passing=new Set();if(S.layers.moves)vl.forEach(v=>v.pass.forEach(p=>passing.add(p)));
  const tens=new Map(),avoid=new Set();
  if(c&&S.layers.scale&&c.scale){
    const core=new Set(c.core.map(t=>t.pc));
    c.scale.notes.forEach(sn=>{if(core.has(sn.pc))return;tens.set(sn.pc,sn);if(core.has(mod(sn.pc-1)))avoid.add(sn.pc)});
  }
  const ks=H.keyScaleSet(S.key);
  nodes.forEach((nd,pc)=>{
    const ct=inCur.get(pc),nt=inNext.get(pc);
    const cl=['node'];
    if(ks.has(pc))cl.push('in-key');
    if(ct)cl.push('in-cur');
    if(ct&&ct.deg===1)cl.push('root');
    if(nt)cl.push(ct?'common':'in-next');
    if(!ct&&tens.has(pc))cl.push(avoid.has(pc)?'tension avoid':'tension');
    if(!ct&&passing.has(pc))cl.push('passing');
    if(c&&c.bass&&c.bass.pc===pc&&!ct)cl.push('bass');
    nd.g.setAttribute('class',cl.join(' '));
    let name;
    if(ct)name=H.nn(ct.L,ct.a);else if(tens.has(pc)){const s=tens.get(pc);name=H.nn(s.L,s.a)}else if(nt)name=H.nn(nt.L,nt.a);else name=H.pcName(pc,flat);
    nd.lbl.textContent=name;
    nd.lbl.style.fontSize=name.length>3?'11px':name.length>2?'12px':'';
    let dg='';
    if(ct)dg=ct.ext?ct.label:ct.label;
    else if(tens.has(pc)&&c){const semi=mod(pc-c.root.pc);dg=({1:'♭9',2:'9',3:'♯9',4:'3',5:'11',6:'♯11',7:'5',8:'♭13',9:'13',10:'♭7',11:'7'})[semi]||''}
    else if(c&&c.bass&&c.bass.pc===pc)dg='basse';
    nd.deg.textContent=dg;
    nd.g.setAttribute('aria-label',name+(dg?' ('+dg+')':''));
  });
  // dynamique
  gDyn.innerHTML='';
  const poly=(chord,cls)=>{const pcs=[...new Set(chord.core.map(t=>t.pc))].sort((a,b)=>posK(a)-posK(b));
    const pts=pcs.map(pc=>xy(posK(pc),R).map(v=>v.toFixed(1)).join(','));
    if(pts.length>=3)sv('polygon',{class:cls,points:pts.join(' ')},gDyn);else if(pts.length===2)sv('polyline',{class:cls,points:pts.join(' ')},gDyn)};
  if(n&&S.layers.next)poly(n,'poly-next');
  if(c)poly(c,'poly');
  if(S.layers.moves)vl.forEach(v=>{
    if(v.d===0)return;
    const [x1,y1]=xy(posK(v.from.pc),R),[x2,y2]=xy(posK(v.to.pc),R);
    const mx=(x1+x2)/2,my=(y1+y2)/2;let cx=CX+(mx-CX)*.6,cy=CY+(my-CY)*.6;
    if(Math.hypot(x1-x2,y1-y2)<1){return}
    const s=shorten(x1,y1,cx,cy,NR+2),e=shorten(x2,y2,cx,cy,NR+5);
    sv('path',{class:'mv'+(v.guide?' guide':''),d:`M${s[0].toFixed(1)},${s[1].toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${e[0].toFixed(1)},${e[1].toFixed(1)}`},gDyn);
  });
  // centre
  cSym.textContent=c?H.chordText(c):'';
  cNum.textContent=c?c.an.label:'';
  cScale.textContent=c&&c.scale?c.scale.name:'';
  updateMelodyCircle();
}

/* ---------- panneau d'analyse ---------- */
function renderDetail(){
  const box=$('#detail');const ev=S.tl[S.cur];
  if(!ev){box.innerHTML='<p class="muted">Aucun accord reconnu. Saisissez une grille ci-contre.</p>';return}
  const c=ev.chord,A=c.an,N=S.tl.length;
  const ni=AC.nextIdx(S.cur,N,true,S.region),n=N>1&&ni>=0?S.tl[ni].chord:null;
  const flat=H.keyFlat(S.key);
  const notes=c.tones.map(t=>`<span class="chip${t.ext?'':' core'}"><b>${H.nn(t.L,t.a)}</b><small>${t.label}</small></span>`).join('');
  const exts=c.tones.filter(t=>t.ext).map(t=>t.label);
  let scaleHTML='';
  if(c.scale){
    const core=new Set(c.core.map(t=>t.pc));
    scaleHTML=c.scale.notes.map(sn=>{const isC=core.has(sn.pc);const av=!isC&&core.has(mod(sn.pc-1));
      const semi=mod(sn.pc-c.root.pc);const lab=isC?(c.core.find(t=>t.pc===sn.pc)?.label||''):({1:'♭9',2:'9',3:'♯9',4:'3',5:'11',6:'♯11',7:'5',8:'♭13',9:'13',10:'♭7',11:'7'})[semi];
      return `<span class="chip${isC?' core':av?' avoid':''}" title="${av?'Note à traiter en passage (demi-ton au-dessus d\'une note de l\'accord)':isC?'Note de l\'accord':'Tension disponible'}"><b>${H.nn(sn.L,sn.a)}</b><small>${lab}</small></span>`}).join('');
  }
  let vlHTML='<p class="muted">Dernier accord de la grille.</p>';
  if(n){
    const vl=H.voiceLeading(c,n);
    const tot=vl.reduce((s,v)=>s+Math.abs(v.d),0);
    const common=vl.filter(v=>v.d===0).map(v=>H.nn(v.from.L,v.from.a));
    const passAll=[...new Set(vl.flatMap(v=>v.pass))];
    const rm=mod(n.root.pc-c.root.pc);
    vlHTML=`<p><b>Fondamentale :</b> ${H.INTV[rm]}</p>
    <div class="vl">${vl.map(v=>`<span class="n">${H.nn(v.from.L,v.from.a)}</span><span class="a">${v.d===0?'=':'→'}</span><span class="n${v.guide?' g':''}">${H.nn(v.to.L,v.to.a)}</span><span class="s">${v.d===0?'commune':(v.d>0?'+':'−')+Math.abs(v.d)+' demi-ton'+(Math.abs(v.d)>1?'s':'')}${v.guide?'<span class="tag">note guide '+v.from.label+'</span>':''}</span>`).join('')}</div>
    <p class="muted">${common.length?`Notes communes : ${common.join(', ')}. `:'Aucune note commune. '}Mouvement total : ${tot} demi-ton${tot>1?'s':''}.</p>
    ${passAll.length?`<div class="chips">${passAll.map(pc=>`<span class="chip pass"><b>${H.pcName(pc,flat)}</b><small>passage</small></span>`).join('')}</div>`:''}
    <p class="muted">Approche chromatique de ${H.nn(n.root.L,n.root.a)} : ${H.pcName(n.root.pc-1,false)} (par en dessous) ou ${H.pcName(n.root.pc+1,true)} (par au-dessus).</p>`;
  }
  box.innerHTML=`
    <div class="d-head"><div class="d-sym">${esc(H.chordText(c))}</div>
      <div class="d-name">${H.nn(c.root.L,c.root.a)} ${H.QNAME[c.kind]||''}${exts.length?' · tensions '+exts.join(' '):''}${c.bass?' · basse '+H.nn(c.bass.L,c.bass.a):''}</div>
      <span class="fn fn-${A.fn}">${H.FN_NAME[A.fn]}</span></div>
    <div class="d-grid">
      <div class="d-block"><span class="label">Notes de l'accord</span><div class="chips">${notes}</div></div>
      <div class="d-block"><span class="label">Analyse en ${H.keyName(S.key)}</span><div class="num-big">${esc(A.label)}</div><p>${esc(A.text)}</p></div>
      <div class="d-block"><span class="label">Gamme de l'accord</span><p><b>${c.scale?esc(H.nn(c.root.L,c.root.a)+' '+c.scale.name):'–'}</b></p><div class="chips">${scaleHTML}</div>
        <p class="muted">Pointillés rouges : notes à jouer en passage plutôt qu'en appui.</p></div>
      <div class="d-block"><span class="label">Vers ${n?esc(H.chordText(n)):'la fin'}</span>${vlHTML}</div>
    </div>`;
}

/* ---------- grille ---------- */
let chEls=[];
function symHTML(chord){
  let h=esc(H.nn(chord.root.L,chord.root.a));
  const suf=H.prettySuffix(chord.suffix);
  if(suf)h+=`<sup>${esc(suf)}</sup>`;
  if(chord.bass)h+=`<span class="bs">/${esc(H.nn(chord.bass.L,chord.bass.a))}</span>`;
  return h;
}
function renderGrid(){
  const grid=$('#grid');grid.innerHTML='';chEls=[];
  if(!S.sheet||!S.sheet.rows.length){grid.innerHTML='<p class="help" style="padding:20px 6px">La grille est vide. Saisissez des accords dans l\'onglet « Liste d\'accords » ou choisissez un exemple.</p>';return}
  S.sheet.rows.forEach(row=>{
    const r=document.createElement('div');r.className='row';
    const lab=document.createElement('div');lab.className='row-label';lab.textContent=row.label||'';r.append(lab);
    const bars=document.createElement('div');bars.className='bars';
    row.bars.forEach(bar=>{
      const b=document.createElement('div');b.className='bar';
      bar.items.forEach(it=>{
        const btn=document.createElement('button');
        if(it.error){btn.className='ch err';btn.innerHTML=`<span class="sym">${esc(it.tok)}</span><span class="an">?</span><span class="fnbar"></span>`;btn.title=it.error;b.append(btn);return}
        const ev=S.tl[it.ev];const A=ev.chord.an;
        btn.className='ch'+(bar.repeat?' rep':'');btn.dataset.fn=A.fn;
        const arrow=A.arrow==='res'?' <span class="res">→</span>':A.arrow==='sub'?' <span class="sub">⇢</span>':'';
        btn.innerHTML=`<span class="sym">${bar.repeat&&bar.items.length===1?'%':symHTML(ev.chord)}</span><span class="an">${esc(A.label)}${arrow}${A.iiv?`<span class="br ${A.iiv}"></span>`:''}</span><span class="fnbar"></span>`;
        btn.setAttribute('aria-label',`${H.chordText(ev.chord)}, ${A.label}, mesure ${ev.bar+1}`);
        btn.addEventListener('click',e=>onChordClick(it.ev,e));
        b.append(btn);chEls[it.ev]=btn;
      });
      bars.append(b);
    });
    r.append(bars);grid.append(r);
  });
  markLoop();
}

/* ---------- boucle sur une partie de la grille ---------- */
const inRegion=i=>!S.region||(i>=S.region.a&&i<=S.region.b);
function setRegion(a,b){
  if(a==null||!S.tl.length)S.region=null;
  else{if(a>b)[a,b]=[b,a];S.region={a,b}}
  rearrange();markLoop();
  if(S.region&&!inRegion(S.cur))jumpTo(S.region.a,false);else refresh(false);
}
function setSelMode(on){
  S.selMode=on;S.selAnchor=null;$('#btn-sel').setAttribute('aria-pressed',String(on));$('#gridbox').classList.toggle('selecting',on);markLoop();
}
function onChordClick(i,e){
  if(S.selMode){
    if(S.selAnchor==null){S.selAnchor=i;markLoop();return}
    const a=S.selAnchor;setSelMode(false);setRegion(a,i);return;
  }
  if(e&&e.shiftKey){setRegion(S.cur,i);return}
  jumpTo(i,true);
}
function markLoop(){
  const r=S.region;
  chEls.forEach((el,i)=>{if(!el)return;const inn=!!r&&i>=r.a&&i<=r.b;
    el.classList.toggle('in-loop',inn);el.classList.toggle('loop-a',inn&&i===r.a);el.classList.toggle('loop-b',inn&&i===r.b);
    el.classList.toggle('sel-anchor',S.selMode&&i===S.selAnchor)});
  const info=$('#loop-info');if(!info)return;$('#btn-unloop').hidden=!r;
  if(S.selMode)info.textContent=S.selAnchor==null?'Touchez le premier accord de la boucle.':'Touchez maintenant le dernier accord.';
  else if(r){const a=S.tl[r.a].bar+1,b=S.tl[r.b].bar+1,n=r.b-r.a+1;info.textContent=`Boucle : ${a===b?'mesure '+a:'mesures '+a+' à '+b} · ${n} accord${n>1?'s':''}`}
  else info.textContent='Sur ordinateur : Maj + clic sur un accord boucle depuis l\'accord en cours.';
}
function stepChord(d){const N=S.tl.length;if(!N)return;const j=d>0?AC.nextIdx(S.cur,N,true,S.region):AC.prevIdx(S.cur,N,true,S.region);jumpTo(j,true)}

/* ---------- chargement ---------- */
function keyOptions(){
  const sel=$('#sel-key');const auto=S.autoKey;
  let h=`<option value="auto">Auto · ${auto?H.keyShort(auto):'–'}</option>`;
  for(const mode of ['major','minor'])for(let t=0;t<12;t++){const k={tonic:t,mode};h+=`<option value="${t}:${mode}">${H.keyName(k)}</option>`}
  sel.innerHTML=h;sel.value=S.keyChoice;
}
function applyKey(){
  if(S.keyChoice==='auto')S.key=S.autoKey||{tonic:0,mode:'major'};
  else{const [t,m]=S.keyChoice.split(':');S.key={tonic:+t,mode:m}}
  H.analyze(S.tl,S.key);
}
function load(text,{keepPos=false}={}){
  S.src=text;save();
  const sh=H.parseSheet(text);S.sheet=sh;
  if(sh.meta.tempo){S.bpm=sh.meta.tempo;$('#inp-bpm').value=S.bpm}
  S.bpb=sh.meta.beats||4;
  const {tl,totalBeats,bars}=H.buildTimeline(sh,S.bpb);
  S.tl=tl;S.total=totalBeats;S.bars=bars;
  S.autoKey=H.parseKey(sh.meta.key)||(tl.length?H.detectKey(tl):null);
  if(!keepPos){S.keyChoice='auto'}
  keyOptions();applyKey();
  if(!keepPos||(S.region&&S.region.b>=tl.length)){S.region=null;if(S.selMode)setSelMode(false)}
  rearrange();
  $('#sheet-title').textContent=sh.meta.title||'Grille';
  const errs=$('#errs');errs.innerHTML=sh.errors.slice(0,8).map(e=>`<li>${esc(e)}</li>`).join('');
  if(!keepPos){S.cur=0;S.beatPos=0}else{S.cur=Math.min(S.cur,Math.max(0,tl.length-1));S.beatPos=tl[S.cur]?tl[S.cur].start:0}
  renderBeats();renderGrid();regen(true);refresh(false);
}
function refresh(scroll=true){
  renderCircle();renderDetail();
  const N=S.tl.length,ev=S.tl[S.cur],ni=AC.nextIdx(S.cur,N,true,S.region),pi=AC.prevIdx(S.cur,N,true,S.region);
  chEls.forEach((el,i)=>{if(!el)return;el.classList.toggle('is-cur',i===S.cur);el.classList.toggle('is-next',N>1&&i===ni&&i!==S.cur);if(i!==S.cur)el.style.removeProperty('--p')});
  $('#m-now').textContent=ev?H.chordText(ev.chord):'–';
  $('#m-prev').textContent=N>1&&pi>=0?H.chordText(S.tl[pi].chord):'–';
  $('#m-next').textContent=N>1&&ni>=0?H.chordText(S.tl[ni].chord):'–';
  if(scroll)scrollToCur();
  updatePos();
}
function scrollToCur(){
  const el=chEls[S.cur];const box=$('#gridbox');if(!el)return;if(box.scrollHeight<=box.clientHeight+2){followGridWindow();return}
  const er=el.getBoundingClientRect(),br=box.getBoundingClientRect();
  const off=er.top-br.top+box.scrollTop;
  const target=off-box.clientHeight*0.35;
  if(er.top<br.top+20||er.bottom>br.bottom-20)box.scrollTop=Math.max(0,target);
  followGridWindow();
}
function followGridWindow(){
  if(!S.playing||S.view!=='grid')return;const el=chEls[S.cur];if(!el)return;
  const r=el.getBoundingClientRect(),top=hdrBottom()+8,bot=innerHeight-8;
  if(r.top<top||r.bottom>bot)window.scrollBy({top:r.top-(top+(bot-top)*.25),behavior:scrollMode()});
}

/* ---------- lecture ---------- */
function renderBeats(){$('#beats').innerHTML=Array.from({length:S.bpb},()=>'<i></i>').join('')}
function updatePos(){
  const bar=Math.floor(S.beatPos/S.bpb),beat=Math.floor(S.beatPos-bar*S.bpb);
  $('#pos-txt').textContent=`Mesure ${Math.min(bar+1,Math.max(1,S.bars))} / ${S.bars||1}`;
  [...$('#beats').children].forEach((d,i)=>d.classList.toggle('on',S.playing&&i===beat));
}
function idxAt(b){const tl=S.tl;for(let i=tl.length-1;i>=0;i--)if(tl[i].start<=b+1e-6)return i;return 0}
let raf=0,lastT=0;
function tick(now){
  if(!S.playing)return;
  const dt=Math.min(.25,(now-lastT)/1000);lastT=now;
  const db=dt*S.bpm/60;S.beatPos+=db;S.abs+=db;
  if(S.region){
    // boucle sur la partie choisie : chaque passage compte comme un nouveau tour (nouvelle ligne en défilement)
    const B=AC.bounds(S.tl,S.total,S.region);
    if(S.beatPos>=B.end-1e-9||S.beatPos<B.start-1e-6){const c=Math.floor((S.abs-db)/S.total);
      S.beatPos=B.start+Math.max(0,Math.min(S.beatPos-B.end,B.end-B.start-1e-6));S.abs=(c+1)*S.total+S.beatPos}
  }
  else if(S.beatPos>=S.total){if(S.loop||streaming())S.beatPos-=S.total;else{S.beatPos=S.total-1e-3;setPlaying(false);return}}
  const i=idxAt(S.beatPos);
  if(i!==S.cur){S.cur=i;refresh()}
  schedule();
  melodyTick();updatePlayhead();updateStrip();
  const ev=S.tl[S.cur];if(ev&&chEls[S.cur])chEls[S.cur].style.setProperty('--p',Math.min(1,(S.beatPos-ev.start)/ev.beats).toFixed(3));
  updatePos();
  raf=requestAnimationFrame(tick);
}
function setPlaying(p){
  if(!S.tl.length)p=false;
  S.playing=p;$('#btn-play').setAttribute('aria-label',p?'Pause':'Lecture');
  $('#ico-play').innerHTML=p?'<path d="M3.5 2.5h3.2v11H3.5zM9.3 2.5h3.2v11H9.3z"/>':'<path d="M4 2.5v11L13.5 8z"/>';
  $('#fb-play').innerHTML=$('#btn-play').innerHTML.replace(' id="ico-play"','');$('#fb-play').setAttribute('aria-label',p?'Pause':'Lecture');
  cancelAnimationFrame(raf);
  if(p){lastLine=-1;
    if(S.region){const B=AC.bounds(S.tl,S.total,S.region);if(S.beatPos<B.start-1e-6||S.beatPos>=B.end-1e-2){S.beatPos=B.start;S.cur=S.region.a;syncAbs();refresh()}}
    else if(S.beatPos>=S.total-1e-2)S.beatPos=0;
    lastT=performance.now();if(S.sound){audio();resetSched(true);schedule();S.slot=-1;melodyTick()}raf=requestAnimationFrame(tick)}
  else fadeActive();
  updatePos();
}
function jumpTo(i,play){
  const N=S.tl.length;if(!N||i<0)return;i=mod(i,N);
  if(!inRegion(i)){S.region=null;rearrange();markLoop()}
  S.cur=i;S.beatPos=S.tl[i].start;syncAbs();lastT=performance.now();S.slot=-1;
  if(S.sound&&S.playing){fadeActive();resetSched(true)}
  refresh();melodyTick(!S.playing&&!!play);updatePlayhead();updateStrip();
  if(S.sound&&play&&!S.playing&&accOn())previewChord(S.tl[i]);
}

/* ---------- son ---------- */
let ac=null,master=null,bus={},voices=[],center=62;
function audio(){
  if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)();const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=5200;master=ac.createGain();master.gain.value=.55;master.connect(f).connect(ac.destination);
    bus.gtr=ac.createBiquadFilter();bus.gtr.type='highpass';bus.gtr.frequency.value=90;bus.gtr.connect(master);
    bus.bass=ac.createBiquadFilter();bus.bass.type='lowpass';bus.bass.frequency.value=1000;bus.bass.connect(master)}catch(e){ac=null}}
  if(ac&&ac.state==='suspended')ac.resume();
  return ac;
}
const mf=m=>440*Math.pow(2,(m-69)/12);
/* chaque note est suivie dans un groupe (chord, bass, mel) pour pouvoir l'étouffer ou l'annuler */
function track(group,g,srcs,t0,end){voices.push({group,g,srcs,t0,end});if(voices.length>96){const now=ac.currentTime;voices=voices.filter(v=>v.end>now)}}
function newGain(){const g=ac.createGain();g.gain.value=0;return g}
function release(v,t,tau){try{const p=v.g.gain;if(p.cancelAndHoldAtTime)p.cancelAndHoldAtTime(t);else p.cancelScheduledValues(t);p.setTargetAtTime(0,t,tau)}catch(e){}v.end=Math.min(v.end,t+tau*6)}
function cutGroup(group,t,tau=.03){voices.forEach(v=>{if(v.group===group&&v.t0<t-1e-3&&v.end>t)release(v,t,tau)})}
function fadeActive(){if(!ac)return;const t=ac.currentTime;voices.forEach(v=>{if(v.t0>t+.005)v.srcs.forEach(s=>{try{s.stop(t)}catch(e){}});else release(v,t,.05)});voices=[]}
/* corde pincée (Karplus-Strong) : une table d'onde calculée une fois par hauteur */
const ksCache=new Map();
function ksBuffer(m,kind){
  const key=kind+m;let b=ksCache.get(key);if(b)return b;
  const sr=ac.sampleRate,isB=kind==='bass',len=Math.floor(sr*(isB?2.4:1.8)),N=Math.max(2,Math.round(sr/mf(m)-.5));
  b=ac.createBuffer(1,len,sr);const d=b.getChannelData(0);
  let s=(m*7919+(isB?17:3))>>>0;const rnd=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/2147483648-1};
  const k=isB?.2:.55,n0=Math.min(N,len);let y=0,mean=0,pk=1e-9;
  for(let i=0;i<n0;i++){y+=k*(rnd()-y);d[i]=y;mean+=y}
  mean/=n0;for(let i=0;i<n0;i++){d[i]-=mean;pk=Math.max(pk,Math.abs(d[i]))}
  for(let i=0;i<n0;i++)d[i]/=pk;
  const decay=isB?.997:.996;
  for(let i=N;i<len;i++){const a=d[i-N],c=i-N-1>=0?d[i-N-1]:a;d[i]=decay*.5*(a+c)}
  ksCache.set(key,b);return b;
}
function pluck(m,kind,t,dur,peak,group,dest){
  const src=ac.createBufferSource();src.buffer=ksBuffer(m,kind);
  const g=newGain();g.gain.setValueAtTime(peak,t);g.gain.setTargetAtTime(0,t+dur,kind==='bass'?.06:.035);
  src.connect(g).connect(dest||master);const end=t+Math.min(dur+.5,src.buffer.duration);src.start(t);src.stop(end);track(group,g,[src],t,end);
}
function strum(notes,t,dur,peak){[...notes].sort((a,b)=>a-b).forEach((m,i)=>pluck(m,'gtr',t+i*.011,dur,peak*(1-i*.05),'chord',bus.gtr))}
function pianoNote(m,t,dur,peak){
  const f=mf(m),o1=ac.createOscillator(),o2=ac.createOscillator();o1.type='triangle';o2.type='sine';o1.frequency.value=f;o2.frequency.value=f*2.002;
  const g2=ac.createGain();g2.gain.value=.3;
  const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(Math.min(9000,f*8),t);lp.frequency.setTargetAtTime(Math.min(3000,f*3),t,.25);
  const g=newGain(),tau=Math.max(.25,1.4*Math.pow(2,-(m-48)/18));
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+.006);g.gain.setTargetAtTime(0,t+.006,tau);g.gain.setTargetAtTime(0,t+dur,.09);
  o1.connect(lp);o2.connect(g2).connect(lp);lp.connect(g).connect(master);
  const end=t+dur+.6;o1.start(t);o2.start(t);o1.stop(end);o2.stop(end);track('chord',g,[o1,o2],t,end);
}
function bassNote(m,t,dur,peak){
  const d=Math.max(.08,dur*.96);
  pluck(m,'bass',t,d,peak,'bass',bus.bass);
  const o=ac.createOscillator();o.type='sine';o.frequency.value=mf(m);const g=newGain();
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak*.6,t+.01);g.gain.setTargetAtTime(peak*.25,t+.01,.25);g.gain.setTargetAtTime(0,t+d,.05);
  o.connect(g).connect(bus.bass);const end=t+d+.4;o.start(t);o.stop(end);track('bass',g,[o],t,end);
}
function voicing(c){
  let pcs=[...new Set(c.tones.filter(t=>!t.ext||t.deg===9||t.deg===13).map(t=>t.pc))];
  if(pcs.length>4)pcs=pcs.filter(pc=>pc!==c.root.pc);
  const notes=pcs.map(pc=>{let best=null;for(let m=52;m<=78;m++)if(mod(m)===pc&&(best==null||Math.abs(m-center)<Math.abs(best-center)))best=m;return best}).sort((a,b)=>a-b);
  const avg=notes.reduce((s,m)=>s+m,0)/notes.length;center=Math.max(58,Math.min(67,avg));
  const bp=(c.bass||c.root).pc;return {notes,bass:40+mod(bp-4)};
}
function tone(m,type,peak,t,dur,group='mel'){
  const o=ac.createOscillator();o.type=type;o.frequency.value=mf(m);
  const g=newGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+.02);g.gain.exponentialRampToValueAtTime(peak*.4,t+.7);
  g.gain.setTargetAtTime(0,t+dur,.15);o.connect(g).connect(master);o.start(t);o.stop(t+dur+1.2);track(group,g,[o],t,t+dur+1.2);
}
/* ---------- accompagnement : accords et basse calculés par AC, programmés un peu en avance ---------- */
const vcache=new Map();
function voicingFor(i){if(!vcache.has(i))vcache.set(i,voicing(S.tl[i].chord));return vcache.get(i)}
const accOn=()=>!(S.view==='etude'&&S.et.mix==='mel');
function rearrange(){
  S.accSeed=1;vcache.clear();center=62;
  S.arr=S.tl.length?AC.arrange(S.tl,S.total,S.bpb,{comp:S.acc.comp,bass:S.acc.bass,loop:S.loop,region:S.region},S.accSeed):{chords:[],bass:[]};
}
function playChordHit(h,t,dur){
  if(!S.tl[h.ev])return;
  const v=voicingFor(h.ev),et=S.view==='etude',vol=(h.acc||1)*(et?.55:1),notes=v.notes.map(m=>et&&m>64?m-12:m);
  cutGroup('chord',t);
  if(S.acc.comp==='guitar')strum(h.kind==='chop'?notes:[v.bass,...notes],t,dur,.17*vol);
  else if(S.acc.comp==='piano'){notes.forEach(m=>pianoNote(m,t,dur,.1*vol));if(S.acc.bass==='none')pianoNote(v.bass,t,dur,.12*vol)}
  else{notes.forEach(m=>tone(m,'triangle',.11*vol,t,dur,'chord'));if(S.acc.bass==='none')tone(v.bass,'sine',.28*vol,t,dur,'chord')}
}
let lastBass=36;
function playBassHit(h,t,dur){cutGroup('bass',t,.02);bassNote(h.m,t,dur,S.view==='etude'?.32:.45);lastBass=h.m}
function previewChord(ev){
  const ctx=audio(),i=S.tl.indexOf(ev);if(!ctx||i<0)return;fadeActive();
  const t=ctx.currentTime+.02;playChordHit({ev:i,kind:'low',acc:1},t,1.5);
  if(S.acc.bass!=='none')playBassHit({m:AC.near((ev.chord.bass||ev.chord.root).pc,lastBass)},t,1.5);
}
const LOOK=.1; // secondes programmées à l'avance
let schedPos=0;
const isLooping=()=>!!S.region||S.loop||streaming();
/* repart de la position courante ; si un accord ou une basse tenus ont commencé avant, on les fait entendre */
function resetSched(catchUp){
  schedPos=S.beatPos;if(!catchUp||!S.sound||!accOn()||!S.tl.length)return;
  const ctx=audio();if(!ctx)return;const spb=60/S.bpm,t=ctx.currentTime+.02,p=S.beatPos;
  const ring=(list,fn)=>{const h=list.find(h=>h.t<p-1e-3&&h.t+h.dur>p+.25);if(h)fn(h,t,(h.t+h.dur-p)*spb)};
  ring(S.arr.chords,playChordHit);ring(S.arr.bass,playBassHit);
}
function fire(a,b,delay){
  const spb=60/S.bpm,now=ac.currentTime+.01,inS=h=>h.t>=a-1e-9&&h.t<b-1e-9;
  for(const h of S.arr.chords)if(inS(h))playChordHit(h,now+delay(h.t)*spb,h.dur*spb);
  for(const h of S.arr.bass)if(inS(h))playBassHit(h,now+delay(h.t)*spb,h.dur*spb);
}
function onLap(){ // nouvelle ligne de walking à chaque tour
  if(S.acc.bass!=='walk')return;S.accSeed=(S.accSeed||1)+1;
  S.arr.bass=AC.bassLine(S.tl,S.total,S.bpb,{style:'walk',loop:S.loop,region:S.region,startFrom:lastBass},S.accSeed);
}
function schedule(){
  if(!S.sound||!S.playing||!accOn()||!S.tl.length||!audio())return;
  const B=AC.bounds(S.tl,S.total,S.region),loopOn=isLooping(),L=LOOK*S.bpm/60,p=S.beatPos;
  if(B.end-B.start<=0)return;
  let ahead;
  if(schedPos>=p-1e-9)ahead=schedPos-p;
  else if(loopOn&&(B.end-p)+(schedPos-B.start)<2*L)ahead=(B.end-p)+(schedPos-B.start);
  else if(p-schedPos<2*L){fire(schedPos,p,()=>0);schedPos=p;ahead=0}
  else{schedPos=p;ahead=0}
  if(ahead>2*L){schedPos=p;ahead=0}
  let base=ahead,need=L-ahead,guard=0;
  while(need>1e-9&&guard++<8){
    const s0=schedPos,b0=base,e=Math.min(B.end,s0+need);
    fire(s0,e,t=>b0+(t-s0));
    base+=e-s0;need-=e-s0;schedPos=e;
    if(schedPos>=B.end-1e-9){if(!loopOn)break;schedPos=B.start;onLap()}
  }
}
function playNote(pc){if(!S.sound){flashSound();return}const ctx=audio();if(!ctx)return;tone(60+pc,'triangle',.18,ctx.currentTime+.01,.9)}
function flashSound(){const b=$('#btn-sound');b.animate([{boxShadow:'0 0 0 3px var(--next)'},{boxShadow:'0 0 0 0 transparent'}],{duration:700})}

/* ---------- étude ---------- */
const ET=window.ET;
/* registres en hauteur ÉCRITE ; son réel = écrit − semi */
const INST={
 c:{name:'Ut · son réel',semi:0,steps:0,r:{low:[52,76],mid:[55,79],high:[60,84],full:[52,84]}},
 vln:{name:'Violon',semi:0,steps:0,r:{low:[55,74],mid:[62,81],high:[69,88],full:[55,88]}},
 clb:{name:'Clarinette en Si♭',semi:2,steps:1,iv:'une seconde majeure',r:{low:[52,70],mid:[57,77],high:[64,84],full:[52,88]}},
 asx:{name:'Saxophone alto en Mi♭',semi:9,steps:5,iv:'une sixte majeure',r:{low:[58,74],mid:[62,79],high:[67,89],full:[58,89]}},
 tsx:{name:'Saxophone ténor en Si♭',semi:14,steps:1,iv:'une neuvième majeure (un ton plus une octave)',r:{low:[58,74],mid:[62,79],high:[67,89],full:[58,89]}}
};
const curInst=()=>INST[S.et.inst]||INST.c;
const curTr=curInst;
function soundRange(){const I=curInst(),w=I.r[S.et.range]||I.r.mid;return [w[0]-I.semi,w[1]-I.semi]}
function writtenName(m){const sp=H.pcSp(mod(m),true);return H.nn(sp.L,sp.a)+(Math.floor((m-sp.a)/12)-1)}
const ET_PRESETS=[
 {id:'phrase',name:'Étude phrasée',set:{sub:2,motif:'random',fill:'mix',start:'near',ten:true,app:true,rhy:'phrase',slur:true}},
 {id:'manouche',name:'Phrasé manouche, syncopé',set:{sub:2,motif:'random',fill:'mix',start:'near',ten:true,app:true,rhy:'sync',swing:.64,slur:true}},
 {id:'ballad',name:'Ballade, notes longues',set:{sub:2,motif:'guide',fill:'diat',start:'near',ten:true,app:false,rhy:'ballad',swing:.5,slur:true}},
 {id:'arp',name:'Arpèges 1-3-5-7',set:{sub:2,motif:'up',fill:'none',start:'root',ten:false,app:false,rhy:'even'}},
 {id:'wave',name:'Arpèges en vague',set:{sub:2,motif:'wave',fill:'none',start:'near',ten:false,app:false,rhy:'even'}},
 {id:'guide',name:'Notes guides',set:{sub:1,motif:'guide',fill:'none',start:'near',ten:false,app:false}},
 {id:'scale',name:'Gammes d\'accord',set:{sub:2,motif:'wave',fill:'diat',start:'near',ten:false,app:false,rhy:'even'}},
 {id:'chrom',name:'Approches chromatiques',set:{sub:2,motif:'wave',fill:'chrom',start:'near',ten:false,app:true,rhy:'even'}},
 {id:'encl',name:'Encerclements en triolets',set:{sub:3,motif:'wave',fill:'encl',start:'near',ten:false,app:true}},
 {id:'bebop',name:'Ligne bebop',set:{sub:2,motif:'random',fill:'mix',start:'near',ten:true,app:true,rhy:'even'}}
];
const ACC={'1':'♯','2':'𝄪','-1':'♭','-2':'𝄫','0':'♮'};
const LINE_H=172;
let lineOf=[],curEl=null,downloads=null;
function genOpts(extra){const e=S.et,[lo,hi]=soundRange();return {sub:e.sub,motif:e.motif,fill:e.fill,start:e.start,lo,hi,ten:e.ten,app:e.app,loop:S.loop,rhy:e.rhy,slur:e.slur,bow:e.inst==='vln',...extra}}
function regen(full){
  S.notes=S.tl.length?ET.generate(S.tl,S.total,S.bpb,genOpts(),S.et.seed):[];
  if(full){stream.clear();S.abs=S.beatPos}else spliceStream();
  stripDirty=true;S.slot=-1;S.melKey=-1;renderScore();etStats();melodyTick();updateStrip();
}
/* ---------- défilement : flux sans fin, un tour = une nouvelle ligne ---------- */
const stream=new Map();
let stripDirty=true,stripBeat=null,stripGeo=null,stripW=0,lastStripCheck=-1;
const streaming=()=>S.view==='etude'&&S.et.disp==='scroll'&&S.tl.length>0;
function syncAbs(){if(!S.total)return;const c=Math.max(0,Math.floor(S.abs/S.total));S.abs=c*S.total+S.beatPos}
function genChorus(c,startFrom){return ET.generate(S.tl,S.total,S.bpb,genOpts({startFrom,loop:false}),S.et.seed*9973+c*7+1)}
function chorus(c){
  if(c<0||!S.tl.length)return null;
  if(!stream.has(c)){const p=stream.get(c-1);stream.set(c,genChorus(c,p&&p.length?p[p.length-1].m:undefined));
    for(const k of [...stream.keys()])if(k<c-3)stream.delete(k)}
  return stream.get(c);
}
function spliceStream(){
  if(!stream.size||!S.total)return;
  const c=Math.max(0,Math.floor(S.abs/S.total)),tNow=S.abs-c*S.total,old=stream.get(c);
  for(const k of [...stream.keys()])if(k>=c)stream.delete(k);
  const p=stream.get(c-1);const fresh=genChorus(c,p&&p.length?p[p.length-1].m:undefined);
  stream.set(c,old?old.filter(n=>n.t<=tNow+1e-6).concat(fresh.filter(n=>n.t>tNow+1e-6)):fresh);
}
function streamNoteAt(abs){
  if(!S.total)return null;const c=Math.max(0,Math.floor(abs/S.total)),arr=chorus(c);if(!arr||!arr.length)return null;
  const t=swT(abs-c*S.total);let i=0;while(i+1<arr.length&&arr[i+1].t<=t+1e-6)i++;
  while(i>0&&arr[i].hold)i--;   // note tenue : on reste sur son attaque
  let pi=i-1;while(pi>0&&(arr[pi].hold||arr[pi].rest))pi--;
  return {c,i,n:arr[i],p:pi>=0?arr[pi]:(stream.get(c-1)||[]).filter(x=>!x.hold&&!x.rest).slice(-1)[0]};
}
// swing : la 2e croche de chaque temps arrive plus tard (rapport S.et.swing ; 0,5 = croches égales)
const swR=()=>S.et.sub===2?(+S.et.swing||.5):.5;
function swT(t){const r=swR();if(r===.5)return t;const i=Math.floor(t),f=t-i;return i+(f<r?f/r*.5:.5+(f-r)/(1-r)*.5)}
/* ---------- figures rythmiques, communes à la partition et à la portée qui défile ----------
   pts : notes attaquées dans l'ordre {x,y,d,at,dur,slS,slE,bow,sT} ; d = degré diatonique (30 = mi4, 1re ligne) */
const EPS=1e-6;
const isDotted=dur=>[0.75,1.5,3].some(v=>Math.abs(dur-v)<EPS);
function headSVG(x,y,d,dur,col){
  let o=dur>=2-EPS?`<ellipse cx="${x}" cy="${y}" rx="5.6" ry="4.1" transform="rotate(-20 ${x.toFixed(1)} ${y})" style="fill:none;stroke:${col};stroke-width:1.8"/>`
    :`<ellipse cx="${x}" cy="${y}" rx="5.8" ry="4.3" transform="rotate(-20 ${x.toFixed(1)} ${y})" style="fill:${col}"/>`;
  if(isDotted(dur))o+=`<circle cx="${x+9.5}" cy="${d%2===0?y-4:y}" r="1.9" style="fill:${col}"/>`;
  return o;
}
function restSVG(x,sT,dur,col){
  const F=`style="fill:${col}"`,L=w=>`style="fill:none;stroke:${col};stroke-width:${w};stroke-linecap:round;stroke-linejoin:round"`;
  const dot=isDotted(dur)?`<circle cx="${x+9}" cy="${sT+15}" r="1.9" ${F}/>`:'';
  if(dur>=4-EPS)return `<rect x="${x-6}" y="${sT+10}" width="12" height="5" ${F}/>`;
  if(dur>=2-EPS)return `<rect x="${x-6}" y="${sT+15}" width="12" height="5" ${F}/>`+dot;
  if(dur>=1-EPS)return `<path d="M${x-2},${sT+7} L${x+3.5},${sT+14} Q${x-1.5},${sT+17} ${x+3},${sT+23} Q${x-5},${sT+21} ${x+1},${sT+32}" ${L(2.2)}/>`+dot;
  return `<circle cx="${x-2.5}" cy="${sT+15}" r="2.7" ${F}/><path d="M${x-2.5},${sT+17} Q${x+1},${sT+17.5} ${x+4},${sT+13} L${x-1},${sT+31}" ${L(1.6)}/>`+dot;
}
function stemsSVG(pts,ink,ink2){
  let o='';const Sk=`style="stroke:${ink};stroke-width:1.3"`;
  const stem=(p,up,tip)=>{const sx=up?p.x+5.2:p.x-5.2;return `<line x1="${sx}" x2="${sx}" y1="${p.y+(up?-1:1)}" y2="${tip}" ${Sk}/>`};
  for(let i=0;i<pts.length;){
    const p=pts[i];
    if(p.dur>=1-EPS){if(p.dur<4-EPS){const up=p.d<34;o+=stem(p,up,p.y+(up?-32:32))}i++;continue}
    // croches (ou triolets) d'un même temps : une ligature ; seule : un crochet
    const b=Math.floor(p.at+EPS);let j=i;
    while(j+1<pts.length&&pts[j+1].dur<1-EPS&&Math.floor(pts[j+1].at+EPS)===b&&pts[j+1].sT===p.sT)j++;
    const gr=pts.slice(i,j+1);i=j+1;
    const up=gr.reduce((s,q)=>s+q.d,0)/gr.length<34,sx=q=>up?q.x+5.2:q.x-5.2;
    if(gr.length===1){const tip=p.y+(up?-32:32),x=sx(p);o+=stem(p,up,tip);
      o+=up?`<path d="M${x},${tip} c.5,6 8,8 6,17 c0,-6 -3,-9 -6,-11z" style="fill:${ink}"/>`:`<path d="M${x},${tip} c.5,-6 8,-8 6,-17 c0,6 -3,9 -6,11z" style="fill:${ink}"/>`;continue}
    const tip=up?Math.min(...gr.map(q=>q.y))-30:Math.max(...gr.map(q=>q.y))+30;
    gr.forEach(q=>{o+=stem(q,up,tip)});
    const x1=sx(gr[0]),x2=sx(gr[gr.length-1]);
    o+=`<rect x="${x1-.6}" y="${up?tip:tip-4.5}" width="${x2-x1+1.2}" height="4.5" style="fill:${ink}"/>`;
    if(gr.length===3&&Math.abs(gr[0].dur-1/3)<EPS)o+=`<text x="${(x1+x2)/2}" y="${up?tip-5:tip+14}" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="11" style="fill:${ink2}">3</text>`;
  }
  // liaisons d'archet : du côté des têtes (opposé aux hampes)
  let st=null;
  for(let k=0;k<pts.length;k++){const p=pts[k];
    if(p.slS)st=k;
    if(p.slE&&st!=null){const seg=pts.slice(st,k+1),a=seg[0];
      if(seg.every(q=>q.sT===a.sT)){
        const up=seg.reduce((s,q)=>s+q.d,0)/seg.length<34;
        const y1=a.y+(up?7:-7),y2=p.y+(up?7:-7),yc=up?Math.max(...seg.map(q=>q.y))+16:Math.min(...seg.map(q=>q.y))-16;
        const xa=a.x+1,xb=p.x-1,xm=(xa+xb)/2;
        o+=`<path d="M${xa},${y1} Q${xm},${yc} ${xb},${y2} Q${xm},${yc+(up?-2.6:2.6)} ${xa},${y1}z" style="fill:${ink};stroke:${ink};stroke-width:.5"/>`;
      }
      st=null}
  }
  // tiré (⊓) au-dessus de la note
  for(const p of pts)if(p.bow){const top=Math.min(p.sT-9,p.d<34?p.y-40:p.y-12);
    o+=`<path d="M${p.x-5},${top} v-7 h10 v7" style="fill:none;stroke:${ink};stroke-width:1.3"/><rect x="${p.x-5}" y="${top-8}" width="10" height="2.6" style="fill:${ink}"/>`}
  return o;
}
const PPB={1:46,2:58,3:72};
function stripSize(){const w=$('#stripbox').clientWidth||600;
  // plein écran : agrandir la portée pour remplir la hauteur, sans descendre sous ~320 unités de large
  if(S.focus){const h=($('#stripbox').clientHeight||400)-110;const zoom=Math.max(1,Math.min(h/188,w/320));return {w,Wi:Math.round(w/zoom)}}const zoom=w>760?1.45:w>520?1.25:1.05;return {w,Wi:Math.round(w/zoom)}}
function buildStrip(beat){
  const svgEl=$('#strip');const {w,Wi}=stripSize();stripW=w;
  const H0=188,sT=74,sB=sT+40,ppb=PPB[S.et.sub]||58;
  const curX=Math.round(Wi*(S.et.cursor==='left'?.33:.5));
  const tr=curTr(),aid=S.et.aid!==false;
  const RC=aid?{ct:'var(--ink)',ten:'var(--x)',pass:'var(--next)',chr:'var(--d)'}:{ct:'var(--ink)',ten:'var(--ink)',pass:'var(--ink)',chr:'var(--ink)'};
  const F=c=>`style="fill:${c}"`,Sk=(c,wd)=>`style="stroke:${c};stroke-width:${wd}"`;
  const music=`font-family="'Noto Music','Bravura Text','Segoe UI Symbol',serif"`;
  const from=Math.max(0,Math.floor((beat-curX/ppb-2)/S.bpb)*S.bpb),to=beat+(Wi-curX)/ppb+2;
  // notes visibles
  const vis=[];
  for(let c=Math.floor(from/S.total);c<=Math.floor(to/S.total);c++){const arr=chorus(c);if(!arr)continue;
    arr.forEach((n,i)=>{const at=c*S.total+n.t;if(at>=from-1e-6&&at<=to)vis.push({n,at,c,i})})}
  let o='';
  const X=at=>at*ppb+12;
  // barres et numéros
  for(let b=Math.ceil(from/S.bpb)*S.bpb;b<=to;b+=S.bpb){
    const x=b*ppb,c=Math.floor(b/S.total+1e-9),bi=Math.round((b-c*S.total)/S.bpb);
    o+=`<line x1="${x}" x2="${x}" y1="${sT}" y2="${sB}" ${Sk('var(--ink)',1)}/>`;
    o+=`<text x="${x+3}" y="${sT-7}" font-family="'IBM Plex Mono',monospace" font-size="9" ${F('var(--ink-3)')}>${bi+1}</text>`;
    if(bi===0)o+=`<text x="${x+3}" y="${sT-19}" font-family="'IBM Plex Mono',monospace" font-size="9.5" font-weight="600" ${F('var(--mel)')}>TOUR ${c+1}</text>`;
  }
  const acc=new Map();let curBar=-1;const pts=[];
  vis.forEach((v,j)=>{
    const n=writtenNote(v.n,tr),bar=Math.floor(v.at/S.bpb+1e-9);
    if(bar!==curBar){acc.clear();curBar=bar}
    const x=X(v.at),y=sB-(n.d-30)*5;
    if(n.cs)o+=`<text x="${x-6}" y="28" font-family="'Gochi Hand',cursive" font-size="21" ${F('var(--ink)')}>${esc(chordTextT(S.tl[n.ev].chord,tr))}</text>`;
    if(n.hold)return;
    if(n.rest){o+=restSVG(x,sT,n.dur,'var(--ink)');return}
    pts.push({x,y,d:n.d,at:v.at,dur:n.dur||1/S.et.sub,slS:n.slS,slE:n.slE,bow:n.bow,sT});
    let g=`<g class="sm" data-a="${v.at.toFixed(3)}">`;
    for(let dd=28;dd>=n.d;dd-=2){const ly=sB-(dd-30)*5;g+=`<line x1="${x-9}" x2="${x+9}" y1="${ly}" y2="${ly}" ${Sk('var(--ink)',1)}/>`}
    for(let dd=40;dd<=n.d;dd+=2){const ly=sB-(dd-30)*5;g+=`<line x1="${x-9}" x2="${x+9}" y1="${ly}" y2="${ly}" ${Sk('var(--ink)',1)}/>`}
    const key=n.L+n.oct,shown=acc.has(key)?acc.get(key):0;
    if(n.a!==shown){g+=`<text x="${x-8}" y="${y+5}" text-anchor="end" font-size="15" ${music} ${F('var(--ink)')}>${ACC[n.a]}</text>`;acc.set(key,n.a)}
    g+=headSVG(x,y,n.d,n.dur||1/S.et.sub,RC[n.role])+'</g>';
    o+=g;
    if(aid)o+=`<text x="${x}" y="${sB+52}" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="10" ${F(RC[n.role])}>${esc(n.label)}</text>`;
  });
  o+=stemsSVG(pts,'var(--ink)','var(--ink-2)');
  let staff='';for(let i=0;i<5;i++)staff+=`<line x1="0" x2="${Wi}" y1="${sT+i*10}" y2="${sT+i*10}" ${Sk('var(--ink-3)',1)}/>`;
  svgEl.setAttribute('viewBox',`0 0 ${Wi} ${H0}`);
  svgEl.innerHTML=`<defs><linearGradient id="fadeR" x1="0" x2="1"><stop offset="0" stop-color="var(--surface)" stop-opacity="0"/><stop offset="1" stop-color="var(--surface)" stop-opacity="1"/></linearGradient><linearGradient id="fadeL" x1="0" x2="1"><stop offset="0" stop-color="var(--surface)" stop-opacity="1"/><stop offset="1" stop-color="var(--surface)" stop-opacity="0"/></linearGradient></defs>
  ${staff}<g id="strip-move">${o}</g>
  <rect class="mask" x="0" y="0" width="50" height="${H0}"/><rect class="fade-l" x="50" y="0" width="30" height="${H0}"/><rect class="fade-r" x="${Wi-40}" y="0" width="40" height="${H0}"/>
  ${[0,1,2,3,4].map(i=>`<line x1="0" x2="80" y1="${sT+i*10}" y2="${sT+i*10}" ${Sk('var(--ink-3)',1)}/>`).join('')}
  <text x="8" y="${sT+30}" ${F('var(--ink)')} ${music} font-size="40">𝄞</text>
  <g><line class="sp-glow" x1="${curX}" x2="${curX}" y1="${sT-26}" y2="${sB+26}"/><line class="sp-line" x1="${curX}" x2="${curX}" y1="${sT-26}" y2="${sB+26}"/><path class="sp-cap" d="M${curX-6},${sT-33} L${curX+6},${sT-33} L${curX},${sT-25} z"/></g>`;
  stripGeo={ppb,curX};
}
function updateStrip(){
  if(!streaming()){return}
  const beat=Math.floor(S.abs);
  if(stripDirty||beat!==stripBeat||Math.abs(($('#stripbox').clientWidth||0)-stripW)>4){buildStrip(beat);stripBeat=beat;stripDirty=false}
  const mv=document.getElementById('strip-move');if(!mv||!stripGeo)return;
  mv.setAttribute('transform',`translate(${(stripGeo.curX-(S.abs*stripGeo.ppb+12)).toFixed(1)},0)`);
  const r=streamNoteAt(S.abs);
  const nowKey=r?(r.c*S.total+r.n.t).toFixed(3):'';
  mv.querySelectorAll('.sm.now').forEach(e=>{if(e.dataset.a!==nowKey)e.classList.remove('now')});
  const ne=mv.querySelector(`.sm[data-a="${nowKey}"]`);if(ne)ne.classList.add('now');
  const c=Math.floor(S.abs/S.total);
  $('#strip-info').textContent=`Tour ${c+1} · mesure ${Math.floor((S.abs-c*S.total)/S.bpb)+1} / ${S.bars} · chaque tour génère une nouvelle ligne avec les réglages en cours`;
  // garder la portée visible dans la fenêtre pendant la lecture
  // (sur téléphone la portée est collée sous la barre du haut : elle reste visible sans faire défiler la page)
  if(S.playing&&!S.focus&&beat!==lastStripCheck){lastStripCheck=beat;const b=$('#stripbox').getBoundingClientRect(),top=hdrBottom(),bot=tabTop();
    if(b.top<top-2||b.bottom>bot+2)window.scrollBy({top:b.top-top-8,behavior:scrollMode()})}
}
function applyPanels(init){
  const c=S.show.circle,d=S.show.detail;
  $('.stage').hidden=!c;$('#detail').hidden=!d;
  $('main').classList.toggle('solo',!c&&!d);
  $('#tg-circle').setAttribute('aria-pressed',String(c));$('#tg-detail').setAttribute('aria-pressed',String(d));
  if(!init){save();stripDirty=true;renderScore();updateStrip()}
}
function setDisp(d){
  S.et.disp=d;save();
  $('#d-score').setAttribute('aria-pressed',String(d==='score'));$('#d-scroll').setAttribute('aria-pressed',String(d==='scroll'));
  const sc=d==='scroll';
  $('#stripbox').hidden=!sc;$('#scorebox').hidden=sc;$('#et-cursor-wrap').hidden=!sc;$('#et-full').hidden=!sc;if(!sc&&S.focus)setFocus(false);$('#et-follow-wrap').hidden=sc;
  $('#et-svg').hidden=sc||!downloads;
  if(sc){syncAbs();stripDirty=true;lastStripCheck=-1}
  S.slot=-1;S.melKey=-1;renderScore();melodyTick();updatePlayhead();updateStrip();updateMelodyCircle();
}
function etStats(){
  const snd=S.notes.filter(x=>!x.hold&&!x.rest),n=snd.length,c={ct:0,ten:0,pass:0,chr:0};snd.forEach(x=>c[x.role]++);
  const pc=v=>Math.round(v/Math.max(1,n)*100)+' %';
  $('#et-stats').textContent=n?`Variante ${S.et.seed} · ${n} notes · ${pc(c.ct)} notes d'accord · ${pc(c.ten)} tensions · ${pc(c.pass)} passage · ${pc(c.chr)} chromatiques`:'Aucune note : la grille est vide.';
}

const NATPC={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function tSpell(L,a,pc,tr){if(!tr.semi)return {L,a};const L2='CDEFGAB'[('CDEFGAB'.indexOf(L)+tr.steps)%7];return {L:L2,a:mod(mod(pc+tr.semi)-NATPC[L2]+6)-6}}
function chordTextT(c,tr){
  if(!tr.semi)return H.chordText(c);
  const r=tSpell(c.root.L,c.root.a,c.root.pc,tr);let t=H.nn(r.L,r.a)+H.prettySuffix(c.suffix);
  if(c.bass){const b=tSpell(c.bass.L,c.bass.a,c.bass.pc,tr);t+='/'+H.nn(b.L,b.a)}
  return t;
}
function writtenNote(n,tr){
  if(!tr.semi)return n;
  const sp=tSpell(n.L,n.a,mod(n.m),tr),m=n.m+tr.semi,oct=Math.floor((m-sp.a)/12)-1;
  return {...n,L:sp.L,a:sp.a,oct,d:oct*7+'CDEFGAB'.indexOf(sp.L)};
}
let SG=null;
function scoreSVG(width,C,screen){
  const notes=S.notes,sub=S.et.sub,spb=S.bpb*sub;
  const nBars=Math.ceil(notes.length/spb);
  const minBar=spb*(sub===3?18:sub===2?22:34)+20;
  const left=68;
  const bpl=Math.max(1,Math.min(4,Math.floor((width-left-8)/minBar)));
  const barW=(width-left-8)/bpl;
  const nLines=Math.ceil(nBars/bpl);
  const F=c=>`style="fill:${c}"`,Sk=(c,w)=>`style="stroke:${c};stroke-width:${w}"`;
  const aid=S.et.aid!==false;
  const RC=aid?{ct:C.ct,ten:C.ten,pass:C.pass,chr:C.chr}:{ct:C.ct,ten:C.ct,pass:C.ct,chr:C.ct};
  const music=`font-family="'Noto Music','Bravura Text','Segoe UI Symbol',serif"`;
  let o='';const geo=[];lineOf=[];
  for(let li=0;li<nLines;li++){
    const y0=li*LINE_H,sT=y0+70,first=li*bpl,cnt=Math.min(bpl,nBars-first),end=left+cnt*barW;
    for(let i=0;i<5;i++)o+=`<line x1="6" x2="${end}" y1="${sT+i*10}" y2="${sT+i*10}" ${Sk(C.line,1)}/>`;
    o+=`<text x="9" y="${sT+30}" ${F(C.ink)} ${music} font-size="40">𝄞</text>`;
    if(li===0)o+=`<text x="44" y="${sT+18}" ${F(C.ink)} font-family="Georgia,serif" font-weight="700" font-size="21" text-anchor="middle">${S.bpb}</text><text x="44" y="${sT+38}" ${F(C.ink)} font-family="Georgia,serif" font-weight="700" font-size="21" text-anchor="middle">4</text>`;
    for(let b=0;b<cnt;b++){
      const x=left+(b+1)*barW,bx=left+b*barW;
      if(first+b===nBars-1)o+=`<line x1="${x-6}" x2="${x-6}" y1="${sT}" y2="${sT+40}" ${Sk(C.ink,1)}/><rect x="${x-3}" y="${sT}" width="3.2" height="40" ${F(C.ink)}/>`;
      else o+=`<line x1="${x}" x2="${x}" y1="${sT}" y2="${sT+40}" ${Sk(C.ink,1)}/>`;
      o+=`<text x="${bx+3}" y="${sT-6}" font-family="'IBM Plex Mono',monospace" font-size="9" ${F(C.ink3)}>${first+b+1}</text>`;
    }
  }
  const tr=curTr();
  if(screen)SG={left,barW,bpl,spb,sub};
  const acc=new Map();let curBar=-1;const pts=[];
  notes.forEach((n0,i)=>{
    const n=writtenNote(n0,tr);
    const bar=Math.floor(i/spb),li=Math.floor(bar/bpl),j=i%spb;
    if(bar!==curBar){acc.clear();curBar=bar}
    const y0=li*LINE_H,sT=y0+70,sB=sT+40;
    const x=left+(bar%bpl)*barW+16+(j+.5)*(barW-22)/spb;
    const y=sB-(n.d-30)*5;
    geo[i]={x,y,d:n.d};lineOf[i]=li;
    if(n.cs)o+=`<text x="${x-6}" y="${y0+24}" font-family="'Gochi Hand',cursive" font-size="21" ${F(C.ink)}>${esc(chordTextT(S.tl[n.ev].chord,tr))}</text>`;
    if(n.hold)return;
    if(n.rest){o+=restSVG(x,sT,n.dur,C.ink);return}
    pts.push({x,y,d:n.d,at:n.t,dur:n.dur||1/sub,slS:n.slS,slE:n.slE,bow:n.bow,sT});
    let g=`<g class="sn" data-k="${i}"><circle class="hl" cx="${x}" cy="${y}" r="11"/>`;
    for(let dd=28;dd>=n.d;dd-=2){const ly=sB-(dd-30)*5;g+=`<line x1="${x-9}" x2="${x+9}" y1="${ly}" y2="${ly}" ${Sk(C.ink,1)}/>`}
    for(let dd=40;dd<=n.d;dd+=2){const ly=sB-(dd-30)*5;g+=`<line x1="${x-9}" x2="${x+9}" y1="${ly}" y2="${ly}" ${Sk(C.ink,1)}/>`}
    const key=n.L+n.oct,shown=acc.has(key)?acc.get(key):0;
    if(n.a!==shown){g+=`<text x="${x-8}" y="${y+5}" text-anchor="end" font-size="15" ${music} ${F(C.ink)}>${ACC[n.a]}</text>`;acc.set(key,n.a)}
    g+=headSVG(x,y,n.d,n.dur||1/sub,RC[n.role])+'</g>';
    o+=g;
    if(aid)o+=`<text x="${x}" y="${sB+50}" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="${sub===3?9:10.5}" ${F(RC[n.role])}>${esc(n.label)}</text>`;
  });
  o+=stemsSVG(pts,C.ink,C.ink2);
  if(screen)o+=`<g id="ph"><line class="ph-glow" x1="0" x2="0" y1="-22" y2="64"/><line class="ph-line" x1="0" x2="0" y1="-22" y2="64"/><path class="ph-cap" d="M-5,-28 L5,-28 L0,-21 z"/></g>`;
  return {body:o,h:nLines*LINE_H};
}
const SCREEN_C={ink:'var(--ink)',ink2:'var(--ink-2)',ink3:'var(--ink-3)',line:'var(--ink-3)',ct:'var(--ink)',ten:'var(--x)',pass:'var(--next)',chr:'var(--d)'};
let scoreW=0;
function renderScore(){
  const svgEl=$('#score');curEl=null;
  if(S.view!=='etude')return;
  const w=Math.max(300,Math.floor($('#scorebox').clientWidth-8));scoreW=w;
  if(!S.notes.length){svgEl.setAttribute('viewBox','0 0 '+w+' 60');svgEl.innerHTML=`<text x="12" y="34" style="fill:var(--ink-2)" font-size="13">Saisissez une grille pour générer une étude.</text>`;return}
  const r=scoreSVG(w,SCREEN_C,true);
  svgEl.setAttribute('viewBox',`0 0 ${w} ${r.h}`);svgEl.innerHTML=r.body;updatePlayhead();etHelp();
  markScore();
}
function markScore(){
  if(curEl)curEl.classList.remove('cur');curEl=null;
  if(S.view!=='etude'||S.slot<0)return;
  curEl=$('#score').querySelector(`.sn[data-k="${S.slot}"]`);
  if(!curEl)return;curEl.classList.add('cur');
}
let lastLine=-1,lastCheck=-1;
const hdrBottom=()=>{const h=document.querySelector('.top');return h?Math.max(0,h.getBoundingClientRect().bottom):0};
const scrollMode=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
/* garde le curseur visible : défile la partition, puis la page si besoin */
function followScore(li,force){
  // en mode défilement la partition est masquée : ses positions valent 0 et feraient sauter la page
  if(S.et.follow===false||S.view!=='etude'||streaming()||$('#scorebox').hidden)return;
  const ph=document.getElementById('ph');if(!ph)return;
  const slot=Math.floor(S.beatPos*S.et.sub);
  if(li===lastLine&&!force){
    if(slot===lastCheck)return;lastCheck=slot;
    const r=ph.getBoundingClientRect(),bx=$('#scorebox').getBoundingClientRect();
    const top=Math.max(hdrBottom(),bx.top),bot=Math.min(innerHeight,bx.bottom);
    if(r.top>=top-2&&r.bottom<=bot+2)return;
  }
  lastLine=li;lastCheck=slot;
  const box=$('#scorebox'),svgEl=$('#score');
  const sc=svgEl.getBoundingClientRect().width/(scoreW||1)||1;
  const lineTop=li*LINE_H*sc;
  const inner=box.scrollHeight>box.clientHeight+2;
  let boxTarget=box.scrollTop;
  if(inner){boxTarget=Math.max(0,Math.min(box.scrollHeight-box.clientHeight,lineTop-LINE_H*.35*sc));if(Math.abs(box.scrollTop-boxTarget)>3)box.scrollTo({top:boxTarget,behavior:scrollMode()})}
  // position prévue de la ligne dans la fenêtre après le défilement de la boîte
  const br=box.getBoundingClientRect();
  const yTop=br.top+8+lineTop-boxTarget,yBot=yTop+LINE_H*sc;
  const top=hdrBottom()+8,bot=innerHeight-8;
  if(yTop<top||yBot>bot){
    const want=top+(bot-top)*.18;
    window.scrollBy({top:yTop-want,behavior:scrollMode()});
  }
}
function updatePlayhead(){
  const ph=document.getElementById('ph');if(!ph||!SG||S.view!=='etude'||!S.notes.length)return;
  const t=Math.max(0,Math.min(S.beatPos,S.total-1e-6)),bar=Math.floor(t/S.bpb),tb=t-bar*S.bpb;
  const li=Math.floor(bar/SG.bpl),base=SG.left+(bar%SG.bpl)*SG.barW,step=(SG.barW-22)/SG.spb;
  const x=Math.min(base+SG.barW-3,base+16+(tb*SG.sub+.5)*step);
  ph.setAttribute('transform',`translate(${x.toFixed(1)},${li*LINE_H+70})`);
  followScore(li);
}
function etHelp(){
  const tr=curTr();
  const I=curInst(),[lo,hi]=I.r[S.et.range]||I.r.mid;
  $('#et-help').textContent=(I.semi?`Partie écrite pour ${I.name.charAt(0).toLowerCase()+I.name.slice(1)} : notes et accords sont écrits ${I.iv} au-dessus du son réel. `:I.name==='Violon'?'Violon : écrit en son réel. ':'Notes écrites en clé de sol, à la hauteur réelle. ')+`Registre écrit ${writtenName(lo)}–${writtenName(hi)}. Le son joué reste en son réel. Les chiffres sous les notes donnent le degré par rapport à la fondamentale de l'accord. La barre suit la lecture ; cliquez une note pour vous y placer.`;
}
function updateMelodyCircle(){
  if(!gMel)return;gMel.innerHTML='';
  nodes.forEach(n=>n.g.classList.remove('mel'));
  if(S.view!=='etude'||!S.mel.cur||(!streaming()&&S.slot<0))return;
  const n=S.mel.cur,pc=mod(n.m);nodes[pc].g.classList.add('mel');
  const p=S.mel.prev;
  if(p&&mod(p.m)!==pc){
    const [x1,y1]=xy(posK(mod(p.m)),R),[x2,y2]=xy(posK(pc),R);
    const cx=CX+((x1+x2)/2-CX)*.5,cy=CY+((y1+y2)/2-CY)*.5;
    const s=shorten(x1,y1,cx,cy,NR+3),e=shorten(x2,y2,cx,cy,NR+4);
    sv('path',{class:'mel-line',d:`M${s[0].toFixed(1)},${s[1].toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${e[0].toFixed(1)},${e[1].toFixed(1)}`},gMel);
  }
}
function melodyTick(force){
  if(streaming()){
    const r=streamNoteAt(S.abs);if(!r)return;const key=r.c*1e5+r.i;
    if(key===S.melKey&&!force)return;S.melKey=key;S.mel={cur:r.n.rest?null:r.n,prev:r.p};updateMelodyCircle();
    if(S.sound&&(S.playing||force))playMel(r.n);return;
  }
  if(S.view!=='etude'||!S.notes.length){if(S.slot!==-1){S.slot=-1;markScore();updateMelodyCircle()}return}
  const ns=S.notes;
  let k=Math.floor(swT(S.beatPos)*S.et.sub+1e-6);k=Math.max(0,Math.min(ns.length-1,k));
  while(k>0&&ns[k].hold)k--;   // note tenue : on reste sur son attaque
  if(k===S.slot&&!force)return;
  let pk=k-1;while(pk>0&&(ns[pk].hold||ns[pk].rest))pk--;
  S.slot=k;S.mel={cur:ns[k].rest?null:ns[k],prev:ns[pk]};markScore();updateMelodyCircle();
  if(S.sound&&(S.playing||force))playMel(ns[k]);
}
function playMel(n){
  const ctx=audio();if(!ctx||!n||n.rest)return;
  // durée réelle : valeur de la note, croches inégales en swing
  let beats=n.dur||1/S.et.sub;
  if(S.et.sub===2&&Math.abs(beats-.5)<1e-6){const r=swR();beats=n.k%2===0?r:1-r}
  const dur=Math.max(.08,60/S.bpm*beats*(beats>=1?.95:.92));
  tone(n.m,'triangle',.22,ctx.currentTime+.005,dur);
}
function syncEtUI(){
  const e=S.et;
  document.querySelectorAll('[data-sub]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.sub===e.sub)));
  $('#et-motif').value=e.motif;$('#et-fill').value=e.fill;$('#et-start').value=e.start;$('#et-range').value=e.range;$('#et-mix').value=e.mix;$('#et-follow').checked=e.follow!==false;$('#et-inst').value=e.inst||'c';{const I=curInst();['low','mid','high','full'].forEach(k=>{const o=$('#et-range').querySelector(`option[value="${k}"]`);const r=I.r[k];o.textContent=({low:'Grave',mid:'Médium',high:'Aigu',full:'Toute la tessiture'})[k]+' · '+writtenName(r[0])+'–'+writtenName(r[1])})}$('#et-aid').checked=e.aid!==false;$('#et-cursor').value=e.cursor||'center';
  $('#et-ten').checked=e.ten;$('#et-app').checked=e.app;$('#et-slur').checked=e.slur!==false;
  $('#et-rhy').value=e.rhy||'even';$('#et-swing').value=String(e.swing||.5);
  // style rythmique et swing ne s'appliquent qu'en croches
  for(const id of ['#et-rhy','#et-swing']){$(id).disabled=e.sub!==2;$(id).title=e.sub!==2?'Disponible en croches':''}
  $('#et-preset').value=e.preset||'';
  const P=ET_PRESETS.find(p=>p.id===e.preset);
  const lbl=sel=>sel.options[sel.selectedIndex]?.text||'';
  $('#et-sum').textContent=[P?P.name:'Personnalisé',lbl($('#et-motif')),lbl($('#et-fill')).replace(/ \(.*\)/,''),e.sub===2&&e.rhy&&e.rhy!=='even'?lbl($('#et-rhy')).toLowerCase():['','noires','croches','triolets'][e.sub]].join(' · ');
  $('#et-legend').hidden=e.aid===false;
}
function etChange(patch){Object.assign(S.et,patch);
  const p=ET_PRESETS.find(p=>Object.entries(p.set).every(([k,v])=>S.et[k]===v));S.et.preset=p?p.id:null;
  syncEtUI();save();regen();}
function setView(v){
  S.view=v;save();
  $('#v-grid').setAttribute('aria-pressed',String(v==='grid'));$('#v-etude').setAttribute('aria-pressed',String(v==='etude'));
  $('#view-grid').hidden=v!=='grid';$('#view-etude').hidden=v!=='etude';
  S.slot=-1;S.melKey=-1;if(v==='etude')setDisp(S.et.disp);else{melodyTick();updateMelodyCircle()}
}
async function exportScore(){
  const C={ink:'#1a2333',ink2:'#596374',ink3:'#8b93a1',line:'#8b93a1',ct:'#1a2333',ten:'#7f63b3',pass:'#bf7f0b',chr:'#c9412f'};
  const r=scoreSVG(1000,C);
  const title=(S.sheet&&S.sheet.meta.title)||'Grille';
  const svgTxt=`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${r.h+60}" viewBox="0 0 1000 ${r.h+60}"><rect width="1000" height="${r.h+60}" fill="#ffffff"/><text x="20" y="36" font-family="Georgia,serif" font-size="24" fill="#1a2333">${esc(title)} · étude${S.et.inst&&S.et.inst!=='c'?' · '+esc(curInst().name):''}</text><text x="980" y="36" text-anchor="end" font-family="Helvetica,Arial,sans-serif" font-size="12" fill="#596374">${esc(H.keyName(S.key))} · ♩ = ${S.bpm}</text><g transform="translate(0,50)">${r.body.replace(/ class="hl"/g,' class="hl" fill="none"')}</g></svg>`;
  try{await downloads.save({filename:title.replace(/[\\/:*?"<>|]/g,'')+' - étude.svg',data:svgTxt});$('#et-stats').textContent='Partition enregistrée.';}
  catch(e){if(e&&e.code!=='declined'){$('#et-stats').textContent='Le téléchargement n\'est pas disponible ici.';if(['unavailable','not_granted','capability_disabled','capability_removed'].includes(e.code))$('#et-svg').hidden=true}}
}
function initEtude(){
  $('#et-preset').innerHTML='<option value="">Personnalisé</option>'+ET_PRESETS.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('');
  $('#et-preset').addEventListener('change',e=>{const p=ET_PRESETS.find(x=>x.id===e.target.value);if(p)etChange({...p.set});else syncEtUI()});
  const box=$('#et-box');box.open=S.etBoxOpen;box.addEventListener('toggle',()=>{S.etBoxOpen=box.open;save()});
  $('#tg-circle').addEventListener('click',()=>{S.show.circle=!S.show.circle;applyPanels()});
  $('#tg-detail').addEventListener('click',()=>{S.show.detail=!S.show.detail;applyPanels()});
  applyPanels(true);
  document.querySelectorAll('[data-sub]').forEach(b=>b.addEventListener('click',()=>etChange({sub:+b.dataset.sub})));
  $('#et-motif').addEventListener('change',e=>etChange({motif:e.target.value}));
  $('#et-fill').addEventListener('change',e=>etChange({fill:e.target.value}));
  $('#et-start').addEventListener('change',e=>etChange({start:e.target.value}));
  $('#et-range').addEventListener('change',e=>etChange({range:e.target.value}));
  $('#et-mix').addEventListener('change',e=>{S.et.mix=e.target.value;save()});
  $('#et-follow').addEventListener('change',e=>{S.et.follow=e.target.checked;save();if(e.target.checked){lastLine=-1;updatePlayhead()}});
  $('#et-inst').addEventListener('change',e=>{S.et.inst=e.target.value;save();syncEtUI();regen()});
  $('#et-aid').addEventListener('change',e=>{S.et.aid=e.target.checked;save();syncEtUI();renderScore();stripDirty=true;updateStrip()});
  $('#et-cursor').addEventListener('change',e=>{S.et.cursor=e.target.value;save();stripDirty=true;updateStrip()});
  $('#d-score').addEventListener('click',()=>setDisp('score'));
  $('#d-scroll').addEventListener('click',()=>setDisp('scroll'));
  $('#et-ten').addEventListener('change',e=>etChange({ten:e.target.checked}));
  $('#et-app').addEventListener('change',e=>etChange({app:e.target.checked}));
  $('#et-slur').addEventListener('change',e=>etChange({slur:e.target.checked}));
  $('#et-rhy').addEventListener('change',e=>etChange({rhy:e.target.value}));
  $('#et-swing').addEventListener('change',e=>etChange({swing:parseFloat(e.target.value)}));
  $('#et-new').addEventListener('click',()=>{S.et.seed++;save();regen()});
  $('#et-svg').addEventListener('click',exportScore);
  $('#v-grid').addEventListener('click',()=>setView('grid'));
  $('#v-etude').addEventListener('click',()=>setView('etude'));
  $('#score').addEventListener('click',e=>{
    const g=e.target.closest('.sn');if(!g)return;const n=S.notes[+g.dataset.k];if(!n)return;
    if(!inRegion(n.ev)){S.region=null;rearrange();markLoop()}
    S.beatPos=n.t;syncAbs();lastT=performance.now();if(S.cur!==n.ev){S.cur=n.ev;refresh(false)}
    S.slot=-1;melodyTick(true);updatePlayhead();
  });
  try{new ResizeObserver(()=>{const w=Math.floor($('#scorebox').clientWidth-8);if(S.view==='etude'&&Math.abs(w-scoreW)>4)renderScore()}).observe($('#scorebox'))}catch(e){}
  syncEtUI();
  $('#view-grid').hidden=S.view!=='grid';$('#view-etude').hidden=S.view!=='etude';
  $('#v-grid').setAttribute('aria-pressed',String(S.view==='grid'));$('#v-etude').setAttribute('aria-pressed',String(S.view==='etude'));
  (async()=>{try{downloads=window.claude&&window.claude.use?await window.claude.use('downloads'):null}catch(e){downloads=null}
    // Hors de claude.ai : téléchargement classique via un lien blob
    if(!downloads)downloads={save:async({filename,data})=>{const url=URL.createObjectURL(new Blob([data],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);return {status:'saved'}}};
    $('#et-svg').hidden=!downloads||S.et.disp==='scroll'})();
}

/* ---------- image ---------- */
let sample=null,imgFile=null,ctl=null;
const PROMPT=`Tu reçois l'image d'une grille d'accords (lead sheet, grille de jazz, partition avec chiffrages, grille manuscrite ou capture d'écran).
Transcris les accords mesure par mesure, dans l'ordre de lecture.
Réponds uniquement avec un objet JSON de cette forme :
{"title": "titre ou null", "key": "tonalité probable comme Gm ou Bb, ou null", "time": "4/4", "sections": [{"label": "A ou null", "bars": [["Dm7","G7"],["Cmaj7"]]}]}
Règles :
- Notation anglo-saxonne pour les fondamentales (C D E F G A B), # et b pour les altérations, m pour mineur, maj7, m7b5, dim7, 7b9, 7#11, sus4, 6/9, et la barre oblique pour la basse (C/E).
- Une mesure de répétition (% ou signe de mesure répétée) : recopie le contenu de la mesure précédente.
- Une barre de reprise avec 1re/2e fois : écris la grille dans l'ordre joué une seule fois, sans dupliquer toute la reprise.
- Ignore paroles, mélodie, indications de jeu.
- Si aucun accord n'est lisible, réponds {"error": "explication courte"}.`;
function jsonToText(j){
  const out=[];if(j.title)out.push('titre: '+j.title);if(j.key)out.push('tonalité: '+j.key);if(j.time&&j.time!=='4/4')out.push('mesure: '+j.time);
  if(out.length)out.push('');
  (j.sections||[]).forEach(s=>{const bars=(s.bars||[]).map(b=>' '+(Array.isArray(b)?b.join(' '):String(b))+' ');
    for(let i=0;i<bars.length;i+=8){const lab=i===0&&s.label?String(s.label).replace(/[:|]/g,'')+': ':'';out.push(lab+'|'+bars.slice(i,i+8).join('|')+'|')}});
  return out.join('\n');
}
const ERR={not_granted:'Accès à Claude refusé pour cette page. Vous pouvez saisir la grille à la main.',sampling_disabled:'Claude n\'est pas disponible pour ce compte.',rate_limited:'Trop de demandes pour le moment. Réessayez dans un instant.',
  image_rejected:'Image refusée : utilisez un fichier JPEG, PNG, WebP ou GIF de moins de 20 Mo.',invalid_json:'La réponse n\'a pas pu être lue. Essayez une image plus nette ou recadrée sur la grille.',
  session_expired:'Votre session a expiré : reconnectez-vous à Claude.',images_unavailable:'Cette vue ne peut pas envoyer d\'images à Claude.',refused:'Claude n\'a pas pu traiter cette image.'};
async function readImage(){
  if(!sample||!imgFile)return;
  const st=$('#img-status');ctl=new AbortController();
  $('#btn-read').disabled=true;$('#btn-stop').hidden=false;st.textContent='Lecture de la grille en cours…';
  try{
    const j=await sample.json(PROMPT,{images:[imgFile],signal:ctl.signal});
    if(!j||j.error||!Array.isArray(j.sections)){st.textContent=(j&&j.error)?'Aucune grille lisible : '+j.error:'Aucune grille lisible dans cette image.';return}
    const text=jsonToText(j);
    $('#src').value=text;load(text);selectTab('text');
    st.textContent='Grille importée. Vérifiez-la dans l\'onglet « Liste d\'accords ».';
  }catch(e){if(e&&e.code==='cancelled')st.textContent='Lecture arrêtée.';else st.textContent=ERR[e&&e.code]||'La lecture a échoué. Réessayez.';if(e&&(e.code==='not_granted'||e.code==='sampling_disabled'||e.code==='images_unavailable'))disableImg(ERR[e.code])}
  finally{$('#btn-read').disabled=!imgFile||!sample;$('#btn-stop').hidden=true}
}
function disableImg(msg){sample=null;$('#btn-read').disabled=true;$('#img-status').textContent=msg}
function setImg(f){
  if(!f||!/^image\//.test(f.type)){$('#img-status').textContent='Choisissez un fichier image (JPEG, PNG, WebP ou GIF).';return}
  imgFile=f;const url=URL.createObjectURL(f);const im=$('#img-prev');im.src=url;im.hidden=false;
  $('#btn-read').disabled=!sample;
  if(sample)$('#img-status').textContent='Image prête. Lancez la lecture.';
}

/* ---------- onglets ---------- */
function selectTab(name){['text','img','ex'].forEach(t=>{$('#tab-'+t).setAttribute('aria-selected',String(t===name));$('#pane-'+t).hidden=t!==name})}

/* ---------- câblage ---------- */
function init(){
  H.O.notation=S.notation;$('#sel-not').value=S.notation;
  $('#mode-chroma').setAttribute('aria-pressed',String(S.circle==='chroma'));$('#mode-fifths').setAttribute('aria-pressed',String(S.circle==='fifths'));
  for(const k of ['next','moves','scale','key'])$('#ly-'+k).checked=S.layers[k];
  initEtude();
  buildCircle();
  $('#presets').innerHTML=PRESETS.map((p,i)=>`<button class="preset" data-i="${i}"><b>${esc(p.name)}</b><span>${esc(p.sub)}</span></button>`).join('');
  $('#presets').addEventListener('click',e=>{const b=e.target.closest('.preset');if(!b)return;const p=PRESETS[+b.dataset.i];setPlaying(false);$('#src').value=p.text;load(p.text);selectTab('text');$('#gridbox').scrollTop=0});
  const text=S.src||PRESETS[0].text;$('#src').value=text;load(text);

  let to=0;$('#src').addEventListener('input',e=>{clearTimeout(to);to=setTimeout(()=>load(e.target.value,{keepPos:true}),350)});
  $('#btn-play').addEventListener('click',()=>setPlaying(!S.playing));
  $('#btn-prev').addEventListener('click',()=>stepChord(-1));
  $('#btn-next').addEventListener('click',()=>stepChord(1));
  $('#inp-bpm').addEventListener('change',e=>{const v=Math.max(30,Math.min(320,parseInt(e.target.value,10)||120));S.bpm=v;e.target.value=v});
  $('#btn-loop').addEventListener('click',e=>{S.loop=!S.loop;e.currentTarget.setAttribute('aria-pressed',String(S.loop));rearrange();regen();renderCircle()});
  $('#btn-sound').addEventListener('click',e=>{S.sound=!S.sound;e.currentTarget.setAttribute('aria-pressed',String(S.sound));if(S.sound){audio();if(S.playing)resetSched(true);else if(accOn())previewChord(S.tl[S.cur])}else fadeActive()});
  // accompagnement
  $('#sel-comp').value=S.acc.comp;$('#sel-bass').value=S.acc.bass;
  const accChange=()=>{S.acc.comp=$('#sel-comp').value;S.acc.bass=$('#sel-bass').value;save();rearrange();
    if(S.sound&&S.playing){fadeActive();resetSched(true)}else if(S.sound&&accOn())previewChord(S.tl[S.cur])};
  $('#sel-comp').addEventListener('change',accChange);$('#sel-bass').addEventListener('change',accChange);
  // boucle sur une partie
  $('#btn-sel').addEventListener('click',()=>setSelMode(!S.selMode));
  $('#btn-unloop').addEventListener('click',()=>{setSelMode(false);setRegion(null)});
  $('#mode-chroma').addEventListener('click',()=>setCircle('chroma'));
  $('#mode-fifths').addEventListener('click',()=>setCircle('fifths'));
  for(const k of ['next','moves','scale','key'])$('#ly-'+k).addEventListener('change',e=>{S.layers[k]=e.target.checked;save();renderCircle()});
  $('#sel-key').addEventListener('change',e=>{S.keyChoice=e.target.value;applyKey();rearrange();renderGrid();regen(true);refresh(false)});
  $('#sel-not').addEventListener('change',e=>{S.notation=e.target.value;H.O.notation=S.notation;save();keyOptions();applyKey();renderGrid();regen(true);refresh(false)});
  ['text','img','ex'].forEach(t=>$('#tab-'+t).addEventListener('click',()=>selectTab(t)));
  document.addEventListener('keydown',e=>{
    if(e.target.closest('textarea,input,select'))return;
    if(e.code==='Space'){e.preventDefault();setPlaying(!S.playing)}
    else if(e.key==='ArrowRight'){e.preventDefault();stepChord(1)}
    else if(e.key==='ArrowLeft'){e.preventDefault();stepChord(-1)}
    else if(e.key==='Escape'&&S.selMode)setSelMode(false);
  });
  // image
  const drop=$('#drop');
  $('#file-img').addEventListener('change',e=>setImg(e.target.files[0]));
  drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('over')});
  drop.addEventListener('dragleave',()=>drop.classList.remove('over'));
  drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('over');setImg(e.dataTransfer.files[0])});
  document.addEventListener('paste',e=>{if($('#pane-img').hidden)return;const f=[...(e.clipboardData?.files||[])].find(x=>/^image\//.test(x.type));if(f)setImg(f)});
  $('#btn-read').addEventListener('click',readImage);
  $('#btn-stop').addEventListener('click',()=>ctl&&ctl.abort());
  (async()=>{
    try{
      const s=window.claude&&window.claude.use?await window.claude.use('sample'):null;
      const lim=s?await s.limits().catch(()=>null):null;
      if(s&&lim&&lim.images){sample=s;$('#btn-read').disabled=!imgFile}
      else $('#img-status').textContent='La lecture d\'image passe par Claude et n\'est pas disponible dans cette vue. Ouvrez la page dans Claude, ou saisissez la grille à la main.';
    }catch(e){$('#img-status').textContent='La lecture d\'image n\'est pas disponible dans cette vue.'}
  })();
}
function setCircle(m){
  S.circle=m;save();
  $('#mode-chroma').setAttribute('aria-pressed',String(m==='chroma'));$('#mode-fifths').setAttribute('aria-pressed',String(m==='fifths'));
  const g=$('#g-dyn');g.classList.add('fade');placeNodes();
  setTimeout(()=>{renderCircle();g.classList.remove('fade')},380);
}

/* ---------- défilement en plein écran : seulement la portée et quelques commandes ---------- */
let wake=null;
async function setFocus(on){
  if(!!S.focus===on)return;S.focus=on;
  document.documentElement.classList.toggle('focus',on);
  $('#stripbox').setAttribute('role',on?'dialog':'region');
  syncFocusBar();stripDirty=true;lastStripCheck=-1;
  if(on){
    // masquer aussi les barres d'Android et garder l'écran allumé, quand c'est possible
    try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen({navigationUI:'hide'})}catch(e){}
    try{wake=await navigator.wakeLock.request('screen')}catch(e){wake=null}
    $('#fb-play').focus({preventScroll:true});
  }else{
    try{if(document.fullscreenElement)await document.exitFullscreen()}catch(e){}
    try{wake&&wake.release()}catch(e){}wake=null;
    $('#et-full').focus({preventScroll:true});
  }
  requestAnimationFrame(()=>{stripDirty=true;updateStrip()});
}
function syncFocusBar(){
  $('#fb-bpm').textContent='♩ '+S.bpm;
  $('#fb-aid').setAttribute('aria-pressed',String(S.et.aid!==false));
}
function setBpm(v){const i=$('#inp-bpm');i.value=v;i.dispatchEvent(new Event('change'));syncFocusBar()}
function initFocus(){
  $('#fb-play').innerHTML=$('#btn-play').innerHTML.replace(' id="ico-play"','');
  $('#et-full').addEventListener('click',()=>setFocus(true));
  $('#fb-exit').addEventListener('click',()=>setFocus(false));
  $('#fb-play').addEventListener('click',()=>setPlaying(!S.playing));
  $('#fb-slow').addEventListener('click',()=>setBpm(S.bpm-(S.bpm>200?10:5)));
  $('#fb-fast').addEventListener('click',()=>setBpm(S.bpm+(S.bpm>=200?10:5)));
  $('#fb-aid').addEventListener('click',()=>{$('#et-aid').click();syncFocusBar()});
  $('#inp-bpm').addEventListener('change',syncFocusBar);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.focus)setFocus(false)});
  // sortie du plein écran système (geste retour, glissement) : quitter aussi le mode
  document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&S.focus)setFocus(false)});
  // l'écran se rallume ou tourne : redemander le maintien de l'écran, redessiner à la bonne taille
  document.addEventListener('visibilitychange',async()=>{if(S.focus&&document.visibilityState==='visible'&&!wake){try{wake=await navigator.wakeLock.request('screen')}catch(e){}}});
  addEventListener('resize',()=>{if(S.focus){stripDirty=true;updateStrip()}});
}

/* ---------- mobile : onglets en bas, réglages dans un tiroir ---------- */
// haut de la barre d'onglets quand elle est en bas de l'écran (sinon bas de la fenêtre)
const tabTop=()=>{const t=document.getElementById('tabbar'),r=t&&t.getBoundingClientRect();return r&&r.width>r.height&&r.top>0?r.top:innerHeight};
const MQ=matchMedia('(max-width:720px),(max-height:500px) and (orientation:landscape)');
// éléments déplacés dans le tiroir sur petit écran, remis à leur place sinon
const MOVE=[['#btn-loop','#dr-play'],['.sheet-meta','#dr-acc'],['.layers','#dr-circle']].map(([sel,to])=>({el:$(sel),to}));
MOVE.forEach(o=>{o.home=document.createComment('');o.el.before(o.home)});
function placeMobile(){
  const m=MQ.matches;
  MOVE.forEach(o=>{if(m)$(o.to).append(o.el);else o.home.after(o.el)});
  if(!m)openDrawer(false);
  setMTab(S.mtab,true);
}
function setMTab(t,init){
  S.mtab=t;if(!init)save();
  document.body.dataset.m=t;
  document.querySelectorAll('#tabbar [data-m]').forEach(b=>{if(b.dataset.m===t)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  if(!MQ.matches)return;
  // sur téléphone chaque onglet affiche une seule section : on force l'affichage du panneau voulu
  if(t==='circle'&&!S.show.circle){S.show.circle=true;applyPanels()}
  if(t==='detail'&&!S.show.detail){S.show.detail=true;applyPanels()}
  const v=t==='etude'?'etude':t==='grid'||t==='edit'?'grid':null;
  if(v&&S.view!==v)setView(v);else if(v==='etude'){stripDirty=true;renderScore();updateStrip()}
  if(!init)window.scrollTo({top:0});
}
function openDrawer(on){
  const d=$('#drawer');if(d.hidden===!on)return;
  d.hidden=!on;$('#btn-menu').setAttribute('aria-expanded',String(on));
  document.documentElement.classList.toggle('noscroll',on);
  if(on)$('#drawer-close').focus();else if(MQ.matches)$('#btn-menu').focus({preventScroll:true});
}
function initMobile(){
  $('#tabbar').addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b)setMTab(b.dataset.m)});
  $('#btn-menu').addEventListener('click',()=>openDrawer(true));
  $('#drawer-close').addEventListener('click',()=>openDrawer(false));
  $('#drawer').addEventListener('click',e=>{if(e.target===e.currentTarget)openDrawer(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#drawer').hidden)openDrawer(false)});
  // le bouton Étude / Grille du bureau garde l'onglet mobile cohérent
  $('#v-etude').addEventListener('click',()=>{S.mtab='etude';document.body.dataset.m='etude';save()});
  $('#v-grid').addEventListener('click',()=>{if(S.mtab==='etude'){S.mtab='grid';document.body.dataset.m='grid';save()}});
  // hauteur de la barre du haut, pour coller la portée qui défile juste dessous
  const top=$('.top'),setH=()=>document.documentElement.style.setProperty('--hdr',top.offsetHeight+'px');
  setH();try{new ResizeObserver(setH).observe(top)}catch(e){}
  // barre d'insertion de l'éditeur : garder le clavier ouvert, insérer au curseur
  const src=$('#src');
  $('#keys').addEventListener('pointerdown',e=>{if(e.target.closest('button'))e.preventDefault()});
  $('#keys').addEventListener('click',e=>{const b=e.target.closest('[data-ins]');if(!b)return;
    const ins=b.dataset.ins.replace(/\\n/g,'\n');src.focus();
    src.setRangeText(ins,src.selectionStart,src.selectionEnd,'end');
    src.dispatchEvent(new Event('input',{bubbles:true}))});
  MQ.addEventListener('change',placeMobile);
  placeMobile();
}
// thème : « auto » suit le réglage du téléphone, sinon on force clair ou sombre
function applyTheme(){
  const r=document.documentElement;if(S.theme==='auto')delete r.dataset.theme;else r.dataset.theme=S.theme;
  $('#sel-theme').value=S.theme;
  const m=document.querySelector('meta[name="theme-color"]');if(m)m.content=getComputedStyle(r).getPropertyValue('--paper').trim();
}
function setGridSimple(on){S.gridSimple=on;$('#view-grid').classList.toggle('simple',on);$('#btn-simple').setAttribute('aria-pressed',String(on))}
init();
$('#btn-simple').addEventListener('click',()=>{setGridSimple(!S.gridSimple);save();scrollToCur()});setGridSimple(S.gridSimple);
applyTheme();$('#sel-theme').addEventListener('change',e=>{S.theme=e.target.value;save();applyTheme();stripDirty=true;renderScore();updateStrip()});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applyTheme);
initMobile();
initFocus();
})();
