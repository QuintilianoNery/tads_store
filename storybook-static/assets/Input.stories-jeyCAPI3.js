import{j as r}from"./jsx-runtime-Bsrh3UZy.js";import"./iframe-CYusSvBt.js";import"./preload-helper-C1FmrZbK.js";function B({label:a,error:e,helperText:t,required:d,id:M,style:N,...R}){const m=M??`input-${Math.random().toString(36).slice(2,7)}`;return r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--space-2)"},children:[a&&r.jsxs("label",{htmlFor:m,style:{fontSize:"var(--text-sm)",fontWeight:"var(--font-medium)",color:"var(--color-gray-700)"},children:[a,d&&r.jsx("span",{style:{color:"var(--color-danger)"},children:" *"})]}),r.jsx("input",{id:m,required:d,"aria-invalid":!!e,style:{width:"100%",padding:"0.75rem 1rem",background:"var(--color-white)",border:`1.5px solid ${e?"var(--color-danger)":"var(--color-gray-300)"}`,borderRadius:"var(--radius-md)",fontSize:"var(--text-sm)",color:"var(--color-gray-900)",transition:"border-color var(--transition-fast), box-shadow var(--transition-fast)",...N},onFocus:o=>{e||(o.target.style.borderColor="var(--color-primary-500)",o.target.style.boxShadow="0 0 0 3px var(--color-primary-100)")},onBlur:o=>{o.target.style.borderColor=e?"var(--color-danger)":"var(--color-gray-300)",o.target.style.boxShadow="none"},...R}),e&&r.jsx("p",{style:{fontSize:"var(--text-xs)",color:"var(--color-danger)"},role:"alert",children:e}),t&&!e&&r.jsx("p",{style:{fontSize:"var(--text-xs)",color:"var(--color-gray-500)"},children:t})]})}B.__docgenInfo={description:`Input — campo de texto rotulado com suporte a erro + texto auxiliar.
Borda 1.5px, foca em azul primário com anel suave.`,methods:[],displayName:"Input"};const{expect:p,userEvent:W,within:H}=__STORYBOOK_MODULE_TEST__,O={title:"Design System/Input",component:B,tags:["autodocs"],parameters:{layout:"padded"},argTypes:{label:{control:"text"},placeholder:{control:"text"},helperText:{control:"text"},error:{control:"text"},required:{control:"boolean"},type:{control:"select",options:["text","email","password","search","tel"]}},args:{label:"E-mail",placeholder:"seu@email.com",type:"email"},decorators:[a=>r.jsx("div",{style:{maxWidth:360},children:r.jsx(a,{})})]},n={},l={args:{label:"Nome completo",placeholder:"Seu nome",type:"text",required:!0}},s={args:{label:"Senha",type:"password",placeholder:"Mínimo 6 caracteres",helperText:"A senha deve ter pelo menos 6 caracteres."}},c={args:{label:"E-mail",defaultValue:"invalido",error:"Informe um e-mail válido."},play:async({canvasElement:a})=>{const e=H(a);await p(e.getByRole("alert")).toHaveTextContent("Informe um e-mail válido."),await p(e.getByLabelText("E-mail")).toHaveAttribute("aria-invalid","true")}},i={args:{label:"Nome completo",type:"text",placeholder:"Seu nome"},play:async({canvasElement:a})=>{const t=H(a).getByLabelText("Nome completo");await W.type(t,"Maria Silva"),await p(t).toHaveValue("Maria Silva")}};var u,v,x;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:"{}",...(x=(v=n.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};var y,g,h;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    label: 'Nome completo',
    placeholder: 'Seu nome',
    type: 'text',
    required: true
  }
}`,...(h=(g=l.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var f,b,S;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    label: 'Senha',
    type: 'password',
    placeholder: 'Mínimo 6 caracteres',
    helperText: 'A senha deve ter pelo menos 6 caracteres.'
  }
}`,...(S=(b=s.parameters)==null?void 0:b.docs)==null?void 0:S.source}}};var w,E,T;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    label: 'E-mail',
    defaultValue: 'invalido',
    error: 'Informe um e-mail válido.'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('Informe um e-mail válido.');
    await expect(canvas.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true');
  }
}`,...(T=(E=c.parameters)==null?void 0:E.docs)==null?void 0:T.source}}};var j,I,_;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    label: 'Nome completo',
    type: 'text',
    placeholder: 'Seu nome'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByLabelText('Nome completo');
    await userEvent.type(field, 'Maria Silva');
    await expect(field).toHaveValue('Maria Silva');
  }
}`,...(_=(I=i.parameters)==null?void 0:I.docs)==null?void 0:_.source}}};const q=["Default","Required","WithHelper","WithError","Typing"];export{n as Default,l as Required,i as Typing,c as WithError,s as WithHelper,q as __namedExportsOrder,O as default};
