import {STORY} from './story.js?v=0.2.0';
import {checkRhythm,checkInvestigation,addNoise,event} from './engine.js?v=0.2.0';

export function createChallenges(api){
 const $=s=>document.querySelector(s);
 const {state,showDialog,act,closeModal,collect,persist,cue,readEvidence,setback}=api;
 const signal=()=>state().challenge.map(x=>x==='short'?'短':'长').join(' · ');
 const warning=()=>`<p class="risk-note">巡查警觉 ${state().noise[state().room]||0}/3。累计三次错误操作会引来值夜人，你会退回本区入口；证据与约定保留。阅读时危险暂停。</p>`;
 function mistake(reason){const caught=addNoise(state(),reason);persist();if(caught){setback('第三次动静之后，钥匙声停在了你背后。',state().room);return true;}cue('附近 · 钥匙',`钥匙停顿了一下。巡查警觉 ${state().noise[state().room]}/3。`);return false;}
 function story(key,done=closeModal){
  let page=0;
  function draw(){const p=STORY[key][page];showDialog(`这一晚 · ${page+1}/${STORY[key].length}`,p.title,p.body,[act(p.next,()=>{
   if(page<STORY[key].length-1){page++;draw();return;}
   state().flags[key]=true;
   if(key==='arrival'){state().flags.coat=true;collect('coat');collect('unsent');}
   if(key==='cameraMemory')collect('care');
   event(state(),'story',{id:key});persist();done();
  },true)]);}
  draw();
 }
 function phone(){
  showDialog('306 · 接通的内线','声音知道过去。它知道现在吗？','<blockquote>“哥，我在306医务间。你还在吗？”</blockquote><p>广播插进来：“她早就走了。请按墙上的旧检修指示操作。”</p><p>你可以用一个新的约定确认对方。回放旧录音无法回答刚刚提出的要求。</p>',[
   act('问她一件童年的事',()=>showDialog('电话另一端','“你怕的明明是黑。”','<p>这个答案，你在旧磁带里也听见过。它能证明说话的人知道过去，却没有回答眼前的情况。</p>',[act('再换一种问法',phone)]),false,true),
   act('现在约定一段新节奏，让她换个物件回应',()=>{
    state().flags.signalKnown=true;collect('live');state().flags.signalText=signal();
    event(state(),'signal-issued',{pattern:state().challenge});cue('本轮敲击约定',signal());persist();
    showDialog('内线另一端 · 当场约定','先是一下轻响',`<p>你临时指定的节奏：<strong>${signal()}</strong>。</p><blockquote>“梳子太轻了……我换个杯子。”</blockquote><p>她重敲了一遍，停顿和轻重都对应你的新要求。之后她请你在走廊管道上回应。</p><p>墙牌写的是旧检修节奏，不是这次约定。记录可以随时在这里重新查看。</p><div class="code-output">${signal()}</div><p class="muted">敲击只用于确认对方确实在场。确认后，你还需要亲手打开门外的检修闩。</p>`,[act('记下本轮约定',closeModal,true)]);
   },false,true),
   act('暂时挂断',closeModal)
  ]);
 }
 function rhythm(){
  let seq=[];
  showDialog('走廊 · 暖气管','让她确认，你也在这里',`<p>墙上留着旧牌子：“两短一长”。电话另一端却要求回应你们刚刚约定的节奏。</p><p>${state().flags.signalKnown?'你已经把本轮约定记在文字记录中。可以回电话旁重新核对。':'你还没有与电话另一端约定新节奏。可以先回到电话旁。'}</p><div class="code-output" id="rhythm-output">· · ·</div><p id="rhythm-result" class="muted">输入三次敲击。不会因为关闭面板而重新抽取约定。</p>${warning()}`,[]);
  const actions=$('#modal-actions');
  for(const [label,type] of [['短敲','short'],['长敲','long']]){
   const b=document.createElement('button');b.textContent=label;b.onclick=()=>{
    if(seq.length>=3)seq=[];seq.push(type);$('#rhythm-output').textContent=seq.map(x=>x==='short'?'●':'━').join(' ');
    if(seq.length!==3)return;
    if(checkRhythm(seq,state().challenge)){
     state().flags.pipes=true;event(state(),'puzzle',{id:'rhythm',success:true});persist();
     $('#rhythm-result').textContent='“收到了，是你。”门内的人说。她让你检查门外那枚锈住的检修闩。';
     actions.querySelectorAll('button').forEach(x=>x.disabled=true);const next=document.createElement('button');next.textContent='去306，打开外侧门闩';next.className='primary';next.onclick=closeModal;actions.append(next);
    }else{
     event(state(),'puzzle',{id:'rhythm',success:false});
     if(mistake('错误敲击'))return;
     $('#rhythm-result').textContent='门内没有按约定回应。你可以回电话旁重新核对。';
     $('.risk-note').outerHTML=warning();
    }
   };actions.append(b);
  }
  const back=document.createElement('button');back.textContent='回去核对约定';back.onclick=closeModal;actions.append(back);
 }
 function timeline(){
  if(state().flags.timeline){if(!state().flags.truth)story('truth');else readEvidence('medical');return;}
  let draft=state().flags.reviewDraft||{offset:0,order:['bandage','arrival','leave'],cause:''};
  let {offset,cause}=draft,order=[...draft.order];
  const names={arrival:'入口：林川右手有血',bandage:'医务间：林遥拿起剪刀',leave:'楼下：林川独自离开'};
  const save=()=>{state().flags.reviewDraft={offset,order:[...order],cause};persist();};
  showDialog('值班室 · 原始材料复核','先对齐时间，再解释发生了什么',`<p>广播建议：“监控往回调四分钟。拿剪刀的人伤了你。”</p><p>你可以检查复核台旁的维修贴纸，以及医务柜里的实物，自己核对这个说法。</p><div class="source-actions"><button id="review-clock">查看已收集的校时资料</button><button id="review-wound">查看已收集的伤口证据</button></div><div class="control-row"><label for="offset">监控时间补正</label><input id="offset" type="range" min="-6" max="6" step="1" value="${offset}"><strong id="offset-label">${offset>0?'+':''}${offset} 分钟</strong></div><div id="timeline-rows"></div><label class="cause-label" for="cause">剪刀在这段记录中的用途</label><select id="cause"><option value="">选择你的解释</option><option value="attack">她拿剪刀伤害了我</option><option value="bandage">她剪开纱布，替我包扎</option><option value="wire">她在剪断门锁电线</option></select><p id="timeline-result" class="muted">时间、先后顺序和实物解释需要互相吻合。</p>${warning()}`,[act('提交这次还原',()=>{
   save();
   if(checkInvestigation(offset,order,cause)){
    state().flags.timeline=true;collect('medical');event(state(),'puzzle',{id:'timeline',success:true});persist();
    story('truth',()=>{closeModal();api.world().scare();cue('实时监控 · 身后','你终于看清了那一晚。监控里的另一个你，却仍在对她摇头。');});
   }else{
    event(state(),'puzzle',{id:'timeline',success:false,offset,cause});
    if(mistake('错误复核'))return;
    $('#timeline-result').textContent='这个解释与原始材料仍有冲突。比较同一次报时，再核对血迹最早出现在哪一段。';$('.risk-note').outerHTML=warning();
   }
  },true)]);
  function source(id,missing){save();if(state().evidence.includes(id))readEvidence(id,timeline);else showDialog('尚未取得原件','先检查现场',`<p>${missing}</p>`,[act('回到现场',closeModal),act('返回复核',timeline)]);}
  $('#review-clock').onclick=()=>source('clock','维修贴纸在三台显示器右侧，调查“设备维修贴纸”。广播的建议不是原件。');
  $('#review-wound').onclick=()=>source('wound','医务柜在房间右侧。检查剪刀上的纱线，以及它和你绷带的关系。');
  const draw=()=>{
   $('#timeline-rows').replaceChildren();
   for(let i=0;i<order.length;i++){
    const id=order[i],minute={arrival:45,bandage:48,leave:52}[id]+offset,row=document.createElement('div');row.className='record-line';row.innerHTML=`<b>01:${String(minute).padStart(2,'0')}</b><span style="flex:1">${names[id]}</span>`;
    const b=document.createElement('button');b.textContent='上移';b.className='small-button';b.disabled=i===0;b.onclick=()=>{[order[i-1],order[i]]=[order[i],order[i-1]];save();draw();};row.append(b);$('#timeline-rows').append(row);
   }
  };
  $('#offset').oninput=e=>{offset=Number(e.target.value);$('#offset-label').textContent=`${offset>0?'+':''}${offset} 分钟`;save();draw();};
  $('#cause').value=cause;$('#cause').onchange=e=>{cause=e.target.value;save();};draw();
 }
 return {story,phone,rhythm,timeline,mistake,signal};
}
