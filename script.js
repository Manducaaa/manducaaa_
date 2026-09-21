const out=document.querySelector("#output"),form=document.querySelector("#nameForm"),input=document.querySelector("#nameInput"),actions=document.querySelector("#actions"),crt=document.querySelector("#crt"),snd=document.querySelector("#soundToggle");
const sleep=ms=>new Promise(r=>setTimeout(r,ms)); let sound=false,audio=null,start=Date.now(),name="",noAttempts=0;
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function beep(freq=660,d=.035){if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();let o=audio.createOscillator(),g=audio.createGain();o.type="square";o.frequency.value=freq;g.gain.value=.025;o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+d)}catch{}}
snd.onclick=()=>{sound=!sound;snd.textContent=`SND:${sound?"ON":"OFF"}`;beep()};
function add(text="",cls=""){let d=document.createElement("div");d.className=`line ${cls}`;d.innerHTML=esc(text);out.appendChild(d);scroll();return d}
function raw(html,cls=""){let d=document.createElement("div");d.className=`line ${cls}`;d.innerHTML=html;out.appendChild(d);scroll();return d}
function scroll(){requestAnimationFrame(()=>document.querySelector(".terminal").scrollTop=999999)}
async function type(text,cls="",speed=14){let d=add("",cls);for(const c of text){d.textContent+=c;if(c!==" ")beep(700+Math.random()*100,0.012);await sleep(speed)}return d}
async function lines(arr,delay=180){for(const x of arr){if(Array.isArray(x)) await type(x[0],x[1]||"",x[2]??10);else await type(x,"",10);await sleep(delay)}}
async function boot(){
 start=Date.now(); let old=localStorage.getItem("mds86_name"),done=localStorage.getItem("mds86_done");
 await lines(["MANDUCA SYSTEMS CORPORATION","MDS/86 COMPATIBLE SYSTEM","MEMORY TEST: 640K ........ OK","",["ROM BIOS REV. 2.17","dim"],["COPYRIGHT (C) 1987-1994","dim"],"","INITIALIZING I/O........... OK","LOADING CORE............... OK","CHECKING TERMINAL.......... OK","REMOTE SESSION............. ESTABLISHED","","> running IDENT.EXE"],110);
 if(old&&done){name=old;await sleep(650);await lines(["","BOOT OK.","","...","",["WAIT.","amber"],"",["SUBJECT RECORD EXISTS.","red"],"",`Welcome back, ${name}.`,"Você não aprendeu da primeira vez?","","> restarting restricted session..."],260);await sleep(900);return consent();}
 await sleep(500);await lines(["","MDS IDENTITY TERMINAL","----------------------------","","Operador não identificado.",""],100);form.classList.remove("hidden");input.focus();
}
form.addEventListener("submit",async e=>{e.preventDefault();let v=input.value.trim().replace(/\s+/g," ");if(!v)return;name=v.slice(0,24).toUpperCase();localStorage.setItem("mds86_name",name);form.classList.add("hidden");await identify()});
async function identify(){
 await lines([`INPUT RECEIVED: ${name}`,"","SEARCHING LOCAL INDEX..."],130);
 for(const [bar,p] of [["████░░░░░░░░░░░░",24],["█████████░░░░░░░",57],["████████████████",100]]){add(`${bar}  ${p}%`,"progress");await sleep(500)}
 await lines(["","MATCHING RECORD............. YES","VERIFYING SUBJECT........... OK"],150);await sleep(600);
 crt.classList.add("red-flash","glitch");beep(110,0.35);await lines([["","red"],["!!! TARGET FOUND !!!","red big"],["","red"],[`SUBJECT: ${name}`,"red"],["STATUS: ACTIVE","red"],["SESSION: OPEN","red"]],90);await sleep(1300);crt.classList.remove("red-flash","glitch");crt.classList.add("blackout");await sleep(1800);out.innerHTML="";crt.classList.remove("blackout");consent();
}
async function consent(){
 await type(`${name}, quer continuar?`,"big center",45);actions.classList.remove("hidden");actions.innerHTML='<button class="terminal-btn" id="yes">[ SIM ]</button><button class="terminal-btn no-btn" id="no">[ NÃO ]</button>';
 let yes=document.querySelector("#yes"),no=document.querySelector("#no");placeNo(no);
 const flee=e=>{e.preventDefault();noAttempts++;placeNo(no);beep(180,.04);if(noAttempts===4)raw('<span class="red">NEGATIVE RESPONSE FAILURE.</span><br>Você não tem muita escolha.');};
 ["pointerenter","pointerdown","touchstart"].forEach(ev=>no.addEventListener(ev,flee,{passive:false}));yes.onclick=analysis;
}
function placeNo(b){let box=actions.getBoundingClientRect(),w=b.offsetWidth||120,h=b.offsetHeight||48,pad=8;b.style.left=Math.max(pad,Math.random()*Math.max(pad,box.width-w-pad))+"px";b.style.top=Math.max(pad,Math.random()*Math.max(pad,box.height-h-pad))+"px"}
async function analysis(){
 actions.classList.add("hidden");out.innerHTML="";await lines(["CONSENT FLAG............... 1","RESTRICTED MODE............ ENABLED","","DO NOT DISCONNECT TERMINAL.","","Starting subject analysis..."],150);
 await sleep(600);await lines(["READING BEHAVIOR...............","CHECKING DECISION HISTORY......","ANALYZING CURIOSITY............","SEARCHING BAD DECISIONS........","ESTIMATING THREAT LEVEL........"],300);
 await sleep(500);crt.classList.add("red-flash","glitch");await lines([["","red"],["WARNING 0x17","red"],["ANOMALOUS BEHAVIOR DETECTED","red"]],80);await sleep(800);crt.classList.remove("red-flash","glitch");
 raw(`<pre>
+--------------------------------+
| SUBJECT ANALYSIS UNIT          |
|                                |
|          .-----.               |
|       .-'   |   '-.            |
|      /      |      \\           |
|     |-------+-------|           |
|      \\      |      /           |
|       '-.   |   .-'            |
|          '-----'               |
|                                |
| SIGNAL: █████████████ 97%      |
+--------------------------------+

SUBJECT: ${esc(name)}
CLASSIFICATION:
<span class="red">SUSPICIOUSLY CURIOUS</span></pre>`);await sleep(2200);question();
}
async function question(){
 await lines(["","FINAL VERIFICATION REQUIRED.","","Por que você abriu este link?"],100);actions.classList.remove("hidden");actions.innerHTML='<div class="choice-list"><button class="terminal-btn">[ A ] Curiosidade</button><button class="terminal-btn">[ B ] Me mandaram</button><button class="terminal-btn">[ C ] Não sei</button><button class="terminal-btn">[ D ] Eu sabia o que estava fazendo</button></div>';
 [...actions.querySelectorAll("button")].forEach((b,i)=>b.onclick=()=>reject(i));
}
async function reject(i){
 actions.classList.add("hidden");let ans=["Curiosidade","Me mandaram","Não sei","Eu sabia o que estava fazendo"][i];await lines(["",`> "${ans}"`,"","PROCESSING...","COMPARING RESPONSE...","CHECKING..."],180);await sleep(700);
 await lines([["","red"],["> RESPONSE REJECTED.","red"],"","Motivo:","Você viu um link suspeito","e clicou mesmo assim."],160);if(i===3)await lines(["","> No, you didn't."],250);await sleep(1300);finalProcedure();
}
async function finalProcedure(){
 out.innerHTML="";await lines(["EXECUTING FINAL PROCEDURE",""],120);
 for(const [bar,p,t] of [["██░░░░░░░░░░░░░░░░",12,400],["██████░░░░░░░░░░░░",31,500],["███████████░░░░░░░",58,550],["████████████████░░",87,650],["██████████████████",99,3200]]){add(`[${bar}] ${p}%`,"progress");beep(420+p*3,.04);await sleep(t)}
 crt.classList.add("glitch","red-flash");await lines([["FATAL ERROR","red big"],["CODE: 0x00000BURRO","red"],"","SYSTEM COULD NOT COMPLETE ANALYSIS.","","REASON:","INTELLIGENCE REQUIREMENTS NOT MET."],110);await sleep(1800);crt.classList.remove("glitch","red-flash");crt.classList.add("blackout");await sleep(2200);out.innerHTML="";crt.classList.remove("blackout");ending();
}
function fmt(ms){let s=Math.floor(ms/1000),m=Math.floor(s/60);return `${String(m).padStart(2,"0")} minuto${m===1?"":"s"} e ${String(s%60).padStart(2,"0")} segundos`}
async function ending(){
 let elapsed=fmt(Date.now()-start);await lines([[`PARABÉNS, ${name}.`,"big"],"",`Você acabou de perder ${elapsed}`,"da sua vida entrando","em um link aleatório.","","Nenhuma informação secreta foi encontrada.","Nenhum \"scanner\" era real.","","Mas uma coisa foi confirmada:",["CURIOSIDADE: 100%","amber"],"",["ACHIEVEMENT UNLOCKED","amber"],["[ THE CURIOUS ONE ]","amber"],"","\"clicou onde claramente"," não deveria clicar\"","",["SESSION TERMINATED.","dim"],["THANK YOU FOR PARTICIPATING.","dim"],"",["MDS/86 SYSTEM","dim"],["made by manduca.","dim"]],130);
 localStorage.setItem("mds86_done","1");await sleep(3500);await type("> wait...","dim",90);await sleep(900);actions.classList.remove("hidden");actions.innerHTML='<button class="terminal-btn" id="egg">[ NÃO CLIQUE AQUI ]</button>';document.querySelector("#egg").onclick=easter;
}
async function easter(){
 actions.classList.add("hidden");await sleep(400);await lines(["","> seriously?","",`${name}...`,["VOCÊ CLICOU DE NOVO.","red"],"","Curiosity test: FAILED SUCCESSFULLY.","","MDS/86 will remember this locally.","","Agora pode fechar a página."],180);
}
boot();
