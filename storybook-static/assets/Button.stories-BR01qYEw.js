import{j as r}from"./jsx-runtime-Bsrh3UZy.js";import"./iframe-CYusSvBt.js";import"./preload-helper-C1FmrZbK.js";function n({variant:a="primary",size:o="md",fullWidth:b=!1,isLoading:e=!1,children:la,style:da,disabled:pa,...ua}){const ma={sm:{padding:"0.5rem 1rem",fontSize:"var(--text-sm)"},md:{padding:"0.75rem 1.5rem",fontSize:"var(--text-base)"},lg:{padding:"1rem 2rem",fontSize:"var(--text-lg)"}},ga={primary:{background:"var(--color-primary-800)",color:"var(--color-white)",borderColor:"var(--color-primary-800)"},secondary:{background:"transparent",color:"var(--color-primary-800)",borderColor:"var(--color-primary-800)"},accent:{background:"var(--color-accent)",color:"var(--color-white)",borderColor:"var(--color-accent)"},deal:{background:"var(--color-deal)",color:"var(--color-gray-900)",borderColor:"var(--color-deal)"},ghost:{background:"transparent",color:"var(--color-gray-700)",borderColor:"transparent"},danger:{background:"var(--color-danger)",color:"var(--color-white)",borderColor:"var(--color-danger)"}},f=e||pa;return r.jsxs("button",{disabled:f,style:{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"var(--space-2)",fontFamily:"var(--font-display)",fontWeight:"var(--font-bold)",borderRadius:"var(--radius-md)",border:"2px solid transparent",lineHeight:1,letterSpacing:"0.01em",whiteSpace:"nowrap",cursor:f?"not-allowed":"pointer",opacity:f?.5:1,transition:"all var(--transition-fast)",width:b?"100%":void 0,...ma[o],...ga[a],...da},...ua,children:[e&&r.jsx("span",{"aria-hidden":"true",style:{width:"1em",height:"1em",border:"2px solid transparent",borderTopColor:"currentColor",borderRadius:"var(--radius-full)",animation:"spin 0.6s linear infinite",flexShrink:0}}),la]})}n.__docgenInfo={description:`Button — controle de ação primária da TADS Store.
Manrope, borda 2px, cantos arredondados (radius-md).`,methods:[],displayName:"Button",props:{variant:{defaultValue:{value:"'primary'",computed:!1},required:!1},size:{defaultValue:{value:"'md'",computed:!1},required:!1},fullWidth:{defaultValue:{value:"false",computed:!1},required:!1},isLoading:{defaultValue:{value:"false",computed:!1},required:!1}}};const{expect:x,fn:ta,userEvent:ia,within:ca}=__STORYBOOK_MODULE_TEST__,ba={title:"Design System/Button",component:n,tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","accent","deal","ghost","danger"]},size:{control:"inline-radio",options:["sm","md","lg"]},fullWidth:{control:"boolean"},isLoading:{control:"boolean"},disabled:{control:"boolean"},children:{control:"text"}},args:{variant:"primary",size:"md",children:"Adicionar ao carrinho"}},s={args:{variant:"primary"}},t={args:{variant:"secondary",children:"Explorar catálogo"}},i={args:{variant:"accent"}},c={args:{variant:"deal",children:"Comprar agora"}},l={args:{variant:"ghost",children:"Cancelar"}},d={args:{variant:"danger",children:"Remover"}},p={args:{isLoading:!0,children:"Processando"}},u={args:{disabled:!0}},m={args:{fullWidth:!0,size:"lg"},parameters:{layout:"padded"}},g={render:a=>r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:16},children:[r.jsx(n,{...a,size:"sm",children:"Pequeno"}),r.jsx(n,{...a,size:"md",children:"Médio"}),r.jsx(n,{...a,size:"lg",children:"Grande"})]})},v={render:()=>r.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:12},children:["primary","secondary","accent","deal","ghost","danger"].map(a=>r.jsx(n,{variant:a,children:a},a))})},y={args:{children:"Clique aqui",onClick:ta()},play:async({args:a,canvasElement:o})=>{const e=ca(o).getByRole("button",{name:"Clique aqui"});await ia.click(e),await x(a.onClick).toHaveBeenCalledTimes(1)}},h={args:{children:"Indisponível",disabled:!0,onClick:ta()},play:async({args:a,canvasElement:o})=>{const e=ca(o).getByRole("button",{name:"Indisponível"});await x(e).toBeDisabled(),await ia.click(e),await x(a.onClick).not.toHaveBeenCalled()}};var C,S,w;s.parameters={...s.parameters,docs:{...(C=s.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    variant: 'primary'
  }
}`,...(w=(S=s.parameters)==null?void 0:S.docs)==null?void 0:w.source}}};var B,k,z;t.parameters={...t.parameters,docs:{...(B=t.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Explorar catálogo'
  }
}`,...(z=(k=t.parameters)==null?void 0:k.docs)==null?void 0:z.source}}};var D,q,E;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    variant: 'accent'
  }
}`,...(E=(q=i.parameters)==null?void 0:q.docs)==null?void 0:E.source}}};var j,R,_;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    variant: 'deal',
    children: 'Comprar agora'
  }
}`,...(_=(R=c.parameters)==null?void 0:R.docs)==null?void 0:_.source}}};var W,I,T;l.parameters={...l.parameters,docs:{...(W=l.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    variant: 'ghost',
    children: 'Cancelar'
  }
}`,...(T=(I=l.parameters)==null?void 0:I.docs)==null?void 0:T.source}}};var A,L,P;d.parameters={...d.parameters,docs:{...(A=d.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Remover'
  }
}`,...(P=(L=d.parameters)==null?void 0:L.docs)==null?void 0:P.source}}};var V,F,H;p.parameters={...p.parameters,docs:{...(V=p.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    isLoading: true,
    children: 'Processando'
  }
}`,...(H=(F=p.parameters)==null?void 0:F.docs)==null?void 0:H.source}}};var O,G,M;u.parameters={...u.parameters,docs:{...(O=u.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...(M=(G=u.parameters)==null?void 0:G.docs)==null?void 0:M.source}}};var N,K,U;m.parameters={...m.parameters,docs:{...(N=m.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    fullWidth: true,
    size: 'lg'
  },
  parameters: {
    layout: 'padded'
  }
}`,...(U=(K=m.parameters)==null?void 0:K.docs)==null?void 0:U.source}}};var Y,J,Q;g.parameters={...g.parameters,docs:{...(Y=g.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: args => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 16
  }}>\r
      <Button {...args} size="sm">Pequeno</Button>\r
      <Button {...args} size="md">Médio</Button>\r
      <Button {...args} size="lg">Grande</Button>\r
    </div>
}`,...(Q=(J=g.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var X,Z,$;v.parameters={...v.parameters,docs:{...(X=v.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12
  }}>\r
      {['primary', 'secondary', 'accent', 'deal', 'ghost', 'danger'].map(v => <Button key={v} variant={v}>{v}</Button>)}\r
    </div>
}`,...($=(Z=v.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var aa,ra,ea;y.parameters={...y.parameters,docs:{...(aa=y.parameters)==null?void 0:aa.docs,source:{originalSource:`{
  args: {
    children: 'Clique aqui',
    onClick: fn()
  },
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', {
      name: 'Clique aqui'
    });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  }
}`,...(ea=(ra=y.parameters)==null?void 0:ra.docs)==null?void 0:ea.source}}};var na,oa,sa;h.parameters={...h.parameters,docs:{...(na=h.parameters)==null?void 0:na.docs,source:{originalSource:`{
  args: {
    children: 'Indisponível',
    disabled: true,
    onClick: fn()
  },
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', {
      name: 'Indisponível'
    });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  }
}`,...(sa=(oa=h.parameters)==null?void 0:oa.docs)==null?void 0:sa.source}}};const fa=["Primary","Secondary","Accent","Deal","Ghost","Danger","Loading","Disabled","FullWidth","Sizes","AllVariants","Clickable","DisabledDoesNotFire"];export{i as Accent,v as AllVariants,y as Clickable,d as Danger,c as Deal,u as Disabled,h as DisabledDoesNotFire,m as FullWidth,l as Ghost,p as Loading,s as Primary,t as Secondary,g as Sizes,fa as __namedExportsOrder,ba as default};
