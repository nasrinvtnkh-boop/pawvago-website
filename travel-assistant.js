(() => {
  const root=document.createElement('section');
  root.className='pv-ai-widget';
  root.innerHTML=`<button class="pv-ai-toggle" type="button" aria-expanded="false" aria-controls="pv-ai-panel">✦ Ask PawVago AI</button><div id="pv-ai-panel" class="pv-ai-panel" hidden><div class="pv-ai-head"><strong>PawVago AI Travel Assistant</strong><button type="button" class="pv-ai-close" aria-label="Close assistant">×</button></div><p class="pv-ai-note">Plan your pet's journey. Airline and border rules must be verified with official sources.</p><div class="pv-ai-messages" role="log" aria-live="polite"><p class="pv-ai-message pv-ai-bot">Hi! Where are you travelling from and to, and are you travelling with a dog or cat?</p></div><form class="pv-ai-form"><label class="pv-ai-sr" for="pv-ai-input">Ask a travel question</label><input id="pv-ai-input" maxlength="1500" placeholder="Ask about travelling with your pet…" required><button type="submit">Send</button></form></div>`;
  document.body.appendChild(root);
  const toggle=root.querySelector('.pv-ai-toggle'), panel=root.querySelector('.pv-ai-panel'), close=root.querySelector('.pv-ai-close'),form=root.querySelector('form'),input=root.querySelector('input'),messages=root.querySelector('.pv-ai-messages');
  const history=[];
  function open(value){panel.hidden=!value;toggle.setAttribute('aria-expanded',String(value));if(value)input.focus();}
  toggle.addEventListener('click',()=>open(panel.hidden));close.addEventListener('click',()=>open(false));
  function append(role,content){const p=document.createElement('p');p.className='pv-ai-message '+(role==='user'?'pv-ai-user':'pv-ai-bot');p.textContent=content;messages.appendChild(p);messages.scrollTop=messages.scrollHeight;return p;}
  form.addEventListener('submit',async e=>{
    e.preventDefault();const message=input.value.trim();if(!message)return;
    append('user',message);input.value='';input.disabled=true;form.querySelector('button').disabled=true;
    const pending=append('assistant','Thinking…');
    try{
      const response=await fetch('/api/travel-assistant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,history})});
      const data=await response.json();if(!response.ok)throw Error(data.error||'Service unavailable');
      pending.textContent=data.reply;history.push({role:'user',content:message},{role:'assistant',content:data.reply});
      if(history.length>8)history.splice(0,history.length-8);
    }catch(err){pending.textContent=err.message||'Service unavailable. Please try again.';}
    finally{input.disabled=false;form.querySelector('button').disabled=false;input.focus();messages.scrollTop=messages.scrollHeight;}
  });
})();