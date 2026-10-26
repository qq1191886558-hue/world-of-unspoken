// Emphasize verifiable details, including unreliable statements, without grading them.
const groups={
 person:['林遥','林川','小遥'],
 object:['外套','旧相机','检修闩','电视遥控器','电视柜','两节备用电池','两节电池','备用电池','应急电池盒','应急供电盒','门锁','服务通道','服务梯','布草柜','机械闹钟','闹钟','暖气管','检修响应','消防钥匙','消防门钥匙','铜钥匙','录音机','原始录音','剪刀','纱布','绷带','维修贴纸'],
 detail:['没有发送','我其实……','干涸的血迹','同一声咳嗽','半秒','完全一致','相同的吸气','相同的停顿','两短一长','两短 · 一长','短 · 短 · 长','慢四分钟','慢了四分钟','慢4分钟','+4','右手已经流血','独自离开','独自前往一层','独自退房','没有带走','没有被带走','同时推门','画面没有声音','门没有打开','门始终没有动','水迹停住了','水迹没有变化']
};
const kinds=new Map(Object.entries(groups).flatMap(([kind,words])=>words.map(word=>[word,kind])));
const pattern=new RegExp([...kinds.keys()].sort((a,b)=>b.length-a.length).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+'|\\b\\d{2}:\\d{2}\\b','g');
export function emphasizeClues(root){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
 while(walker.nextNode()){
  const node=walker.currentNode;
  if(!node.parentElement?.closest('button,input,textarea,script,style,.clue-key,.stamp,.clue-legend'))nodes.push(node);
 }
 for(const node of nodes){
  const matches=[...node.textContent.matchAll(pattern)];if(!matches.length)continue;
  const fragment=document.createDocumentFragment();let cursor=0;
  for(const match of matches){fragment.append(document.createTextNode(node.textContent.slice(cursor,match.index)));const strong=document.createElement('strong');strong.className='clue-key';strong.dataset.kind=kinds.get(match[0])||'time';strong.textContent=match[0];fragment.append(strong);cursor=match.index+match[0].length;}
  fragment.append(document.createTextNode(node.textContent.slice(cursor)));node.replaceWith(fragment);
 }
}
