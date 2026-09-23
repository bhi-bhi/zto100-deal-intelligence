export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:'OPENAI_API_KEY mangler på serveren'});
  const {query,limit=10,caseContext=null,existingInvestors=[]}=req.body||{};
  if(!query||typeof query!=='string') return res.status(400).json({error:'Query mangler'});
  const max=Math.max(1,Math.min(Number(limit)||10,20));
  const existing=(existingInvestors||[]).slice(0,200).map(x=>x.name+(x.company?' ('+x.company+')':'')).join('; ');
  const caseText=caseContext?('Case: '+caseContext.name+' / '+(caseContext.company||'')+'. Kapitalmål: '+(caseContext.target||'')+'. Noter: '+(caseContext.notes||'')):'Ingen specifik case.';
  const system='Du er research-analytiker for ZTO100. Find og verificer potentielle investorer med live web search. Brug kun oplysninger du kan underbygge. Skeln tydeligt mellem dokumenterede fakta og estimater. Corporate equity/aktiver er ikke det samme som personlig likvid formue. Estimer investeringskapacitet som interval og angiv confidence Høj, Mellem eller Lav. Returnér kun kandidater der reelt matcher opgaven. Undgå dubletter mod eksisterende investor-master.';
  const user='Research-opgave: '+query+'\n'+caseText+'\nEksisterende investorer som helst ikke skal duplikeres: '+existing+'\nReturnér op til '+max+' kandidater.';
  const schema={
    type:'object',
    properties:{
      summary:{type:'string'},
      results:{type:'array',maxItems:max,items:{type:'object',properties:{
        name:{type:'string'},company:{type:'string'},role:{type:'string'},location:{type:'string'},rationale:{type:'string'},capacity:{type:'string'},
        confidence:{type:'string',enum:['Høj','Mellem','Lav']},
        sources:{type:'array',items:{type:'object',properties:{title:{type:'string'},url:{type:'string'}},required:['title','url'],additionalProperties:false}}
      },required:['name','company','role','location','rationale','capacity','confidence','sources'],additionalProperties:false}}
    },required:['summary','results'],additionalProperties:false
  };
  const r=await fetch('https://api.openai.com/v1/responses',{
    method:'POST',
    headers:{'Authorization':'Bearer '+process.env.OPENAI_API_KEY,'Content-Type':'application/json'},
    body:JSON.stringify({
      model:'gpt-5.5',
      reasoning:{effort:'medium'},
      tools:[{type:'web_search'}],
      tool_choice:'auto',
      input:[{role:'system',content:system},{role:'user',content:user}],
      text:{format:{type:'json_schema',name:'investor_research',strict:true,schema}}
    })
  });
  const data=await r.json();
  if(!r.ok) return res.status(r.status).json({error:data?.error?.message||'OpenAI API fejl'});
  let out=data.output_text;
  if(!out&&Array.isArray(data.output)){
    for(const item of data.output){
      if(item.type==='message'&&Array.isArray(item.content)){
        const part=item.content.find(x=>x.type==='output_text');
        if(part?.text){out=part.text;break}
      }
    }
  }
  if(!out) return res.status(502).json({error:'Tomt svar fra research'});
  try{return res.status(200).json(JSON.parse(out))}
  catch{return res.status(502).json({error:'Research-svaret kunne ikke læses'})}
}