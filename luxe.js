(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(pointer:fine)').matches;
const P={arrow:'M7 17 17 7M8 7h9v9',down:'M12 5v14M6 13l6 6 6-6',heart:'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',check:'M5 12.5l4.5 4.5L19 7.5',cal:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',mtn:'M3 19l6-11 4 7 3-4 5 8z',users:'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19c0-3 3-5 6-5s6 2 6 5M17 11a2.5 2.5 0 1 0 0-5M17 14c2.5 0 4 1.8 4 4',compass:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z',pin:'M12 21s6-5.5 6-11a6 6 0 0 0-12 0c0 5.5 6 11 6 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',spark:'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z'};
const ic=(k,c='')=>`<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[k]}"/></svg>`;
const star=`<svg class="ic fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>`.repeat(5);
// SVG icons replace text glyphs
$$('.btn,.text-link,.arrow-link,.help-card a,.gallery-button').forEach(e=>{e.innerHTML=e.innerHTML.replace(/<span>↗<\/span>|↗/g,ic('arrow')).replace(/<span>↓<\/span>|↓/g,ic('down'))});
$$('.rating-line>span,.proof-rating>span').forEach(e=>e.innerHTML=e.innerHTML.replace('★★★★★',star));
$$('.save-trip').forEach(b=>b.innerHTML=ic('heart'));
$$('.compare-item b').forEach(b=>b.innerHTML=ic('check'));
$$('.principle-icon').forEach((e,i)=>e.innerHTML=ic(['compass','users','pin'][i]));
$$('.search-field').forEach((l,i)=>l.insertAdjacentHTML('afterbegin',ic(['mtn','cal','users'][i])));
// marquee + counters
const words=['Dolomites','Seceda Ridge','Tre Cime','Alta Badia','Val Gardena','Alpe di Siusi'];
const mq=`<div class="marquee" aria-hidden="true"><div class="mq">${[0,1].map(()=>words.map(w=>`<span>${w}${ic('spark')}</span>`).join('')).join('')}</div></div><div class="stats wrap">${[['4.9','Group rating',1],['76','Verified reviews',0],['12','Max guests',0],['5','Guided days',0]].map(s=>`<div class="stat reveal"><b data-n="${s[0]}" data-d="${s[2]}">0</b><span>${s[1].toUpperCase()}</span></div>`).join('')}</div>`;
$('.quick-search').insertAdjacentHTML('afterend',mq);
// split headings into masked lines
$$('h1,h2').forEach(h=>{if(!h.innerHTML.includes('<br>'))return;h.innerHTML=h.innerHTML.split('<br>').map((t,i)=>`<span class="ln" style="--l:${i}"><span>${t}</span></span>`).join('');});
// elevation profiles on route
const svgDefs=`<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="pg"><stop offset="0" stop-color="#2ef2c4"/><stop offset="1" stop-color="#ff6a3d"/></linearGradient></defs></svg>`;document.body.insertAdjacentHTML('afterbegin',svgDefs);
const prof=['M0 40 Q25 38 40 30 T80 24 T150 20','M0 42 L25 30 L45 34 L70 10 L100 22 L125 6 L150 14','M0 40 Q40 30 60 30 T110 22 T150 24','M0 44 L30 28 L55 32 L85 8 L110 18 L130 4 L150 12','M0 30 Q35 36 70 28 T150 36'];
$$('.day-row').forEach((r,i)=>r.insertAdjacentHTML('beforeend',`<svg class="prof" viewBox="0 0 150 46" aria-hidden="true"><path d="${prof[i%5]}"/></svg>`));
// reveal stagger + counters + hero in
$$('.terrain-card,.departure-card,.principles article,.day-row,.stat').forEach((e,i)=>e.style.setProperty('--i',i%3));
const cnt=el=>{const n=+el.dataset.n,d=+el.dataset.d,t=performance.now();const f=now=>{const p=Math.min(1,(now-t)/1600),v=n*(1-Math.pow(1-p,4));el.textContent=v.toFixed(d);p<1&&requestAnimationFrame(f)};RM?el.textContent=n.toFixed(d):requestAnimationFrame(f)};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');$$('[data-n]',e.target).forEach(cnt);io.unobserve(e.target)}}),{threshold:.15});
$$('.stat,.section-heading,.route-intro,.checkout-heading,.detail-top,.day-row').forEach(e=>io.observe(e));
addEventListener('load',()=>setTimeout(()=>$('.hero').classList.add('on'),150));setTimeout(()=>$('.hero').classList.add('on'),900);
// scroll progress + smart header
const bar=document.createElement('div');bar.id='progress';document.body.append(bar);const hd=$('.site-header');let ly=0;
addEventListener('scroll',()=>{const y=scrollY;bar.style.transform=`scaleX(${y/(document.documentElement.scrollHeight-innerHeight||1)})`;hd.classList.toggle('hide',y>ly&&y>400);ly=y},{passive:true});
// Use the native system cursor for accurate, low-latency pointer feedback.
// WebGL alpine point-cloud hero (Three.js r128)
(()=>{if(!window.THREE||RM)return;const host=$('.hero'),cv=document.createElement('canvas');cv.id='gl';host.prepend(cv);let R;try{R=new THREE.WebGLRenderer({canvas:cv,alpha:true});}catch(e){cv.remove();return}
 R.setPixelRatio(Math.min(devicePixelRatio,1.5));const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(58,1,.1,300),N=innerWidth<800?170:300,pos=new Float32Array(N*N*3);
 for(let i=0;i<N;i++)for(let j=0;j<N;j++){const k=(i*N+j)*3;pos[k]=(i/N-.5)*150;pos[k+1]=0;pos[k+2]=-110+j/N*125}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));
 const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uT:{value:0}},
 vertexShader:`uniform float uT;varying float vH,vD;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}float rf(vec2 p){float a=0.,b=.5;for(int i=0;i<4;i++){a+=b*(1.-abs(n(p)*2.-1.));p*=2.03;b*=.5;}return a;}void main(){vec3 p=position;float e=rf(vec2(p.x*.05,p.z*.05+uT*.03));p.y=pow(e,2.3)*30.*smoothstep(4.,26.,abs(p.x))-3.;vH=p.y;vec4 mv=modelViewMatrix*vec4(p,1.);vD=-mv.z;gl_PointSize=clamp(120./vD,1.2,4.5);gl_Position=projectionMatrix*mv;}`,
 fragmentShader:`varying float vH,vD;void main(){vec2 c=gl_PointCoord-.5;if(dot(c,c)>.25)discard;float t=clamp((vH+3.)/18.,0.,1.);vec3 col=mix(vec3(.18,.95,.77),vec3(.55,.36,1.),smoothstep(0.,.35,t));col=mix(col,vec3(1.,.42,.24),smoothstep(.35,.7,t));col=mix(col,vec3(1.,.92,.7),smoothstep(.8,1.,t));gl_FragColor=vec4(col,smoothstep(140.,25.,vD)*(.3+t*.8));}`});
 S.add(new THREE.Points(g,m));let mx=0,my=0,vis=true;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
 new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(host);
 const rs=()=>{R.setSize(host.clientWidth,host.clientHeight,false);C.aspect=host.clientWidth/host.clientHeight;C.updateProjectionMatrix()};rs();addEventListener('resize',rs);
 (function loop(t){requestAnimationFrame(loop);if(!vis)return;m.uniforms.uT.value=t*.001;C.position.set(mx*8,9-my*3,18);C.lookAt(mx*4,5,-30);R.render(S,C)})(0)})();
})();
