/* Moteur harmonique : parsing de grilles, analyse fonctionnelle, gammes d'accord, conduite des voix. Expose window.HT */
/* ======================= Moteur harmonique ======================= */
window.HT=(()=>{
const O={notation:'en'};
const NAT={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const LETTERS='CDEFGAB';
const LATIN={C:'Do',D:'Ré',E:'Mi',F:'Fa',G:'Sol',A:'La',B:'Si'};
const LATIN_IN=[['sol','G'],['do','C'],['ré','D'],['re','D'],['mi','E'],['fa','F'],['la','A'],['si','B']];
const SHARP_N=[['C',0],['C',1],['D',0],['D',1],['E',0],['F',0],['F',1],['G',0],['G',1],['A',0],['A',1],['B',0]];
const FLAT_N=[['C',0],['D',-1],['D',0],['E',-1],['E',0],['F',0],['G',-1],['G',0],['A',-1],['A',0],['B',-1],['B',0]];
const mod=(n,m=12)=>((n%m)+m)%m;
const accStr=a=>a>0?'♯'.repeat(a):a<0?'♭'.repeat(-a):'';
const nn=(L,a)=>(O.notation==='fr'?LATIN[L]:L)+accStr(a);
const pcSp=(pc,flat)=>{const [L,a]=(flat?FLAT_N:SHARP_N)[mod(pc)];return {L,a,pc:mod(pc)}};
const pcName=(pc,flat)=>{const s=pcSp(pc,flat);return nn(s.L,s.a)};
const STEP={1:0,2:1,3:2,4:3,5:4,6:5,7:6,9:1,11:3,13:5};
const NATS={1:0,2:2,3:4,4:5,5:7,6:9,7:11,9:2,11:5,13:9};
const spellFrom=(root,semi,deg)=>{const L=LETTERS[(LETTERS.indexOf(root.L)+STEP[deg])%7];const pc=mod(root.pc+semi);return {L,a:mod(pc-NAT[L]+6)-6,pc}};
function degLabel(deg,semi){if(deg===1)return '1';if(deg===7&&semi===9)return '°7';const d=mod(semi-NATS[deg]+6)-6;return accStr(d)+deg}

function parseRoot(s,fr){
  let L=null,len=0;
  if(fr){const low=s.toLowerCase();for(const [n,X] of LATIN_IN){if(low.startsWith(n)){L=X;len=n.length;break}}}
  if(!L){const c=s[0];if(c&&LETTERS.includes(c)){L=c;len=1}}
  if(!L)return null;
  let a=0;
  while(len<s.length&&Math.abs(a)<2){const c=s[len];if(c==='#'||c==='♯'){a++;len++}else if(c==='b'||c==='♭'){a--;len++}else break}
  return {L,a,pc:mod(NAT[L]+a),len};
}

function parseQuality(raw){
  let q=raw.replace(/[()\s,\[\]]/g,'').replace(/♯/g,'#').replace(/♭/g,'b')
    .replace(/[Δ∆△^]/g,'maj').replace(/Maj|MAJ|Ma(?=j)/g,'maj').replace(/M(?=7|9|11|13)/g,'maj').replace(/^M$/,'')
    .replace(/ø7?/g,'m7b5').replace(/[°º]/g,'dim').replace(/^o(?=7|$)/,'dim').replace(/^[-−]/,'m').replace(/^min/,'m').replace(/^\+/,'aug');
  const st={third:4,fifth:7,sev:null,six:false,sus:null,ext:new Map(),no5:false,no3:false,dim:false,alt:false};
  let i=0,m;
  const eat=re=>{const r=re.exec(q.slice(i));if(r&&r.index===0){i+=r[0].length;return r}return null};
  const setExt=(deg,semi)=>{for(const k of [...st.ext.keys()])if(k.startsWith(deg+':'))st.ext.delete(k);st.ext.set(deg+':'+semi,{deg,semi})};
  const has=deg=>[...st.ext.keys()].some(k=>k.startsWith(deg+':'));
  const addNum=n=>{n=+n;if(n>=9&&!has(9))setExt(9,2);if(n===11)setExt(11,5);if(n===13)setExt(13,9)};
  if(eat(/^m(?!aj)/))st.third=3;
  else if(eat(/^dim/)){st.third=3;st.fifth=6;st.dim=true}
  else if(eat(/^aug/))st.fifth=8;
  else if(eat(/^5(?!\d)/))st.no3=true;
  if(eat(/^maj/)){st.sev=11;if(m=eat(/^(13|11|9|7)/))addNum(m[1])}
  else if(eat(/^(6\/9|69)/)){st.six=true;setExt(9,2)}
  else if(eat(/^6(?!\d)/))st.six=true;
  else if(m=eat(/^(13|11|9|7)/)){st.sev=st.dim?9:10;addNum(m[1])}
  while(i<q.length){
    if(eat(/^sus2/))st.sus=2;
    else if(eat(/^sus4?/))st.sus=4;
    else if(m=eat(/^add(13|11|9|6|4|2)/)){const n=m[1];if(n==='2'||n==='9')setExt(9,2);else if(n==='4'||n==='11')setExt(11,5);else st.six=true}
    else if(m=eat(/^(b|#|-|\+)(13|11|9|5)/)){const up=m[1]==='#'||m[1]==='+';const d=+m[2];if(d===5)st.fifth=up?8:6;else setExt(d,{9:2,11:5,13:9}[d]+(up?1:-1))}
    else if(eat(/^alt/)){if(st.sev==null)st.sev=10;setExt(9,1);st.ext.set('9:3',{deg:9,semi:3});setExt(13,8);st.no5=true;st.alt=true}
    else if(eat(/^maj7?/))st.sev=11;
    else if(m=eat(/^(13|11|9|7)/)){if(st.sev==null)st.sev=st.dim?9:10;addNum(m[1])}
    else if(eat(/^6/))st.six=true;
    else if(eat(/^\+/))st.fifth=8;
    else if(eat(/^no3/))st.no3=true;
    else if(eat(/^(no5|omit5)/))st.no5=true;
    else return {error:true};
  }
  return st;
}

function classify(st){
  const third=(st.sus||st.no3)?null:st.third;
  if(st.sev===9)return 'dim7';
  if(third===3&&st.fifth===6&&st.sev===10)return 'hdim';
  if(third===3&&st.fifth===6&&st.sev==null)return 'dim';
  if(third===4&&st.sev===10)return 'dom';
  if(st.sus&&st.sev===10)return 'domsus';
  if(third===4&&st.sev===11)return 'maj7';
  if(third===3&&st.sev===11)return 'mmaj7';
  if(third===3&&st.sev===10)return 'm7';
  if(third===3)return st.six?'m6':'min';
  if(third===4&&st.fifth===8)return 'aug';
  if(st.sus)return 'sus';
  if(third===4)return st.six?'6':'maj';
  return 'power';
}

function parseChord(tok,fr){
  let t=tok.trim();
  let bass=null;
  const sl=t.lastIndexOf('/');
  if(sl>0){const b=parseRoot(t.slice(sl+1),fr);if(b&&b.len===t.length-sl-1){bass=b;t=t.slice(0,sl)}}
  const r=parseRoot(t,fr);
  if(!r)return {error:`« ${tok} » : fondamentale inconnue`};
  const suffix=t.slice(r.len);
  const st=parseQuality(suffix);
  if(st.error)return {error:`« ${tok} » : chiffrage non reconnu`};
  const root={L:r.L,a:r.a,pc:r.pc};
  const raw=[{deg:1,semi:0}];
  if(st.sus===4)raw.push({deg:4,semi:5});else if(st.sus===2)raw.push({deg:2,semi:2});else if(!st.no3)raw.push({deg:3,semi:st.third});
  if(!st.no5)raw.push({deg:5,semi:st.fifth});
  if(st.six)raw.push({deg:6,semi:9});
  if(st.sev!=null)raw.push({deg:7,semi:st.sev});
  const exts=[...st.ext.values()].sort((a,b)=>a.deg-b.deg||a.semi-b.semi).map(e=>({...e,ext:true}));
  const tones=[];const seen=new Set();
  for(const x of [...raw,...exts]){const pc=mod(root.pc+x.semi);if(seen.has(pc))continue;seen.add(pc);
    const sp=spellFrom(root,x.semi,x.deg);tones.push({deg:x.deg,semi:x.semi,pc,L:sp.L,a:sp.a,ext:!!x.ext,label:degLabel(x.deg,x.semi)})}
  const kind=classify(st);
  return {sym:tok,root,bass:bass?{L:bass.L,a:bass.a,pc:bass.pc}:null,suffix,tones,core:tones.filter(x=>!x.ext),kind,alt:st.alt};
}

const META=/^(titre|title|tonalit[ée]|key|ton|tempo|bpm|mesure|time|signature)\s*[:=]\s*(.+)$/i;
function parseSheet(text){
  const lines=text.split(/\r?\n/);
  const meta={};const rows=[];const errors=[];
  const barLines=lines.filter(l=>l.trim()&&!META.test(l.trim())&&!/^(#|\/\/)/.test(l.trim()));
  const fr=barLines.some(l=>/(^|[\s|:])(do|ré|re|mi|fa|sol|la|si)(?=[#b♯♭m0-9\s|(/+°øΔ^\-]|$)/i.test(l.replace(/^[^|:]{1,12}:/,' ')));
  for(let raw of lines){
    let l=raw.trim();
    if(!l||/^(#|\/\/)/.test(l))continue;
    const mm=META.exec(l);
    if(mm){const k=mm[1].toLowerCase();const v=mm[2].trim();
      if(/^(titre|title)$/.test(k))meta.title=v;
      else if(/^(tonalit|key|ton)/.test(k))meta.key=v;
      else if(/^(tempo|bpm)$/.test(k)){const n=parseInt(v,10);if(n)meta.tempo=n}
      else{const t=/(\d+)\s*\/\s*(\d+)/.exec(v);if(t)meta.beats=+t[1]}
      continue}
    let label=null;
    const lm=/^\[?([A-Za-zÀ-ÿ0-9' ]{1,14}?)\]?\s*:\s*(.*)$/.exec(l);
    if(lm&&!/\|/.test(lm[1])){label=lm[1].trim();l=lm[2]}
    let times=1;const xm=/\s*[x×]\s*(\d)\s*$/i.exec(l);if(xm){times=Math.min(4,+xm[1]);l=l.slice(0,xm.index)}
    let segs;
    if(l.includes('|'))segs=l.split('|').map(s=>s.replace(/^\s*:|:\s*$/g,'').trim()).filter(s=>s.length);
    else segs=l.split(/\s+/).filter(Boolean);
    const bars=[];
    for(const seg of segs){
      const toks=seg.split(/\s+/).filter(Boolean);
      if(toks.length===1&&(toks[0]==='%'||toks[0]==='𝄎')){
        const prev=bars[bars.length-1]||(rows.length?rows[rows.length-1].bars.slice(-1)[0]:null);
        if(prev)bars.push({repeat:true,items:prev.items.map(it=>({...it}))});
        continue}
      const items=[];
      for(const tk of toks){
        if(tk==='.'||tk==='/'||tk==='-'){if(items.length)items[items.length-1].units++;continue}
        if(/^n\.?c\.?$/i.test(tk))continue;
        const c=parseChord(tk,fr);
        if(c.error){errors.push(c.error);items.push({tok:tk,units:1,error:c.error})}
        else items.push({tok:tk,units:1,chord:c});
      }
      if(items.length)bars.push({repeat:false,items});
    }
    if(!bars.length)continue;
    for(let r=0;r<times;r++)rows.push({label:r===0?label:(label?label+'′':''),bars:r===0?bars:bars.map(b=>({repeat:b.repeat,items:b.items.map(it=>({...it}))}))});
  }
  return {meta,rows,errors,fr};
}

function buildTimeline(sheet,bpb){
  const tl=[];let beat=0,barNo=0;
  sheet.rows.forEach((row,ri)=>row.bars.forEach((bar,bi)=>{
    const total=bar.items.reduce((s,it)=>s+it.units,0)||1;
    let b=beat;
    bar.items.forEach(it=>{const dur=it.units/total*bpb;
      if(it.chord){it.ev=tl.length;tl.push({chord:it.chord,start:b,beats:dur,bar:barNo,row:ri,repeat:bar.repeat})}
      b+=dur});
    beat+=bpb;barNo++;
  }));
  return {tl,totalBeats:beat,bars:barNo};
}

/* ---- tonalités ---- */
const MAJ=[0,2,4,5,7,9,11],NMIN=[0,2,3,5,7,8,10],MINH=[0,2,3,5,7,8,10,11];
const KEY_MAJ=[['C',0],['D',-1],['D',0],['E',-1],['E',0],['F',0],['F',1],['G',0],['A',-1],['A',0],['B',-1],['B',0]];
const KEY_MIN=[['C',0],['C',1],['D',0],['E',-1],['E',0],['F',0],['F',1],['G',0],['G',1],['A',0],['B',-1],['B',0]];
const FLAT_MAJ=new Set([1,3,5,8,10]),FLAT_MIN=new Set([0,2,3,5,7,10]);
const keyRoot=k=>{const [L,a]=(k.mode==='major'?KEY_MAJ:KEY_MIN)[k.tonic];return {L,a,pc:k.tonic}};
const keyFlat=k=>(k.mode==='major'?FLAT_MAJ:FLAT_MIN).has(k.tonic);
const keyName=k=>{const r=keyRoot(k);return nn(r.L,r.a)+(k.mode==='major'?' majeur':' mineur')};
const keyShort=k=>{const r=keyRoot(k);return nn(r.L,r.a)+(k.mode==='major'?'':'m')};
const parallel=k=>({tonic:k.tonic,mode:k.mode==='major'?'minor':'major'});
const keyScaleSet=k=>new Set((k.mode==='major'?MAJ:MINH).map(x=>mod(x+k.tonic)));
function parseKey(str){
  if(!str)return null;
  const s=str.trim();
  const fr=/^(do|ré|re|mi|fa|sol|la|si)/i.test(s);
  const r=parseRoot(fr?s:s[0].toUpperCase()+s.slice(1),fr);if(!r)return null;
  const rest=s.slice(r.len).trim().toLowerCase();
  const minor=/^(m(?!aj)|min|mineur|minor|-)/.test(rest);
  return {tonic:r.pc,mode:minor?'minor':'major'};
}
const MAJQ=['maj','maj7','6'],MINQ=['min','m7','m6','mmaj7'];
function detectKey(tl){
  const chords=tl.map(e=>e.chord);if(!chords.length)return {tonic:0,mode:'major'};
  let best=null;
  for(let t=0;t<12;t++)for(const mode of ['major','minor']){
    const sc=keyScaleSet({tonic:t,mode});let s=0;
    chords.forEach((c,i)=>{
      const core=c.core.filter(x=>x.deg!==6);
      s+=core.filter(x=>sc.has(x.pc)).length/core.length;
      const tq=mode==='major'?MAJQ:MINQ;
      if(c.root.pc===t&&tq.includes(c.kind))s+=.6;
      const nx=chords[i+1];
      if(nx&&nx.root.pc===t&&(c.kind==='dom'||c.kind==='domsus')&&c.root.pc===mod(t+7))s+=1;
    });
    const f=chords[0],l=chords[chords.length-1];
    const tq=mode==='major'?MAJQ:MINQ;
    if(l.root.pc===t)s+=tq.includes(l.kind)?1.5:.6;
    if(f.root.pc===t)s+=tq.includes(f.kind)?.8:.3;
    if(!best||s>best.s+1e-9)best={s,tonic:t,mode};
  }
  return {tonic:best.tonic,mode:best.mode};
}

/* ---- analyse ---- */
const NUM=['I','♭II','II','♭III','III','IV','♯IV','V','♭VI','VI','♭VII','VII'];
const LOWER=new Set(['min','m7','m6','mmaj7','dim','hdim','dim7']);
const SUF={dim7:'°7',hdim:'ø7',dim:'°',aug:'+',maj7:'Δ7',mmaj7:'Δ7',dom:'7',domsus:'7sus',m7:'7',m6:'6','6':'6',sus:'sus',min:'',maj:'',power:'5'};
const FN_MAJ={0:'T',2:'SD',4:'T',5:'SD',7:'D',9:'T',11:'D'};
const FN_MIN={0:'T',2:'SD',3:'T',5:'SD',7:'D',8:'SD',10:'SD',11:'D'};
const FN_NAME={T:'Tonique',SD:'Sous-dominante',D:'Dominante',X:'Couleur'};
function numeralBare(c,key){
  const rel=mod(c.root.pc-key.tonic);let n=NUM[rel];
  if(rel===6&&!['hdim','dim','dim7'].includes(c.kind))n='♭V';
  if(LOWER.has(c.kind))n=n.replace(/[IV]+/,x=>x.toLowerCase());
  return n;
}
const numeral=(c,key)=>numeralBare(c,key)+SUF[c.kind];
const isDomLike=c=>c.kind==='dom'||c.kind==='domsus';
const isMinorish=c=>['min','m7','m6','mmaj7','hdim','dim'].includes(c.kind);
function isDiatonic(c,key){const sc=keyScaleSet(key);return c.core.filter(t=>t.deg!==6).every(t=>sc.has(t.pc))}
function chordText(c){
  let s=nn(c.root.L,c.root.a)+prettySuffix(c.suffix);
  if(c.bass)s+='/'+nn(c.bass.L,c.bass.a);
  return s;
}
function prettySuffix(s){return s.replace(/b(?=\d)/g,'♭').replace(/#/g,'♯')}

function analyze(tl,key){
  const flat=keyFlat(key);
  const N=tl.length;
  tl.forEach((ev,i)=>{
    const c=ev.chord;const n=N>1?tl[(i+1)%N].chord:null;
    const rel=mod(c.root.pc-key.tonic);
    const A={rel,num:numeral(c,key),fn:'X',role:'chrom',label:'',text:'',arrow:null,iiv:null,ctx:null};
    const diat=isDiatonic(c,key);
    if(isDomLike(c)&&n&&n.root.pc===mod(c.root.pc+5)){
      A.fn='D';A.arrow='res';
      if(n.root.pc===key.tonic){A.role='V';A.label='V'+SUF[c.kind];A.text='Dominante principale : la fondamentale descend d\'une quinte vers la tonique.';A.ctx=key}
      else{A.role='secV';A.label='V'+SUF[c.kind]+'/'+numeralBare(n,key);A.text=`Dominante secondaire : c'est le V7 de ${chordText(n)} (${numeralBare(n,key)}). Elle installe brièvement ce degré comme une tonique.`;A.ctx={tonic:n.root.pc,mode:isMinorish(n)?'minor':'major',root:n.root}}
    }else if(isDomLike(c)&&n&&n.root.pc===mod(c.root.pc-1)){
      const orig=mod(n.root.pc+7);
      const g=c.core.filter(t=>t.deg===3||t.deg===7).map(t=>nn(t.L,t.a)).join('–');
      A.role='subV';A.fn='D';A.arrow='sub';A.label=n.root.pc===key.tonic?'subV7':'subV7/'+numeralBare(n,key);
      A.text=`Substitution tritonique : remplace ${pcName(orig,flat)}7, avec qui il partage le triton ${g}. Sa fondamentale descend d'un demi-ton vers ${chordText(n)}.`;
    }else if(c.kind==='dim7'&&n&&n.root.pc===mod(c.root.pc+1)){
      A.role='passDim';A.fn='D';A.arrow='res';A.label=n.root.pc===key.tonic?'vii°7':'vii°7/'+numeralBare(n,key);
      A.text=`Diminué de passage : sa fondamentale est la sensible de ${chordText(n)} et monte d'un demi-ton.`;
    }else if(diat){
      A.role='diat';A.fn=(key.mode==='major'?FN_MAJ:FN_MIN)[rel]||'X';A.label=A.num;A.ctx=key;
      A.text=`Accord diatonique de ${keyName(key)}, fonction de ${FN_NAME[A.fn].toLowerCase()}.`;
      if(isDomLike(c)&&rel===7)A.text+=' Cette dominante ne résout pas directement sur la tonique.';
    }else if(isDomLike(c)&&(rel===0||rel===5||rel===7||rel===10)){
      A.role='blues';A.fn=rel===0?'T':rel===7?'D':'SD';A.label=A.num;A.ctx=key;
      A.text='Septième de couleur blues : sonorité de dominante sans résolution attendue.';
    }else if(isDiatonic(c,parallel(key))){
      A.role='borrow';A.fn=(key.mode==='major'?FN_MIN:FN_MAJ)[rel]||'SD';A.label=A.num;A.ctx={...parallel(key)};
      A.text=`Emprunt au mode parallèle (${keyName(parallel(key))}).`;
    }else{A.label=A.num;A.text='Accord chromatique, hors de la tonalité : il colore la grille ou prépare l\'accord suivant.'}
    c.an=A;
  });
  // II–V
  for(let i=0;i<N-1;i++){
    const c=tl[i].chord,v=tl[i+1].chord,tg=N>2?tl[(i+2)%N].chord:null;
    const iiLike=c.kind==='m7'||c.kind==='hdim'||c.kind==='min';
    const subPair=iiLike&&isDomLike(v)&&tg&&v.root.pc===mod(c.root.pc-1)&&tg.root.pc===mod(v.root.pc-1);
    if(iiLike&&isDomLike(v)&&(v.root.pc===mod(c.root.pc+5)||subPair)){
      c.an.iiv='s';v.an.iiv='e';
      const resolves=tg&&(tg.root.pc===mod(v.root.pc+5)||subPair);
      if(c.an.role!=='diat'&&resolves&&tg.root.pc!==key.tonic){
        c.an.label=(c.kind==='hdim'?'iiø7':'ii7')+'/'+numeralBare(tg,key);c.an.fn='SD';
        c.an.ctx={tonic:tg.root.pc,mode:isMinorish(tg)?'minor':'major',root:tg.root};c.an.role='secII';
        c.an.text=`II relatif : prépare la dominante ${chordText(v)} vers ${chordText(tg)}.`;
      }else if(resolves) c.an.text+=` Premier accord d'un II–V vers ${chordText(tg)}.`;
      else c.an.text+=' Premier accord d\'un II–V.';
      v.an.text+=' Second accord d\'un II–V.';
    }
  }
  tl.forEach((ev,i)=>{ev.chord.scale=chordScale(ev.chord,key,N>1?tl[(i+1)%N].chord:null)});
}

/* ---- gamme de l'accord ---- */
const SCALES=[
  ['ionien',[0,2,4,5,7,9,11]],['dorien',[0,2,3,5,7,9,10]],['phrygien',[0,1,3,5,7,8,10]],['lydien',[0,2,4,6,7,9,11]],
  ['mixolydien',[0,2,4,5,7,9,10]],['éolien',[0,2,3,5,7,8,10]],['locrien',[0,1,3,5,6,8,10]],
  ['mixolydien ♭9 ♭13',[0,1,4,5,7,8,10]],['mixolydien ♭13',[0,2,4,5,7,8,10]],['lydien ♭7',[0,2,4,6,7,9,10]],
  ['altérée',[0,1,3,4,6,8,10]],['mineur mélodique',[0,2,3,5,7,9,11]],['mineur harmonique',[0,2,3,5,7,8,11]],
  ['locrien ♮2',[0,2,3,5,6,8,10]],['majeur harmonique',[0,2,4,5,7,8,11]],['dorien ♯4',[0,2,3,6,7,9,10]],['lydien augmenté',[0,2,4,6,8,9,11]]
];
function stepScale(root,ints){return ints.map((s,i)=>{const L=LETTERS[(LETTERS.indexOf(root.L)+i)%7];const pc=mod(root.pc+s);return {L,a:mod(pc-NAT[L]+6)-6,pc}})}
function chordScale(c,key,next){
  const A=c.an,k=c.kind,flat=keyFlat(key);
  const sym=(name,pcs)=>({name,notes:pcs.map(pc=>pcSp(pc,flat))});
  const byInts=(name,ints)=>({name,notes:stepScale(c.root,ints)});
  if(k==='dim7')return sym('diminuée (ton / demi-ton)',[0,2,3,5,6,8,9,11].map(x=>mod(c.root.pc+x)));
  if(k==='aug')return sym('par tons',[0,2,4,6,8,10].map(x=>mod(c.root.pc+x)));
  if(c.alt)return byInts('altérée',[0,1,3,4,6,8,10]);
  if(A.role==='subV')return byInts('lydien ♭7',[0,2,4,6,7,9,10]);
  const ctx=A.ctx;
  if(ctx){
    const kr=ctx.root||keyRoot(ctx);
    const base=ctx.mode==='major'?MAJ:NMIN;
    const sc=stepScale(kr,base);
    for(const t of c.tones){const j=sc.findIndex(e=>e.L===t.L);if(j>=0&&sc[j].pc!==t.pc)sc[j]={L:t.L,a:t.a,pc:t.pc}}
    const j0=sc.findIndex(e=>e.L===c.root.L);
    if(j0>=0&&sc[j0].pc===c.root.pc){
      const rot=sc.slice(j0).concat(sc.slice(0,j0));
      const ints=rot.map(e=>mod(e.pc-c.root.pc));
      const hit=SCALES.find(([,v])=>v.every((x,i)=>x===ints[i]));
      if(hit)return {name:hit[0],notes:rot};
    }
  }
  const F={maj:'lydien',maj7:'lydien','6':'lydien',min:'dorien',m7:'dorien',m6:'dorien',mmaj7:'mineur mélodique',dom:'mixolydien',domsus:'mixolydien',hdim:'locrien ♮2',dim:'locrien',sus:'mixolydien',power:'mixolydien'}[k]||'ionien';
  if(isDomLike(c)&&next&&isMinorish(next)&&A.arrow)return byInts('mixolydien ♭9 ♭13',[0,1,4,5,7,8,10]);
  return byInts(F,SCALES.find(s=>s[0]===F)[1]);
}

/* ---- conduite des voix ---- */
function voiceLeading(c,n){
  if(!n)return [];
  const to=n.core;
  return c.core.map(t=>{
    let best=null;
    for(const u of to){const d=mod(u.pc-t.pc+6)-6;if(!best||Math.abs(d)<Math.abs(best.d)||(Math.abs(d)===Math.abs(best.d)&&d<best.d))best={u,d}}
    const pass=Math.abs(best.d)===2?[mod(t.pc+best.d/2)]:Math.abs(best.d)===3?[mod(t.pc+Math.sign(best.d)),mod(t.pc+2*Math.sign(best.d))]:[];
    return {from:t,to:best.u,d:best.d,guide:t.deg===3||t.deg===7,pass};
  });
}
const INTV=['même fondamentale','demi-ton ↑','seconde majeure ↑','tierce mineure ↑','tierce majeure ↑','quarte ↑ (cycle des quintes)','triton','quinte ↑ (quarte ↓)','sixte mineure ↑ (tierce majeure ↓)','tierce mineure ↓','seconde majeure ↓','demi-ton ↓'];
const QNAME={maj:'majeur',min:'mineur','6':'majeur 6',m6:'mineur 6',maj7:'majeur 7',m7:'mineur 7',dom:'septième de dominante',domsus:'7 suspendu',hdim:'demi-diminué',dim:'diminué',dim7:'diminué 7',aug:'augmenté',mmaj7:'mineur majeur 7',sus:'suspendu',power:'quinte à vide'};

return {O,mod,nn,pcName,pcSp,parseSheet,parseChord,buildTimeline,detectKey,analyze,parseKey,keyName,keyShort,keyFlat,keyRoot,keyScaleSet,
  voiceLeading,INTV,QNAME,FN_NAME,chordText,prettySuffix,degLabel};
})();
