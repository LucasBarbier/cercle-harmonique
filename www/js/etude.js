/* Générateur d'études (lignes mélodiques sur la grille). Dépend de window.HT, expose window.ET */
window.ET=(()=>{
const H=window.HT,mod=H.mod;
const LETTERS='CDEFGAB';
const IV={0:'1',1:'♭9',2:'9',3:'♯9',4:'3',5:'11',6:'♯11',7:'5',8:'♭13',9:'13',10:'♭7',11:'7'};
function rngOf(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function info(c){
  const ct=new Map();c.core.forEach(t=>ct.set(t.pc,{L:t.L,a:t.a,label:t.label}));
  const ten=new Map();
  c.tones.filter(t=>t.ext).forEach(t=>ten.set(t.pc,{L:t.L,a:t.a,label:t.label}));
  const sc=new Map();
  (c.scale?c.scale.notes:[]).forEach(n=>{sc.set(n.pc,n);
    if(!ct.has(n.pc)&&!ten.has(n.pc)&&!ct.has(mod(n.pc-1)))ten.set(n.pc,{L:n.L,a:n.a,label:IV[mod(n.pc-c.root.pc)]})});
  c.tones.forEach(t=>{if(!sc.has(t.pc))sc.set(t.pc,{L:t.L,a:t.a,pc:t.pc})});
  const guide=c.core.filter(t=>t.deg===3||t.deg===7).map(t=>t.pc);
  return {ct,ten,sc,root:c.root.pc,guide,c};
}
const pitches=(pcs,lo,hi)=>{const r=[];for(let m=lo;m<=hi;m++)if(pcs.has(mod(m)))r.push(m);return r};
function nearest(arr,x,excl){let b=null;for(const m of arr){if(excl&&m===x)continue;if(b==null||Math.abs(m-x)<Math.abs(b-x))b=m}return b}

function fillGap(A,B,k,I,mode,chromLast,rng,lo,hi){
  if(k>3){const r=[];for(let i=1;i<=k;i++)r.push(Math.round(A+(B-A)*i/(k+1)));return r}
  const cands=[];for(let m=Math.min(A,B)-5;m<=Math.max(A,B)+5;m++)if(m>=lo-3&&m<=hi+3)cands.push(m);
  const step=d=>{d=Math.abs(d);return d===0?5:d<=2?0:d===3?1.5:d===4?2.5:d===5?4:8};
  const side=rng()<.5?1:-1;
  let best=null,bestC=1e9;
  const seq=[];
  const rec=(i,c)=>{
    if(c>=bestC)return;
    if(i===k){
      const all=[A,...seq,B];let cost=c+step(B-seq[k-1]);
      for(let j=1;j<all.length-1;j++){const d1=all[j]-all[j-1],d2=all[j+1]-all[j];if(d1*d2<0&&mode!=='encl')cost+=1}
      const last=seq[k-1];
      if((chromLast||mode==='chrom'||mode==='encl')&&Math.abs(last-B)!==1)cost+=6;
      if(mode==='encl'){
        if(k>=2){const pen=seq[k-2];if(pen===B||Math.sign(pen-B)===Math.sign(last-B)||Math.abs(pen-B)>2)cost+=6;if(Math.sign(pen-B)!==side)cost+=.5}
        else if(Math.sign(last-B)!==side)cost+=.5;
      }
      cost+=rng()*.4;
      if(cost<bestC){bestC=cost;best=seq.slice()}
      return;
    }
    const pv=i===0?A:seq[i-1],isLast=i===k-1;
    for(const m of cands){
      let cc=step(m-pv);
      if(!I[i].sc.has(mod(m))){if(mode==='diat'&&!(chromLast&&isLast))continue;if(!isLast)cc+=2}
      if(isLast&&m===B)cc+=5;
      seq.push(m);rec(i+1,c+cc);seq.pop();
    }
  };
  rec(0,0);
  return best||Array(k).fill(A);
}

function generate(tl,total,bpb,o,seed){
  const rng=rngOf(seed*7919+13);
  const sub=o.sub,N=Math.round(total*sub);
  if(!tl.length||!N)return [];
  const infos=tl.map(e=>info(e.chord));
  const lo=o.lo,hi=o.hi,mid=Math.round((lo+hi)/2);
  const slots=[];let ei=0;
  for(let k=0;k<N;k++){const t=k/sub;while(ei+1<tl.length&&tl[ei+1].start<=t+1e-6)ei++;slots.push({k,t,ev:ei})}
  slots.forEach((s,k)=>{
    s.cs=k===0||slots[k-1].ev!==s.ev;
    const onBeat=Math.abs(s.t-Math.round(s.t))<1e-6;
    const bib=Math.round(s.t)%bpb;
    s.strong=o.fill==='none'||s.cs||(sub===1?(onBeat&&bib%2===0):onBeat);
    s.last=k===N-1||slots[k+1].ev!==s.ev;
  });
  const pools=infos.map(I=>{const pcs=new Set(I.ct.keys());if(o.ten)for(const p of I.ten.keys())pcs.add(p);return pitches(pcs,lo,hi)});
  const roots=I=>pitches(new Set([I.root]),lo,hi);
  // degré d'entrée choisi (repli : sus pour la tierce, 6 pour la septième, sinon fondamentale)
  const DEG={root:[1],third:[3,4,2],fifth:[5],seventh:[7,6]};
  const entry=I=>{const want=DEG[o.start];if(!want)return null;
    for(const d of want){const t=I.c.core.find(x=>x.deg===d);if(t)return pitches(new Set([t.pc]),lo,hi)}
    return roots(I)};
  let prev=o.startFrom??null,dir=o.motif==='down'?-1:1;
  for(const s of slots){
    if(!s.strong)continue;
    const P=pools[s.ev],I=infos[s.ev];let m;
    if(prev==null)m=nearest(entry(I)||roots(I),o.motif==='down'?hi-5:o.motif==='up'?lo+4:mid-3);
    else if(s.cs){
      if(o.motif==='guide'){const g=pitches(new Set(I.guide.length?I.guide:[...I.ct.keys()]),lo,hi);m=nearest(g,prev)}
      else if(o.start!=='near'&&entry(I))m=nearest(entry(I),prev);
      else m=nearest(P,prev,true)??prev;
    }else if(o.motif==='random'){
      const c=P.filter(x=>x!==prev&&Math.abs(x-prev)<=8);
      if(c.length){let tot=0;const w=c.map(x=>{const v=1/Math.abs(x-prev);tot+=v;return v});let r=rng()*tot;m=c[c.length-1];
        for(let i=0;i<c.length;i++){r-=w[i];if(r<=0){m=c[i];break}}}
      else m=nearest(P,prev,true)??prev;
    }else{
      const d=o.motif==='up'?1:o.motif==='down'?-1:dir;
      let c=d>0?P.filter(x=>x>prev):P.filter(x=>x<prev);
      if(c.length)m=d>0?Math.min(...c):Math.max(...c);
      else if(o.motif==='up')m=nearest(roots(I),lo+4);
      else if(o.motif==='down')m=nearest(roots(I),hi-5);
      else{dir=-dir;c=dir>0?P.filter(x=>x>prev):P.filter(x=>x<prev);m=c.length?(dir>0?Math.min(...c):Math.max(...c)):prev}
    }
    if(m==null)m=prev??mid;
    if(o.motif==='wave'||o.motif==='guide'||o.motif==='random'){if(m>=hi-2)dir=-1;else if(m<=lo+2)dir=1}
    s.m=m;prev=m;
  }
  // approche sur temps fort quand il n'y a pas de remplissage
  if(o.app){
    for(let k=0;k<N-1;k++){
      const s=slots[k];if(!s.last||s.cs||!s.strong)continue;
      const B=slots[k+1].m,pv=slots[k-1].m;
      const below=B-1,above=B+1;
      const pick=Math.abs(below-pv)===Math.abs(above-pv)?(rng()<.5?below:above):(Math.abs(below-pv)<Math.abs(above-pv)?below:above);
      s.m=pick;s.app=true;
    }
  }
  // remplissage des temps faibles
  const strongIdx=slots.filter(s=>s.strong).map(s=>s.k);
  for(let j=0;j<strongIdx.length;j++){
    const a=strongIdx[j],b=j+1<strongIdx.length?strongIdx[j+1]:N;
    const k=b-a-1;if(k<=0)continue;
    const A=slots[a].m,B=b<N?slots[b].m:(o.loop?slots[0].m:A);
    let mode=o.fill;if(mode==='mix'){const r=rng();mode=r<.45?'diat':r<.75?'chrom':'encl'}
    const into=b<N?slots[b].cs:o.loop;
    const f=fillGap(A,B,k,slots.slice(a+1,b).map(s=>infos[s.ev]),mode,o.app&&into,rng,lo,hi);
    f.forEach((m,i)=>{slots[a+1+i].m=m});
  }
  // orthographe et rôle
  const out=slots.map((s,i)=>{
    const I=infos[s.ev],pc=mod(s.m);let role,sp;
    if(I.ct.has(pc)){sp=I.ct.get(pc);role='ct'}
    else if(I.ten.has(pc)){sp=I.ten.get(pc);role=s.strong&&!s.app?'ten':'pass'}
    else if(I.sc.has(pc)){sp=I.sc.get(pc);role='pass'}
    else{const nx=slots[i+1]?slots[i+1].m:s.m;sp=H.pcSp(pc,nx<s.m);role='chr'}
    const label=role==='ct'?sp.label:IV[mod(pc-I.root)];
    const oct=Math.floor((s.m-sp.a)/12)-1;
    return {k:s.k,t:s.t,ev:s.ev,m:s.m,L:sp.L,a:sp.a,oct,d:oct*7+LETTERS.indexOf(sp.L),role,label,strong:s.strong,cs:s.cs,dur:1/sub};
  });
  shapeRhythm(out,sub,bpb,o,rng);
  return out;
}

/* ---------- rythme : phrases, cellules, liaisons ----------
   Chaque case reste une subdivision (croche) ; une note peut durer plusieurs cases :
   les cases suivantes sont marquées hold (prolongation) ou rest (silence).
   Notation des cellules : n = attaque, - = prolonge la case précédente (note ou silence), r = silence. */
const CELLS={
  phrase:{body:['nnnnnnnn','nnnnnnnn','n-nnnnnn','nnnnn-nn','n-nnn-nn','nnn-nnnn','n--nnnnn','nnnnnnn-'],
          end:['nnnnn---','n-nnn---','nnnnn-r-','nnn-n---','nnnnn--r']},
  sync:  {body:['nnnn-nnn','nn-nnnnn','nnnnnn-n','rnn-nnnn','n-nn-nnn','nnnnnnnn','nn-nn-nn'],
          end:['nnnnnn--','nnnnn---','nnnnn-r-','nn-nn---']},
  ballad:{body:['n-n-n-n-','n---n-n-','n--nn-n-','n-nnn-n-','n-n-nnn-','n--nn---'],
          end:['n-n-n---','n-------','n---r---','n--nn---']}
};
// mesures autres que 4/4 : cellules par temps
const BEATS={phrase:['nn','nn','nn','n-'],sync:['nn','nn','rn','n-'],ballad:['n-','n-','nn']};
function barCell(style,kind,bpb,rng){
  const pick=a=>a[Math.floor(rng()*a.length)];
  if(bpb===4)return pick(CELLS[style][kind]);
  let c='';for(let b=0;b<bpb;b++)c+=pick(BEATS[style]);
  if(kind==='end')c=c.slice(0,2*bpb-3)+'n--';
  return c;
}
function shapeRhythm(notes,sub,bpb,o,rng){
  const N=notes.length;if(!N)return;
  const style=sub===2&&CELLS[o.rhy]?o.rhy:null;
  const spb=sub*bpb,bars=Math.ceil(N/spb);
  const plen=bars>=8?4:2;
  if(style){
    let motif=null;
    for(let b=0;b<bars;b++){
      const inP=b%plen,last=inP===plen-1||b===bars-1;
      let cell;
      if(last)cell=barCell(style,'end',bpb,rng);
      else if(inP===2&&motif&&rng()<.75)cell=motif;      // reprise du motif rythmique : la phrase se tient
      else{cell=barCell(style,'body',bpb,rng);if(inP===0)motif=cell}
      if(inP===0&&b>0&&cell[0]==='n'&&cell[1]==='n'&&rng()<.4)cell='r'+cell.slice(1); // respiration en début de phrase
      for(let j=0;j<spb&&b*spb+j<N;j++){
        const n=notes[b*spb+j],c=cell[j]||'n';
        if(c==='r')n.rest=true;
        else if(c==='-'&&j>0){n.hold=true;if(notes[b*spb+j-1].rest)n.rest=true}
      }
      if(last)notes[Math.min(N,(b+1)*spb)-1].phraseEnd=true;
    }
    // une note tenue ne traverse pas un changement d'accord, sauf anticipation (attaque juste avant le temps)
    for(let i=1;i<N;i++){const n=notes[i];if(!n.hold||n.rest||!n.cs)continue;
      let s=i-1;while(s>0&&notes[s].hold)s--;
      if(!(s===i-1&&notes[s].k%sub!==0))n.hold=false}
    // attaque à contretemps tenue sur le temps : elle prend la note du temps (anticipation)
    for(let i=0;i<N-1;i++){const n=notes[i];if(n.rest||n.hold||n.k%sub===0||!notes[i+1].hold)continue;
      const t=notes[i+1];for(const f of ['m','L','a','oct','d','role','label','ev'])n[f]=t[f];n.ant=true}
  }
  // durées
  // durées : une attaque (note ou silence) dure jusqu'à la prochaine attaque
  for(let i=0;i<N;i++){const n=notes[i];if(n.hold)continue;let j=i+1;while(j<N&&notes[j].hold)j++;n.dur=(j-i)/sub}
  // liaisons d'archet : groupes de 2 ou 4 croches sur un temps, sans grand saut
  const snd=notes.filter(n=>!n.hold&&!n.rest);
  if(o.slur&&sub>=2){
    for(let i=0;i<snd.length-1;){
      const a=snd[i];
      if(a.dur!==1/sub||a.k%sub!==0){i++;continue}
      const r=rng(),want=r<.35?2:r<.6?(sub===3?3:4):0;
      if(!want){i++;continue}
      let g=[a];
      for(let j=i+1;j<snd.length&&g.length<want;j++){const b=snd[j],p=g[g.length-1];
        if(b.k!==p.k+1||b.dur!==1/sub||Math.floor(b.k/spb)!==Math.floor(a.k/spb)||Math.abs(b.m-p.m)>7)break;g.push(b)}
      if(g.length>=2){g[0].slS=true;g[g.length-1].slE=true;i+=g.length}else i++;
    }
  }
  // archet : tiré au début de chaque phrase (et après un silence)
  if(o.bow){let fresh=true;for(const n of notes){if(n.hold)continue;if(n.rest){fresh=true;continue}
    const ph=n.k%(spb*plen)===0;if(fresh||ph){n.bow='d';fresh=false}}}
}
return {generate};
})();
