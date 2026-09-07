n Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)
}
function TS(r){
let n="";
for(let s in r)r.hasOwnProperty(s)&&(n.length&&(n+="&"),n+=encodeURIComponent(s)+"="+encodeURIComponent(r[s]));
return n
}
function NS(r){
let n={

}
,s=r.split("&");
for(let o=0,l=s.length;
o<l;
o++){
let c=s[o].split("=");
n[decodeURIComponent(c[0])]=decodeURIComponent(c[1])
}
return n
}
class OS extends Error{
constructor(n,s,o){
super(n),this.description=s,this.context=o,this.type="TransportError"
}

}
class Zc extends Ye{
constructor(n){
super(),this.writable=!1,$a(this,n),this.opts=n,this.query=n.query,this.socket=n.socket,this.supportsBinary=!n.forceBase64
}
onError(n,s,o){
return super.emitReserved("error",new OS(n,s,o)),this
}
open(){
return this.readyState="opening",this.doOpen(),this
}
close(){
return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this
}
send(n){
this.readyState==="open"&&this.write(n)
}
onOpen(){
this.readyState="open",this.writable=!0,super.emitReserved("open")
}
onData(n){
const s=Jc(n,this.socket.binaryType);
this.onPacket(s)
}
onPacket(n){
super.emitReserved("packet",n)
}
onClose(n){
this.readyState="closed",super.emitReserved("close",n)
}
pause(n){

}
createUri(n,s={

}
){
return n+"://"+this._hostname()+this._port()+this.opts.path+this._query(s)
}
_hostname(){
const n=this.opts.hostname;
return n.indexOf(":")===-1?n:"["+n+"]"
}
_port(){
return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""
}
_query(n){
const s=TS(n);
return s.length?"?"+s:""
}

}
class PS extends Zc{
constructor(){
super(...arguments),this._polling=!1
}
get name(){
return"polling"
}
doOpen(){
this._poll()
}
pause(n){
this.readyState="pausing";
const s=()=>{
this.readyState="paused",n()
}
;
if(this._polling||!this.writable){
let o=0;
this._polling&&(o++,this.once("pollComplete",function(){
--o||s()
}
)),this.writable||(o++,this.once("drain",function(){
--o||s()
}
))
}
else s()
}
_poll(){
this._polling=!0,this.doPoll(),this.emitReserved("poll")
}
onData(n){
const s=o=>{
if(this.readyState==="opening"&&o.type==="open"&&this.onOpen(),o.type==="close")return this.onClose({
description:"transport closed by the server"
}
),!1;
this.onPacket(o)
}
;
vS(n,this.socket.binaryType).forEach(s),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())
}
doClose(){
const n=()=>{
this.write([{
type:"close"
}
])
}
;
this.readyState==="open"?n():this.once("open",n)
}
write(n){
this.writable=!1,yS(n,s=>{
this.doWrite(s,()=>{
this.writable=!0,this.emitReserved("drain")
}
)
}
)
}
uri(){
const n=this.opts.secure?"https":"http",s=this.query||{

}
;
return this.opts.timestampRequests!==!1&&(s[this.opts.timestampParam]=iy()),!this.supportsBinary&&!s.sid&&(s.b64=1),this.createUri(n,s)
}

}
let oy=!1;
try{
oy=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest
}
catch{

}
const AS=oy;
function jS(){

}
class LS extends PS{
constructor(n){
if(super(n),typeof location<"u"){
const s=location.protocol==="https:";
let o=location.port;
o||(o=s?"443":"80"),this.xd=typeof location<"u"&&n.hostname!==location.hostname||o!==n.port
}

}
doWrite(n,s){
const o=this.request({
method:"POST",data:n
}
);
o.on("success",s),o.on("error",(l,c)=>{
this.onError("xhr post error",l,c)
}
)
}
doPoll(){
const n=this.request();
n.on("data",this.onData.bind(this)),n.on("error",(s,o)=>{
this.onError("xhr poll error",s,o)
}
),this.pollXhr=n
}

}
class xn extends Ye{
constructor(n,s,o){
super(),this.createRequest=n,$a(this,o),this._opts=o,this._method=o.method||"GET",this._uri=s,this._data=o.data!==void 0?o.data:null,this._create()
}
_create(){
var n;
const s=sy(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");
s.xdomain=!!this._opts.xd;
const o=this._xhr=this.createRequest(s);
try{
o.open(this._method,this._uri,!0);
try{
if(this._opts.extraHeaders){
o.setDisableHeaderCheck&&o.setDisableHeaderCheck(!0);
for(let l in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(l)&&o.setRequestHeader(l,this._opts.extraHeaders[l])
}

}
catch{

}
if(this._method==="POST")try{
o.setRequestHeader("Content-type","text/plain;
charset=UTF-8")
}
catch{

}
try{
o.setRequestHeader("Accept","*/*")
}
catch{

}
(n=this._opts.cookieJar)===null||n===void 0||n.addCookies(o),"withCredentials"in o&&(o.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(o.timeout=this._opts.requestTimeout),o.onreadystatechange=()=>{
var l;
o.readyState===3&&((l=this._opts.cookieJar)===null||l===void 0||l.parseCookies(o.getResponseHeader("set-cookie"))),o.readyState===4&&(o.status===200||o.status===1223?this._onLoad():this.setTimeoutFn(()=>{
this._onError(typeof o.status=="number"?o.status:0)
}
,0))
}
,o.send(this._data)
}
catch(l){
this.setTimeoutFn(()=>{
this._onError(l)
}
,0);
return
}
typeof document<"u"&&(this._index=xn.requestsCount++,xn.requests[this._index]=this)
}
_onError(n){
this.emitReserved("error",n,this._xhr),this._cleanup(!0)
}
_cleanup(n){
if(!(typeof this._xhr>"u"||this._xhr===null)){
if(this._xhr.onreadystatechange=jS,n)try{
this._xhr.abort()
}
catch{

}
typeof document<"u"&&delete xn.requests[this._index],this._xhr=null
}

}
_onLoad(){
const n=this._xhr.responseText;
n!==null&&(this.emitReserved("data",n),this.emitReserved("success"),this._cleanup())
}
abort(){
this._cleanup()
}

}
xn.requestsCount=0;
xn.requests={

}
;
if(typeof document<"u"){
if(typeof attachEvent=="function")attachEvent("onunload",pm);
else if(typeof addEventListener=="function"){
const r="onpagehide"in Gt?"pagehide":"unload";
addEventListener(r,pm,!1)
}

}
function pm(){
for(let r in xn.requests)xn.requests.hasOwnProperty(r)&&xn.requests[r].abort()
}
const IS=(function(){
const r=ay({
xdomain:!1
}
);
return r&&r.responseType!==null
}
)();
class zS extends LS{
constructor(n){
super(n);
const s=n&&n.forceBase64;
this.supportsBinary=IS&&!s
}
request(n={

}
){
return Object.assign(n,{
xd:this.xd
}
,this.opts),new xn(ay,this.uri(),n)
}

}
function ay(r){
const n=r.xdomain;
try{
if(typeof XMLHttpRequest<"u"&&(!n||AS))return new XMLHttpRequest
}
catch{

}
if(!n)try{
return new Gt[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")
}
catch{

}

}
const ly=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";
class DS extends Zc{
get name(){
return"websocket"
}
doOpen(){
const n=this.uri(),s=this.opts.protocols,o=ly?{

}
:sy(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");
this.opts.extraHeaders&&(o.headers=this.opts.extraHeaders);
try{
this.ws=this.createSocket(n,s,o)
}
catch(l){
return this.emitReserved("error",l)
}
this.ws.binaryType=this.socket.binaryType,this.addEventListeners()
}
addEventListeners(){
this.ws.onopen=()=>{
this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()
}
,this.ws.onclose=n=>this.onClose({
description:"websocket connection closed",context:n
}
),this.ws.onmessage=n=>this.onData(n.data),this.ws.onerror=n=>this.onError("websocket error",n)
}
write(n){
this.writable=!1;
for(let s=0;
s<n.length;
s++){
const o=n[s],l=s===n.length-1;
Yc(o,this.supportsBinary,c=>{
try{
this.doWrite(o,c)
}
catch{

}
l&&Ba(()=>{
this.writable=!0,this.emitReserved("drain")
}
,this.setTimeoutFn)
}
)
}

}
doClose(){
typeof this.ws<"u"&&(this.ws.onerror=()=>{

}
,this.ws.close(),this.ws=null)
}
uri(){
const n=this.opts.secure?"wss":"ws",s=this.query||{

}
;
return this.opts.timestampRequests&&(s[this.opts.timestampParam]=iy()),this.supportsBinary||(s.b64=1),this.createUri(n,s)
}

}
const Ju=Gt.WebSocket||Gt.MozWebSocket;
class MS extends DS{
createSocket(n,s,o){
return ly?new Ju(n,s,o):s?new Ju(n,s):new Ju(n)
}
doWrite(n,s){
this.ws.send(s)
}

}
class US extends Zc{
get name(){
return"webtransport"
}
doOpen(){
try{
this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])
}
catch(n){
return this.emitReserved("error",n)
}
this._transport.closed.then(()=>{
this.onClose()
}
).catch(n=>{
this.onError("webtransport error",n)
}
),this._transport.ready.then(()=>{
this._transport.createBidirectionalStream().then(n=>{
const s=xS(Number.MAX_SAFE_INTEGER,this.socket.binaryType),o=n.readable.pipeThrough(s).getReader(),l=wS();
l.readable.pipeTo(n.writable),this._writer=l.writable.getWriter();
const c=()=>{
o.read().then(({
done:h,value:p
}
)=>{
h||(this.onPacket(p),c())
}
).catch(h=>{

}
)
}
;
c();
const d={
type:"open"
}
;
this.query.sid&&(d.data=`{
"sid":"${
this.query.sid
}
"
}
`),this._writer.write(d).then(()=>this.onOpen())
}
)
}
)
}
write(n){
this.writable=!1;
for(let s=0;
s<n.length;
s++){
const o=n[s],l=s===n.length-1;
this._writer.write(o).then(()=>{
l&&Ba(()=>{
this.writable=!0,this.emitReserved("drain")
}
,this.setTimeoutFn)
}
)
}

}
doClose(){
var n;
(n=this._transport)===null||n===void 0||n.close()
}

}
const FS={
websocket:MS,webtransport:US,polling:zS
}
,BS=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{
0,4
}
:){
2,7
}
[a-f0-9]{
0,4
}
|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,$S=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];
function kc(r){
if(r.length>8e3)throw"URI too long";
const n=r,s=r.indexOf("["),o=r.indexOf("]");
s!=-1&&o!=-1&&(r=r.substring(0,s)+r.substring(s,o).replace(/:/g,";
")+r.substring(o,r.length));
let l=BS.exec(r||""),c={

}
,d=14;
for(;
d--;
)c[$S[d]]=l[d]||"";
return s!=-1&&o!=-1&&(c.source=n,c.host=c.host.substring(1,c.host.length-1).replace(/;
/g,":"),c.authority=c.authority.replace("[","").replace("]","").replace(/;
/g,":"),c.ipv6uri=!0),c.pathNames=qS(c,c.path),c.queryKey=VS(c,c.query),c
}
function qS(r,n){
const s=/\/{
2,9
}
/g,o=n.replace(s,"/").split("/");
return(n.slice(0,1)=="/"||n.length===0)&&o.splice(0,1),n.slice(-1)=="/"&&o.splice(o.length-1,1),o
}
function VS(r,n){
const s={

}
;
return n.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(o,l,c){
l&&(s[l]=c)
}
),s
}
const Ec=typeof addEventListener=="function"&&typeof removeEventListener=="function",Ca=[];
Ec&&addEventListener("offline",()=>{
Ca.forEach(r=>r())
}
,!1);
class gr extends Ye{
constructor(n,s){
if(super(),this.binaryType=_S,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,n&&typeof n=="object"&&(s=n,n=null),n){
const o=kc(n);
s.hostname=o.host,s.secure=o.protocol==="https"||o.protocol==="wss",s.port=o.port,o.query&&(s.query=o.query)
}
else s.host&&(s.hostname=kc(s.host).host);
$a(this,s),this.secure=s.secure!=null?s.secure:typeof location<"u"&&location.protocol==="https:",s.hostname&&!s.port&&(s.port=this.secure?"443":"80"),this.hostname=s.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=s.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={

}
,s.transports.forEach(o=>{
const l=o.prototype.name;
this.transports.push(l),this._transportsByName[l]=o
}
),this.opts=Object.assign({
path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{
threshold:1024
}
,transportOptions:{

}
,closeOnBeforeunload:!1
}
,s),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=NS(this.opts.query)),Ec&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{
this.transport&&(this.transport.removeAllListeners(),this.transport.close())
}
,addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{
this._onClose("transport close",{
description:"network connection lost"
}
)
}
,Ca.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()
}
createTransport(n){
const s=Object.assign({

}
,this.opts.query);
s.EIO=ry,s.transport=n,this.id&&(s.sid=this.id);
const o=Object.assign({

}
,this.opts,{
query:s,socket:this,hostname:this.hostname,secure:this.secure,port:this.port
}
,this.opts.transportOptions[n]);
return new this._transportsByName[n](o)
}
_open(){
if(this.transports.length===0){
this.setTimeoutFn(()=>{
this.emitReserved("error","No transports available")
}
,0);
return
}
const n=this.opts.rememberUpgrade&&gr.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];
this.readyState="opening";
const s=this.createTransport(n);
s.open(),this.setTransport(s)
}
setTransport(n){
this.transport&&this.transport.removeAllListeners(),this.transport=n,n.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",s=>this._onClose("transport close",s))
}
onOpen(){
this.readyState="open",gr.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()
}
_onPacket(n){
if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",n),this.emitReserved("heartbeat"),n.type){
case"open":this.onHandshake(JSON.parse(n.data));
break;
case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();
break;
case"error":const s=new Error("server error");
s.code=n.data,this._onError(s);
break;
case"message":this.emitReserved("data",n.data),this.emitReserved("message",n.data);
break
}

}
onHandshake(n){
this.emitReserved("handshake",n),this.id=n.sid,this.transport.query.sid=n.sid,this._pingInterval=n.pingInterval,this._pingTimeout=n.pingTimeout,this._maxPayload=n.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()
}
_resetPingTimeout(){
this.clearTimeoutFn(this._pingTimeoutTimer);
const n=this._pingInterval+this._pingTimeout;
this._pingTimeoutTime=Date.now()+n,this._pingTimeoutTimer=this.setTimeoutFn(()=>{
this._onClose("ping timeout")
}
,n),this.opts.autoUnref&&this._pingTimeoutTimer.unref()
}
_onDrain(){
this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()
}
flush(){
if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){
const n=this._getWritablePackets();
this.transport.send(n),this._prevBufferLen=n.length,this.emitReserved("flush")
}

}
_getWritablePackets(){
if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;
let s=1;
for(let o=0;
o<this.writeBuffer.length;
o++){
const l=this.writeBuffer[o].data;
if(l&&(s+=CS(l)),o>0&&s>this._maxPayload)return this.writeBuffer.slice(0,o);
s+=2
}
return this.writeBuffer
}
_hasPingExpired(){
if(!this._pingTimeoutTime)return!0;
const n=Date.now()>this._pingTimeoutTime;
return n&&(this._pingTimeoutTime=0,Ba(()=>{
this._onClose("ping timeout")
}
,this.setTimeoutFn)),n
}
write(n,s,o){
return this._sendPacket("message",n,s,o),this
}
send(n,s,o){
return this._sendPacket("message",n,s,o),this
}
_sendPacket(n,s,o,l){
if(typeof s=="function"&&(l=s,s=void 0),typeof o=="function"&&(l=o,o=null),this.readyState==="closing"||this.readyState==="closed")return;
o=o||{

}
,o.compress=o.compress!==!1;
const c={
type:n,data:s,options:o
}
;
this.emitReserved("packetCreate",c),this.writeBuffer.push(c),l&&this.once("flush",l),this.flush()
}
close(){
const n=()=>{
this._onClose("forced close"),this.transport.close()
}
,s=()=>{
this.off("upgrade",s),this.off("upgradeError",s),n()
}
,o=()=>{
this.once("upgrade",s),this.once("upgradeError",s)
}
;
return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{
this.upgrading?o():n()
}
):this.upgrading?o():n()),this
}
_onError(n){
if(gr.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();
this.emitReserved("error",n),this._onClose("transport error",n)
}
_onClose(n,s){
if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){
if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),Ec&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){
const o=Ca.indexOf(this._offlineEventListener);
o!==-1&&Ca.splice(o,1)
}
this.readyState="closed",this.id=null,this.emitReserved("close",n,s),this.writeBuffer=[],this._prevBufferLen=0
}

}

}
gr.protocol=ry;
class HS extends gr{
constructor(){
super(...arguments),this._upgrades=[]
}
onOpen(){
if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let n=0;
n<this._upgrades.length;
n++)this._probe(this._upgrades[n])
}
_probe(n){
let s=this.createTransport(n),o=!1;
gr.priorWebsocketSuccess=!1;
const l=()=>{
o||(s.send([{
type:"ping",data:"probe"
}
]),s.once("packet",w=>{
if(!o)if(w.type==="pong"&&w.data==="probe"){
if(this.upgrading=!0,this.emitReserved("upgrading",s),!s)return;
gr.priorWebsocketSuccess=s.name==="websocket",this.transport.pause(()=>{
o||this.readyState!=="closed"&&(v(),this.setTransport(s),s.send([{
type:"upgrade"
}
]),this.emitReserved("upgrade",s),s=null,this.upgrading=!1,this.flush())
}
)
}
else{
const T=new Error("probe error");
T.transport=s.name,this.emitReserved("upgradeError",T)
}

}
))
}
;
function c(){
o||(o=!0,v(),s.close(),s=null)
}
const d=w=>{
const T=new Error("probe error: "+w);
T.transport=s.name,c(),this.emitReserved("upgradeError",T)
}
;
function h(){
d("transport closed")
}
function p(){
d("socket closed")
}
function g(w){
s&&w.name!==s.name&&c()
}
const v=()=>{
s.removeListener("open",l),s.removeListener("error",d),s.removeListener("close",h),this.off("close",p),this.off("upgrading",g)
}
;
s.once("open",l),s.once("error",d),s.once("close",h),this.once("close",p),this.once("upgrading",g),this._upgrades.indexOf("webtransport")!==-1&&n!=="webtransport"?this.setTimeoutFn(()=>{
o||s.open()
}
,200):s.open()
}
onHandshake(n){
this._upgrades=this._filterUpgrades(n.upgrades),super.onHandshake(n)
}
_filterUpgrades(n){
const s=[];
for(let o=0;
o<n.length;
o++)~this.transports.indexOf(n[o])&&s.push(n[o]);
return s
}

}
let WS=class extends HS{
constructor(n,s={

}
){
const o=typeof n=="object",l=o?{
...n
}
:{
...s
}
;
(!l.transports||l.transports&&typeof l.transports[0]=="string")&&(l.transports=(l.transports||["polling","websocket","webtransport"]).map(c=>FS[c]).filter(c=>!!c)),super(o?l:n,l)
}

}
;
function QS(r,n="",s){
let o=r;
s=s||typeof location<"u"&&location,r==null&&(r=s.protocol+"//"+s.host),typeof r=="string"&&(r.charAt(0)==="/"&&(r.charAt(1)==="/"?r=s.protocol+r:r=s.host+r),/^(https?|wss?):\/\//.test(r)||(typeof s<"u"?r=s.protocol+"//"+r:r="https://"+r),o=kc(r)),o.port||(/^(http|ws)$/.test(o.protocol)?o.port="80":/^(http|ws)s$/.test(o.protocol)&&(o.port="443")),o.path=o.path||"/";
const c=o.host.indexOf(":")!==-1?"["+o.host+"]":o.host;
return o.id=o.protocol+"://"+c+":"+o.port+n,o.href=o.protocol+"://"+c+(s&&s.port===o.port?"":":"+o.port),o
}
const KS=typeof ArrayBuffer=="function",GS=r=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(r):r.buffer instanceof ArrayBuffer,uy=Object.prototype.toString,XS=typeof Blob=="function"||typeof Blob<"u"&&uy.call(Blob)==="[object BlobConstructor]",YS=typeof File=="function"||typeof File<"u"&&uy.call(File)==="[object FileConstructor]";
function ed(r){
return KS&&(r instanceof ArrayBuffer||GS(r))||XS&&r instanceof Blob||YS&&r instanceof File
}
function Ra(r,n){
if(!r||typeof r!="object")return!1;
if(Array.isArray(r)){
for(let s=0,o=r.length;
s<o;
s++)if(Ra(r[s]))return!0;
return!1
}
if(ed(r))return!0;
if(r.toJSON&&typeof r.toJSON=="function"&&arguments.length===1)return Ra(r.toJSON(),!0);
for(const s in r)if(Object.prototype.hasOwnProperty.call(r,s)&&Ra(r[s]))return!0;
return!1
}
function JS(r){
const n=[],s=r.data,o=r;
return o.data=Cc(s,n),o.attachments=n.length,{
packet:o,buffers:n
}

}
function Cc(r,n){
if(!r)return r;
if(ed(r)){
const s={
_placeholder:!0,num:n.length
}
;
return n.push(r),s
}
else if(Array.isArray(r)){
const s=new Array(r.length);
for(let o=0;
o<r.length;
o++)s[o]=Cc(r[o],n);
return s
}
else if(typeof r=="object"&&!(r instanceof Date)){
const s={

}
;
for(const o in r)Object.prototype.hasOwnProperty.call(r,o)&&(s[o]=Cc(r[o],n));
return s
}
return r
}
function ZS(r,n){
return r.data=Rc(r.data,n),delete r.attachments,r
}
function Rc(r,n){
if(!r)return r;
if(r&&r._placeholder===!0){
if(typeof r.num=="number"&&r.num>=0&&r.num<n.length)return n[r.num];
throw new Error("illegal attachments")
}
else if(Array.isArray(r))for(let s=0;
s<r.length;
s++)r[s]=Rc(r[s],n);
else if(typeof r=="object")for(const s in r)Object.prototype.hasOwnProperty.call(r,s)&&(r[s]=Rc(r[s],n));
return r
}
const ek=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];
var Ee;
(function(r){
r[r.CONNECT=0]="CONNECT",r[r.DISCONNECT=1]="DISCONNECT",r[r.EVENT=2]="EVENT",r[r.ACK=3]="ACK",r[r.CONNECT_ERROR=4]="CONNECT_ERROR",r[r.BINARY_EVENT=5]="BINARY_EVENT",r[r.BINARY_ACK=6]="BINARY_ACK"
}
)(Ee||(Ee={

}
));
class tk{
constructor(n){
this.replacer=n
}
encode(n){
return(n.type===Ee.EVENT||n.type===Ee.ACK)&&Ra(n)?this.encodeAsBinary({
type:n.type===Ee.EVENT?Ee.BINARY_EVENT:Ee.BINARY_ACK,nsp:n.nsp,data:n.data,id:n.id
}
):[this.encodeAsString(n)]
}
encodeAsString(n){
let s=""+n.type;
return(n.type===Ee.BINARY_EVENT||n.type===Ee.BINARY_ACK)&&(s+=n.attachments+"-"),n.nsp&&n.nsp!=="/"&&(s+=n.nsp+","),n.id!=null&&(s+=n.id),n.data!=null&&(s+=JSON.stringify(n.data,this.replacer)),s
}
encodeAsBinary(n){
const s=JS(n),o=this.encodeAsString(s.packet),l=s.buffers;
return l.unshift(o),l
}

}
class td extends Ye{
constructor(n){
super(),this.opts=Object.assign({
reviver:void 0,maxAttachments:10
}
,typeof n=="function"?{
reviver:n
}
:n)
}
add(n){
let s;
if(typeof n=="string"){
if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");
s=this.decodeString(n);
const o=s.type===Ee.BINARY_EVENT;
o||s.type===Ee.BINARY_ACK?(s.type=o?Ee.EVENT:Ee.ACK,this.reconstructor=new nk(s),s.attachments===0&&super.emitReserved("decoded",s)):super.emitReserved("decoded",s)
}
else if(ed(n)||n.base64)if(this.reconstructor)s=this.reconstructor.takeBinaryData(n),s&&(this.reconstructor=null,super.emitReserved("decoded",s));
else throw new Error("got binary data when not reconstructing a packet");
else throw new Error("Unknown type: "+n)
}
decodeString(n){
let s=0;
const o={
type:Number(n.charAt(0))
}
;
if(Ee[o.type]===void 0)throw new Error("unknown packet type "+o.type);
if(o.type===Ee.BINARY_EVENT||o.type===Ee.BINARY_ACK){
const c=s+1;
for(;
n.charAt(++s)!=="-"&&s!=n.length;
);
const d=n.substring(c,s);
if(d!=Number(d)||n.charAt(s)!=="-")throw new Error("Illegal attachments");
const h=Number(d);
if(!rk(h)||h<0)throw new Error("Illegal attachments");
if(h>this.opts.maxAttachments)throw new Error("too many attachments");
o.attachments=h
}
if(n.charAt(s+1)==="/"){
const c=s+1;
for(;
++s&&!(n.charAt(s)===","||s===n.length);
);
o.nsp=n.substring(c,s)
}
else o.nsp="/";
const l=n.charAt(s+1);
if(l!==""&&Number(l)==l){
const c=s+1;
for(;
++s;
){
const d=n.charAt(s);
if(d==null||Number(d)!=d){
--s;
break
}
if(s===n.length)break
}
o.id=Number(n.substring(c,s+1))
}
if(n.charAt(++s)){
const c=this.tryParse(n.substr(s));
if(td.isPayloadValid(o.type,c))o.data=c;
else throw new Error("invalid payload")
}
return o
}
tryParse(n){
try{
return JSON.parse(n,this.opts.reviver)
}
catch{
return!1
}

}
static isPayloadValid(n,s){
switch(n){
case Ee.CONNECT:return mm(s);
case Ee.DISCONNECT:return s===void 0;
case Ee.CONNECT_ERROR:return typeof s=="string"||mm(s);
case Ee.EVENT:case Ee.BINARY_EVENT:return Array.isArray(s)&&(typeof s[0]=="number"||typeof s[0]=="string"&&ek.indexOf(s[0])===-1);
case Ee.ACK:case Ee.BINARY_ACK:return Array.isArray(s)
}

}
destroy(){
this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)
}

}
class nk{
constructor(n){
this.packet=n,this.buffers=[],this.reconPack=n
}
takeBinaryData(n){
if(this.buffers.push(n),this.buffers.length===this.reconPack.attachments){
const s=ZS(this.reconPack,this.buffers);
return this.finishedReconstruction(),s
}
return null
}
finishedReconstruction(){
this.reconPack=null,this.buffers=[]
}

}
const rk=Number.isInteger||function(r){
return typeof r=="number"&&isFinite(r)&&Math.floor(r)===r
}
;
function mm(r){
return Object.prototype.toString.call(r)==="[object Object]"
}
const sk=Object.freeze(Object.defineProperty({
__proto__:null,Decoder:td,Encoder:tk,get PacketType(){
return Ee
}

}
,Symbol.toStringTag,{
value:"Module"
}
));
function dn(r,n,s){
return r.on(n,s),function(){
r.off(n,s)
}

}
const ik=Object.freeze({
connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1
}
);
class cy extends Ye{
constructor(n,s,o){
super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={

}
,this.flags={

}
,this.io=n,this.nsp=s,o&&o.auth&&(this.auth=o.auth),this._opts=Object.assign({

}
,o),this.io._autoConnect&&this.open()
}
get disconnected(){
return!this.connected
}
subEvents(){
if(this.subs)return;
const n=this.io;
this.subs=[dn(n,"open",this.onopen.bind(this)),dn(n,"packet",this.onpacket.bind(this)),dn(n,"error",this.onerror.bind(this)),dn(n,"close",this.onclose.bind(this))]
}
get active(){
return!!this.subs
}
connect(){
return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)
}
open(){
return this.connect()
}
send(...n){
return n.unshift("message"),this.emit.apply(this,n),this
}
emit(n,...s){
var o,l,c;
if(ik.hasOwnProperty(n))throw new Error('"'+n.toString()+'" is a reserved event name');
if(s.unshift(n),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(s),this;
const d={
type:Ee.EVENT,data:s
}
;
if(d.options={

}
,d.options.compress=this.flags.compress!==!1,typeof s[s.length-1]=="function"){
const v=this.ids++,w=s.pop();
this._registerAckCallback(v,w),d.id=v
}
const h=(l=(o=this.io.engine)===null||o===void 0?void 0:o.transport)===null||l===void 0?void 0:l.writable,p=this.connected&&!(!((c=this.io.engine)===null||c===void 0)&&c._hasPingExpired());
return this.flags.volatile&&!h||(p?(this.notifyOutgoingListeners(d),this.packet(d)):this.sendBuffer.push(d)),this.flags={

}
,this
}
_registerAckCallback(n,s){
var o;
const l=(o=this.flags.timeout)!==null&&o!==void 0?o:this._opts.ackTimeout;
if(l===void 0){
this.acks[n]=s;
return
}
const c=this.io.setTimeoutFn(()=>{
delete this.acks[n];
for(let h=0;
h<this.sendBuffer.length;
h++)this.sendBuffer[h].id===n&&this.sendBuffer.splice(h,1);
s.call(this,new Error("operation has timed out"))
}
,l),d=(...h)=>{
this.io.clearTimeoutFn(c),s.apply(this,h)
}
;
d.withError=!0,this.acks[n]=d
}
emitWithAck(n,...s){
return new Promise((o,l)=>{
const c=(d,h)=>d?l(d):o(h);
c.withError=!0,s.push(c),this.emit(n,...s)
}
)
}
_addToQueue(n){
let s;
typeof n[n.length-1]=="function"&&(s=n.pop());
const o={
id:this._queueSeq++,tryCount:0,pending:!1,args:n,flags:Object.assign({
fromQueue:!0
}
,this.flags)
}
;
n.push((l,...c)=>(this._queue[0],l!==null?o.tryCount>this._opts.retries&&(this._queue.shift(),s&&s(l)):(this._queue.shift(),s&&s(null,...c)),o.pending=!1,this._drainQueue())),this._queue.push(o),this._drainQueue()
}
_drainQueue(n=!1){
if(!this.connected||this._queue.length===0)return;
const s=this._queue[0];
s.pending&&!n||(s.pending=!0,s.tryCount++,this.flags=s.flags,this.emit.apply(this,s.args))
}
packet(n){
n.nsp=this.nsp,this.io._packet(n)
}
onopen(){
typeof this.auth=="function"?this.auth(n=>{
this._sendConnectPacket(n)
}
):this._sendConnectPacket(this.auth)
}
_sendConnectPacket(n){
this.packet({
type:Ee.CONNECT,data:this._pid?Object.assign({
pid:this._pid,offset:this._lastOffset
}
,n):n
}
)
}
onerror(n){
this.connected||this.emitReserved("connect_error",n)
}
onclose(n,s){
this.connected=!1,delete this.id,this.emitReserved("disconnect",n,s),this._clearAcks()
}
_clearAcks(){
Object.keys(this.acks).forEach(n=>{
if(!this.sendBuffer.some(o=>String(o.id)===n)){
const o=this.acks[n];
delete this.acks[n],o.withError&&o.call(this,new Error("socket has been disconnected"))
}

}
)
}
onpacket(n){
if(n.nsp===this.nsp)switch(n.type){
case Ee.CONNECT:n.data&&n.data.sid?this.onconnect(n.data.sid,n.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
break;
case Ee.EVENT:case Ee.BINARY_EVENT:this.onevent(n);
break;
case Ee.ACK:case Ee.BINARY_ACK:this.onack(n);
break;
case Ee.DISCONNECT:this.ondisconnect();
break;
case Ee.CONNECT_ERROR:this.destroy();
const o=new Error(n.data.message);
o.data=n.data.data,this.emitReserved("connect_error",o);
break
}

}
onevent(n){
const s=n.data||[];
n.id!=null&&s.push(this.ack(n.id)),this.connected?this.emitEvent(s):this.receiveBuffer.push(Object.freeze(s))
}
emitEvent(n){
if(this._anyListeners&&this._anyListeners.length){
const s=this._anyListeners.slice();
for(const o of s)o.apply(this,n)
}
super.emit.apply(this,n),this._pid&&n.length&&typeof n[n.length-1]=="string"&&(this._lastOffset=n[n.length-1])
}
ack(n){
const s=this;
let o=!1;
return function(...l){
o||(o=!0,s.packet({
type:Ee.ACK,id:n,data:l
}
))
}

}
onack(n){
const s=this.acks[n.id];
typeof s=="function"&&(delete this.acks[n.id],s.withError&&n.data.unshift(null),s.apply(this,n.data))
}
onconnect(n,s){
this.id=n,this.recovered=s&&this._pid===s,this._pid=s,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")
}
emitBuffered(){
this.receiveBuffer.forEach(n=>this.emitEvent(n)),this.receiveBuffer=[],this.sendBuffer.forEach(n=>{
this.notifyOutgoingListeners(n),this.packet(n)
}
),this.sendBuffer=[]
}
ondisconnect(){
this.destroy(),this.onclose("io server disconnect")
}
destroy(){
this.subs&&(this.subs.forEach(n=>n()),this.subs=void 0),this.io._destroy(this)
}
disconnect(){
return this.connected&&this.packet({
type:Ee.DISCONNECT
}
),this.destroy(),this.connected&&this.onclose("io client disconnect"),this
}
close(){
return this.disconnect()
}
compress(n){
return this.flags.compress=n,this
}
get volatile(){
return this.flags.volatile=!0,this
}
timeout(n){
return this.flags.timeout=n,this
}
onAny(n){
return this._anyListeners=this._anyListeners||[],this._anyListeners.push(n),this
}
prependAny(n){
return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(n),this
}
offAny(n){
if(!this._anyListeners)return this;
if(n){
const s=this._anyListeners;
for(let o=0;
o<s.length;
o++)if(n===s[o])return s.splice(o,1),this
}
else this._anyListeners=[];
return this
}
listenersAny(){
return this._anyListeners||[]
}
onAnyOutgoing(n){
return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(n),this
}
prependAnyOutgoing(n){
return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(n),this
}
offAnyOutgoing(n){
if(!this._anyOutgoingListeners)return this;
if(n){
const s=this._anyOutgoingListeners;
for(let o=0;
o<s.length;
o++)if(n===s[o])return s.splice(o,1),this
}
else this._anyOutgoingListeners=[];
return this
}
listenersAnyOutgoing(){
return this._anyOutgoingListeners||[]
}
notifyOutgoingListeners(n){
if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){
const s=this._anyOutgoingListeners.slice();
for(const o of s)o.apply(this,n.data)
}

}

}
function Vs(r){
r=r||{

}
,this.ms=r.min||100,this.max=r.max||1e4,this.factor=r.factor||2,this.jitter=r.jitter>0&&r.jitter<=1?r.jitter:0,this.attempts=0
}
Vs.prototype.duration=function(){
var r=this.ms*Math.pow(this.factor,this.attempts++);
if(this.jitter){
var n=Math.random(),s=Math.floor(n*this.jitter*r);
r=(Math.floor(n*10)&1)==0?r-s:r+s
}
return Math.min(r,this.max)|0
}
;
Vs.prototype.reset=function(){
this.attempts=0
}
;
Vs.prototype.setMin=function(r){
this.ms=r
}
;
Vs.prototype.setMax=function(r){
this.max=r
}
;
Vs.prototype.setJitter=function(r){
this.jitter=r
}
;
class Tc extends Ye{
constructor(n,s){
var o;
super(),this.nsps={

}
,this.subs=[],n&&typeof n=="object"&&(s=n,n=void 0),s=s||{

}
,s.path=s.path||"/socket.io",this.opts=s,$a(this,s),this.reconnection(s.reconnection!==!1),this.reconnectionAttempts(s.reconnectionAttempts||1/0),this.reconnectionDelay(s.reconnectionDelay||1e3),this.reconnectionDelayMax(s.reconnectionDelayMax||5e3),this.randomizationFactor((o=s.randomizationFactor)!==null&&o!==void 0?o:.5),this.backoff=new Vs({
min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()
}
),this.timeout(s.timeout==null?2e4:s.timeout),this._readyState="closed",this.uri=n;
const l=s.parser||sk;
this.encoder=new l.Encoder,this.decoder=new l.Decoder,this._autoConnect=s.autoConnect!==!1,this._autoConnect&&this.open()
}
reconnection(n){
return arguments.length?(this._reconnection=!!n,n||(this.skipReconnect=!0),this):this._reconnection
}
reconnectionAttempts(n){
return n===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=n,this)
}
reconnectionDelay(n){
var s;
return n===void 0?this._reconnectionDelay:(this._reconnectionDelay=n,(s=this.backoff)===null||s===void 0||s.setMin(n),this)
}
randomizationFactor(n){
var s;
return n===void 0?this._randomizationFactor:(this._randomizationFactor=n,(s=this.backoff)===null||s===void 0||s.setJitter(n),this)
}
reconnectionDelayMax(n){
var s;
return n===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=n,(s=this.backoff)===null||s===void 0||s.setMax(n),this)
}
timeout(n){
return arguments.length?(this._timeout=n,this):this._timeout
}
maybeReconnectOnOpen(){
!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()
}
open(n){
if(~this._readyState.indexOf("open"))return this;
this.engine=new WS(this.uri,this.opts);
const s=this.engine,o=this;
this._readyState="opening",this.skipReconnect=!1;
const l=dn(s,"open",function(){
o.onopen(),n&&n()
}
),c=h=>{
this.cleanup(),this._readyState="closed",this.emitReserved("error",h),n?n(h):this.maybeReconnectOnOpen()
}
,d=dn(s,"error",c);
if(this._timeout!==!1){
const h=this._timeout,p=this.setTimeoutFn(()=>{
l(),c(new Error("timeout")),s.close()
}
,h);
this.opts.autoUnref&&p.unref(),this.subs.push(()=>{
this.clearTimeoutFn(p)
}
)
}
return this.subs.push(l),this.subs.push(d),this
}
connect(n){
return this.open(n)
}
onopen(){
this.cleanup(),this._readyState="open",this.emitReserved("open");
const n=this.engine;
this.subs.push(dn(n,"ping",this.onping.bind(this)),dn(n,"data",this.ondata.bind(this)),dn(n,"error",this.onerror.bind(this)),dn(n,"close",this.onclose.bind(this)),dn(this.decoder,"decoded",this.ondecoded.bind(this)))
}
onping(){
this.emitReserved("ping")
}
ondata(n){
try{
this.decoder.add(n)
}
catch(s){
this.onclose("parse error",s)
}

}
ondecoded(n){
Ba(()=>{
this.emitReserved("packet",n)
}
,this.setTimeoutFn)
}
onerror(n){
this.emitReserved("error",n)
}
socket(n,s){
let o=this.nsps[n];
return o?this._autoConnect&&!o.active&&o.connect():(o=new cy(this,n,s),this.nsps[n]=o),o
}
_destroy(n){
const s=Object.keys(this.nsps);
for(const o of s)if(this.nsps[o].active)return;
this._close()
}
_packet(n){
const s=this.encoder.encode(n);
for(let o=0;
o<s.length;
o++)this.engine.write(s[o],n.options)
}
cleanup(){
this.subs.forEach(n=>n()),this.subs.length=0,this.decoder.destroy()
}
_close(){
this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")
}
disconnect(){
return this._close()
}
onclose(n,s){
var o;
this.cleanup(),(o=this.engine)===null||o===void 0||o.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",n,s),this._reconnection&&!this.skipReconnect&&this.reconnect()
}
reconnect(){
if(this._reconnecting||this.skipReconnect)return this;
const n=this;
if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;
else{
const s=this.backoff.duration();
this._reconnecting=!0;
const o=this.setTimeoutFn(()=>{
n.skipReconnect||(this.emitReserved("reconnect_attempt",n.backoff.attempts),!n.skipReconnect&&n.open(l=>{
l?(n._reconnecting=!1,n.reconnect(),this.emitReserved("reconnect_error",l)):n.onreconnect()
}
))
}
,s);
this.opts.autoUnref&&o.unref(),this.subs.push(()=>{
this.clearTimeoutFn(o)
}
)
}

}
onreconnect(){
const n=this.backoff.attempts;
this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",n)
}

}
const ji={

}
;
function Ta(r,n){
typeof r=="object"&&(n=r,r=void 0),n=n||{

}
;
const s=QS(r,n.path||"/socket.io"),o=s.source,l=s.id,c=s.path,d=ji[l]&&c in ji[l].nsps,h=n.forceNew||n["force new connection"]||n.multiplex===!1||d;
let p;
return h?p=new Tc(o,n):(ji[l]||(ji[l]=new Tc(o,n)),p=ji[l]),s.query&&!n.query&&(n.query=s.queryKey),p.socket(s.path,n)
}
Object.assign(Ta,{
Manager:Tc,Socket:cy,io:Ta,connect:Ta
}
);
const ok=250;
function gm(r,n){
var s;
const o=(s=r.token)!==null&&s!==void 0?s:Gr(),l={
app_id:r.appId,token:o
}
;
o||(l.anonymous_id=Xc());
const c=Ta(r.serverUrl,{
path:r.mountPath,transports:r.transports,query:l
}
);
return c.on("connect",async()=>{
var d;
return console.log("connect",c.id),(d=n.connect)===null||d===void 0?void 0:d.call(n)
}
),c.on("update_model",async d=>{
var h;
return(h=n.update_model)===null||h===void 0?void 0:h.call(n,d)
}
),c.on("error",async d=>{
var h;
return(h=n.error)===null||h===void 0?void 0:h.call(n,d)
}
),c.on("connect_error",async d=>{
var h;
return console.error("connect_error",d),(h=n.error)===null||h===void 0?void 0:h.call(n,d)
}
),c
}
function ak({
config:r
}
){
let n={
...r
}
;
const s={

}
,o={

}
,l={
connect:async()=>{
const b=[];
Object.keys(s).forEach(z=>{
const j=T(z);
j.length!==0&&(g(z),j.forEach(({
connect:I
}
)=>{
const Q=async()=>I==null?void 0:I();
b.push(Q())
}
))
}
),await Promise.all(b)
}
,update_model:async b=>{
const j=T(b.room).map(I=>{
var Q;
return(Q=I.update_model)===null||Q===void 0?void 0:Q.call(I,b)
}
);
await Promise.all(j)
}
,error:async b=>{
console.error("error",b);
const z=Object.values(s).flat().map(j=>{
var I;
return(I=j.error)===null||I===void 0?void 0:I.call(j,b)
}
);
await Promise.all(z)
}

}
;
let c=gm(r,l);
function d(){
h()
}
function h(){
D(),c&&c.disconnect()
}
function p(b){
d(),n={
...n,...b
}
,c=gm(n,l)
}
function g(b){
c.emit("join",b)
}
function v(b){
c.emit("leave",b)
}
async function w(b,z){
var j;
const I=JSON.stringify(z);
return(j=l.update_model)===null||j===void 0?void 0:j.call(l,{
room:b,data:I
}
)
}
function T(b){
var z;
return(z=s[b])!==null&&z!==void 0?z:[]
}
function O(b){
const z=o[b];
z&&(clearTimeout(z),delete o[b])
}
function D(){
Object.keys(o).forEach(b=>{
var z,j;
clearTimeout(o[b]),delete o[b],((j=(z=s[b])===null||z===void 0?void 0:z.length)!==null&&j!==void 0?j:0)===0&&delete s[b]
}
)
}
function N(b){
O(b),o[b]=setTimeout(()=>{
var z,j;
delete o[b],!(((j=(z=s[b])===null||z===void 0?void 0:z.length)!==null&&j!==void 0?j:0)>0)&&(v(b),delete s[b])
}
,ok)
}
return{
socket:c,subscribeToRoom:(b,z)=>{
s[b]?O(b):(g(b),s[b]=[]),s[b].push(z);
let j=!1;
return()=>{
var I,Q;
j||(j=!0,s[b]=(Q=(I=s[b])===null||I===void 0?void 0:I.filter(W=>W!==z))!==null&&Q!==void 0?Q:[],s[b].length===0&&N(b))
}

}
,updateConfig:p,updateModel:w,disconnect:h
}

}
(!globalThis.EventTarget||!globalThis.Event)&&console.error(`
  PartySocket requires a global 'EventTarget' class to be available!
  You can polyfill this global by adding this to your code before any partysocket imports: 
  
  \`\`\`
  import 'partysocket/event-target-polyfill';

  \`\`\`
  Please file an issue at https://github.com/partykit/partykit if you're still having trouble.
`);
var dy=class extends Event{
constructor(n,s){
super("error",s);
Ae(this,"message");
Ae(this,"error");
this.message=n.message,this.error=n
}

}
,fy=class extends Event{
constructor(n=1e3,s="",o){
super("close",o);
Ae(this,"code");
Ae(this,"reason");
Ae(this,"wasClean",!0);
this.code=n,this.reason=s
}

}
,Zu={
Event,ErrorEvent:dy,CloseEvent:fy
}
;
function lk(r,n){
if(!r)throw new Error(n)
}
function uk(r){
return new r.constructor(r.type,r)
}
function ck(r){
return"data"in r?new MessageEvent(r.type,r):"code"in r||"reason"in r?new fy(r.code||1999,r.reason||"unknown reason",r):"error"in r?new dy(r.error,r):new Event(r.type,r)
}
var Pm,dk=typeof process<"u"&&typeof((Pm=process.versions)==null?void 0:Pm.node)<"u"&&typeof document>"u",va=dk?ck:uk,Ir={
maxReconnectionDelay:1e4,minReconnectionDelay:1e3+Math.random()*4e3,minUptime:5e3,reconnectionDelayGrowFactor:1.3,connectionTimeout:4e3,maxRetries:1/0,maxEnqueuedMessages:1/0
}
,ym=!1,fk=class zr extends EventTarget{
constructor(s,o,l={

}
){
super();
Ae(this,"_ws");
Ae(this,"_retryCount",-1);
Ae(this,"_uptimeTimeout");
Ae(this,"_connectTimeout");
Ae(this,"_shouldReconnect",!0);
Ae(this,"_connectLock",!1);
Ae(this,"_binaryType","blob");
Ae(this,"_closeCalled",!1);
Ae(this,"_messageQueue",[]);
Ae(this,"_url");
Ae(this,"_protocols");
Ae(this,"_options");
Ae(this,"onclose",null);
Ae(this,"onerror",null);
Ae(this,"onmessage",null);
Ae(this,"onopen",null);
Ae(this,"_handleOpen",s=>{
this._debug("open event");
const{
minUptime:o=Ir.minUptime
}
=this._options;
clearTimeout(this._connectTimeout),this._uptimeTimeout=setTimeout(()=>this._acceptOpen(),o),lk(this._ws,"WebSocket is not defined"),this._ws.binaryType=this._binaryType,this._messageQueue.forEach(l=>{
var c;
return(c=this._ws)==null?void 0:c.send(l)
}
),this._messageQueue=[],this.onopen&&this.onopen(s),this.dispatchEvent(va(s))
}
);
Ae(this,"_handleMessage",s=>{
this._debug("message event"),this.onmessage&&this.onmessage(s),this.dispatchEvent(va(s))
}
);
Ae(this,"_handleError",s=>{
this._debug("error event",s.message),this._disconnect(void 0,s.message==="TIMEOUT"?"timeout":void 0),this.onerror&&this.onerror(s),this._debug("exec error listeners"),this.dispatchEvent(va(s)),this._connect()
}
);
Ae(this,"_handleClose",s=>{
this._debug("close event"),this._clearTimeouts(),this._shouldReconnect&&this._connect(),this.onclose&&this.onclose(s),this.dispatchEvent(va(s))
}
);
this._url=s,this._protocols=o,this._options=l,this._options.startClosed&&(this._shouldReconnect=!1),this._connect()
}
static get CONNECTING(){
return 0
}
static get OPEN(){
return 1
}
static get CLOSING(){
return 2
}
static get CLOSED(){
return 3
}
get CONNECTING(){
return zr.CONNECTING
}
get OPEN(){
return zr.OPEN
}
get CLOSING(){
return zr.CLOSING
}
get CLOSED(){
return zr.CLOSED
}
get binaryType(){
return this._ws?this._ws.binaryType:this._binaryType
}
set binaryType(s){
this._binaryType=s,this._ws&&(this._ws.binaryType=s)
}
get retryCount(){
return Math.max(this._retryCount,0)
}
get bufferedAmount(){
return this._messageQueue.reduce((o,l)=>(typeof l=="string"?o+=l.length:l instanceof Blob?o+=l.size:o+=l.byteLength,o),0)+(this._ws?this._ws.bufferedAmount:0)
}
get extensions(){
return this._ws?this._ws.extensions:""
}
get protocol(){
return this._ws?this._ws.protocol:""
}
get readyState(){
return this._ws?this._ws.readyState:this._options.startClosed?zr.CLOSED:zr.CONNECTING
}
get url(){
return this._ws?this._ws.url:""
}
get shouldReconnect(){
return this._shouldReconnect
}
close(s=1e3,o){
if(this._closeCalled=!0,this._shouldReconnect=!1,this._clearTimeouts(),!this._ws){
this._debug("close enqueued: no ws instance");
return
}
if(this._ws.readyState===this.CLOSED){
this._debug("close: already closed");
return
}
this._ws.close(s,o)
}
reconnect(s,o){
this._shouldReconnect=!0,this._closeCalled=!1,this._retryCount=-1,!this._ws||this._ws.readyState===this.CLOSED?this._connect():(this._disconnect(s,o),this._connect())
}
send(s){
if(this._ws&&this._ws.readyState===this.OPEN)this._debug("send",s),this._ws.send(s);
else{
const{
maxEnqueuedMessages:o=Ir.maxEnqueuedMessages
}
=this._options;
this._messageQueue.length<o&&(this._debug("enqueue",s),this._messageQueue.push(s))
}

}
_debug(...s){
this._options.debug&&console.log.apply(console,["RWS>",...s])
}
_getNextDelay(){
const{
reconnectionDelayGrowFactor:s=Ir.reconnectionDelayGrowFactor,minReconnectionDelay:o=Ir.minReconnectionDelay,maxReconnectionDelay:l=Ir.maxReconnectionDelay
}
=this._options;
let c=0;
return this._retryCount>0&&(c=o*Math.pow(s,this._retryCount-1),c>l&&(c=l)),this._debug("next delay",c),c
}
_wait(){
return new Promise(s=>{
setTimeout(s,this._getNextDelay())
}
)
}
_getNextProtocols(s){
if(!s)return Promise.resolve(null);
if(typeof s=="string"||Array.isArray(s))return Promise.resolve(s);
if(typeof s=="function"){
const o=s();
if(!o)return Promise.resolve(null);
if(typeof o=="string"||Array.isArray(o))return Promise.resolve(o);
if(o.then)return o
}
throw Error("Invalid protocols")
}
_getNextUrl(s){
if(typeof s=="string")return Promise.resolve(s);
if(typeof s=="function"){
const o=s();
if(typeof o=="string")return Promise.resolve(o);
if(o.then)return o
}
throw Error("Invalid URL")
}
_connect(){
if(this._connectLock||!this._shouldReconnect)return;
this._connectLock=!0;
const{
maxRetries:s=Ir.maxRetries,connectionTimeout:o=Ir.connectionTimeout
}
=this._options;
if(this._retryCount>=s){
this._debug("max retries reached",this._retryCount,">=",s);
return
}
this._retryCount++,this._debug("connect",this._retryCount),this._removeListeners(),this._wait().then(()=>Promise.all([this._getNextUrl(this._url),this._getNextProtocols(this._protocols||null)])).then(([l,c])=>{
if(this._closeCalled){
this._connectLock=!1;
return
}
!this._options.WebSocket&&typeof WebSocket>"u"&&!ym&&(console.error(`‼️ No WebSocket implementation available. You should define options.WebSocket. 

For example, if you're using node.js, run \`npm install ws\`, and then in your code:

import PartySocket from 'partysocket';

import WS from 'ws';


const partysocket = new PartySocket({

  host: "127.0.0.1:1999",
  room: "test-room",
  WebSocket: WS

}
);


`),ym=!0);
const d=this._options.WebSocket||WebSocket;
this._debug("connect",{
url:l,protocols:c
}
),this._ws=c?new d(l,c):new d(l),this._ws.binaryType=this._binaryType,this._connectLock=!1,this._addListeners(),this._connectTimeout=setTimeout(()=>this._handleTimeout(),o)
}
).catch(l=>{
this._connectLock=!1,this._handleError(new Zu.ErrorEvent(Error(l.message),this))
}
)
}
_handleTimeout(){
this._debug("timeout event"),this._handleError(new Zu.ErrorEvent(Error("TIMEOUT"),this))
}
_disconnect(s=1e3,o){
if(this._clearTimeouts(),!!this._ws){
this._removeListeners();
try{
this._ws.close(s,o),this._handleClose(new Zu.CloseEvent(s,o,this))
}
catch{

}

}

}
_acceptOpen(){
this._debug("accept open"),this._retryCount=0
}
_removeListeners(){
this._ws&&(this._debug("removeListeners"),this._ws.removeEventListener("open",this._handleOpen),this._ws.removeEventListener("close",this._handleClose),this._ws.removeEventListener("message",this._handleMessage),this._ws.removeEventListener("error",this._handleError))
}
_addListeners(){
this._ws&&(this._debug("addListeners"),this._ws.addEventListener("open",this._handleOpen),this._ws.addEventListener("close",this._handleClose),this._ws.addEventListener("message",this._handleMessage),this._ws.addEventListener("error",this._handleError))
}
_clearTimeouts(){
clearTimeout(this._connectTimeout),clearTimeout(this._uptimeTimeout)
}

}
;
/*!
 * Reconnecting WebSocket
 * by Pedro Ladaria <pedro.ladaria@gmail.com>
 * https://github.com/pladaria/reconnecting-websocket
 * License MIT
 */var hk=r=>r[1]!==null&&r[1]!==void 0;
function pk(){
if(typeof crypto<"u"&&crypto.randomUUID)return crypto.randomUUID();
let r=new Date().getTime(),n=typeof performance<"u"&&performance.now&&performance.now()*1e3||0;
return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(s){
let o=Math.random()*16;
return r>0?(o=(r+o)%16|0,r=Math.floor(r/16)):(o=(n+o)%16|0,n=Math.floor(n/16)),(s==="x"?o:o&3|8).toString(16)
}
)
}
function hy(r,n,s={

}
){
const{
host:o,path:l,protocol:c,room:d,party:h,query:p
}
=r;
let g=o.replace(/^(http|https|ws|wss):\/\//,"");
if(g.endsWith("/")&&(g=g.slice(0,-1)),l&&l.startsWith("/"))throw new Error("path must not start with a slash");
const v=h??"main",w=l?`/${
l
}
`:"",T=c||(g.startsWith("localhost:")||g.startsWith("127.0.0.1:")||g.startsWith("192.168.")||g.startsWith("10.")||g.startsWith("172.")&&g.split(".")[1]>="16"&&g.split(".")[1]<="31"||g.startsWith("[::ffff:7f00:1]:")?n:n+"s"),O=`${
T
}
://${
g
}
/${
h?`parties/${
h
}
`:"party"
}
/${
d
}
${
w
}
`,D=(_={

}
)=>`${
O
}
?${
new URLSearchParams([...Object.entries(s),...Object.entries(_).filter(hk)])
}
`,N=typeof p=="function"?async()=>D(await p()):D(p);
return{
host:g,path:w,room:d,name:v,protocol:T,partyUrl:O,urlProvider:N
}

}
var mk=class extends fk{
constructor(n){
const s=vm(n);
super(s.urlProvider,s.protocols,s.socketOptions);
Ae(this,"_pk");
Ae(this,"_pkurl");
Ae(this,"name");
Ae(this,"room");
Ae(this,"host");
Ae(this,"path");
this.partySocketOptions=n,this.setWSProperties(s)
}
updateProperties(n){
const s=vm({
...n,host:n.host??this.host,room:n.room??this.room,path:n.path??this.path
}
);
this._url=s.urlProvider,this._protocols=s.protocols,this._options=s.socketOptions,this.setWSProperties(s)
}
setWSProperties(n){
const{
_pk:s,_pkurl:o,name:l,room:c,host:d,path:h
}
=n;
this._pk=s,this._pkurl=o,this.name=l,this.room=c,this.host=d,this.path=h
}
reconnect(n,s){
if(!this.room||!this.host)throw new Error("The room and host must be set before connecting, use `updateProperties` method to set them or pass them to the constructor.");
super.reconnect(n,s)
}
get id(){
return this._pk
}
get roomUrl(){
return this._pkurl
}
static async fetch(n,s){
const o=hy(n,"http"),l=typeof o.urlProvider=="string"?o.urlProvider:await o.urlProvider();
return(n.fetch??fetch)(l,s)
}

}
;
function vm(r){
const{
id:n,host:s,path:o,party:l,room:c,protocol:d,query:h,protocols:p,...g
}
=r,v=n||pk(),w=hy(r,"ws",{
_pk:v
}
);
return{
_pk:v,_pkurl:w.partyUrl,name:w.name,room:w.room,host:w.host,path:w.path,protocols:p,socketOptions:g,urlProvider:w.urlProvider
}

}
const gk=1e3,yk=3e3;
class vk{
constructor(n,s,o,l,c){
var d;
this.onClose=c,this.listeners=new Set,this.heartbeat=null,this.id=(d=l==null?void 0:l.id)!==null&&d!==void 0?d:crypto.randomUUID();
const h=new mk({
host:o.host,party:n,room:s,id:this.id,query:()=>{
const v=o.getAuthToken();
return{
app_id:o.appId,handler:n,...v?{
token:v
}
:{

}
,...o.functionsVersion?{
fv:o.functionsVersion
}
:{

}

}

}

}
);
this.ws=h;
let p=Date.now();
const g=()=>{
p=Date.now()
}
;
h.addEventListener("open",g),h.addEventListener("message",v=>{
g();
let w;
try{
w=JSON.parse(v.data)
}
catch{
return
}
if((w&&typeof w=="object"?w.type:void 0)!=="__pong")for(const O of this.listeners)O(w)
}
),this.heartbeat=setInterval(()=>{
if(Date.now()-p>yk){
g(),h.reconnect();
return
}
try{
h.send(JSON.stringify({
type:"__ping"
}
))
}
catch{

}

}
,gk)
}
subscribe(n){
return this.listeners.add(n),{
unsubscribe:()=>{
this.listeners.delete(n)
}

}

}
send(n){
this.ws.send(JSON.stringify(n))
}
close(){
this.heartbeat&&(clearInterval(this.heartbeat),this.heartbeat=null),this.listeners.clear(),this.ws.close(),this.onClose()
}

}
function wk(r,n,s,o){
let l=null;
return{
connect(c){
if(l)return l;
const d=new vk(r,n,s,c,()=>{
o.delete(d),l===d&&(l=null)
}
);
return l=d,o.add(d),d
}

}

}
function xk(r,n){
return r&&!r.startsWith("/")?r:n??r
}
function bk(r){
const n=new Set;
return{
module:new Proxy({

}
,{
get(o,l){
if(!(typeof l!="string"||l==="then"))return c=>wk(l,c,r,n)
}

}
),closeAll:()=>{
for(const o of[...n])o.close()
}

}

}
function _k(r){
var n,s,o;
const{
serverUrl:l="https://base44.app",appId:c,token:d,serviceToken:h,requiresAuth:p=!1,appBaseUrl:g,options:v,functionsVersion:w,headers:T
}
=r,O=typeof g=="string"?g:"",D={
serverUrl:l,mountPath:"/ws-user-apps/socket.io/",transports:["websocket"],appId:c,token:d
}
;
let N=null;
const _=()=>(N||(N=ak({
config:D
}
)),N),b={
...T,"X-App-Id":String(c)
}
,z=w?{
...b,"Base44-Functions-Version":w
}
:b,j=Ii({
baseURL:`${
l
}
/api`,headers:b,token:d,onError:v==null?void 0:v.onError
}
),I=Ii({
baseURL:`${
l
}
/api`,headers:z,token:d,interceptResponses:!1,onError:v==null?void 0:v.onError
}
),Q={
...b,...d?{
"on-behalf-of":`Bearer ${
d
}
`
}
:{

}

}
,W=Ii({
baseURL:`${
l
}
/api`,headers:Q,token:h,onError:v==null?void 0:v.onError
}
),de=Ii({
baseURL:`${
l
}
/api`,headers:z,token:h,interceptResponses:!1
}
),$=aS(j,I,c,{
appBaseUrl:O
}
);
if(typeof window<"u"){
const xe=d||Gr();
xe&&$.setToken(xe)
}
const le=bk({
appId:c,host:xk(l,typeof window<"u"?(n=window.location)===null||n===void 0?void 0:n.origin:void 0),functionsVersion:w,getAuthToken:()=>d||Gr()
}
),me={
entities:im({
axios:j,appId:c,getSocket:_
}
),integrations:om(j,c),connectors:cS(j,c),auth:$,functions:am(I,c,{
getAuthHeaders:()=>{
const xe={

}
,Re=d||Gr();
return Re&&(xe.Authorization=`Bearer ${
Re
}
`),xe
}
,baseURL:(s=I.defaults)===null||s===void 0?void 0:s.baseURL
}
),agents:lm({
axios:j,getSocket:_,appId:c,serverUrl:l,token:d
}
),aiGateway:um({
serverUrl:l,token:d,appId:c
}
),appLogs:cm(j,c),users:fS(j,c),analytics:Q_({
axiosClient:j,serverUrl:l,appId:c,userAuthModule:$
}
),actors:le.module,cleanup:()=>{
me.analytics.cleanup(),le.closeAll(),N&&N.disconnect()
}

}
,Ce={
entities:im({
axios:W,appId:c,getSocket:_
}
),integrations:om(W,c),sso:lS(W,c),connectors:uS(W,c),functions:am(de,c,{
getAuthHeaders:()=>{
const xe={

}
;
return h&&(xe.Authorization=`Bearer ${
h
}
`),xe
}
,baseURL:(o=de.defaults)===null||o===void 0?void 0:o.baseURL
}
),agents:lm({
axios:W,getSocket:_,appId:c,serverUrl:l,token:d
}
),aiGateway:um({
serverUrl:l,token:h,appId:c
}
),appLogs:cm(W,c),cleanup:()=>{
N&&N.disconnect()
}

}
;
return p&&typeof window<"u"&&setTimeout(async()=>{
try{
await me.auth.isAuthenticated()||me.auth.redirectToLogin(window.location.href)
}
catch(xe){
console.error("Authentication check failed:",xe),me.auth.redirectToLogin(window.location.href)
}

}
,0),{
...me,setToken(xe){
me.auth.setToken(xe),N&&N.updateConfig({
token:xe
}
),D.token=xe
}
,getConfig(){
return{
serverUrl:l,appId:c,requiresAuth:p
}

}
,get asServiceRole(){
if(!h)throw new Error("Service token is required to use asServiceRole. Please provide a serviceToken when creating the client.");
return Ce
}

}

}
const py=typeof window>"u",Sk=py?{
localStorage:new Map
}
:window,Fi=Sk.localStorage,kk=r=>r.replace(/([A-Z])/g,"_$1").toLowerCase(),Rs=(r,{
defaultValue:n=void 0,removeFromUrl:s=!1
}
={

}
)=>{
if(py)return n;
const o=`base44_${
kk(r)
}
`,l=new URLSearchParams(window.location.search),c=l.get(r);
if(s){
l.delete(r);
const h=`${
window.location.pathname
}
${
l.toString()?`?${
l.toString()
}
`:""
}
${
window.location.hash
}
`;
window.history.replaceState({

}
,document.title,h)
}
if(c)return Fi.setItem(o,c),c;
if(n)return Fi.setItem(o,n),n;
const d=Fi.getItem(o);
return d||null
}
,Ek=()=>(Rs("clear_access_token")==="true"&&(Fi.removeItem("base44_access_token"),Fi.removeItem("token")),{
appId:Rs("app_id",{
defaultValue:"6a77449c0d40e1579c14ec79"
}
),token:Rs("access_token",{
removeFromUrl:!0
}
),fromUrl:Rs("from_url",{
defaultValue:window.location.href
}
),functionsVersion:Rs("functions_version",{
defaultValue:"prod"
}
),appBaseUrl:Rs("app_base_url",{
defaultValue:void 0
}
)
}
),Di={
...Ek()
}
,{
appId:Ck,token:Rk,functionsVersion:Tk,appBaseUrl:Nk
}
=Di,Mi=_k({
appId:Ck,token:Rk,functionsVersion:Tk,serverUrl:"",requiresAuth:!1,appBaseUrl:Nk
}
);
function Ok({

}
){
var l;
const n=$c().pathname.substring(1),{
data:s,isFetched:o
}
=jx({
queryKey:["user"],queryFn:async()=>{
try{
return{
user:await Mi.auth.me(),isAuthenticated:!0
}

}
catch{
return{
user:null,isAuthenticated:!1
}

}

}

}
);
return y.jsx("div",{
className:"min-h-screen flex items-center justify-center p-6 bg-slate-50",children:y.jsx("div",{
className:"max-w-md w-full",children:y.jsxs("div",{
className:"text-center space-y-6",children:[y.jsxs("div",{
className:"space-y-2",children:[y.jsx("h1",{
className:"text-7xl font-light text-slate-300",children:"404"
}
),y.jsx("div",{
className:"h-0.5 w-16 bg-slate-200 mx-auto"
}
)]
}
),y.jsxs("div",{
className:"space-y-3",children:[y.jsx("h2",{
className:"text-2xl font-medium text-slate-800",children:"Page Not Found"
}
),y.jsxs("p",{
className:"text-slate-600 leading-relaxed",children:["The page ",y.jsxs("span",{
className:"font-medium text-slate-700",children:['"',n,'"']
}
)," could not be found in this application."]
}
)]
}
),o&&s.isAuthenticated&&((l=s.user)==null?void 0:l.role)==="admin"&&y.jsx("div",{
className:"mt-8 p-4 bg-slate-100 rounded-lg border border-slate-200",children:y.jsxs("div",{
className:"flex items-start space-x-3",children:[y.jsx("div",{
className:"flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mt-0.5",children:y.jsx("div",{
className:"w-2 h-2 rounded-full bg-orange-400"
}
)
}
),y.jsxs("div",{
className:"text-left space-y-1",children:[y.jsx("p",{
className:"text-sm font-medium text-slate-700",children:"Admin Note"
}
),y.jsx("p",{
className:"text-sm text-slate-600 leading-relaxed",children:"This could mean that the AI hasn't implemented this page yet. Ask it to implement it in the chat."
}
)]
}
)]
}
)
}
),y.jsx("div",{
className:"pt-6",children:y.jsxs("button",{
onClick:()=>window.location.href="/",className:"inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500",children:[y.jsx("svg",{
className:"w-4 h-4 mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:y.jsx("path",{
strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
}
)
}
),"Go Home"]
}
)
}
)]
}
)
}
)
}
)
}
const my=F.createContext(),Pk=({
children:r
}
)=>{
const[n,s]=F.useState(null),[o,l]=F.useState(!1),[c,d]=F.useState(!0),[h,p]=F.useState(!0),[g,v]=F.useState(null),[w,T]=F.useState(!1),[O,D]=F.useState(null);
F.useEffect(()=>{
N()
}
,[]);
const N=async()=>{
var j,I;
try{
p(!0),v(null);
const Q=Ii({
baseURL:"/api/apps/public",headers:{
"X-App-Id":Di.appId
}
,token:Di.token,interceptResponses:!0
}
);
try{
const W=await Q.get(`/prod/public-settings/by-id/${
Di.appId
}
`);
D(W),Di.token?await _():(d(!1),l(!1),T(!0)),p(!1)
}
catch(W){
if(console.error("App state check failed:",W),W.status===403&&((I=(j=W.data)==null?void 0:j.extra_data)!=null&&I.reason)){
const de=W.data.extra_data.reason;
v(de==="auth_required"?{
type:"auth_required",message:"Authentication required"
}
:de==="user_not_registered"?{
type:"user_not_registered",message:"User not registered for this app"
}
:{
type:de,message:W.message
}
)
}
else v({
type:"unknown",message:W.message||"Failed to load app"
}
);
p(!1),d(!1)
}

}
catch(Q){
console.error("Unexpected error:",Q),v({
type:"unknown",message:Q.message||"An unexpected error occurred"
}
),p(!1),d(!1)
}

}
,_=async()=>{
try{
d(!0);
const j=await Mi.auth.me();
s(j),l(!0),d(!1),T(!0)
}
catch(j){
console.error("User auth check failed:",j),d(!1),l(!1),T(!0),(j.status===401||j.status===403)&&v({
type:"auth_required",message:"Authentication required"
}
)
}

}
,b=(j=!0)=>{
s(null),l(!1),j?Mi.auth.logout(window.location.href):Mi.auth.logout()
}
,z=()=>{
Mi.auth.redirectToLogin(window.location.href)
}
;
return y.jsx(my.Provider,{
value:{
user:n,isAuthenticated:o,isLoadingAuth:c,isLoadingPublicSettings:h,authError:g,appPublicSettings:O,authChecked:w,logout:b,navigateToLogin:z,checkUserAuth:_,checkAppState:N
}
,children:r
}
)
}
,Ak=()=>{
const r=F.useContext(my);
if(!r)throw new Error("useAuth must be used within an AuthProvider");
return r
}
,jk=()=>y.jsx("div",{
className:"flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-50",children:y.jsx("div",{
className:"max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-slate-100",children:y.jsxs("div",{
className:"text-center",children:[y.jsx("div",{
className:"inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-orange-100",children:y.jsx("svg",{
className:"w-8 h-8 text-orange-600",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:y.jsx("path",{
strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
}
)
}
)
}
),y.jsx("h1",{
className:"text-3xl font-bold text-slate-900 mb-4",children:"Access Restricted"
}
),y.jsx("p",{
className:"text-slate-600 mb-8",children:"You are not registered to use this application. Please contact the app administrator to request access."
}
),y.jsxs("div",{
className:"p-4 bg-slate-50 rounded-md text-sm text-slate-600",children:[y.jsx("p",{
children:"If you believe this is an error, you can:"
}
),y.jsxs("ul",{
className:"list-disc list-inside mt-2 space-y-1",children:[y.jsx("li",{
children:"Verify you are logged in with the correct account"
}
),y.jsx("li",{
children:"Contact the app administrator for access"
}
),y.jsx("li",{
children:"Try logging out and back in again"
}
)]
}
)]
}
)]
}
)
}
)
}
),Lk=r=>{
const n=r.slice(1);
try{
return decodeURIComponent(n)
}
catch{
return n
}

}
;
function Ik(){
const{
pathname:r,hash:n
}
=$c(),s=i1();
return F.useEffect(()=>{
if(s!=="POP"){
if(n){
const o=Lk(n),l=window.setTimeout(()=>{
var c;
(c=document.getElementById(o))==null||c.scrollIntoView({
behavior:"smooth"
}
)
}
,50);
return()=>window.clearTimeout(l)
}
window.scrollTo({
top:0,left:0,behavior:"instant"
}
)
}

}
,[r,n,s]),null
}
const ec=[{
code:"en",label:"EN",name:"English"
}
,{
code:"it",label:"IT",name:"Italiano"
}
,{
code:"zh",label:"中",name:"中文"
}
],gy=F.createContext({
lang:"en",setLang:()=>{

}
,t:r=>r
}
);
function zk({
children:r
}
){
const[n,s]=F.useState(()=>typeof window>"u"?"en":localStorage.getItem("ss-lang")||"en");
F.useEffect(()=>{
localStorage.setItem("ss-lang",n),document.documentElement.lang=n
}
,[n]);
const o=l=>{
const c=l.split(".");
let d=Dk[n];
for(const h of c)d=d==null?void 0:d[h];
return d??l
}
;
return y.jsx(gy.Provider,{
value:{
lang:n,setLang:s,t:o
}
,children:r
}
)
}
const xr=()=>F.useContext(gy),Dk={
en:{
nav:{
atmosphere:"Atmosphere",menu:"Menu",findUs:"Find Us",guestbook:"Guestbook",cta:"Find Us"
}
,hero:{
welcome:"welcome · 欢迎",title1:"Where Italian dolcezza",title2:"meets Chinese serenity",subtitle:"A hidden bubble tea & cake shop in the heart of Brescia — a small sanctuary of fresh boba, handmade cakes, and afternoons that ask nothing of you.",directions:"Find Us",bake:"See the Menu"
}
,atmosphere:{
label:"the atmosphere",title:"Every cup is happiness",p1:"Step in and the street softens. Sage walls, pale oak, a row of white stools at the bar and shelves dressed with little objects collected over time. Light falls gently through the window onto the counter where each drink is made by hand.",p2:"We are a little Chinese-Italian corner — boba and bubble tea from one tradition, cakes and dolcezza from the other, both served in the same quiet, rounded room. Stay a while;
 there is no hurry here.",f1t:"Sage & oak",f1s:"a palette borrowed from stillness",f2t:"Made by hand",f2s:"every cup, every cake",f3t:"No hurry",f3s:"a room that asks nothing of you"
}
,menu:{
label:"the menu",title:"The Menu",subtitle:"Fresh boba, fruit tea, and handmade cakes — baked and brewed each day. Tap a cake to read more.",notes:"Tasting notes",priceTitle:"The Price List",priceSubtitle:"Everything on the counter, plainly priced. Prices in euro.",cats:{
milkTea:"Milk Tea",highlights:"Highlights",summer:"Summer Series",fruitTea:"Fruit Tea",snacks:"Snacks",toppings:"Toppings",cakes:"Cakes"
}
,boardHint:"See our menu boards below"
}
,location:{
label:"find us",title:"Find our little corner",directions:"Get Directions",guideMe:"Guide me to September",hoursLabel:"Hours",phoneLabel:"Call us",instaLabel:"Follow us",closed:"Closed",closedNote:"Closed on Mondays so the kettle may rest",vibe:{
resting:"Resting — we reopen tomorrow at noon",morning:"Quiet · we open at noon",lunch:"Warm & lively · lunchtime pause",afternoon:"Soft & golden · afternoon tea",evening:"Closing soon · come back tomorrow"
}

}
,days:{
mon:"Monday",tue:"Tuesday",wed:"Wednesday",thu:"Thursday",fri:"Friday",sat:"Saturday",sun:"Sunday"
}
,guestbook:{
label:"the guestbook",title:"A wall of moments",subtitle:"Words left behind by those who stayed a while."
}
,reviews:[{
text:"The matcha bubble tea is the best in Brescia, and the cakes look too beautiful to eat. I stayed an hour longer than I meant to.",author:"Giulia R.",place:"Brescia"
}
,{
text:"A tiny, calm room with sage walls and the kindest staff. The boba is fresh and the cakes are handmade — it feels like a little secret.",author:"Marco D.",place:"Milano"
}
,{
text:"My favourite corner of the city. Soft light, soft music, and a heart-shaped cake that made my whole day.",author:"Sofia B.",place:"Verona"
}
],footer:{
tagline:"Bubble Tea & Cake · 奶茶与蛋糕",description:"A little Chinese-Italian corner in Brescia — fresh boba, handmade cakes, and a quiet room to enjoy them in.",visit:"Visit",hours:"Hours",follow:"Follow",madeWith:"made with love · 以爱制成",rights:"Brescia, Italia"
}

}
,it:{
nav:{
atmosphere:"Atmosfera",menu:"Menù",findUs:"Trovaci",guestbook:"Ospiti",cta:"Trovaci"
}
,hero:{
welcome:"benvenuti · 欢迎",title1:"Dove la dolcezza italiana",title2:"incontra la serenità cinese",subtitle:"Un piccolo locale di bubble tea e torte nel cuore di Brescia — un rifugio di boba fresco, torte fatte a mano e pomeriggi che non chiedono nulla.",directions:"Trovaci",bake:"Vedi il Menù"
}
,atmosphere:{
label:"l'atmosfera",title:"Ogni tazza è felicità",p1:"Entra e la strada si addolcisce. Pareti salvia, quercia pallida, una fila di sgabelli bianchi al bancone e mensole con piccoli oggetti raccolti nel tempo. La luce entra dolce dalla finestra sul bancone dove ogni bevanda è fatta a mano.",p2:"Siamo un piccolo angolo sino-italiano — boba e bubble tea da una tradizione, torte e dolcezza dall'altra, serviti nella stessa stanza quieta e arrotondata. Fermati un po';
 qui non c'è fretta.",f1t:"Salvia e quercia",f1s:"una tinta presa in prestito dalla quiete",f2t:"Fatto a mano",f2s:"ogni tazza, ogni torta",f3t:"Senza fretta",f3s:"una stanza che non chiede nulla"
}
,menu:{
label:"il menù",title:"Il Menù",subtitle:"Boba fresco, tè alla frutta e torte fatte a mano — sfornati e preparati ogni giorno. Tocca una torta per saperne di più.",notes:"Note di degustazione",priceTitle:"La Lista dei Prezzi",priceSubtitle:"Tutto ciò che è sul bancone, con prezzo chiaro. Prezzi in euro.",cats:{
milkTea:"Milk Tea",highlights:"In Evidenza",summer:"Serie Estiva",fruitTea:"Tè alla Frutta",snacks:"Snack",toppings:"Topping",cakes:"Torte"
}
,boardHint:"Vedi le nostre lavagne menù qui sotto"
}
,location:{
label:"trovaci",title:"Trova il nostro angolino",directions:"Ottieni indicazioni",guideMe:"Guidami da September",hoursLabel:"Orari",phoneLabel:"Chiamaci",instaLabel:"Seguici",closed:"Chiuso",closedNote:"Chiuso il lunedì per far riposare il bollitore",vibe:{
resting:"Riposo — riapriamo domani a mezzogiorno",morning:"Quieto · apriamo a mezzogiorno",lunch:"Caldo e vivace · la pausa di mezzogiorno",afternoon:"Morbido e dorato · il tè del pomeriggio",evening:"Chiudiamo presto · torna domani"
}

}
,days:{
mon:"Lunedì",tue:"Martedì",wed:"Mercoledì",thu:"Giovedì",fri:"Venerdì",sat:"Sabato",sun:"Domenica"
}
,guestbook:{
label:"il libro degli ospiti",title:"Un muro di momenti",subtitle:"Parole lasciate da chi si è fermato un po'."
}
,reviews:[{
text:"Il bubble tea al matcha è il migliore di Brescia, e le torte sono troppo belle per mangiarle. Sono rimasta un'ora più del previsto.",author:"Giulia R.",place:"Brescia"
}
,{
text:"Una stanza piccola e calma con pareti salvia e il personale più gentile. Il boba è fresco e le torte fatte a mano — sembra un piccolo segreto.",author:"Marco D.",place:"Milano"
}
,{
text:"Il mio angolo preferito della città. Luce dolce, musica dolce, e una torta a forma di cuore che mi ha reso la giornata.",author:"Sofia B.",place:"Verona"
}
],footer:{
tagline:"Bubble Tea & Cake · 奶茶与蛋糕",description:"Un piccolo angolo sino-italiano a Brescia — boba fresco, torte fatte a mano e una stanza quieta per gustarle.",visit:"Visita",hours:"Orari",follow:"Seguici",madeWith:"fatto con amore · 以爱制成",rights:"Brescia, Italia"
}

}
,zh:{
nav:{
atmosphere:"氛围",menu:"菜单",findUs:"寻访",guestbook:"留言",cta:"寻访"
}
,hero:{
welcome:"欢迎 · benvenuti",title1:"意式甜蜜",title2:"遇见中式宁静",subtitle:"藏在布雷西亚市中心的小小奶茶蛋糕铺——一处鲜制波霸、手作蛋糕与无所求的午后。",directions:"寻访我们",bake:"查看菜单"
}
,atmosphere:{
label:"氛围",title:"每一杯都是快乐",p1:"走进来，街市的喧嚣便轻下来。青瓷色的墙、浅橡木、吧台前一排白凳，与架上慢慢攒起的小物件。光从窗子柔柔落在吧台上，每一杯都由手现做。",p2:"我们是一处小小的中意角落——波霸与奶茶来自一处，蛋糕与甜蜜来自另一处，都端上同一间安静、圆润的小屋。坐一会儿吧，这里不急。",f1t:"青瓷与橡木",f1s:"向宁静借来的色调",f2t:"手作",f2s:"每一杯，每一只蛋糕",f3t:"不急",f3s:"一间无所求的小屋"
}
,menu:{
label:"菜单",title:"菜单",subtitle:"鲜制波霸、水果茶与手作蛋糕——每日现做现烤。轻触一只蛋糕了解更多。",notes:"品鉴笔记",priceTitle:"价目表",priceSubtitle:"柜台上的每一物，明码标价。价格以欧元计。",cats:{
milkTea:"奶茶",highlights:"招牌精选",summer:"夏日系列",fruitTea:"水果茶",snacks:"小吃",toppings:"加料",cakes:"蛋糕"
}
,boardHint:"下方为我们的菜单板"
}
,location:{
label:"寻访",title:"找到我们的小角落",directions:"获取路线",guideMe:"带我去 September",hoursLabel:"营业时间",phoneLabel:"致电",instaLabel:"关注我们",closed:"休息",closedNote:"周一休息，让水壶安眠",vibe:{
resting:"休息中——明日正午重开",morning:"宁静·正午开门",lunch:"温暖热闹·午间小憩",afternoon:"柔和金黄·午后茶",evening:"即将打烊·明日再来"
}

}
,days:{
mon:"周一",tue:"周二",wed:"周三",thu:"周四",fri:"周五",sat:"周六",sun:"周日"
}
,guestbook:{
label:"留言簿",title:"一面时刻之墙",subtitle:"留下的人，留下的字。"
}
,reviews:[{
text:"布雷西亚最好的抹茶奶茶，蛋糕美得舍不得吃。我多待了一整个小时。",author:"Giulia R.",place:"布雷西亚"
}
,{
text:"一间青墙、安静的小店，店员温柔。波霸新鲜，蛋糕手作——像一个小秘密。",author:"Marco D.",place:"米兰"
}
,{
text:"我在城里最爱的角落。柔光、柔乐，一只心形蛋糕点亮了我整天。",author:"Sofia B.",place:"维罗纳"
}
],footer:{
tagline:"奶茶与蛋糕 · Bubble Tea & Cake",description:"布雷西亚的一处小小中意角落——鲜制波霸、手作蛋糕，与一间安静的小屋。",visit:"到访",hours:"营业时间",follow:"关注",madeWith:"以爱制成 · fatto con amore",rights:"布雷西亚，意大利"
}

}

}
,yy=F.createContext({
theme:"light",toggle:()=>{

}

}
);
function Mk({
children:r
}
){
const[n,s]=F.useState(()=>typeof window>"u"?"light":localStorage.getItem("ss-theme")||"light");
return F.useEffect(()=>{
const o=document.documentElement;
n==="dark"?o.classList.add("dark"):o.classList.remove("dark"),localStorage.setItem("ss-theme",n)
}
,[n]),y.jsx(yy.Provider,{
value:{
theme:n,toggle:()=>s(o=>o==="dark"?"light":"dark")
}
,children:r
}
)
}
const Uk=()=>F.useContext(yy);
function Fk(){
const r=F.useRef(null),n=F.useRef(null),[s,o]=F.useState(!1),[l,c]=F.useState(!1);
return F.useEffect(()=>{
if(!window.matchMedia("(pointer: fine)").matches)return;
o(!0),document.body.style.cursor="none";
let d=0,h=0,p=0,g=0,v;
const w=O=>{
p=O.clientX,g=O.clientY,r.current&&(r.current.style.transform=`translate(${
p
}
px, ${
g
}
px)`);
const D=O.target;
c(!!D.closest("a, button, [data-cursor-hover]"))
}
,T=()=>{
d+=(p-d)*.18,h+=(g-h)*.18,n.current&&(n.current.style.transform=`translate(${
d
}
px, ${
h
}
px)`),v=requestAnimationFrame(T)
}
;
return v=requestAnimationFrame(T),window.addEventListener("mousemove",w),()=>{
window.removeEventListener("mousemove",w),cancelAnimationFrame(v),document.body.style.cursor=""
}

}
,[]),s?y.jsxs(y.Fragment,{
children:[y.jsx("div",{
ref:n,className:"pointer-events-none fixed top-0 left-0 z-[9999] -ml-5 -mt-5 will-change-transform transition-[width,height,opacity] duration-300",style:{
width:l?56:38,height:l?56:38
}
,children:y.jsx("div",{
className:"w-full h-full rounded-full border-2 border-secondary/70 transition-all duration-300",style:{
backdropFilter:"invert(0.06)"
}

}
)
}
),y.jsx("div",{
ref:r,className:"pointer-events-none fixed top-0 left-0 z-[9999] -ml-1 -mt-1 will-change-transform",children:y.jsx("div",{
className:"w-2 h-2 rounded-full bg-secondary"
}
)
}
)]
}
):null
}
const Ue={
name:"September",nameZh:"九月",phone:"+39 377 839 7349",email:"ciao@septemberbrescia.it",instagram:"https://www.instagram.com/septemberbrescia/",addressLines:{
en:["Via Fratelli Porcellaga, 42","25122 Brescia BS, Italy"],it:["Via Fratelli Porcellaga, 42","25122 Brescia BS, Italia"],zh:["Fratelli Porcellaga 街 42 号","25122 布雷西亚, 意大利"]
}
,mapsUrl:"https://www.google.com/maps/search/?api=1&query=Via+Fratelli+Porcellaga+42+Brescia+Italy",hours:[{
key:"mon",time:"closed"
}
,{
key:"tue",time:"12:00–20:30"
}
,{
key:"wed",time:"12:00–20:30"
}
,{
key:"thu",time:"12:00–20:30"
}
,{
key:"fri",time:"12:00–20:30"
}
,{
key:"sat",time:"12:00–20:30"
}
,{
key:"sun",time:"12:00–20:30"
}
]
}
,Qt="https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/",yr={
hero:`${
Qt
}
8c7dd26ab_unnamed25.webp`,counter:`${
Qt
}
3bc3d0bac_unnamed24.webp`,bubbletea:`${
Qt
}
dd408fbb2_unnamed26.webp`,storefront:`${
Qt
}
13591cd0c_unnamed22.webp`,products:`${
Qt
}
ad1bda049_unnamed23.webp`,menuDrinks:`${
Qt
}
bc9edf317_224fb71e-26d9-4995-a87b-c4af9b6ac5a3.jpg`,menuSnacks:`${
Qt
}
065606f9c_7f7ed8db-8f5b-4f3d-b5f5-268625a98d06.jpg`,menuNewSnacks:`${
Qt
}
12c82929a_458e946a-e213-408b-a89e-541e0cd29117.jpg`
}
,Bk=[{
key:"matcha",image:`${
Qt
}
83ae66714_b8a02b4a-c73e-45e8-a746-f1f81530b324.jpg`,price:"€4,50",name:{
en:"Matcha Cream Cake",it:"Torta al Matcha",zh:"抹茶奶油蛋糕"
}
,desc:{
en:"Matcha cream, fresh blueberries, a sprig of rosemary",it:"Crema di matcha, mirtilli freschi, un rametto di rosmarino",zh:"抹茶奶油，新鲜蓝莓，一枝迷迭香"
}

}
,{
key:"love",image:`${
Qt
}
1ac69291c_241b0524-f328-4956-8cab-f2f6871ae499.jpg`,price:"€5,00",name:{
en:"Love Heart Cake",it:"Torta Cuore d'Amore",zh:"爱心蛋糕"
}
,desc:{
en:"Pink buttercream, hand-piped hearts, a little sweetness for someone",it:"Burro rosa, cuori disegnati a mano, una dolcezza per qualcuno",zh:"粉色奶油，手绘爱心，给某个人的小甜"
}

}
,{
key:"ribbon",image:`${
Qt
}
4b6970c46_3b1b99b9-5b72-4275-af5e-7bf34c1a5200.jpg`,price:"€5,00",name:{
en:"Ribbon Cake",it:"Torta Nastro",zh:"缎带蛋糕"
}
,desc:{
en:"Ruffled ivory frosting, black satin bows, quiet elegance",it:"Crema bianca arricciata, fiocchi di raso neri, eleganza quieta",zh:"白色褶边奶油，黑色缎带蝴蝶结，安静的优雅"
}

}
,{
key:"100days",image:`${
Qt
}
e46422cab_cefbca36-5611-4410-bfa1-9bf83b7f67bb.jpg`,price:"€5,00",name:{
en:"100 Days Cake",it:"Torta 100 Giorni",zh:"100天蛋糕"
}
,desc:{
en:"Heart-shaped, raspberries, blueberries, a celebration in miniature",it:"A forma di cuore, lamponi, mirtilli, una celebrazione in miniatura",zh:"心形，覆盆子，蓝莓，一场微型的庆典"
}

}
],$k=[{
key:"milkTea",note:"M / L",items:[{
name:"Classico",zh:"经典",price:"4,5 / 5,5"
}
,{
name:"Gelsomino",zh:"茉莉",price:"4,5 / 5,5"
}
,{
name:"Vaniglia",zh:"香草",price:"4,5 / 5,5"
}
,{
name:"Caramel",zh:"焦糖",price:"4,5 / 5,5"
}
,{
name:"Taro",zh:"芋头",price:"4,5 / 5,5"
}
,{
name:"Chocolate Oreo",zh:"巧克力奥利奥",price:"5 / 6"
}
,{
name:"Tre Fratelli",zh:"三兄弟",price:"5 / 6"
}
,{
name:"Mochi",zh:"麻薯",price:"5 / 6"
}
,{
name:"Taro Bobo",zh:"芋圆波波",price:"5 / 6"
}
,{
name:"Coco Mango",zh:"椰子芒果",price:"5 / 6"
}
,{
name:"Coco Caffè",zh:"椰子咖啡",price:"5 / 6"
}
,{
name:"Family",zh:"家庭装",price:"7"
}
]
}
,{
key:"highlights",items:[{
name:"Matcha con Cheese",zh:"抹茶芝士",price:"5"
}
,{
name:"Uva Cheese",zh:"葡萄芝士",price:"6"
}
,{
name:"Mango Sago Pomelo",zh:"芒果西米柚",price:"6"
}
,{
name:"Super Fruit",zh:"超级水果",price:"6"
}
]
}
,{
key:"summer",items:[{
name:"Fragola Cheese",zh:"草莓芝士",price:"6"
}
,{
name:"Mango Cheese",zh:"芒果芝士",price:"6"
}
,{
name:"Taro Cheese",zh:"芋头芝士",price:"6"
}
,{
name:"Litchi Cheese",zh:"荔枝芝士",price:"6"
}
,{
name:"Matcha Frappe",zh:"抹茶冰沙",price:"6"
}
,{
name:"Chocolate Frappe",zh:"巧克力冰沙",price:"6"
}
]
}
,{
key:"fruitTea",items:[{
name:"Pieno di Pompelmo",zh:"满杯柚子",price:"6"
}
,{
name:"Peach e Strawberry",zh:"蜜桃草莓",price:"6"
}
,{
name:"Passion Fruit",zh:"百香果",price:"6"
}
,{
name:"Litchi",zh:"荔枝",price:"6"
}
,{
name:"Passion e Pompelmo",zh:"百香柚子",price:"6"
}
,{
name:"Lemon Black Tea",zh:"柠檬红茶",price:"6"
}
,{
name:"Lemon Green Tea",zh:"柠檬绿茶",price:"6"
}
,{
name:"Mango Yakult",zh:"芒果养乐多",price:"6"
}
,{
name:"Grape Yakult",zh:"葡萄养乐多",price:"6"
}
,{
name:"Lemon Yakult",zh:"柠檬养乐多",price:"6"
}
,{
name:"Mango Tea",zh:"芒果茶",price:"6"
}
]
}
,{
key:"snacks",items:[{
name:"Hotdog",zh:"热狗",price:"2"
}
,{
name:"Popcorn Chicken",zh:"鸡米花",price:"6"
}
,{
name:"Tender Crispy",zh:"鸡柳",price:"6"
}
,{
name:"Chicken Wings (5pz)",zh:"海苔肉松炸鸡",price:"8"
}
,{
name:"Involtini (6pz)",zh:"春卷",price:"3,5"
}
,{
name:"Wonton Soup",zh:"鲜肉馄饨",price:"7"
}
,{
name:"Taro Ball (20min)",zh:"芋圆",price:"6"
}
,{
name:"Takoyaki",zh:"章鱼小丸子",price:"6"
}
,{
name:"Meatball",zh:"瘦肉丸",price:"8"
}
,{
name:"Suino / Chicken Crepes",zh:"手抓饼",price:"7,5"
}
]
}
,{
key:"toppings",prefix:"+",items:[{
name:"Tapioca",zh:"波霸",price:"0,7"
}
,{
name:"Cristallo Bobo",zh:"水晶波波",price:"0,7"
}
,{
name:"Sago",zh:"西米",price:"0,7"
}
,{
name:"Boba Fragola",zh:"草莓波霸",price:"0,7"
}
,{
name:"Taro",zh:"芋头",price:"0,7"
}
,{
name:"Cream Cheese",zh:"奶盖",price:"0,7"
}
,{
name:"Pudding",zh:"布丁",price:"0,7"
}
,{
name:"Jelly Erba",zh:"仙草",price:"0,7"
}
,{
name:"Nata de Coco",zh:"椰果",price:"0,7"
}
]
}
];
function qk(){
var T;
const{
t:r,lang:n,setLang:s
}
=xr(),{
theme:o,toggle:l
}
=Uk(),[c,d]=F.useState(!1),[h,p]=F.useState(!1),[g,v]=F.useState(!1);
F.useEffect(()=>{
const O=()=>d(window.scrollY>40);
return O(),window.addEventListener("scroll",O),()=>window.removeEventListener("scroll",O)
}
,[]);
const w=[{
label:r("nav.atmosphere"),href:"#atmosphere"
}
,{
label:r("nav.menu"),href:"#menu"
}
,{
label:r("nav.findUs"),href:"#location"
}
,{
label:r("nav.guestbook"),href:"#guestbook"
}
];
return y.jsxs("header",{
className:`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
c?"bg-background/85 backdrop-blur-md shadow-[0_1px_0_0_hsl(var(--border))]":"bg-transparent"
}
`,children:[y.jsxs("nav",{
className:"max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-20",children:[y.jsxs("a",{
href:"#top",className:"flex items-center gap-3",children:[y.jsx("span",{
className:"w-9 h-9 rounded-full border border-primary/40 flex items-center justify-center text-primary font-display text-base leading-none",children:Ue.nameZh
}
),y.jsx("span",{
className:"font-display text-xl tracking-wide text-primary",children:Ue.name
}
)]
}
),y.jsxs("div",{
className:"hidden md:flex items-center gap-8",children:[w.map(O=>y.jsx("a",{
href:O.href,className:"text-sm tracking-wide text-primary/80 hover:text-primary transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-secondary after:transition-all after:duration-500",children:O.label
}
,O.href)),y.jsxs("div",{
className:"relative",children:[y.jsxs("button",{
onClick:()=>v(O=>!O),className:"flex items-center gap-1 text-sm text-primary/80 hover:text-primary",children:[y.jsx(H0,{
size:16
}
),(T=ec.find(O=>O.code===n))==null?void 0:T.label]
}
),g&&y.jsx("div",{
className:"absolute right-0 mt-2 bg-background border border-border rounded-2xl shadow-lg py-2 min-w-[8rem] animate-fade-in",children:ec.map(O=>y.jsx("button",{
onClick:()=>{
s(O.code),v(!1)
}
,className:`w-full text-left px-4 py-1.5 text-sm hover:bg-secondary/20 ${
n===O.code?"text-secondary":"text-primary/80"
}
`,children:O.name
}
,O.code))
}
)]
}
),y.jsx("button",{
onClick:l,className:"text-primary/80 hover:text-primary","aria-label":"Toggle theme",children:o==="dark"?y.jsx(ap,{
size:18
}
):y.jsx(op,{
size:18
}
)
}
),y.jsx("a",{
href:Ue.instagram,target:"_blank",rel:"noreferrer",className:"text-primary/80 hover:text-primary","aria-label":"Instagram",children:y.jsx(Ac,{
size:18
}
)
}
),y.jsx("a",{
href:Ue.mapsUrl,target:"_blank",rel:"noreferrer",className:"text-sm tracking-wide px-5 py-2 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500",children:r("nav.cta")
}
)]
}
),y.jsxs("div",{
className:"md:hidden flex items-center gap-3",children:[y.jsx("button",{
onClick:l,className:"text-primary","aria-label":"Toggle theme",children:o==="dark"?y.jsx(ap,{
size:18
}
):y.jsx(op,{
size:18
}
)
}
),y.jsx("button",{
className:"text-primary",onClick:()=>p(O=>!O),"aria-label":"Menu",children:h?y.jsx(Lc,{
size:22
}
):y.jsx(Y0,{
size:22
}
)
}
)]
}
)]
}
),h&&y.jsx("div",{
className:"md:hidden bg-background/95 backdrop-blur-md border-t border-border animate-fade-in",children:y.jsxs("div",{
className:"px-6 py-6 flex flex-col gap-5",children:[w.map(O=>y.jsx("a",{
href:O.href,onClick:()=>p(!1),className:"text-base text-primary/85",children:O.label
}
,O.href)),y.jsx("div",{
className:"flex gap-3 pt-2",children:ec.map(O=>y.jsx("button",{
onClick:()=>s(O.code),className:`px-3 py-1.5 rounded-full text-sm border ${
n===O.code?"border-secondary text-secondary":"border-border text-primary/70"
}
`,children:O.label
}
,O.code))
}
),y.jsx("a",{
href:Ue.mapsUrl,target:"_blank",rel:"noreferrer",onClick:()=>p(!1),className:"text-base px-5 py-2.5 rounded-full border border-primary/30 text-primary text-center",children:r("nav.cta")
}
)]
}
)
}
)]
}
)
}
function Vk(r){
const[n,s]=F.useState(null);
return F.useLayoutEffect(()=>{
const o=r.current;
if(!o)return;
const l=o.getBoundingClientRect();
s({
width:l.width,height:l.height
}
);
const c=new ResizeObserver(([d])=>{
const{
width:h,height:p
}
=d.contentRect;
s({
width:h,height:p
}
)
}
);
return c.observe(o),()=>c.disconnect()
}
,[r]),n
}
const wa="https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png",Hk=["media.base44.com","static.wixstatic.com"],Wk=1024,Qk=[1,2,3],Kk=6e3;
function Gk(r){
try{
const n=new URL(r);
if(!Hk.includes(n.hostname))return null;
const s=n.pathname.indexOf("/v1/"),o=s===-1?n.pathname:n.pathname.slice(0,s),l=o.split("/").pop();
return!l||/\.svg$/i.test(l)?null:{
baseUrl:`${
n.origin
}
${
o
}
`,filename:l
}

}
catch{
return null
}

}
const wm=r=>Math.min(Math.max(Math.round(r),1),Kk),xm=r=>Math.min(1,Math.max(0,r));
function Nc({
baseUrl:r,filename:n
}
,{
width:s,height:o,crop:l,focalPoint:c,quality:d
}
){
const h=[`w_${
wm(s)
}
`,`h_${
wm(o||s)
}
`];
l&&h.push(c?`fp_${
xm(c.x).toFixed(2)
}
_${
xm(c.y).toFixed(2)
}
`:"al_c"),h.push(`q_${
d
}
`,"usm_0.66_1.00_0.01","enc_webp","quality_auto");
const p=/\.gif$/i.test(n)?n:n.replace(/\.[a-z0-9]+$/i,"")+".webp";
return`${
r
}
/v1/${
l?"fill":"fit"
}
/${
h.join(",")
}
/${
p
}
`
}
function Xk(r,n){
return Qk.map(s=>`${
Nc(r,{
...n,width:n.width*s,height:n.height?n.height*s:void 0
}
)
}
 ${
s
}
x`).join(", ")
}
const vy=F.forwardRef(({
aspectRatio:r,className:n,style:s,children:o
}
,l)=>y.jsx("span",{
ref:l,className:ts("inline-block relative",n),style:{
aspectRatio:r,...s
}
,children:o
}
));
vy.displayName="ImageWrapper";
const wy=F.forwardRef(({
parsed:r,fittingType:n,focalPoint:s,quality:o,className:l,style:c,aspectRatio:d,onLoad:h,...p
}
,g)=>{
const v=F.useRef(null),w=F.useRef(null),T=Vk(v),[O,D]=F.useState(!1);
F.useImperativeHandle(g,()=>w.current),F.useEffect(()=>{
D(!1)
}
,[r.baseUrl]);
const N=n!=="fit",_=T&&{
width:T.width||Wk,height:T.height?T.height:void 0,crop:N,focalPoint:N?s:void 0,quality:o
}
;
return y.jsxs(vy,{
ref:v,aspectRatio:d,className:l,style:c,children:[_&&!O&&y.jsx("img",{
src:Nc(r,{
..._,width:20,height:_.height?Math.max(1,Math.round(20*_.height/_.width)):void 0,quality:20
}
),alt:"","aria-hidden":"true",className:"w-full h-full inset-0 absolute",style:{
objectFit:n==="fit"?"contain":"cover",filter:"blur(10px)",transform:"scale(1.1)"
}

}
),_&&y.jsx("img",{
ref:w,src:Nc(r,_),srcSet:Xk(r,_),loading:"lazy",className:ts("w-full h-full inset-0 absolute",n==="fit"?"object-contain":"object-cover"),onLoad:b=>{
D(!0),h==null||h(b)
}
,...p
}
)]
}
)
}
);
wy.displayName="ResponsiveImage";
const xy=F.forwardRef(({
src:r,fittingType:n="fill",originWidth:s,originHeight:o,focalPointX:l,focalPointY:c,quality:d=90,...h
}
,p)=>{
const[g,v]=F.useState(r);
F.useEffect(()=>{
v(r)
}
,[r]);
const w={
...h,onError:()=>v(wa)
}
;
if(!r)return y.jsx("img",{
ref:p,src:wa,...w,"data-empty-image":!0
}
);
const T=g===wa?null:Gk(g);
if(!T){
const N=g===wa;
return y.jsx("img",{
ref:p,src:g,...w,"data-error-image":N||void 0
}
)
}
const O=typeof l=="number"&&typeof c=="number"?{
x:l,y:c
}
:void 0,D=s&&o?`${
s
}
 / ${
o
}
`:void 0;
return y.jsx(wy,{
ref:p,parsed:T,fittingType:n,focalPoint:O,quality:d,aspectRatio:D,...w
}
)
}
);
xy.displayName="Image";
function Yk(r){
const s=`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#cdd9c6"/><stop offset="1" stop-color="#e9d9cf"/>
    </linearGradient></defs>
    <rect width="800" height="800" fill="url(#g)"/>
    <circle cx="400" cy="360" r="46" fill="none" stroke="#7f9a78" stroke-width="3" opacity="0.6"/>
    <circle cx="400" cy="360" r="8" fill="#7f9a78" opacity="0.7"/>
    <text x="400" y="470" font-family="Georgia, serif" font-size="34" fill="#5a6b58" text-anchor="middle" opacity="0.8">${
(r||"Add your photo").slice(0,40)
}
</text>
  </svg>`;
return`data:image/svg+xml;
charset=utf-8,${
encodeURIComponent(s)
}
`
}
function vr({
src:r,alt:n,label:s,className:o,fittingType:l="fill",moving:c=!1
}
){
const d=c?"kenburns":"";
return r?y.jsx(xy,{
src:r,alt:n,className:`${
d
}
 ${
o
}
`,fittingType:l
}
):y.jsx("img",{
src:Yk(s),alt:n||"",className:`object-cover ${
d
}
 ${
o
}
`,"data-empty-image":!0
}
)
}
function Jk(){
const{
t:r
}
=xr();
return y.jsxs("section",{
id:"top",className:"relative min-h-screen flex items-center justify-center overflow-hidden",children:[y.jsxs("div",{
className:"absolute inset-0",children:[y.jsx(vr,{
src:yr.hero,alt:"Inside September, Brescia",label:"Hero — café interior",className:"w-full h-full",moving:!0
}
),y.jsx("div",{
className:"absolute inset-0 bg-gradient-to-b from-background/40 via-background/25 to-background/90"
}
)]
}
),y.jsxs("div",{
className:"relative z-10 max-w-5xl mx-auto px-6 text-center pt-24",children:[y.jsx("p",{
className:"font-script text-2xl md:text-3xl text-primary/80 mb-4 animate-fade-in",children:r("hero.welcome")
}
),y.jsxs("h1",{
className:"font-display text-5xl md:text-7xl lg:text-8xl leading-[1.05] text-primary text-balance animate-fade-in",children:[r("hero.title1"),y.jsx("br",{

}
),r("hero.title2")]
}
),y.jsx("p",{
className:"mt-8 max-w-xl mx-auto text-primary/75 text-lg md:text-xl leading-relaxed text-balance",children:r("hero.subtitle")
}
),y.jsxs("div",{
className:"mt-12 flex flex-col sm:flex-row items-center justify-center gap-4",children:[y.jsxs("a",{
href:Ue.mapsUrl,target:"_blank",rel:"noreferrer",className:"group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-sm tracking-wide hover:scale-[1.03] transition-transform duration-500",children:[y.jsx(jc,{
size:16
}
),r("hero.directions")]
}
),y.jsx("a",{
href:"#menu",className:"inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-primary/30 text-primary text-sm tracking-wide hover:bg-primary/5 transition-colors duration-500",children:r("hero.bake")
}
)]
}
)]
}
),y.jsx("a",{
href:"#atmosphere",className:"absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-primary/60 hover:text-primary transition-colors","aria-label":"Scroll down",children:y.jsx($0,{
size:22,className:"animate-float"
}
)
}
)]
}
)
}
function Zk(){
const{
t:r
}
=xr(),n=[[r("atmosphere.f1t"),r("atmosphere.f1s")],[r("atmosphere.f2t"),r("atmosphere.f2s")],[r("atmosphere.f3t"),r("atmosphere.f3s")]];
return y.jsx("section",{
id:"atmosphere",className:"py-28 md:py-40 px-6",children:y.jsxs("div",{
className:"max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center",children:[y.jsx("div",{
className:"order-2 md:order-1",children:y.jsxs("div",{
className:"relative",children:[y.jsx("div",{
className:"moon-gate aspect-square w-full max-w-md mx-auto shadow-2xl overflow-hidden",children:y.jsx(vr,{
src:yr.counter,alt:"The counter at September",label:"The counter",className:"w-full h-full",moving:!0
}
)
}
),y.jsx("div",{
className:"absolute -bottom-6 -right-2 md:-right-6 w-32 h-32 md:w-40 md:h-40 moon-gate shadow-xl overflow-hidden border-4 border-background",children:y.jsx(vr,{
src:yr.bubbletea,alt:"Signature bubble tea",label:"Bubble tea",className:"w-full h-full"
}
)
}
)]
}
)
}
),y.jsxs("div",{
className:"order-1 md:order-2",children:[y.jsx("p",{
className:"font-script text-2xl text-secondary mb-3",children:r("atmosphere.label")
}
),y.jsx("h2",{
className:"font-display text-4xl md:text-5xl leading-tight text-primary text-balance",children:r("atmosphere.title")
}
),y.jsx("div",{
className:"brush-divider w-24 my-8"
}
),y.jsx("p",{
className:"text-primary/80 leading-relaxed mb-5",children:r("atmosphere.p1")
}
),y.jsx("p",{
className:"text-primary/80 leading-relaxed mb-8",children:r("atmosphere.p2")
}
),y.jsx("div",{
className:"flex flex-wrap gap-x-10 gap-y-4",children:n.map(([s,o])=>y.jsxs("div",{
children:[y.jsx("p",{
className:"font-display text-lg text-primary",children:s
}
),y.jsx("p",{
className:"text-sm text-muted-foreground",children:o
}
)]
}
,s))
}
)]
}
)]
}
)
}
)
}
function eE(){
const{
t:r
}
=xr();
return y.jsxs("div",{
className:"mt-24 md:mt-28",children:[y.jsxs("div",{
className:"text-center mb-12",children:[y.jsx("p",{
className:"font-script text-2xl text-secondary mb-3",children:r("menu.label")
}
),y.jsx("h3",{
className:"font-display text-3xl md:text-4xl text-primary",children:r("menu.priceTitle")
}
),y.jsx("div",{
className:"brush-divider w-24 mx-auto my-6"
}
),y.jsx("p",{
className:"max-w-xl mx-auto text-primary/75",children:r("menu.priceSubtitle")
}
)]
}
),y.jsx("div",{
className:"grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10",children:$k.map(n=>y.jsxs("div",{
children:[y.jsxs("div",{
className:"flex items-baseline justify-between mb-3",children:[y.jsx("h4",{
className:"font-display text-xl text-primary",children:r(`menu.cats.${
n.key
}
`)
}
),n.note&&y.jsx("span",{
className:"text-xs text-muted-foreground uppercase tracking-widest",children:n.note
}
)]
}
),y.jsx("div",{
className:"brush-divider w-full mb-3"
}
),y.jsx("ul",{
className:"space-y-2.5",children:n.items.map(s=>y.jsxs("li",{
className:"flex items-baseline justify-between gap-3",children:[y.jsxs("span",{
className:"text-primary/90",children:[s.name,y.jsx("span",{
className:"block text-xs text-muted-foreground",children:s.zh
}
)]
}
),y.jsx("span",{
className:"flex-1 mx-2 border-b border-dotted border-border/70 translate-y-[-3px]"
}
),y.jsxs("span",{
className:"text-primary font-medium whitespace-nowrap",children:[n.prefix?`${
n.prefix
}
€`:"€",s.price]
}
)]
}
,s.name))
}
)]
}
,n.key))
}
),y.jsx("div",{
className:"mt-16 grid md:grid-cols-3 gap-6",children:[{
src:yr.menuDrinks,label:"Drinks menu"
}
,{
src:yr.menuSnacks,label:"Snacks menu"
}
,{
src:yr.menuNewSnacks,label:"New snacks"
}
].map(n=>y.jsx("div",{
className:"rounded-[2rem] overflow-hidden shadow-lg border border-border/60 aspect-square",children:y.jsx(vr,{
src:n.src,alt:n.label,label:n.label,className:"w-full h-full"
}
)
}
,n.label))
}
)]
}
)
}
function tE(){
const{
t:r,lang:n
}
=xr(),[s,o]=F.useState(null);
return y.jsxs("section",{
id:"menu",className:"py-28 md:py-40 px-6 bg-card/40 paper-grain",children:[y.jsxs("div",{
className:"max-w-6xl mx-auto",children:[y.jsxs("div",{
className:"text-center mb-16 md:mb-20",children:[y.jsx("p",{
className:"font-script text-2xl text-secondary mb-3",children:r("menu.label")
}
),y.jsx("h2",{
className:"font-display text-4xl md:text-5xl text-primary text-balance",children:r("menu.title")
}
),y.jsx("div",{
className:"brush-divider w-24 mx-auto my-8"
}
),y.jsx("p",{
className:"max-w-xl mx-auto text-primary/75 leading-relaxed",children:r("menu.subtitle")
}
)]
}
),y.jsx("div",{
className:"grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8",children:Bk.map(l=>y.jsxs("button",{
onClick:()=>o(l),className:"group text-left",children:[y.jsxs("div",{
className:"relative w-full aspect-square moon-gate shadow-lg overflow-hidden border border-border/60 group-hover:shadow-2xl transition-all duration-500",children:[y.jsx(vr,{
src:l.image,alt:l.name[n],label:l.name.en,className:"w-full h-full"
}
),y.jsx("div",{
className:"absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500"
}
)]
}
),y.jsx("p",{
className:"mt-4 font-display text-lg md:text-xl text-primary leading-tight",children:l.name[n]
}
),y.jsx("p",{
className:"mt-1 text-sm text-primary/70",children:l.price
}
)]
}
,l.key))
}
),y.jsx(eE,{

}
)]
}
),s&&y.jsx("div",{
className:"fixed inset-0 z-[60] bg-primary/30 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in",onClick:()=>o(null),children:y.jsxs("div",{
className:"bg-background rounded-[2rem] max-w-md w-full overflow-hidden shadow-2xl",onClick:l=>l.stopPropagation(),children:[y.jsxs("div",{
className:"relative aspect-square",children:[y.jsx(vr,{
src:s.image,alt:s.name[n],label:s.name.en,className:"w-full h-full"
}
),y.jsx("button",{
onClick:()=>o(null),className:"absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-primary hover:bg-background transition-colors","aria-label":"Close",children:y.jsx(Lc,{
size:18
}
)
}
)]
}
),y.jsxs("div",{
className:"p-8",children:[y.jsx("h3",{
className:"font-display text-3xl text-primary",children:s.name[n]
}
),y.jsx("div",{
className:"brush-divider w-16 my-5"
}
),y.jsxs("p",{
className:"text-primary/80 leading-relaxed",children:[y.jsx("span",{
className:"text-sm uppercase tracking-widest text-muted-foreground block mb-1",children:r("menu.notes")
}
),s.desc[n]]
}
),y.jsx("p",{
className:"mt-6 font-display text-2xl text-primary",children:s.price
}
)]
}
)]
}
)
}
)]
}
)
}
function nE(r){
const n=new Date().getHours();
return new Date().getDay()===1?{
label:r("location.vibe.resting"),open:!1
}
:n>=12&&n<15?{
label:r("location.vibe.lunch"),open:!0
}
:n>=15&&n<20?{
label:r("location.vibe.afternoon"),open:!0
}
:n>=20?{
label:r("location.vibe.evening"),open:!1
}
:{
label:r("location.vibe.morning"),open:!1
}

}
function rE(){
const{
t:r,lang:n
}
=xr(),s=nE(r),o=Ue.addressLines[n]||Ue.addressLines.en;
return y.jsx("section",{
id:"location",className:"py-28 md:py-40 px-6",children:y.jsxs("div",{
className:"max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center",children:[y.jsxs("div",{
children:[y.jsx("p",{
className:"font-script text-2xl text-secondary mb-3",children:r("location.label")
}
),y.jsx("h2",{
className:"font-display text-4xl md:text-5xl text-primary text-balance",children:r("location.title")
}
),y.jsx("div",{
className:"brush-divider w-24 my-8"
}
),y.jsxs("div",{
className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/40 mb-8",children:[y.jsx("span",{
className:`w-2 h-2 rounded-full ${
s.open?"bg-secondary animate-pulse-soft":"bg-muted-foreground"
}
`
}
),y.jsx("span",{
className:"text-sm text-primary/80",children:s.label
}
)]
}
),y.jsxs("div",{
className:"space-y-6",children:[y.jsxs("div",{
className:"flex gap-4",children:[y.jsx(jc,{
className:"text-secondary shrink-0 mt-1",size:20
}
),y.jsxs("div",{
children:[o.map(l=>y.jsx("p",{
className:"text-primary leading-relaxed",children:l
}
,l)),y.jsxs("a",{
href:Ue.mapsUrl,target:"_blank",rel:"noreferrer",className:"group inline-flex items-center gap-1.5 text-sm text-secondary mt-1",children:[y.jsxs("span",{
className:"relative flex",children:[y.jsx("span",{
className:"absolute inline-flex h-2 w-2 rounded-full bg-secondary opacity-60 animate-ping"
}
),y.jsx("span",{
className:"relative inline-flex h-2 w-2 rounded-full bg-secondary"
}
)]
}
),r("location.guideMe")]
}
)]
}
)]
}
),y.jsxs("div",{
className:"flex gap-4",children:[y.jsx(Dm,{
className:"text-secondary shrink-0 mt-1",size:20
}
),y.jsxs("div",{
className:"w-full",children:[y.jsx("p",{
className:"text-sm uppercase tracking-widest text-muted-foreground mb-2",children:r("location.hoursLabel")
}
),Ue.hours.map(l=>y.jsxs("div",{
className:"flex justify-between max-w-xs py-1 border-b border-border/50",children:[y.jsx("span",{
className:"text-primary/80",children:r(`days.${
l.key
}
`)
}
),y.jsx("span",{
className:l.time==="closed"?"text-muted-foreground italic":"text-primary",children:l.time==="closed"?r("location.closed"):l.time
}
)]
}
,l.key)),y.jsx("p",{
className:"text-sm text-muted-foreground italic mt-2",children:r("location.closedNote")
}
)]
}
)]
}
),y.jsxs("div",{
className:"flex gap-4",children:[y.jsx(Mm,{
className:"text-secondary shrink-0 mt-1",size:20
}
),y.jsxs("div",{
children:[y.jsx("p",{
className:"text-sm uppercase tracking-widest text-muted-foreground mb-1",children:r("location.phoneLabel")
}
),y.jsx("a",{
href:`tel:${
Ue.phone.replace(/\s/g,"")
}
`,className:"text-primary hover:text-secondary transition-colors",children:Ue.phone
}
)]
}
)]
}
),y.jsxs("div",{
className:"flex gap-4",children:[y.jsx(Ac,{
className:"text-secondary shrink-0 mt-1",size:20
}
),y.jsxs("div",{
children:[y.jsx("p",{
className:"text-sm uppercase tracking-widest text-muted-foreground mb-1",children:r("location.instaLabel")
}
),y.jsx("a",{
href:Ue.instagram,target:"_blank",rel:"noreferrer",className:"text-primary hover:text-secondary transition-colors",children:"@septemberbrescia"
}
)]
}
)]
}
)]
}
),y.jsxs("a",{
href:Ue.mapsUrl,target:"_blank",rel:"noreferrer",className:"mt-10 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-sm tracking-wide hover:scale-[1.03] transition-transform duration-500",children:[y.jsx(ew,{
size:16
}
),r("location.directions")]
}
)]
}
),y.jsxs("div",{
className:"relative",children:[y.jsx("div",{
className:"rounded-[2.5rem] overflow-hidden border border-border shadow-xl aspect-[4/5]",children:y.jsx(vr,{
src:yr.storefront,alt:"The September storefront",label:"Our storefront",className:"w-full h-full"
}
)
}
),y.jsxs("div",{
className:"absolute -bottom-5 -left-5 bg-background rounded-2xl shadow-lg px-6 py-4 border border-border",children:[y.jsx("p",{
className:"font-script text-lg text-secondary",children:"in Brescia"
}
),y.jsx("p",{
className:"font-display text-lg text-primary",children:"Via Fratelli Porcellaga, 42"
}
)]
}
)]
}
)]
}
)
}
)
}
function sE(){
const{
t:r
}
=xr(),n=r("reviews");
return y.jsx("section",{
id:"guestbook",className:"py-28 md:py-40 px-6 bg-card/40 paper-grain",children:y.jsxs("div",{
className:"max-w-6xl mx-auto",children:[y.jsxs("div",{
className:"text-center mb-16 md:mb-20",children:[y.jsx("p",{
className:"font-script text-2xl text-secondary mb-3",children:r("guestbook.label")
}
),y.jsx("h2",{
className:"font-display text-4xl md:text-5xl text-primary text-balance",children:r("guestbook.title")
}
),y.jsx("div",{
className:"brush-divider w-24 mx-auto my-8"
}
),y.jsx("p",{
className:"max-w-xl mx-auto text-primary/75 leading-relaxed",children:r("guestbook.subtitle")
}
)]
}
),y.jsx("div",{
className:"grid md:grid-cols-3 gap-8 md:gap-10",children:n.map((s,o)=>y.jsxs("div",{
className:"bg-background rounded-3xl p-8 shadow-sm border border-border/60 relative",style:{
transform:`rotate(${
o%2===0?-1.2:1
}
deg)`
}
,children:[y.jsx("span",{
className:"absolute -top-3 left-8 text-3xl text-secondary/40 font-display",children:"“"
}
),y.jsx("p",{
className:"font-script text-xl text-primary/85 leading-relaxed",children:s.text
}
),y.jsx("div",{
className:"brush-divider w-12 my-5"
}
),y.jsx("p",{
className:"text-sm text-primary",children:s.author
}
),y.jsx("p",{
className:"text-xs text-muted-foreground",children:s.place
}
)]
}
,o))
}
),y.jsx("div",{
className:"mt-16 flex justify-center",children:y.jsx("div",{
className:"w-40 h-40 moon-gate overflow-hidden shadow-xl border-4 border-background",children:y.jsx(vr,{
src:yr.products,alt:"September products",label:"Our products",className:"w-full h-full"
}
)
}
)
}
)]
}
)
}
)
}
function iE(){
const{
t:r,lang:n
}
=xr(),s=Ue.addressLines[n]||Ue.addressLines.en;
return y.jsxs("footer",{
className:"bg-primary text-primary-foreground px-6 py-20",children:[y.jsxs("div",{
className:"max-w-6xl mx-auto grid md:grid-cols-3 gap-12",children:[y.jsxs("div",{
children:[y.jsxs("div",{
className:"flex items-center gap-3 mb-4",children:[y.jsx("span",{
className:"w-9 h-9 rounded-full border border-primary-foreground/40 flex items-center justify-center font-display text-base leading-none",children:Ue.nameZh
}
),y.jsx("span",{
className:"font-display text-2xl",children:Ue.name
}
)]
}
),y.jsx("p",{
className:"font-script text-xl text-primary-foreground/70 mb-3",children:r("footer.tagline")
}
),y.jsx("p",{
className:"text-sm text-primary-foreground/70 leading-relaxed max-w-xs",children:r("footer.description")
}
)]
}
),y.jsxs("div",{
children:[y.jsx("p",{
className:"text-sm uppercase tracking-widest text-primary-foreground/50 mb-5",children:r("footer.visit")
}
),y.jsxs("ul",{
className:"space-y-4 text-sm",children:[y.jsxs("li",{
className:"flex gap-3",children:[y.jsx(jc,{
size:16,className:"shrink-0 mt-0.5 text-primary-foreground/60"
}
),y.jsx("a",{
href:Ue.mapsUrl,target:"_blank",rel:"noreferrer",className:"hover:underline",children:s.map(o=>y.jsx("span",{
className:"block",children:o
}
,o))
}
)]
}
),y.jsxs("li",{
className:"flex gap-3",children:[y.jsx(Mm,{
size:16,className:"shrink-0 mt-0.5 text-primary-foreground/60"
}
),y.jsx("a",{
href:`tel:${
Ue.phone.replace(/\s/g,"")
}
`,className:"hover:underline",children:Ue.phone
}
)]
}
),y.jsxs("li",{
className:"flex gap-3",children:[y.jsx(Ac,{
size:16,className:"shrink-0 mt-0.5 text-primary-foreground/60"
}
),y.jsx("a",{
href:Ue.instagram,target:"_blank",rel:"noreferrer",className:"hover:underline",children:"@septemberbrescia"
}
)]
}
),y.jsxs("li",{
className:"flex gap-3",children:[y.jsx(K0,{
size:16,className:"shrink-0 mt-0.5 text-primary-foreground/60"
}
),y.jsx("a",{
href:`mailto:${
Ue.email
}
`,className:"hover:underline",children:Ue.email
}
)]
}
)]
}
)]
}
),y.jsxs("div",{
children:[y.jsx("p",{
className:"text-sm uppercase tracking-widest text-primary-foreground/50 mb-5",children:r("footer.hours")
}
),y.jsx("ul",{
className:"space-y-2 text-sm",children:Ue.hours.map(o=>y.jsxs("li",{
className:"flex justify-between max-w-[14rem]",children:[y.jsx("span",{
className:"text-primary-foreground/80",children:r(`days.${
o.key
}
`)
}
),y.jsx("span",{
children:o.time==="closed"?r("location.closed"):o.time
}
)]
}
,o.key))
}
),y.jsxs("p",{
className:"text-xs text-primary-foreground/50 italic mt-3 flex items-center gap-1.5",children:[y.jsx(Dm,{
size:12
}
),r("location.closedNote")]
}
)]
}
)]
}
),y.jsxs("div",{
className:"max-w-6xl mx-auto mt-16 pt-8 border-t border-primary-foreground/15 flex flex-col sm:flex-row items-center justify-between gap-4",children:[y.jsxs("p",{
className:"text-xs text-primary-foreground/50",children:["© ",new Date().getFullYear()," ",Ue.name," · ",r("footer.rights")]
}
),y.jsx("p",{
className:"font-script text-lg text-primary-foreground/60",children:r("footer.madeWith")
}
)]
}
)]
}
)
}
function oE(){
return y.jsx(zk,{
children:y.jsx(Mk,{
children:y.jsxs("div",{
className:"bg-background",children:[y.jsx(Fk,{

}
),y.jsx(qk,{

}
),y.jsxs("main",{
children:[y.jsx(Jk,{

}
),y.jsx(Zk,{

}
),y.jsx(tE,{

}
),y.jsx(rE,{

}
),y.jsx(sE,{

}
)]
}
),y.jsx(iE,{

}
)]
}
)
}
)
}
)
}
const aE=()=>{
const{
isLoadingAuth:r,isLoadingPublicSettings:n,authError:s,navigateToLogin:o
}
=Ak();
if(n||r)return y.jsx("div",{
className:"fixed inset-0 flex items-center justify-center",children:y.jsx("div",{
className:"w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"
}
)
}
);
if(s){
if(s.type==="user_not_registered")return y.jsx(jk,{

}
);
if(s.type==="auth_required")return o(),null
}
return y.jsxs(x1,{
children:[y.jsx(yc,{
path:"/",element:y.jsx(oE,{

}
)
}
),y.jsx(yc,{
path:"*",element:y.jsx(Ok,{

}
)
}
)]
}
)
}
;
function lE(){
return y.jsx(Pk,{
children:y.jsxs(bx,{
client:Lx,children:[y.jsxs(S1,{
children:[y.jsx(Ik,{

}
),y.jsx(aE,{

}
)]
}
),y.jsx(Gw,{

}
)]
}
)
}
)
}
O0.createRoot(document.getElementById("root")).render(y.jsx(lE,{

}
));

