import{j as c}from"./jsx-runtime-Bsrh3UZy.js";import{S as _}from"./StarRating-eIFAxeWK.js";import"./iframe-CYusSvBt.js";import"./preload-helper-C1FmrZbK.js";const{expect:i,within:w}=__STORYBOOK_MODULE_TEST__,O={title:"Design System/StarRating",component:_,tags:["autodocs"],argTypes:{rating:{control:{type:"range",min:0,max:5,step:.5}},size:{control:{type:"range",min:10,max:32,step:1}},count:{control:"number"}},args:{rating:4.5,size:16}},a={},r={args:{rating:4,count:248},play:async({canvasElement:e})=>{const o=w(e);await i(o.getByLabelText("Avaliação: 4 de 5")).toBeInTheDocument(),await i(o.getByText("(248)")).toBeInTheDocument()}},t={args:{rating:5}},n={args:{rating:4,size:28}},s={render:()=>c.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:[5,4,3,2,1].map(e=>c.jsx(_,{rating:e,size:18,count:Math.round(Math.random()*300)},e))})};var m,p,g;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:"{}",...(g=(p=a.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var u,l,d;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    rating: 4,
    count: 248
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('Avaliação: 4 de 5')).toBeInTheDocument();
    await expect(canvas.getByText('(248)')).toBeInTheDocument();
  }
}`,...(d=(l=r.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var x,y,S;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    rating: 5
  }
}`,...(S=(y=t.parameters)==null?void 0:y.docs)==null?void 0:S.source}}};var h,T,v;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    rating: 4,
    size: 28
  }
}`,...(v=(T=n.parameters)==null?void 0:T.docs)==null?void 0:v.source}}};var D,f,B;s.parameters={...s.parameters,docs:{...(D=s.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }}>\r
      {[5, 4, 3, 2, 1].map(r => <StarRating key={r} rating={r} size={18} count={Math.round(Math.random() * 300)} />)}\r
    </div>
}`,...(B=(f=s.parameters)==null?void 0:f.docs)==null?void 0:B.source}}};const R=["Default","WithCount","Full","Large","Scale"];export{a as Default,t as Full,n as Large,s as Scale,r as WithCount,R as __namedExportsOrder,O as default};
