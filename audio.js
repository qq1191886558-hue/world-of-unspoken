export class Atmosphere{
 constructor(){this.enabled=false;this.ctx=null;this.master=null;}
 async toggle(){if(!this.ctx){this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=0;this.master.connect(this.ctx.destination);[43,64.4,87.2].forEach((f,i)=>{let o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.value=.035/(i+1);o.connect(g).connect(this.master);o.start();});}this.enabled=!this.enabled;await this.ctx.resume();this.master.gain.setTargetAtTime(this.enabled?.55:0,this.ctx.currentTime,.5);return this.enabled;}
 tone(freq=90,len=.2,vol=.09){if(!this.enabled||!this.ctx)return;const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='sine';o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(freq*.45,t+len);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+len);o.connect(g).connect(this.master);o.start();o.stop(t+len);}
 knock(){[0,220,900].forEach(t=>setTimeout(()=>this.tone(130,.12,.15),t));}
 scare(){this.tone(43,1.6,.2);}
 pause(paused){if(this.master)this.master.gain.setTargetAtTime(paused?0:this.enabled?.55:0,this.ctx.currentTime,.25);}
}
