import{j as t}from"./jsx-runtime-Bsrh3UZy.js";import"./iframe-CYusSvBt.js";import"./preload-helper-C1FmrZbK.js";function o({size:e=24,style:a,...f}){return t.jsx("span",{role:"status","aria-label":"Carregando",style:{display:"inline-block",width:e,height:e,border:`${Math.max(2,Math.round(e/12))}px solid var(--color-primary-100)`,borderTopColor:"var(--color-primary-600)",borderRadius:"var(--radius-full)",animation:"spin 0.6s linear infinite",...a},...f})}o.__docgenInfo={description:"Spinner — indicador circular de carregamento em azul da marca.",methods:[],displayName:"Spinner",props:{size:{defaultValue:{value:"24",computed:!1},required:!1}}};const{expect:i,within:h}=__STORYBOOK_MODULE_TEST__,_={title:"Design System/Spinner",component:o,tags:["autodocs"],argTypes:{size:{control:{type:"range",min:12,max:64,step:2}}},args:{size:24}},r={play:async({canvasElement:e})=>{const a=h(e);await i(a.getByRole("status")).toBeInTheDocument(),await i(a.getByLabelText("Carregando")).toBeInTheDocument()}},n={args:{size:48}},s={render:()=>t.jsx("div",{style:{display:"flex",alignItems:"center",gap:20},children:[16,24,32,48].map(e=>t.jsx(o,{size:e},e))})};var c,p,l;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Carregando')).toBeInTheDocument();
  }
}`,...(l=(p=r.parameters)==null?void 0:p.docs)==null?void 0:l.source}}};var d,m,u;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    size: 48
  }
}`,...(u=(m=n.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var g,y,x;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 20
  }}>\r
      {[16, 24, 32, 48].map(s => <Spinner key={s} size={s} />)}\r
    </div>
}`,...(x=(y=s.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};const B=["Default","Large","Sizes"];export{r as Default,n as Large,s as Sizes,B as __namedExportsOrder,_ as default};
