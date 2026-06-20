import{j as t}from"./jsx-runtime-Bsrh3UZy.js";import{B as w}from"./Badge-BGLJf9jf.js";import"./iframe-CYusSvBt.js";import"./preload-helper-C1FmrZbK.js";const{expect:T,within:_}=__STORYBOOK_MODULE_TEST__,I={title:"Design System/Badge",component:w,tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","accent","deal","success","danger","warning","info"]},size:{control:"inline-radio",options:["sm","md"]},children:{control:"text"}},args:{variant:"deal",size:"md",children:"-20%"}},r={args:{variant:"deal",children:"-28%"},play:async({canvasElement:a})=>{const E=_(a);await T(E.getByText("-28%")).toBeInTheDocument()}},e={args:{variant:"primary",children:"Principal"}},n={args:{variant:"success",children:"Entregue"}},s={args:{variant:"info",children:"A caminho"}},c={render:()=>t.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:10},children:["primary","accent","deal","success","danger","warning","info"].map(a=>t.jsx(w,{variant:a,children:a},a))})};var i,o,d;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    variant: 'deal',
    children: '-28%'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('-28%')).toBeInTheDocument();
  }
}`,...(d=(o=r.parameters)==null?void 0:o.docs)==null?void 0:d.source}}};var p,l,m;e.parameters={...e.parameters,docs:{...(p=e.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Principal'
  }
}`,...(m=(l=e.parameters)==null?void 0:l.docs)==null?void 0:m.source}}};var g,u,v;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'Entregue'
  }
}`,...(v=(u=n.parameters)==null?void 0:u.docs)==null?void 0:v.source}}};var y,h,x;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'A caminho'
  }
}`,...(x=(h=s.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var f,B,S;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10
  }}>\r
      {['primary', 'accent', 'deal', 'success', 'danger', 'warning', 'info'].map(v => <Badge key={v} variant={v}>{v}</Badge>)}\r
    </div>
}`,...(S=(B=c.parameters)==null?void 0:B.docs)==null?void 0:S.source}}};const P=["Deal","Primary","Success","Info","AllVariants"];export{c as AllVariants,r as Deal,s as Info,e as Primary,n as Success,P as __namedExportsOrder,I as default};
