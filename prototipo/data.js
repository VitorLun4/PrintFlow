const KEY='layerly_v6';
const D=(m,d)=>`2026-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const seed=()=>fix({
 cfg:{negocio:'3DMax',margem:50,base:'custo',imposto:0,horaMaq:2.5,fixas:300,canais:{direto:{n:'Venda direta',c:0,f:0},ml:{n:'Mercado Livre',c:12,f:6},shopee:{n:'Shopee',c:14,f:4},tiktok:{n:'TikTok Shop',c:6,f:2}},tarifa:0.8,watts:150,minimo:200},
 impressoras:[{n:'Creality Ender 5 Pro',m:'FDM · 220×220',st:'imp',ped:'#001235',h:6},{n:'Bambu Lab A1',m:'FDM · 256×256',st:'livre',ped:'',h:0},{n:'Ender 3 V2',m:'FDM · 220×220',st:'man',ped:'',h:0}],
 lotes:[
  {id:'L-001',prev:104,cor:'Preto',hex:'#1c1c22',mat:'PLA',marca:'Voolt3D',ini:1000,g:850,kg:109},
  {id:'L-002',cor:'Branco',hex:'#e9e9ee',mat:'PLA',marca:'Voolt3D',ini:1000,g:1000,kg:105},
  {id:'L-003',prev:104,cor:'Cinza Chumbo',hex:'#5a5a66',mat:'PETG',marca:'3D Lab',ini:1000,g:340,kg:109},
  {id:'L-004',prev:118,cor:'Vermelho',hex:'#c0392b',mat:'PLA',marca:'Voolt3D',ini:1000,g:120,kg:115},
  {id:'L-005',prev:112,cor:'Azul Royal',hex:'#2c4fd0',mat:'PLA',marca:'3D Lab',ini:1000,g:980,kg:112},
  {id:'L-006',cor:'Amarelo',hex:'#e8c53a',mat:'PLA',marca:'Voolt3D',ini:1000,g:55,kg:110},
  {id:'L-007',prev:110,cor:'Verde Escuro',hex:'#1f6b45',mat:'PETG',marca:'3D Lab',ini:1000,g:640,kg:108},
  {id:'L-008',prev:113,cor:'Roxo',hex:'#6b3fd4',mat:'PLA',marca:'Voolt3D',ini:1000,g:410,kg:113}],
 emb:[
  {n:'Caixa Pequena',t:'15×10×8 cm',c:'Kraft',v:1.2,q:40},{n:'Caixa Média',t:'25×20×15 cm',c:'Kraft',v:2.4,q:25},
  {n:'Caixa Grande',t:'40×30×20 cm',c:'Branca',v:4.8,q:10},{n:'Saco Bolha',t:'20×30 cm',c:'Transparente',v:0.6,q:80},
  {n:'Envelope Almofadado',t:'15×20 cm',c:'Cinza',v:1.8,q:30},{n:'Caixa Premium',t:'20×20×10 cm',c:'Preta',v:5.5,q:8}],
 outros:[
  {n:'Bico 0,4 mm',cat:'Peça da impressora',q:6,un:'un',v:12},{n:'Fita Kapton',cat:'Consumível',q:2,un:'rolo',v:18},
  {n:'Cola bastão',cat:'Consumível',q:5,un:'un',v:7},{n:'Álcool isopropílico',cat:'Limpeza',q:1,un:'litro',v:32},
  {n:'Lixa d\'água 400',cat:'Acabamento',q:12,un:'folha',v:2.5},{n:'Tinta spray preta',cat:'Acabamento',q:2,un:'un',v:28}],
 pedidos:[
  {n:'#001234',p:'Suporte para câmera',s:'ent',custo:19.4,v:85,pago:85,d:D(11,10),lote:'L-001',g:90,pg:5,h:3,emb:0},
  {n:'#001235',p:'Peça de reposição industrial',s:'prod',custo:88.3,v:320,pago:160,d:D(11,20),lote:'L-003',g:260,pg:0,h:11,emb:2},
  {n:'#001236',p:'Caixa organizadora modular',s:'fila',custo:41.2,v:140,pago:0,d:D(11,25),lote:'L-005',g:200,pg:10,h:7,emb:1},
  {n:'#001237',p:'Protótipo de encaixe',s:'fila',custo:52.8,v:210,pago:100,d:D(11,15),lote:'L-002',g:180,pg:12,h:6,emb:1},
  {n:'#001238',p:'Miniatura decorativa',s:'pronto',custo:14.7,v:60,pago:60,d:D(11,19),lote:'L-008',g:45,pg:8,h:4,emb:3},
  {n:'#001239',p:'Tampa de painel elétrico',s:'prod',custo:121.5,v:475,pago:237.5,d:D(11,22),lote:'L-001',g:380,pg:0,h:14,emb:2},
  {n:'#001240',p:'Rack para ferramentas',s:'fila',custo:63.0,v:190,pago:0,d:D(11,28),lote:'L-007',g:310,pg:15,h:9,emb:2},
  {n:'#001241',p:'Suporte de mesa articulado',s:'fila',custo:21.0,v:95,pago:0,d:D(11,16),lote:'L-006',g:140,pg:10,h:5,emb:0},
  {n:'#001233',p:'Chaveiros personalizados (10 un)',s:'ent',custo:38.6,v:150,pago:150,d:D(11,5),lote:'L-008',g:120,pg:20,h:8,emb:3},
  {n:'#001232',p:'Vaso geométrico',s:'ent',custo:27.1,v:110,pago:110,d:D(11,3),lote:'L-002',g:160,pg:0,h:6,emb:1}],
 falhas:[{n:'#001235',g:35,lote:'L-001',m:'Peça soltou da mesa',d:D(11,12)}],
 despesas:[
  {d:D(11,2),t:'Outro',desc:'Taxa de participação na feira',v:30},{d:D(11,8),t:'Energia',desc:'Conta de luz (parte da oficina)',v:96.4},
  {d:D(11,14),t:'Peça',desc:'Bico 0,4 mm (2 un)',v:24}],
 receitas:[{d:D(11,9),desc:'Venda avulsa (feira)',v:180}]
});
function fix(o){const cv={'#001236':'ml','#001240':'shopee','#001238':'tiktok','#001239':'ml'};o.pedidos.forEach(p=>{p.custo=+(p.v/1.55).toFixed(2);p.canal=cv[p.n]||'direto';const c=o.cfg.canais[p.canal];p.taxas=+(p.v*c.c/100+c.f).toFixed(2)});return o}
function load(){try{const s=localStorage.getItem(KEY);if(s)return JSON.parse(s)}catch(e){}return seed()}
let db=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){}}
function reset(){try{localStorage.removeItem(KEY)}catch(e){}db=seed();render()}
