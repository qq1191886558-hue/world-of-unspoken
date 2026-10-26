export const VERSION=2;
export const BUILD="0.2.0";
export const SIGNALS=[["short","long","short"],["long","short","short"],["short","short","long"]];
export function challengeFor(id){return SIGNALS[[...id].reduce((n,c)=>n+c.charCodeAt(0),0)%SIGNALS.length].slice();}
export function lurePhase(left){return left>26?"approaching":left>4?"distracted":left>0?"returning":"watching";}
export function addNoise(s,reason){s.noise??={};s.noise[s.room]=(s.noise[s.room]||0)+1;event(s,"noise",{room:s.room,reason,level:s.noise[s.room]});return s.noise[s.room]>=3;}
export function checkInvestigation(offset,order,cause){return checkTimeline(offset,order)&&cause==="bandage";}
export const ROOMS=['bedroom','corridor','phone','monitor','archive','lobby'];
export const ROOM_NAMES={bedroom:'407 客房',corridor:'四层回廊',phone:'306 医务间外',monitor:'夜间值班室',archive:'医务间与寄存室',lobby:'一层出口'};
export const EVIDENCE={
 coat:{title:'忘带的外套',source:'407 · 椅背',text:'妹妹明早七点离开。你没有回复她的邀请，却拿上这件外套，半夜出了门。\n她一冷，手就会发抖。你记得这件小事。'},
 wound:{title:'剪刀上的白色纱线',source:'值班室 · 医务柜',text:'剪刀没有血。剪刃里缠着白色纱线，与右手的绷带一致。\n包装上的批次和监控里她打开的那一包一致。\n便条：“别碰水，伤口会裂。”'},
 rules:{title:'夜间住宿须知',source:'407 · 门背后',text:'① 请先确认熟悉声音的来源。\n② 广播期间，请保持安静。\n③ 退房时，请独自前往一层。\n纸张下面有一道很深的划痕：别让它知道，你在找谁。'},
 unsent:{title:'未发送的消息',source:'407 · 摔裂的手机',text:'收件人：林遥\n昨晚23:00，林遥：“明早七点的车。我住407。如果你愿意，来见我一下。”\n你的草稿：“我到楼下了。”\n编辑时间：01:42。没有发送。屏幕边缘有一道干涸的血迹。'},
 repeat:{title:'相同的停顿',source:'407 · 电话听筒',text:'门外：“您好……检查房间。”\n听筒：“您好……检查房间。”\n两次话语都在“您好”后停了半秒，随后出现同一声咳嗽。第三次，声音来自浴室。'},
 plan:{title:'员工通道图',source:'四层 · 清洁车',text:'住客楼梯旁的备注：夜间维护。\n布草柜背后另有服务通道。柜轮会发出很响的摩擦声。\n值夜人走向声源约需4秒。只有它停在声源旁检查时，才能推柜子；它转身返回时就晚了。'},
 ownnote:{title:'我写过这张纸',source:'四层 · 循环楼梯',text:'“第二次。楼梯还是回到四楼。\n它说只要我一个人下去就行。\n如果下次还能看懂，先找林遥。”\n最后一行被重重划掉。签名与你身份证上的名字相同。'},
 tape:{title:'童年的磁带',source:'306 · 布草间',text:'旧磁带上标着：小遥，七岁。\n“哥，我怕黑。你把门打开。”\n门里的声音连吸气和停顿都与磁带完全一致。问它别的问题，它仍然重复同一句话。'},
 live:{title:'一次笨拙的回应',source:'306 · 内线电话',text:'你临时请她换一种方式敲管道。\n“梳子太轻了。我换个杯子……等一下。”\n她先试错一次，随后按你临时指定的节奏重敲。记住本轮约定，不能拿旧磁带里的节奏代替。她会回应刚刚发生的事情。'},
 clock:{title:'慢了四分钟的监控',source:'值班室 · 维修贴纸',text:'同一次报时：录音机01:49，录像机01:45。两台设备都录下了那一次钟声。\n原始记录不能改。复核时只调整显示偏差。\n广播却建议：“把监控时间往回调四分钟。”'},
 medical:{title:'血迹早于剪刀',source:'值班室 · 校准后的记录',text:'01:49　林川推开门进来，右手已经流血。\n01:52　林遥拿剪刀剪开纱布，给他包扎。\n01:56　广播响起。林川独自走向楼下。\n剪刀上的纱线与手上的绷带一致。'},
 context:{title:'被截断的后半句',source:'值班室 · 原始录音',text:'广播只播放：“我再也不想见到他。”\n原始录音继续：“……可他要是真出了什么事，我还是会去找他。”\n妹妹曾找到过你。你后来听从广播，独自走向出口。'},
 care:{title:'她也一直在等',source:'档案室 · 家里的旧物',text:'寄存的包里是你的旧相机。妹妹替你修好了快门。\n便条：“哥，这次也去拍一点你自己想拍的东西吧。”\n争吵时她说“你以后不用这么累了”。你把这句话听成了她终于能摆脱你。\n刚才她说：“我去工作，不是把你从我的生活里拿走。”'},
 replay:{title:'219 的重复尝试',source:'档案室 · 失败记录',text:'住客把录音机对准门内，连续播放同一段很长的留言。门内有人听着。\n录像中，门始终没有动。\n后来他独自离开。二十分钟后，他再次出现在原来的客房。'},
 together:{title:'两个人同时推门',source:'档案室 · 失败记录',text:'一对住客一直同时推门。他们喊名字，求饶，又反复向彼此道歉。\n门没有打开。最后一段录音里，女人说：“你还是没有告诉我，我对你究竟算什么。”'},
 family:{title:'205 留下的信纸',source:'档案室 · 已离店住客',text:'一对父女的监控：父亲放下行李，隔着门面对女儿说了一会儿话。画面没有声音。两人随后一同离开。\n他留下的信纸：“你不用按我的安排生活……我只是很庆幸，你是我的女儿。”\n练习用的磁带还在房间里，没有被带走。'},
 response:{title:'相同的话，不同的回应',source:'档案室 · 实时通话',text:'你亲口告诉她，你在担心她。墙上的水迹停住了。\n广播随后重播一模一样的句子，水迹没有变化。\n她问：“刚才那一次，真的是你在对我说吗？”'}
};
export function freshState(){const sessionId=globalThis.crypto?.randomUUID?.()||String(Date.now());return {sessionId,challenge:challengeFor(sessionId),noise:{},version:VERSION,room:'bedroom',visited:['bedroom'],evidence:[],flags:{},elapsed:0,events:[],attempts:[],hints:0,finished:false,position:null};}
export function addEvidence(s,id){if(!EVIDENCE[id]||s.evidence.includes(id))return false;s.evidence.push(id);event(s,'evidence',{id});return true;}
export function event(s,type,data={}){s.events.push({t:Math.round(s.elapsed),type,...data});if(s.events.length>500)s.events.shift();}
export function canEnter(s,room){const prev={corridor:'battery',phone:'hall',monitor:'pipes',archive:'timeline',lobby:'archivekey'};return room==='bedroom'||(Boolean(s.flags[prev[room]])&&(room!=='corridor'||Boolean(s.flags.coat))&&(room!=='lobby'||Boolean(s.flags.reunion&&s.flags.cameraMemory)));}
export function enterRoom(s,room){if(!ROOMS.includes(room)||!canEnter(s,room))return false;s.room=room;s.position=null;if(!s.visited.includes(room))s.visited.push(room);event(s,'room',{room});return true;}
export function checkRhythm(seq,expected=SIGNALS[2]){return seq.join(',')===expected.join(',');}
export function checkTimeline(offset,order){return Number(offset)===4&&order.join(',')==='arrival,bandage,leave';}
export function evaluateEnding({target,method,message}){
 if(method==='alone')return {success:false,reason:'alone'};
 if(target!=='real')return {success:false,reason:'echo'};
 if(method==='recording')return {success:false,reason:'recording'};
 if(method!=='speak')return {success:false,reason:'silence'};
 if(message==='love'||message==='cherish')return {success:true,reason:'heard'};
 return {success:false,reason:message==='apology'?'apology':'bargain'};
}
export function recordAttempt(s,decision){const result=evaluateEnding(decision);const attempt={build:BUILD,...result,...decision,elapsed:Math.round(s.elapsed),evidence:s.evidence.slice(),hints:s.hints,number:s.attempts.length+1};s.attempts.push(attempt);s.finished=true;event(s,'ending',attempt);return attempt;}
export function restoreState(raw){try{const s=JSON.parse(raw);if(![1,VERSION].includes(s.version)||!ROOMS.includes(s.room)||!Array.isArray(s.evidence)||!s.flags||!Array.isArray(s.attempts)||!Array.isArray(s.events)||!Array.isArray(s.visited))return null;if(s.version===1){s.version=VERSION;if(s.room!=='bedroom')s.flags.coat=true;if(s.room==='lobby'){s.flags.reunion=true;s.flags.cameraMemory=true;}}s.challenge=challengeFor(s.sessionId||'legacy');s.noise=s.noise||{};s.evidence=s.evidence.filter(x=>EVIDENCE[x]);s.elapsed=Math.max(0,Number(s.elapsed)||0);return s;}catch{return null;}}
export function metrics(s){return {sessionId:s.sessionId||'legacy',build:BUILD,definition:'first completed finale attempt; exploration setbacks excluded',targetFirstAttemptSuccessRate:0.4,firstAttempt:s.attempts[0]||null,allAttempts:s.attempts,activeSeconds:Math.round(s.elapsed),evidenceFound:s.evidence,hintsUsed:s.hints,events:s.events};}
