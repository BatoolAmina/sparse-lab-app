import crypto from 'crypto';
import {db} from './db';
import {services as defaults} from './services';

const now=()=>new Date().toISOString();

export function ensureCatalog(){
  const seed=db.transaction(()=>{
    for(const [index,service] of defaults.entries()){
      db.prepare(`insert or ignore into service_catalog
        (slug,side,title,short,long,points,starting_price,estimated_max_price,open_ended,currency,billing_type,delivery_days,revisions,custom_quote,student_eligible,active,sort_order,updated_at)
        values(?,?,?,?,?,?,?,?,?,'INR','one_time',?,2,?,?,1,?,?)`)
        .run(service.slug,service.side,service.title,service.short,service.long,JSON.stringify(service.points),service.from,service.to,service.openEnded?1:0,service.days,service.customQuote?1:0,1,index,now());
      const previousPrice={
        'website-development':7999,'business-website':14999,'full-stack-web-development':24999,'saas-development':39999,
        'ai-integration':14999,'ai-model-development':24999,'ai-powered-apps':14999,'computer-vision':24999,
        'nlp-llm-systems':24999,'multimodal-research':39999,'ai-web-product':39999,'automation':9999,
        'backend-api-development':12999,'dashboard-development':14999,'ui-ux-engineering':7999,
        'research-ml-experimentation':9999,'research-paper-writing':9999,'technical-documentation':4999,'security-tooling':24999
      }[service.slug];
      const existing=db.prepare('select starting_price,estimated_max_price from service_catalog where slug=?').get(service.slug);
      if(existing&&existing.estimated_max_price===0&&(existing.starting_price>0||!service.customQuote)){
        const min=existing.starting_price===(previousPrice??service.from)?service.from:existing.starting_price;
        db.prepare(`update service_catalog set starting_price=?,estimated_max_price=?,open_ended=?,custom_quote=?,student_eligible=1,updated_at=? where slug=? and estimated_max_price=0`)
          .run(min,Math.max(min,service.to),service.openEnded?1:0,service.customQuote?1:0,now(),service.slug);
      }
    }
    const adjustmentDefaults=[
      ['extra-page','Additional page','Per page beyond the first requested page',1000,2500],
      ['responsive-design','Responsive design','Responsive layouts across common screen sizes',0,1500],
      ['authentication','Authentication','Sign-in, account and access-control workflows',3000,7000],
      ['admin-dashboard','Admin dashboard','A private interface for managing product data',7000,15000],
      ['database','Database','Database design and application integration',3000,8000],
      ['api-integration','API integration','Connect an external or internal API',3000,10000],
      ['payment-gateway','Payment gateway','Payment provider integration (provider fees excluded)',4000,10000],
      ['ai-integration','AI integration','Add an AI model or provider to the product',5000,12000],
      ['animations','Animations','Custom motion and interaction details',2000,6000],
      ['custom-ui-ux','Custom UI/UX','Additional custom interface and user-flow design',3000,10000],
      ['deployment','Deployment','Deployment setup and launch support',1000,4000],
      ['third-party-integrations','Third-party integrations','Connect additional external services',2000,8000],
      ['maintenance','Maintenance / improvements','Optional one-time support or improvement scope',2000,8000]
    ];
    for(const [index,[id,label,description,min,max]] of adjustmentDefaults.entries()){
      db.prepare(`insert or ignore into pricing_adjustments(id,label,description,min_amount,max_amount,active,sort_order,updated_at) values(?,?,?,?,?,1,?,?)`)
        .run(id,label,description,min,max,index,now());
    }
  });
  seed();
}

export function getStudentSettings(){
  ensureCatalog();
  return db.prepare('select * from student_settings where id=1').get();
}

export function getPricingAdjustments({includeInactive=false}={}){
  ensureCatalog();
  return db.prepare(`select id,label,description,min_amount,max_amount,active from pricing_adjustments ${includeInactive?'':'where active=1'} order by sort_order,label`).all().map(option=>({...option,active:!!option.active}));
}

export function getServices({includeInactive=false,student=false}={}){
  ensureCatalog();
  const where=includeInactive?'':'where active=1';
  const rows=db.prepare(`select * from service_catalog ${where} order by sort_order,title`).all();
  return rows.map(row=>{
    const start=row.starting_price,end=row.estimated_max_price||start;
    return {slug:row.slug,side:row.side,title:row.title,short:row.short,long:row.long,points:JSON.parse(row.points),from:start,to:end,openEnded:!!row.open_ended,currency:'INR',billingType:'one_time',days:row.delivery_days,revisions:row.revisions,customQuote:!!row.custom_quote,studentEligible:!!row.student_eligible,studentPriceFrom:student&&row.student_eligible?Math.round(start*.75):null,studentPriceTo:student&&row.student_eligible?Math.round(end*.75):null,active:!!row.active,packages:[],addons:[]};
  });
}

export function getStudentApplication(accessToken){
  if(typeof accessToken!=='string'||!/^[a-f0-9]{64}$/.test(accessToken))return null;
  const tokenHash=crypto.createHash('sha256').update(accessToken).digest('hex');
  const application=db.prepare("select id,email,name,access_expires_at from student_applications where access_token_hash=? and status='approved'").get(tokenHash);
  if(!application||application.access_expires_at<=Date.now())return null;
  return application;
}
