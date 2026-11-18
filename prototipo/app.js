const HOJE=new Date(2026,10,18,12);
const MESES=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const brl=x=>'R$ '+(+x||0).toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const pd=s=>new Date(s+'T12:00:00');
const fmt=s=>{const d=pd(s);return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')};
const dias=s=>Math.round((pd(s)-HOJE)/86400000);
const ST={fila:['Em fila','s-fila'],prod:['Em produção','s-prod'],pronto:['Pronto','s-pronto'],ent:['Entregue','s-ent'],atr:['Atrasado','s-atr']};
const atrasado=p=>p.s!=='ent'&&p.s!=='pronto'&&dias(p.d)<0;
const stOf=p=>atrasado(p)?'atr':p.s;
const BASE=()=>db.cfg.base||'custo';
const lucroP=p=>p.v-(p.taxas||0)-p.custo;
const margP=p=>BASE()==='custo'?(p.custo?lucroP(p)/p.custo*100:0):(p.v?lucroP(p)/p.v*100:0);
const lote=id=>db.lotes.find(l=>l.id===id);
let rota=(location.hash.slice(1)||'login'),aba={ped:'lista',cat:'fil'},calM=new Date(2026,10,1),ui={menu:null,drawer:null,modal:null,q:'',ord:false},toastT;
const NAV=[['dashboard','Dashboard','M3 12l9-9 9 9M5 10v10h14V10'],['pedidos','Pedidos','M4 6h16M4 12h16M4 18h10'],['financeiro','Financeiro','M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'],['catalogo','Catálogo','M4 4h16v6H4zM4 14h7v6H4zM15 14h5v6h-5z'],['config','Configurações','M12 8a4 4 0 100 8 4 4 0 000-8zM3 12h3M18 12h3M12 3v3M12 18v3']];
const ico=p=>`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${p}"/></svg>`;
const LOGO=(s=28)=>`<img src="logo.svg" width="${s}" height="${s}" alt="">`;

function go(r,extra){ui.menu=null;ui.drawer=null;ui.modal=null;rota=r;location.hash=r;enter();render()}
function enter(){const a=document.getElementById('app');a.classList.remove('enter');void a.offsetWidth;a.classList.add('enter');clearTimeout(window._t);window._t=setTimeout(()=>a.classList.remove('enter'),1500)}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2400)}
const pedAtivos=()=>db.pedidos.filter(p=>p.s!=='ent');
const alertas=()=>{const a=[];db.pedidos.filter(atrasado).forEach(p=>a.push(['atr',`${p.n} · ${p.p} está ${-dias(p.d)} dia(s) atrasado`,'pedidos']));db.lotes.filter(l=>l.g<db.cfg.minimo).forEach(l=>a.push(['est',`Lote ${l.id} (${l.cor}) tem só ${l.g} g`,'catalogo']));return a};
function fin(){
  const rec=db.pedidos.reduce((a,p)=>a+p.pago,0)+db.receitas.reduce((a,r)=>a+r.v,0);
  const cp=db.pedidos.filter(p=>p.s!=='fila').reduce((a,p)=>a+p.custo,0);
  const pf=db.falhas.reduce((a,f)=>a+f.g*lote(f.lote).kg/1000,0);
  const od=db.despesas.reduce((a,d)=>a+d.v,0);const tx=db.pedidos.filter(p=>p.s!=='fila').reduce((a,p)=>a+(p.taxas||0),0);
  const rcb=db.pedidos.reduce((a,p)=>a+(p.v-p.pago),0);
  return{rec,cp,pf,od,tx,rcb,lucro:rec-cp-pf-od-tx,tot:cp+pf+od+tx};
}

/* ---------- casca com HUD ---------- */
function shell(body){
  const al=alertas(),f=fin();
  return `<div class="shell"><aside><div class="brand">${LOGO(30)}<span>Layerly</span></div><nav>${NAV.map(([r,l,p])=>`<a class="${rota===r||(r==='pedidos'&&rota==='novo')?'on':''}" onclick="go('${r}')">${ico(p)}${l}</a>`).join('')}</nav>
  <div class="plan"><b>Plano gratuito</b><span>${db.pedidos.length} de 30 pedidos</span><div class="bar"><i style="width:${db.pedidos.length/30*100}%"></i></div></div>
  <div class="user"><div class="av">${db.cfg.negocio[0]}</div><div><b>${db.cfg.negocio}</b><br>usuario@email.com</div></div></aside>
  <div class="col"><header class="hud">
   <div class="srch">${ico('M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5')}<input placeholder="Buscar pedido, produto ou lote…" value="${ui.q}" onchange="ui.q=this.value;aba.ped='lista';go('pedidos')"></div>
   <div class="chips"><span class="chip"><i>📅</i>${HOJE.getDate()} ${MESES[HOJE.getMonth()].slice(0,3).toLowerCase()}</span><span class="chip"><i>🖨️</i>${pedAtivos().length} ativos</span><span class="chip ${db.pedidos.filter(atrasado).length?'red':''}"><i>⏰</i>${db.pedidos.filter(atrasado).length} atrasados</span><span class="chip g"><i>💰</i>Lucro ${brl(f.lucro)}</span></div>
   <div class="hr"><div class="dd"><button class="ibtn" onclick="tg('bell')">🔔${al.length?`<em>${al.length}</em>`:''}</button>${ui.menu==='bell'?`<div class="menu"><div class="lab" style="padding:8px 12px">Alertas</div>${al.length?al.map(a=>`<div class="mi" onclick="go('${a[2]}')"><span class="dot ${a[0]}"></span>${a[1]}</div>`).join(''):'<div class="mi">Tudo em dia ✓</div>'}</div>`:''}</div>
   <div class="dd"><button class="btn" onclick="tg('add')">+ Novo ▾</button>${ui.menu==='add'?`<div class="menu r"><div class="mi" onclick="novoPed()">🧾 Pedido</div><div class="mi" onclick="mod('lote')">🧵 Lote de filamento</div><div class="mi" onclick="mod('emb')">📦 Embalagem</div><div class="mi" onclick="mod('outro')">🔧 Outro material</div><div class="mi" onclick="mod('despesa')">💸 Despesa ou receita</div></div>`:''}</div></div>
  </header><main>${body}</main></div></div>${ui.drawer!==null?drawer():''}${ui.modal?modal():''}`;
}
function tg(m){ui.menu=ui.menu===m?null:m;render()}
function novoPed(preset){setPed(preset);go('novo')}
function setPed(preset){Object.assign(ped,{lote:db.lotes[0].id,g:150,pg:10,h:5,emb:0,marg:db.cfg.margem,final:'',pag:'avista',ent:50,prazo:'2026-11-25',st:'fila',canal:'direto',nome:'',desc:0,frete:0,imp:(db.impressoras.find(i=>i.st==='livre')||db.impressoras[0]||{}).n||'',...(preset||{})})}

/* ---------- Login ---------- */
function login(){return `<div class="login"><div class="box"><div class="lg">${LOGO(56)}<h1>Layerly</h1></div><p class="sub" style="margin-bottom:26px">Seu estoque, custos e prazos de impressão 3D em um só lugar</p><label>E-mail</label><input placeholder="exemplo@email.com"><div style="height:14px"></div><label>Senha</label><input type="password" placeholder="••••••••"><div style="height:20px"></div><button class="btn" style="width:100%;height:46px" onclick="go('dashboard')">Entrar</button><p style="text-align:center"><span class="link">Criar conta</span> · <span class="link">Esqueceu a senha?</span></p></div></div>`}

/* ---------- Dashboard ---------- */
function dashboard(){
  const f=fin(),atr=db.pedidos.filter(atrasado).length,baixo=db.lotes.filter(l=>l.g<db.cfg.minimo).length;
  const prox=[...pedAtivos()].sort((a,b)=>a.d.localeCompare(b.d)).slice(0,5);
  const bars=[['Jun',2310],['Jul',2780],['Ago',3350],['Set',3120],['Out',3890],['Nov',Math.max(0,f.lucro)]],mx=Math.max(...bars.map(b=>b[1]),1);
  return shell(`<div class="top"><div><h2>Olá, ${db.cfg.negocio} 👋</h2><p class="sub">Terça, 18 de novembro · veja como está o seu negócio</p></div><button class="btn" onclick="novoPed()">+ Novo pedido</button></div>
  <div class="grid5" style="margin-bottom:20px">
   <div class="card k"><div class="lab">Lucro do mês</div><div class="big">${brl(f.lucro)}</div><div class="sub">receita ${brl(f.rec)}</div></div>
   <div class="card k"><div class="lab">A receber</div><div class="big">${brl(f.rcb)}</div><div class="sub">pedidos com saldo</div></div>
   <div class="card k"><div class="lab">Pedidos atrasados<span class="new">NOVO</span></div><div class="big" style="color:var(--red)">${atr}</div><div class="sub">prazo vencido, automático</div></div>
   <div class="card k"><div class="lab">Estoque baixo<span class="new">NOVO</span></div><div class="big">${baixo}</div><div class="sub">abaixo de ${db.cfg.minimo} g</div></div>
   <div class="card k"><div class="lab">Perdas por falha<span class="new">NOVO</span></div><div class="big">${brl(f.pf)}</div><div class="sub">${db.falhas.length} falha(s)</div></div></div>
  <div class="cols"><div class="card" style="flex:1.3"><div class="lab" style="margin-bottom:14px">Lucro por mês</div><div class="chart">${bars.map(([m,v])=>`<div>${brl(v).replace(',00','')}<b style="height:${v/mx*150}px"></b>${m}</div>`).join('')}</div></div>
  <div class="card" style="flex:1"><div class="lab" style="margin-bottom:10px">Impressoras<span class="new">NOVO</span></div>${db.impressoras.map(i=>`<div class="li"><span class="dot ${i.st==='imp'?'est':i.st==='livre'?'ok':'atr'}"></span><b>${i.n}</b><span>${i.st==='imp'?`${i.ped} · ${i.h} h`:i.st==='livre'?'livre':'manutenção'}</span></div>`).join('')}</div><div class="card" style="flex:1"><div class="lab" style="margin-bottom:10px">Próximas entregas</div>${prox.map(p=>`<div class="li" onclick="ui.drawer='${p.n}';render()"><span class="pill ${ST[stOf(p)][1]}">${fmt(p.d)}</span><b>${p.p}</b><span class="sub">${brl(p.v)}</span></div>`).join('')}</div></div>`);
}

/* ---------- Pedidos: lista / quadro / calendário ---------- */
function pedidosPg(){
  const tabs=[['lista','Lista'],['quadro','Quadro'],['cal','Calendário']];
  return shell(`<div class="top"><div><h2>Pedidos</h2><p class="sub">${db.pedidos.length} pedidos · ${pedAtivos().length} em andamento</p></div><div class="row"><div class="tabs">${tabs.map(([k,l])=>`<button class="${aba.ped===k?'on':''}" onclick="aba.ped='${k}';render()">${l}</button>`).join('')}</div><button class="btn" onclick="novoPed()">+ Novo pedido</button></div></div>${aba.ped==='lista'?lista():aba.ped==='quadro'?quadro():cal()}`);
}
function lista(){
  let l=[...db.pedidos];const q=ui.q.toLowerCase();if(q)l=l.filter(p=>(p.n+p.p+p.lote).toLowerCase().includes(q));
  l.sort((a,b)=>ui.ord?a.d.localeCompare(b.d):b.n.localeCompare(a.n));
  return `<div class="row" style="margin-bottom:12px"><button class="btn o" onclick="ui.ord=!ui.ord;render()">${ui.ord?'✓ ':''}Ordenar por prazo</button>${q?`<span class="pill s-prod">busca: ${q} <b style="cursor:pointer" onclick="ui.q='';render()">×</b></span>`:''}</div>
  <div class="card" style="padding:0"><table><tr><th>Nº</th><th>Produto</th><th>Status</th><th>Prazo<span class="new">NOVO</span></th><th>Valor</th><th>Pago</th><th></th></tr>${l.map(p=>{const s=stOf(p);return `<tr onclick="ui.drawer='${p.n}';render()" style="cursor:pointer"><td>${p.n}</td><td><b>${p.p}</b></td><td><span class="pill ${ST[s][1]}">${ST[s][0]}</span></td><td style="${s==='atr'?'color:var(--red);font-weight:700':''}">${fmt(p.d)}${s==='atr'?` · ${-dias(p.d)}d de atraso`:''}</td><td>${brl(p.v)}</td><td>${brl(p.pago)}</td><td style="text-align:right" class="link">abrir</td></tr>`}).join('')}</table></div>`;
}
function quadro(){
  const cols=[['fila','Em fila'],['prod','Em produção'],['pronto','Pronto'],['ent','Entregue']];
  return `<div class="kan">${cols.map(([k,t])=>{const it=db.pedidos.filter(p=>p.s===k);return `<div class="kc" ondragover="event.preventDefault();this.classList.add('over')" ondragleave="this.classList.remove('over')" ondrop="soltar(event,'${k}')"><div class="kh"><b>${t}</b><span class="cnt">${it.length}</span></div>${it.map(p=>{const l=lote(p.lote);return `<div class="kcard ${atrasado(p)?'late':''}" draggable="true" ondragstart="event.dataTransfer.setData('t','${p.n}')" onclick="ui.drawer='${p.n}';render()"><div class="row" style="justify-content:space-between"><span class="sub" style="font-family:monospace">${p.n}</span><span class="sw2" style="background:${l?l.hex:'#ccc'}"></span></div>${p.foto?`<img class="th" src="${p.foto}">`:''}<b>${p.p}</b>${p.canal&&p.canal!=='direto'?`<span class="pill s-prod" style="font-size:10px;margin-top:6px">${db.cfg.canais[p.canal].n}</span>`:''}<div class="row" style="justify-content:space-between;margin-top:8px"><span class="pill ${atrasado(p)?'s-atr':'s-fila'}">${atrasado(p)?'⏰ ':'📅 '}${fmt(p.d)}</span><b>${brl(p.v)}</b></div></div>`}).join('')}<button class="add" onclick="novoPed({st:'${k}'})">+ Adicionar pedido</button></div>`}).join('')}</div><p class="sub" style="margin-top:12px">Arraste os cartões entre as colunas para mudar o status.</p>`;
}
function soltar(e,k){e.preventDefault();const n=e.dataTransfer.getData('t'),p=db.pedidos.find(x=>x.n===n);if(p){p.s=k;if(k==='ent')p.pago=p.v;save();toast(`${n} → ${ST[k][0]}`)}render()}
function cal(){
  const y=calM.getFullYear(),m=calM.getMonth(),first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate();let cells='';
  for(let i=0;i<first;i++)cells+='<div class="cd off"></div>';
  for(let d=1;d<=n;d++){const s=iso(new Date(y,m,d)),ps=db.pedidos.filter(p=>p.d===s),h=s===iso(HOJE);
   cells+=`<div class="cd ${h?'hoje':''}"><div class="dn">${d}<button class="plus" title="Novo pedido neste dia" onclick="novoPed({prazo:'${s}'})">+</button></div>${ps.map(p=>`<div class="ev ${stOf(p)}" onclick="ui.drawer='${p.n}';render()">${p.p}</div>`).join('')}</div>`}
  return `<div class="card"><div class="row" style="justify-content:space-between;margin-bottom:14px"><button class="btn o" onclick="calM=new Date(calM.getFullYear(),calM.getMonth()-1,1);render()">‹</button><h3 style="margin:0">${MESES[m]} ${y}</h3><button class="btn o" onclick="calM=new Date(calM.getFullYear(),calM.getMonth()+1,1);render()">›</button></div><div class="cg">${['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(x=>`<div class="ch">${x}</div>`).join('')}${cells}</div></div>`;
}

/* ---------- Gaveta do pedido ---------- */
function drawer(){
  const p=db.pedidos.find(x=>x.n===ui.drawer);if(!p)return '';const s=stOf(p),l=lote(p.lote);
  return `<div class="dbg" onclick="ui.drawer=null;render()"></div><div class="dw"><div class="row" style="justify-content:space-between"><span class="sub" style="font-family:monospace">${p.n}</span><button class="ibtn" onclick="ui.drawer=null;render()">✕</button></div><h2 style="margin:6px 0 10px;font-size:22px">${p.p}</h2><span class="pill ${ST[s][1]}">${ST[s][0]}</span>
  <div class="sum" style="margin-top:18px"><div><span>Prazo</span><b>${fmt(p.d)}</b></div><div><span>Lote</span><b>${l?l.id+' · '+l.cor:p.lote}</b></div><div><span>Filamento + purga</span><b>${p.g} g + ${p.pg} g</b></div><div><span>Custo</span><b>${brl(p.custo)}</b></div><div><span>Preço</span><b>${brl(p.v)}</b></div><div><span>Impressora</span><b>${p.imp||'—'}</b></div><div><span>Canal</span><b>${db.cfg.canais[p.canal||'direto'].n}</b></div><div><span>Taxas e impostos</span><b>${brl(p.taxas||0)}</b></div><div class="t"><span>Lucro · margem</span><b>${brl(lucroP(p))} · ${margP(p).toFixed(0)}%</b></div><div><span>Pago</span><b>${brl(p.pago)}</b></div><div><span>A receber</span><b style="color:var(--p)">${brl(p.v-p.pago)}</b></div></div>
  <div class="lab" style="margin:18px 0 8px">Foto da peça<span class="new">NOVO</span></div><div class="row">${p.foto?`<img class="th big" src="${p.foto}">`:'<div class="ph">sem foto</div>'}<label class="btn o" style="display:inline-flex;align-items:center;margin:0;cursor:pointer">Enviar foto<input type="file" accept="image/*" style="display:none" onchange="foto('${p.n}',this)"></label></div><div class="lab" style="margin:18px 0 8px">Mudar status</div><div class="row seg">${['fila','prod','pronto','ent'].map(k=>`<button class="${p.s===k?'on':''}" onclick="setSt('${p.n}','${k}')">${ST[k][0]}</button>`).join('')}</div>
  <div class="row" style="margin-top:18px;flex-wrap:wrap"><button class="btn" onclick="mod('pagto','${p.n}')">💵 Registrar pagamento</button><button class="btn o" onclick="mod('falha','${p.n}')">⚠ Registrar falha<span class="new">NOVO</span></button><button class="btn o" onclick="mod('orc','${p.n}')">📄 Orçamento<span class="new">NOVO</span></button></div></div>`;
}
function foto(n,inp){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas'),k=Math.min(1,320/im.width);c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);db.pedidos.find(x=>x.n===n).foto=c.toDataURL('image/jpeg',.7);save();toast('Foto salva');render()};im.src=r.result};r.readAsDataURL(f)}
function setSt(n,k){const p=db.pedidos.find(x=>x.n===n);p.s=k;if(k==='ent')p.pago=p.v;save();toast(`${n} → ${ST[k][0]}`);render()}

/* ---------- Modais ---------- */
function mod(t,ctx){ui.menu=null;ui.modal={t,ctx};render();if(t==='falha')calcF()}
function close(){ui.modal=null;render()}
const opts=(a,f)=>a.map(f).join('');
function modal(){
  const {t,ctx}=ui.modal;let h='';
  if(t==='falha')h=`<h2>Registrar falha<span class="new">NOVO</span></h2><p class="sub">Pedido ${ctx}. O material perdido entra no custo real e sai do estoque.</p><label>Lote usado</label><select id="m1" onchange="calcF()">${opts(db.lotes,l=>`<option value="${l.id}" ${l.id===db.pedidos.find(p=>p.n===ctx).lote?'selected':''}>${l.id} · ${l.cor}</option>`)}</select><label>Gramas perdidas</label><input id="m2" type="number" value="40" oninput="calcF()"><label>O que aconteceu</label><select id="m3"><option>Peça soltou da mesa</option><option>Bico entupiu</option><option>Acabou o filamento no meio</option><option>Erro de fatiamento</option><option>Outro</option></select><div class="info" id="mc"></div>`;
  if(t==='pagto')h=`<h2>Registrar pagamento</h2><p class="sub">Pedido ${ctx}</p><label>Valor recebido (R$)</label><input id="m1" type="number" step="0.01" value="${(()=>{const p=db.pedidos.find(x=>x.n===ctx);return (p.v-p.pago).toFixed(2)})()}">`;
  if(t==='orc'){const p=db.pedidos.find(x=>x.n===ctx);h=`<h2>Orçamento<span class="new">NOVO</span></h2><p class="sub">Pronto para enviar ao cliente.</p><textarea id="m1" style="height:150px;padding:12px;line-height:1.5">${orcTxt(p)}</textarea>`}
  if(t==='imp')h=`<h2>Nova impressora</h2><div class="fg"><div class="full"><label>Nome</label><input id="m1" placeholder="Ex.: Prusa MK4"></div><div class="full"><label>Modelo e área de impressão</label><input id="m2" placeholder="FDM · 250×210"></div></div>`;
  if(t==='lote')h=`<h2>Novo lote de filamento</h2><div class="fg"><div><label>Cor</label><input id="m1" placeholder="Ex.: Azul Marinho"></div><div><label>Cor (visual)</label><input id="m2" type="color" value="#6b3fd4" style="padding:4px"></div><div><label>Material</label><select id="m3"><option>PLA</option><option>PETG</option><option>ABS</option><option>TPU</option></select></div><div><label>Marca</label><input id="m4" placeholder="Ex.: Voolt3D"></div><div><label>Peso do rolo (g)</label><input id="m5" type="number" value="1000"></div><div><label>Preço pago (R$)</label><input id="m6" type="number" step="0.01" value="109"></div></div><p class="sub">Cada compra vira um lote, com preço próprio.</p>`;
  if(t==='emb')h=`<h2>Nova embalagem</h2><div class="fg"><div class="full"><label>Nome</label><input id="m1" placeholder="Ex.: Caixa Média"></div><div><label>Tamanho</label><input id="m2" placeholder="25×20×15 cm"></div><div><label>Cor</label><input id="m3" placeholder="Kraft"></div><div><label>Valor unitário (R$)</label><input id="m4" type="number" step="0.01"></div><div><label>Quantidade em estoque</label><input id="m5" type="number" value="10"></div></div>`;
  if(t==='outro')h=`<h2>Novo material</h2><div class="fg"><div class="full"><label>Nome</label><input id="m1" placeholder="Ex.: Bico 0,6 mm"></div><div><label>Categoria</label><select id="m2"><option>Peça da impressora</option><option>Consumível</option><option>Limpeza</option><option>Acabamento</option><option>Outro</option></select></div><div><label>Unidade</label><input id="m3" value="un"></div><div><label>Quantidade</label><input id="m4" type="number" value="1"></div><div><label>Valor unitário (R$)</label><input id="m5" type="number" step="0.01"></div></div>`;
  if(t==='despesa')h=`<h2>Lançamento financeiro</h2><div class="fg"><div><label>Tipo</label><select id="m1"><option value="d">Despesa</option><option value="r">Receita avulsa</option></select></div><div><label>Categoria</label><select id="m2"><option>Filamento</option><option>Energia</option><option>Embalagem</option><option>Peça</option><option>Outro</option></select></div><div class="full"><label>Descrição</label><input id="m3" placeholder="Ex.: Compra de 3 rolos"></div><div><label>Valor (R$)</label><input id="m4" type="number" step="0.01"></div><div><label>Data</label><input id="m5" type="date" value="2026-11-18"></div></div>`;
  return `<div class="modalbg" onclick="if(event.target===this)close()"><div class="modal">${h}<div class="row" style="justify-content:flex-end;margin-top:22px"><button class="btn o" onclick="close()">${t==='orc'?'Fechar':'Cancelar'}</button>${t==='orc'?`<button class="btn o" onclick="copiar()">Copiar</button><button class="btn" onclick="zap()">Abrir no WhatsApp</button>`:`<button class="btn" onclick="ok()">Salvar</button>`}</div></div></div>`;
}
const orcTxt=p=>`Olá! Segue o orçamento:\n\n• ${p.p}\n• Valor: ${brl(p.v)}\n• Prazo de entrega: ${fmt(p.d)}\n• Pagamento: ${brl(p.pago>0?p.pago:p.v/2)} de entrada e o restante na entrega\n\nQualquer dúvida é só chamar! — ${db.cfg.negocio}`;
function copiar(){try{navigator.clipboard.writeText(document.getElementById('m1').value)}catch(e){}toast('Orçamento copiado')}
function zap(){window.open('https://wa.me/?text='+encodeURIComponent(document.getElementById('m1').value),'_blank')}
function calcF(){const l=lote(document.getElementById('m1').value),g=+document.getElementById('m2').value||0;document.getElementById('mc').innerHTML=`Custo da falha: <b>${brl(g*l.kg/1000)}</b>. O estoque do lote ${l.id} cai ${g} g.`}
const v=i=>document.getElementById('m'+i).value;
function ok(){
  const {t,ctx}=ui.modal;
  if(t==='falha'){const g=+v(2)||0,l=lote(v(1));db.falhas.push({n:ctx,g,lote:l.id,m:v(3),d:iso(HOJE)});l.g=Math.max(0,l.g-g);toast('Falha registrada')}
  if(t==='pagto'){const p=db.pedidos.find(x=>x.n===ctx);p.pago=Math.min(p.v,p.pago+(+v(1)||0));toast('Pagamento registrado')}
  if(t==='lote'){if(!v(1))return toast('Informe a cor');const n=db.lotes.length+1,g=+v(5)||1000;db.lotes.push({id:'L-'+String(n).padStart(3,'0'),cor:v(1),hex:v(2),mat:v(3),marca:v(4)||'—',ini:g,g,kg:(+v(6)||0)/g*1000});toast('Lote adicionado')}
  if(t==='imp'){if(!v(1))return toast('Informe o nome');db.impressoras.push({n:v(1),m:v(2)||'FDM',st:'livre',ped:'',h:0});toast('Impressora adicionada')}
  if(t==='emb'){if(!v(1))return toast('Informe o nome');db.emb.push({n:v(1),t:v(2)||'—',c:v(3)||'—',v:+v(4)||0,q:+v(5)||0});toast('Embalagem adicionada')}
  if(t==='outro'){if(!v(1))return toast('Informe o nome');db.outros.push({n:v(1),cat:v(2),un:v(3),q:+v(4)||0,v:+v(5)||0});toast('Material adicionado')}
  if(t==='despesa'){if(!(+v(4)))return toast('Informe o valor');v(1)==='d'?db.despesas.push({d:v(5),t:v(2),desc:v(3)||v(2),v:+v(4)}):db.receitas.push({d:v(5),desc:v(3)||'Receita',v:+v(4)});toast('Lançamento salvo')}
  save();ui.modal=null;render();
}

/* ---------- Novo pedido ---------- */
let ped={};
function calc(){
  const l=lote(ped.lote),pk=l.kg/1000,fil=ped.g*pk,pur=ped.pg*pk,en=db.cfg.watts/1000*ped.h*db.cfg.tarifa,em=db.emb[ped.emb].v,maq=ped.h*(db.cfg.horaMaq||0),frete=+ped.frete||0,custo=fil+pur+en+maq+em+frete;
  const cn=db.cfg.canais[ped.canal]||db.cfg.canais.direto,t=(cn.c+db.cfg.imposto)/100,m=ped.marg/100;
  const den=Math.max(0.05,BASE()==='custo'?1-t:1-t-m);
  const sug=BASE()==='custo'?(custo*(1+m)+cn.f)/den:(custo+cn.f)/den;
  const desc=+ped.desc||0,fin=Math.max(0,(ped.final===''?sug:+ped.final)-desc),taxa=fin*cn.c/100+cn.f,imp=fin*db.cfg.imposto/100,liq=fin-taxa-imp,lucro=liq-custo;
  return{l,fil,pur,en,maq,frete,desc,em,custo,sug,fin,taxa,imp,liq,lucro,cn,marg:BASE()==='custo'?(custo?lucro/custo*100:0):(fin?lucro/fin*100:0),falta:(+ped.g+ +ped.pg)>l.g};
}
function novo(){
  const c=calc();
  return shell(`<div class="top"><div class="row"><span class="link" onclick="go('pedidos')">← Pedidos</span><span style="color:var(--line)">/</span><h2>Novo pedido</h2></div></div>
  <div class="row" style="align-items:flex-start;gap:24px"><div class="card form" style="flex:1"><div class="fg">
   <div><label>Impressora<span class="new">NOVO</span></label><select onchange="ped.imp=this.value">${db.impressoras.map(i=>`<option value="${i.n}" ${i.n===ped.imp?'selected':''}>${i.n}${i.st==='livre'?' · livre':i.st==='imp'?' · ocupada':' · manutenção'}</option>`).join('')}</select></div><div><label>Status inicial</label><select onchange="ped.st=this.value">${['fila','prod','pronto'].map(k=>`<option value="${k}" ${ped.st===k?'selected':''}>${ST[k][0]}</option>`).join('')}</select></div>
   <div class="full"><label>Produto</label><input placeholder="Ex.: suporte de mesa articulado" value="${ped.nome}" onchange="ped.nome=this.value"></div>
   <div><label>Lote de filamento</label><select onchange="ped.lote=this.value;render()">${db.lotes.map(l=>`<option value="${l.id}" ${l.id===ped.lote?'selected':''}>${l.id} · ${l.cor} · ${l.g} g</option>`).join('')}</select></div>
   <div><label>Gramas da peça</label><input type="number" value="${ped.g}" onchange="ped.g=+this.value;render()"></div>
   <div><label>Purga (g)<span class="new">NOVO</span></label><input type="number" value="${ped.pg}" onchange="ped.pg=+this.value;render()"></div>
   <div><label>Tempo de impressão (h)</label><input type="number" value="${ped.h}" onchange="ped.h=+this.value;render()"></div>
   <div class="full">${c.falta?`<div class="warn"><span>⚠</span><span>Estoque insuficiente<span class="new">NOVO</span><br><span style="font-weight:500">O lote ${c.l.id} (${c.l.cor}) tem só ${c.l.g} g e o pedido precisa de ${+ped.g+ +ped.pg} g. Escolha outro lote ou reponha o estoque.</span></span></div>`:`<div class="okb">✓ Estoque suficiente: sobram ${c.l.g-ped.g-ped.pg} g no lote ${c.l.id}.</div>`}</div>
   <div><label>Embalagem</label><select onchange="ped.emb=+this.value;render()">${db.emb.map((e,i)=>`<option value="${i}" ${i===ped.emb?'selected':''}>${e.n} · ${brl(e.v)}</option>`).join('')}</select></div>
   <div><label>Prazo de entrega<span class="new">NOVO</span></label><input type="date" value="${ped.prazo}" onchange="ped.prazo=this.value"></div>
   <div><label>Canal de venda<span class="new">NOVO</span></label><select onchange="ped.canal=this.value;render()">${Object.entries(db.cfg.canais).map(([k,c])=>`<option value="${k}" ${k===ped.canal?'selected':''}>${c.n}${c.c||c.f?` · ${c.c}% + ${brl(c.f)}`:''}</option>`).join('')}</select></div><div><label>Impostos (%)<span class="new">NOVO</span></label><input readonly value="${db.cfg.imposto}% (ajuste em Configurações)"></div>
   <div><label>Margem (%) sobre o</label><div class="row" style="flex-wrap:nowrap"><input type="number" style="width:90px" value="${ped.marg}" onchange="ped.marg=+this.value;render()"><div class="seg row" style="gap:0"><button class="${BASE()==='custo'?'on':''}" onclick="db.cfg.base='custo';save();render()">custo</button><button class="${BASE()==='preco'?'on':''}" onclick="db.cfg.base='preco';save();render()">preço</button></div></div></div>
   <div><label>Preço final</label><input type="number" step="0.01" placeholder="${c.sug.toFixed(2)}" value="${ped.final}" onchange="ped.final=this.value;render()"></div>
   <div><label>Desconto (R$)<span class="new">NOVO</span></label><input type="number" step="0.01" value="${ped.desc}" onchange="ped.desc=+this.value;render()"></div><div><label>Frete pago por você (R$)<span class="new">NOVO</span></label><input type="number" step="0.01" value="${ped.frete}" onchange="ped.frete=+this.value;render()"></div>
   <div class="full"><label>Pagamento</label><div class="row seg"><button class="${ped.pag==='avista'?'on':''}" onclick="ped.pag='avista';render()">À vista</button><button class="${ped.pag==='parcial'?'on':''}" onclick="ped.pag='parcial';render()">Parcial (entrada + restante)</button>${ped.pag==='parcial'?`<input style="width:110px" type="number" value="${ped.ent}" onchange="ped.ent=+this.value;render()"><span class="sub">% de entrada</span>`:''}</div></div>
  </div><div class="row" style="justify-content:flex-end;margin-top:28px"><button class="btn o" onclick="go('pedidos')">Cancelar</button><button class="btn" onclick="go('confirmar')">Revisar e salvar</button></div></div>
  <div style="width:340px;position:sticky;top:96px"><div class="sum"><div class="lab" style="margin-bottom:8px">Custo do pedido</div><div><span>Filamento (${ped.g} g)</span><span>${brl(c.fil)}</span></div><div><span>Purga (${ped.pg} g)</span><span>${brl(c.pur)}</span></div><div><span>Energia (${ped.h} h)</span><span>${brl(c.en)}</span></div><div><span>Hora de máquina<span class="new">NOVO</span></span><span>${brl(c.maq)}</span></div>${c.frete?`<div><span>Frete</span><span>${brl(c.frete)}</span></div>`:''}<div><span>Embalagem</span><span>${brl(c.em)}</span></div><div class="t"><span>Custo</span><span>${brl(c.custo)}</span></div><div><span>Preço sugerido (${ped.marg}% sobre o ${BASE()==='custo'?'custo':'preço'})</span><span>${brl(c.sug)}</span></div>${c.desc?`<div><span>Desconto</span><span>− ${brl(c.desc)}</span></div>`:''}<div class="t"><span>Preço final</span><span>${brl(c.fin)}</span></div><div><span>Taxa do canal (${c.cn.c}% + ${brl(c.cn.f)})</span><span>− ${brl(c.taxa)}</span></div><div><span>Impostos (${db.cfg.imposto}%)</span><span>− ${brl(c.imp)}</span></div><div><span>Você recebe</span><span>${brl(c.liq)}</span></div><div class="t" style="color:var(--p)"><span>Lucro · margem sobre o ${BASE()==='custo'?'custo':'preço'}</span><span>${brl(c.lucro)} · ${c.marg.toFixed(0)}%</span></div></div>${ped.pag==='parcial'?`<div class="info" style="margin-top:12px">Entrada ${brl(c.fin*ped.ent/100)} · a receber na entrega ${brl(c.fin*(100-ped.ent)/100)}</div>`:''}</div></div>`);
}
function confirmar(){
  const c=calc(),r=[['Produto',ped.nome||'Novo pedido'],['Lote',`${c.l.id} · ${c.l.cor} · ${ped.g} g + ${ped.pg} g de purga`],['Impressora',ped.imp],['Embalagem',db.emb[ped.emb].n],['Prazo',fmt(ped.prazo)],['Custo estimado',brl(c.custo)],['Preço final',brl(c.fin)],['Canal',c.cn.n],['Taxas e impostos',brl(c.taxa+c.imp)],['Lucro · margem',brl(c.lucro)+' · '+c.marg.toFixed(0)+'%'],['Pagamento',ped.pag==='avista'?'À vista':`Parcial: entrada ${brl(c.fin*ped.ent/100)}`]];
  return shell(`<div class="card" style="max-width:580px;margin:12px auto;padding:0"><div style="padding:24px;border-bottom:1px solid var(--line)"><h2 style="font-size:20px">Confirmar pedido</h2><p class="sub">Revise antes de confirmar</p></div><div style="padding:8px 24px">${r.map(([a,b])=>`<div class="row" style="padding:10px 0;border-bottom:1px solid #f0edf7"><span class="lab" style="width:150px">${a}</span><b style="font-size:14px">${b}</b></div>`).join('')}</div>${c.falta?'<div class="warn" style="margin:12px 24px">⚠ O lote escolhido não tem filamento suficiente.</div>':''}<div class="row" style="justify-content:space-between;padding:20px 24px;background:var(--bg)"><button class="btn o" onclick="go('novo')">← Voltar</button><button class="btn" onclick="salvaPed()">Confirmar pedido</button></div></div>`);
}
function salvaPed(){const c=calc(),n='#00'+(1242+db.pedidos.length-10);db.pedidos.push({n,p:ped.nome||'Novo pedido',s:ped.st,custo:c.custo,v:+c.fin.toFixed(2),pago:ped.pag==='avista'?0:+(c.fin*ped.ent/100).toFixed(2),imp:ped.imp,canal:ped.canal,taxas:+(c.taxa+c.imp).toFixed(2),d:ped.prazo,lote:ped.lote,g:+ped.g,pg:+ped.pg,h:+ped.h,emb:ped.emb});c.l.g=Math.max(0,c.l.g-ped.g-ped.pg);const pr=db.impressoras.find(i=>i.n===ped.imp);if(pr&&ped.st==='prod'){pr.st='imp';pr.ped=n;pr.h=+ped.h}save();aba.ped='quadro';go('pedidos');toast(`Pedido ${n} criado`)}

/* ---------- Financeiro ---------- */
function exportar(){const f=['Data;Descrição;Tipo;Valor'];const l=[...db.pedidos.filter(p=>p.pago>0).map(p=>[p.d,'Pedido '+p.n+' '+p.p,'Receita',p.pago]),...db.receitas.map(r=>[r.d,r.desc,'Receita',r.v]),...db.despesas.map(x=>[x.d,x.desc,x.t,-x.v])];l.forEach(r=>f.push(r.join(';').replace(/\./g,',')));const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+f.join('\n')],{type:'text/csv'}));a.download='layerly-financeiro.csv';a.click();toast('Planilha exportada')}
function financeiro(){
  const f=fin(),comp=[['Custo dos pedidos (material, energia, máquina)',db.pedidos.filter(p=>p.s!=='fila').reduce((a,p)=>a+p.custo,0),'#6b3fd4'],['Perdas por falha',f.pf,'#c0392b'],['Taxas e impostos',f.tx,'#4a2a9e'],['Outras despesas',f.od,'#b794ff']],tot=comp.reduce((a,c)=>a+c[1],0)||1;
  const lanc=[...db.pedidos.filter(p=>p.pago>0).map(p=>({d:p.d,desc:`Pedido ${p.n} · ${p.p}`,t:'Receita',v:p.pago})),...db.receitas.map(r=>({d:r.d,desc:r.desc,t:'Receita',v:r.v})),...db.despesas.map(x=>({d:x.d,desc:x.desc,t:x.t,v:-x.v})),...db.falhas.map(x=>({d:x.d,desc:`Falha ${x.n} · ${x.m}`,t:'Falha',v:-(x.g*lote(x.lote).kg/1000)}))].sort((a,b)=>b.d.localeCompare(a.d));
  const mc=f.rec?Math.max(0.05,(f.rec-f.tot+f.od)/f.rec):0.4,pe=db.cfg.fixas/mc;
  const cats={};db.despesas.forEach(x=>cats[x.t]=(cats[x.t]||0)+x.v);
  return shell(`<div class="top"><div><h2>Financeiro</h2><p class="sub">Novembro de 2026 · entradas, gastos e lucro</p></div><div class="row"><button class="btn o" onclick="exportar()">⬇ Exportar planilha<span class="new">NOVO</span></button><button class="btn" onclick="mod('despesa')">+ Novo lançamento</button></div></div>
  <div class="grid4" style="margin-bottom:20px"><div class="card k"><div class="lab">Receita</div><div class="big" style="-webkit-text-fill-color:#1e7a3c;color:#1e7a3c">${brl(f.rec)}</div><div class="sub">recebido no mês</div></div><div class="card k"><div class="lab">Gastos</div><div class="big">${brl(f.tot)}</div><div class="sub">pedidos, taxas, falhas e despesas</div></div><div class="card k"><div class="lab">Lucro</div><div class="big">${brl(f.lucro)}</div><div class="sub">margem sobre a receita ${f.rec?(f.lucro/f.rec*100).toFixed(0):0}%</div></div><div class="card k"><div class="lab">A receber</div><div class="big">${brl(f.rcb)}</div><div class="sub">saldos em aberto</div></div></div>
  <div class="card" style="margin-bottom:16px"><div class="row" style="justify-content:space-between"><div><div class="lab">Ponto de equilíbrio<span class="new">NOVO</span></div><div class="sub" style="margin-top:4px">Você precisa vender <b style="color:var(--ink)">${brl(pe)}</b> no mês para cobrir as despesas fixas de ${brl(db.cfg.fixas)}</div></div><b style="font-size:20px;color:${f.rec>=pe?'#1e7a3c':'var(--p)'}">${f.rec>=pe?'✓ já passou':Math.min(100,f.rec/pe*100).toFixed(0)+'%'}</b></div><div class="bar"><i style="width:${Math.min(100,f.rec/pe*100)}%"></i></div></div>
  <div class="cols"><div class="card" style="flex:1"><div class="lab" style="margin-bottom:12px">Para onde foi o dinheiro</div><div class="stack">${comp.map(c=>`<i style="width:${c[1]/tot*100}%;background:${c[2]}" title="${c[0]}"></i>`).join('')}</div>${comp.map(c=>`<div class="li"><span class="dot2" style="background:${c[2]}"></span><b>${c[0]}</b><span>${brl(c[1])} · ${(c[1]/tot*100).toFixed(0)}%</span></div>`).join('')}<div class="lab" style="margin:16px 0 6px">Despesas por categoria</div>${Object.entries(cats).map(([k,x])=>`<div class="li"><b>${k}</b><span>${brl(x)}</span></div>`).join('')}</div>
  <div class="card" style="flex:1.5;padding:0"><div class="lab" style="padding:18px 18px 8px">Lançamentos</div><table><tr><th>Data</th><th>Descrição</th><th>Tipo</th><th style="text-align:right">Valor</th></tr>${lanc.map(x=>`<tr><td>${fmt(x.d)}</td><td>${x.desc}</td><td><span class="pill ${x.v>0?'s-pronto':'s-fila'}">${x.t}</span></td><td style="text-align:right;font-weight:700;color:${x.v>0?'#1e7a3c':'var(--ink)'}">${x.v>0?'+':'−'} ${brl(Math.abs(x.v))}</td></tr>`).join('')}</table></div></div>`);
}

/* ---------- Catálogo ---------- */
function catalogo(){
  const tabs=[['fil','Filamentos'],['emb','Embalagens'],['out','Outros materiais'],['imp','Impressoras']],b=db.lotes.filter(l=>l.g<db.cfg.minimo).length;let body='',add='';
  if(aba.cat==='fil'){add=`<button class="btn" onclick="mod('lote')">+ Novo lote</button>`;body=`${b?`<div class="warn" style="margin-bottom:14px"><span>⚠</span><span>${b} lote(s) abaixo de ${db.cfg.minimo} g: reposição recomendada.</span></div>`:''}<div class="grid4">${db.lotes.map(l=>{const low=l.g<db.cfg.minimo;return `<div class="card fil ${low?'low':''}">${low?'<div class="lab" style="color:var(--red);margin-bottom:8px">Estoque baixo</div>':''}<div class="sw" style="background:${l.hex};border:1px solid var(--line)"></div><b>${l.cor}</b> <span class="pill s-prod" style="font-size:10px">${l.mat}</span><div class="sub" style="font-family:monospace">${l.id} · ${l.marca}</div><div class="row" style="justify-content:space-between;margin-top:8px"><b style="font-size:18px;${low?'color:var(--red)':''}">${l.g} g</b><span class="sub">${brl(l.kg)}/kg</span></div>${l.prev?`<div class="sub" style="margin-top:4px;color:${l.kg>l.prev?'var(--red)':'#1e7a3c'}">${l.kg>l.prev?'▲':'▼'} ${Math.abs((l.kg/l.prev-1)*100).toFixed(0)}% vs compra anterior</div>`:''}<div class="bar ${low?'low':''}"><i style="width:${Math.min(100,l.g/l.ini*100)}%"></i></div></div>`}).join('')}</div>`}
  if(aba.cat==='emb'){add=`<button class="btn" onclick="mod('emb')">+ Nova embalagem</button>`;body=`<div class="card" style="padding:0"><table><tr><th>Nome</th><th>Tamanho</th><th>Cor</th><th>Valor unit.</th><th>Em estoque</th></tr>${db.emb.map(e=>`<tr><td><b>${e.n}</b></td><td style="font-family:monospace">${e.t}</td><td>${e.c}</td><td>${brl(e.v)}</td><td><span class="pill ${e.q<10?'s-atr':'s-pronto'}">${e.q} un</span></td></tr>`).join('')}</table></div>`}
  if(aba.cat==='imp'){add=`<button class="btn" onclick="mod('imp')">+ Nova impressora</button>`;body=`<div class="grid4" style="grid-template-columns:repeat(3,1fr)">${db.impressoras.map((i,k)=>`<div class="card fil"><div class="row" style="justify-content:space-between"><b style="font-size:16px">${i.n}</b><span class="pill ${i.st==='livre'?'s-pronto':i.st==='imp'?'s-prod':'s-atr'}">${i.st==='livre'?'Livre':i.st==='imp'?'Imprimindo':'Manutenção'}</span></div><div class="sub">${i.m}</div>${i.st==='imp'?`<div class="info" style="margin-top:12px">${i.ped} · termina em ${i.h} h</div>`:'<div style="height:12px"></div>'}<div class="row seg" style="margin-top:12px">${[['livre','Livre'],['imp','Imprimindo'],['man','Manutenção']].map(([v2,l2])=>`<button class="${i.st===v2?'on':''}" onclick="db.impressoras[${k}].st='${v2}';save();render()">${l2}</button>`).join('')}</div></div>`).join('')}</div>`}
  if(aba.cat==='out'){add=`<button class="btn" onclick="mod('outro')">+ Novo material</button>`;body=`<div class="card" style="padding:0"><table><tr><th>Material</th><th>Categoria</th><th>Quantidade</th><th>Valor unit.</th></tr>${db.outros.map(o=>`<tr><td><b>${o.n}</b></td><td><span class="pill s-prod">${o.cat}</span></td><td>${o.q} ${o.un}</td><td>${brl(o.v)}</td></tr>`).join('')}</table></div>`}
  return shell(`<div class="top"><div><h2>Catálogo</h2><p class="sub">Tudo o que você usa para produzir</p></div><div class="row"><div class="tabs">${tabs.map(([k,l])=>`<button class="${aba.cat===k?'on':''}" onclick="aba.cat='${k}';render()">${l}</button>`).join('')}</div>${add}</div></div>${body}`);
}

/* ---------- Configurações ---------- */
function config(){
  const f=(k,l,st='1')=>`<div><label>${l}</label><input type="number" step="${st}" value="${db.cfg[k]}" onchange="db.cfg.${k}=+this.value;save();toast('Salvo')"></div>`;
  return shell(`<div class="top"><div><h2>Configurações</h2><p class="sub">Valores usados nos cálculos de custo e alertas</p></div></div><div class="card form"><div class="fg"><div class="full"><label>Nome do negócio</label><input value="${db.cfg.negocio}" onchange="db.cfg.negocio=this.value;save();render()"></div>${f('margem','Margem padrão (%)')}<div><label>Margem calculada sobre</label><select onchange="db.cfg.base=this.value;save();toast('Salvo')"><option value="custo" ${BASE()==='custo'?'selected':''}>O custo (acréscimo)</option><option value="preco" ${BASE()==='preco'?'selected':''}>O preço de venda</option></select></div>${f('tarifa','Tarifa de energia (R$/kWh)','0.01')}${f('watts','Potência da impressora (W)')}${f('minimo','Alertar estoque abaixo de (g)')}${f('horaMaq','Hora de máquina (R$/h, desgaste)','0.1')}${f('fixas','Despesas fixas por mês (R$)')}</div><div class="lab" style="margin:26px 0 10px">Impostos<span class="new">NOVO</span></div><div class="row"><input type="number" step="0.1" style="width:110px" value="${db.cfg.imposto}" onchange="db.cfg.imposto=+this.value;save();render()"><span class="sub">% sobre a venda</span><button class="btn o" onclick="db.cfg.imposto=0;save();render()">MEI (0%)</button><button class="btn o" onclick="db.cfg.imposto=4;save();render()">Simples Nacional (≈4%)</button></div><p class="sub" style="margin-top:6px">Valores de referência: confirme com o seu contador.</p><div class="lab" style="margin:26px 0 10px">Canais de venda e taxas<span class="new">NOVO</span></div><table style="font-size:14px"><tr><th>Canal</th><th>Comissão (%)</th><th>Taxa fixa (R$)</th></tr>${Object.entries(db.cfg.canais).map(([k,c])=>`<tr><td><b>${c.n}</b></td><td><input type="number" step="0.1" style="width:100px" value="${c.c}" onchange="db.cfg.canais['${k}'].c=+this.value;save();toast('Salvo')"></td><td><input type="number" step="0.1" style="width:100px" value="${c.f}" onchange="db.cfg.canais['${k}'].f=+this.value;save();toast('Salvo')"></td></tr>`).join('')}</table><p class="sub" style="margin-top:6px">Taxas de exemplo: confira o valor atual no painel de cada marketplace e ajuste aqui.</p><div class="row" style="margin-top:24px"><button class="btn o" onclick="if(confirm('Voltar aos dados de exemplo?'))reset()">Restaurar dados de exemplo</button></div></div>`);
}

function render(){
  const pg={login,dashboard,pedidos:pedidosPg,novo,confirmar,financeiro,catalogo,config}[rota]||login;
  document.getElementById('app').innerHTML=pg();
}
document.addEventListener('click',e=>{if(ui.menu&&!e.target.closest('.dd')){ui.menu=null;render()}});
window.addEventListener('hashchange',()=>{const r=location.hash.slice(1);if(r&&r!==rota){rota=r;render()}});
setPed();go(rota);
