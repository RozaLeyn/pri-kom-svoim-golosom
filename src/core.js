export function shuffle(items, random=Math.random){
 const result=[...items]; for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1)); [result[i],result[j]]=[result[j],result[i]];} return result;
}
export function createGame(questions){return {deck:shuffle(questions).map(q=>({...q,options:shuffle(q.options)})),index:0,answers:[],hidden:[],hintUsed:false,done:false};}
export function hint(state){if(state.hintUsed||state.done||state.answers.length>state.index)return; const q=state.deck[state.index]; state.hidden=shuffle(q.options.filter(o=>o!==q.correct)).slice(0,2); state.hintUsed=true;}
export function answer(state,value){const q=state.deck[state.index]; if(state.done||state.answers.length>state.index||!q.options.includes(value)||state.hidden.includes(value))return; state.answers.push({id:q.id,value,correct:value===q.correct,hint:state.hidden.length>0});}
export function next(state){if(state.done||state.answers.length<=state.index)return; if(state.index===state.deck.length-1){state.done=true;return;} state.index++;state.hidden=[];}
export function score(state){return state.answers.filter(a=>a.correct).length;}
