/* Accessible public PawVago guided-policy chat. No model billing or user data retention. */
(() => {
 "use strict";
 document.addEventListener("DOMContentLoaded", () => {
  const openBtn=document.getElementById("pv-chat-open");
  const panel=document.getElementById("pv-chat-panel");
  const close=document.getElementById("pv-chat-close");
  const log=document.getElementById("pv-chat-log");
  const form=document.getElementById("pv-chat-form");
  const input=document.getElementById("pv-chat-input");
  const send=document.getElementById("pv-chat-send");
  if(!openBtn||!panel||!close||!log||!form||!input||!send)return;
  let lastFocus;
  const toggle=(state)=>{
   panel.hidden=!state;
   openBtn.setAttribute("aria-expanded",String(state));
   if(state){ lastFocus=document.activeElement;input.focus(); }
   else{ (lastFocus&&typeof lastFocus.focus==="function"?lastFocus:openBtn).focus(); }
  };
  openBtn.addEventListener("click",()=>toggle(panel.hidden));
  close.addEventListener("click",()=>toggle(false));
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)toggle(false)});
  const addMessage=(content,person,sources)=>{
   const entry=document.createElement("div");
   entry.className="pv-chat-bubble pv-chat-"+person;
   entry.textContent=String(content||"");
   if(Array.isArray(sources)) for(const src of sources.slice(0,2)){
    try{const u=new URL(src);if(u.protocol!=="https:"&&u.protocol!=="http:")continue;
     const a=document.createElement("a");a.href=u.toString();a.target="_blank";a.rel="noopener noreferrer";a.textContent="Source: "+u.hostname;entry.appendChild(a);
    }catch{} }
   log.appendChild(entry);log.scrollTop=log.scrollHeight;
  };
  form.addEventListener("submit",async e=>{
   e.preventDefault();
   const message=input.value.trim().slice(0,600);
   if(!message)return;
   input.value="";addMessage(message,"user");
   input.disabled=true;send.disabled=true;
   try{
    const response=await fetch("/api/assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message})});
    if(!response.ok)throw new Error("guidance unavailable");
    const result=await response.json();
    addMessage(result.answer,"agent",result.sources);
    if(result.next)addMessage(result.next,"hint");
   }catch{addMessage("The guidance service is temporarily unavailable. Please try again later.","agent");}
   finally{input.disabled=false;send.disabled=false;input.focus();}
  });
  addMessage("Hi! I can help you explore airline pet policies and general travel documents. This is a guided preview, not yet a generative AI chat or a booking engine.","agent");
 });
})();