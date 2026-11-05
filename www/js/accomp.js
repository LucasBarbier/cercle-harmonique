/* Accompagnement : boucle sur une partie de la grille, rythmes d'accords (pompe, piano, nappe) et lignes de basse
   (fondamentale, deux temps, walking). Calcul pur, sans audio : app.js joue le résultat. Expose window.AC */
(()=>{
const mod=(n,m=12)=>((n%m)+m)%m;
const EPS=1e-6;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

/* ---- boucle : region = {a,b}, indices d'accords inclus ---- */
const validRegion=(tl,r)=>!!r&&Number.isInteger(r.a)&&Number.isInteger(r.b)&&r.a>=0&&r.b<tl.length&&r.a<=r.b;
function bounds(tl,total,region){
  if(validRegion(tl,region))return {start:tl[region.a].start,end:tl[region.b].start+tl[region.b].beats};
  return {start:0,end:total};
}
function nextIdx(i,N,loop,region){if(!N)return -1;if(region&&i===region.b)return region.a;if(i>=N-1)return loop?0:-1;return i+1}
function prevIdx(i,N,loop,region){if(!N)return -1;if(region&&i===region.a)return region.b;if(i<=0)return loop?N-1:-1;return i-1}

/* temps entiers couverts par un accord, précédés de son début s'il tombe entre deux temps */
function beatsOf(ev){const out=[ev.start];for(let b=Math.ceil(ev.start+EPS);b<ev.start+ev.beats-EPS;b++)out.push(b);return out}

/* ---- accords : liste de coups {t, dur, ev, kind, acc} en temps ---- */
function compLine(tl,bpb,style){
  const out=[];
  tl.forEach((ev,i)=>{
    const end=ev.start+ev.beats;
    if(style==='guitar'){
      // pompe : temps 1 et 3 « basse » (cordes graves), temps 2 et 4 étouffés et accentués ; en 3/4 : 1 puis deux étouffés
      beatsOf(ev).forEach(t=>{
        const r=Math.round(t),onBeat=Math.abs(t-r)<EPS,bib=mod(r,bpb);
        const low=onBeat&&(bpb%2===0?bib%2===0:bib===0);
        out.push({t,ev:i,kind:low?'low':'chop',dur:Math.min(low?.5:.22,end-t),acc:low?.8:1});
      });
    }else if(style==='piano'){
      // un coup par mesure de l'accord ; sur une mesure entière en 4/4, rythme « Charleston » (1, puis le « et » de 2)
      let t=ev.start;
      while(t<end-EPS){
        const barEnd=(Math.floor(t/bpb+EPS)+1)*bpb,segEnd=Math.min(end,barEnd),len=segEnd-t;
        if(bpb===4&&len>=4-EPS){out.push({t,ev:i,kind:'hit',dur:1.2,acc:1});out.push({t:t+1.5,ev:i,kind:'hit',dur:2.2,acc:.7})}
        else out.push({t,ev:i,kind:'hit',dur:Math.max(.5,len*.9),acc:1});
        t=segEnd;
      }
    }else out.push({t:ev.start,ev:i,kind:'pad',dur:ev.beats,acc:1});
  });
  return out;
}

/* ---- basse : liste de notes {t, dur, m, ev} ---- */
const LO=28,HI=50; // Mi1 – Ré3 (son réel)
function near(pc,ref,lo=LO,hi=HI){let best=null;for(let m=lo;m<=hi;m++)if(mod(m)===pc&&(best==null||Math.abs(m-ref)<Math.abs(best-ref)))best=m;return best}
const bassPc=c=>(c.bass||c.root).pc;
/* note d'approche de la cible T : chromatique (par en dessous ou au-dessus) ou quinte de la cible */
function approach(T,cur,rnd,lo,hi){
  const ok=m=>m!=null&&m>=lo&&m<=hi&&m!==cur;
  const fifth=[T+7,T-5].filter(ok).sort((a,b)=>Math.abs(a-cur)-Math.abs(b-cur))[0];
  const same=cur<T?T-1:T+1,other=cur<T?T+1:T-1,r=rnd();
  const order=r<.6?[same,other,fifth]:r<.8?[other,same,fifth]:[fifth,same,other];
  for(const m of order)if(ok(m))return m;
  return T;
}
/* pas vers la cible, sur une note de l'accord (préférée) ou de sa gamme */
function step(cur,T,pool,chordPcs,rnd,lo,hi){
  let dir=T>cur?1:T<cur?-1:(rnd()<.5?1:-1);
  for(let pass=0;pass<2;pass++,dir=-dir){
    const cand=[];
    for(let d=1;d<=5;d++){const m=cur+dir*d;if(m<lo||m>hi||!pool.has(mod(m)))continue;cand.push({m,w:(chordPcs.has(mod(m))?3:1)/d})}
    if(cand.length){let x=rnd()*cand.reduce((s,c)=>s+c.w,0);for(const c of cand){x-=c.w;if(x<=0)return c.m}return cand[cand.length-1].m}
  }
  return Math.max(lo,Math.min(hi,cur+dir*2));
}
function bassLine(tl,total,bpb,{style='walk',loop=true,region=null,lo=LO,hi=HI,startFrom}={},seed=1){
  if(!style||style==='none'||!tl.length)return [];
  const rnd=mulberry32((seed>>>0)||1),out=[];let prev=startFrom!=null?startFrom:36;
  const push=(t,m,dur,i)=>{out.push({t,m,dur,ev:i});prev=m};
  const half=bpb%2===0?bpb/2:bpb;
  tl.forEach((ev,i)=>{
    const c=ev.chord,end=ev.start+ev.beats,root=near(bassPc(c),prev,lo,hi);
    if(style==='root'){push(ev.start,root,ev.beats,i);return}
    if(style==='two'){
      // fondamentale sur 1, quinte sur 3 (à chaque demi-mesure) ; en 3/4, une note par mesure
      const ts=[ev.start];
      for(let t=(Math.floor(ev.start/half+EPS)+1)*half;t<end-EPS;t+=half)ts.push(t);
      ts.forEach((t,k)=>{const nx=k+1<ts.length?ts[k+1]:end;push(t,k%2===0?root:near(mod(c.root.pc+7),root,lo,hi),nx-t,i)});
      return;
    }
    // walking : une noire par temps ; fondamentale au début, approche de l'accord suivant à la fin
    const ts=beatsOf(ev),n=ts.length,j=nextIdx(i,tl.length,loop,region),nxt=j>=0?tl[j].chord:c;
    const chordPcs=new Set(c.core.map(t=>t.pc)),pool=new Set(chordPcs);
    if(c.scale)c.scale.notes.forEach(s=>pool.add(s.pc));
    ts.forEach((t,k)=>{
      const dur=(k+1<n?ts[k+1]:end)-t;let m;
      if(k===0)m=root;
      else{const T=near(bassPc(nxt),prev,lo,hi);m=k===n-1?approach(T,prev,rnd,lo,hi):step(prev,T,pool,chordPcs,rnd,lo,hi)}
      push(t,m,dur,i);
    });
  });
  return out;
}

function arrange(tl,total,bpb,{comp='pad',bass='root',loop=true,region=null,startFrom}={},seed=1){
  return {chords:compLine(tl,bpb,comp),bass:bassLine(tl,total,bpb,{style:bass,loop,region,startFrom},seed)};
}

window.AC={bounds,nextIdx,prevIdx,compLine,bassLine,arrange,near,BASS_RANGE:[LO,HI]};
})();
