export const serviceGroups=[
  {
    id:'web-development',
    number:'01',
    title:'Web Development',
    description:'Websites, applications and digital experiences built for real-world use.',
    representative:{slug:'web-development',title:'Web development',side:'web'},
    slugs:['website-development','landing-page','business-website','professional-multipage-website','website-backend','website-admin-dashboard','full-stack-web-development','custom-full-stack-website','website-editing-bug-fixes','website-redesign','complete-website-redesign','basic-web-app','bug-fixes','feature-addition','website-improvement','performance-optimization']
  },
  {
    id:'ai-development',
    number:'02',
    title:'AI Development',
    description:'AI models, assistants and intelligent capabilities built around your needs.',
    representative:{slug:'ai-development',title:'AI development',side:'ai'},
    slugs:['ai-integration','ai-powered-apps','ai-assistant','ai-model-development','nlp-llm-systems','computer-vision','multimodal-research','ai-ml-model-evaluation','custom-ai-ml-project']
  },
  {
    id:'ai-web-products',
    number:'03',
    title:'AI + Web Products',
    description:'Complete digital products combining AI with modern web technology.',
    representative:{slug:'ai-web-product',title:'AI web product',side:'ai'},
    slugs:['ai-web-product','ai-chatbot-website','ai-powered-web-app','ai-automation','ai-automation-service','ai-integration','ai-assistant','ai-powered-apps']
  },
  {
    id:'research-ml',
    number:'04',
    title:'Research & ML',
    description:'Research, experimentation, evaluation and machine-learning development.',
    representative:{slug:'research-ml',title:'Research and ML',side:'ai'},
    slugs:['research-ml-experimentation','research-paper-writing','research-assistance','multimodal-research','ai-ml-model-evaluation','custom-ai-ml-project','ai-model-development']
  },
  {
    id:'automation-systems',
    number:'05',
    title:'Automation & Systems',
    description:'Connect workflows, APIs and intelligent systems to reduce repetitive work.',
    representative:{slug:'automation',title:'Automation workflow',side:'web'},
    slugs:['automation','api-workflow-automation','ai-automation','ai-automation-service','backend-api-development','authentication-system','database-integration','security-tooling']
  },
  {
    id:'ui-ux-engineering',
    number:'06',
    title:'UI/UX Engineering',
    description:'Interfaces and product experiences designed for clarity and usability.',
    representative:{slug:'ui-ux',title:'UI UX design',side:'web'},
    slugs:['ui-ux-engineering','landing-page-ui-ux','web-app-ui-ux','dashboard-ui-ux','complete-product-ui-ux','website-improvement','website-redesign']
  },
  {
    id:'backend-product-engineering',
    number:'07',
    title:'Backend & Product Engineering',
    description:'Scalable APIs, databases, authentication and product foundations.',
    representative:{slug:'backend-product-engineering',title:'Backend API software',side:'web'},
    slugs:['backend-api-development','authentication-system','database-integration','dashboard-development','saas-development','custom-saas-platform','full-stack-web-development','website-backend','website-admin-dashboard']
  },
  {
    id:'technical-research-support',
    number:'08',
    title:'Technical & Research Support',
    description:'Documentation, evaluation, research and technical improvement.',
    representative:{slug:'research-support',title:'Research documentation',side:'ai'},
    slugs:['technical-documentation','research-paper-writing','research-assistance','ai-ml-model-evaluation','security-tooling','performance-optimization','bug-fixes','feature-addition']
  }
];

export function getServiceGroups(services){
  const servicesBySlug=new Map(services.map(service=>[service.slug,service]));
  const assigned=new Set();

  return serviceGroups.map(group=>({
    ...group,
    services:group.slugs.map(slug=>servicesBySlug.get(slug)).filter(Boolean).map(service=>{
      assigned.add(service.slug);
      return service;
    })
  })).map(group=>({
    ...group,
    description:group.description,
    count:group.services.length
  })).filter(group=>group.count>0).concat(
    services.filter(service=>!assigned.has(service.slug)).map((service,index)=>({
      id:`additional-${service.slug}`,
      number:String(serviceGroups.length+index+1).padStart(2,'0'),
      title:service.title,
      description:service.short,
      representative:service,
      services:[service],
      count:1
    }))
  );
}
