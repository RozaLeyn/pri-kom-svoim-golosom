export function headerState({screen,index,answers,total}){
 if(screen==='intro')return {visible:false,title:'',counter:'',showProgress:false,segments:[]};
 if(screen==='result')return {visible:true,title:'При ком?',counter:'результат',showProgress:false,segments:[]};
 return {
  visible:true,
  title:'При ком?',
  counter:`${index+1} из ${total}`,
  showProgress:true,
  segments:Array.from({length:total},(_,i)=>answers[i]?(answers[i].correct?'correct':'incorrect'):i===index?'current':'pending')
 };
}
