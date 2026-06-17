import{j as e}from"./jsx-runtime-Bsrh3UZy.js";import{R as X}from"./iframe-CYusSvBt.js";import{B as $}from"./Badge-BGLJf9jf.js";import{S as ee}from"./StarRating-eIFAxeWK.js";import"./preload-helper-C1FmrZbK.js";const ae="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z";function S({children:a,active:t,onClick:o,label:i}){const[n,c]=X.useState(!1),l=t?"var(--color-danger)":"var(--color-primary-800)";return e.jsx("button",{onClick:o,"aria-label":i,onMouseEnter:()=>c(!0),onMouseLeave:()=>c(!1),style:{width:"2rem",height:"2rem",background:n?l:"var(--color-white)",color:n?"var(--color-white)":t?"var(--color-danger)":"var(--color-gray-600)",border:"none",borderRadius:"var(--radius-full)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"var(--shadow-md)",cursor:"pointer",transition:"all var(--transition-fast)"},children:a})}function v({title:a="Produto",category:t="categoria",price:o=0,originalPrice:i,discountPercentage:n=0,rating:c=0,thumbnail:l,wishlisted:b=!1,onAddToCart:K,onToggleWishlist:U,style:Z,...J}){const[s,w]=X.useState(!1),T=n>0,j=Q=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Q??0);return e.jsxs("article",{onMouseEnter:()=>w(!0),onMouseLeave:()=>w(!1),style:{background:"var(--color-white)",borderRadius:"var(--radius-lg)",overflow:"hidden",boxShadow:s?"var(--shadow-lg)":"var(--shadow-sm)",border:"1px solid var(--color-gray-100)",transition:"box-shadow var(--transition-base), transform var(--transition-base)",transform:s?"translateY(-2px)":"none",display:"flex",flexDirection:"column",...Z},...J,children:[e.jsxs("div",{style:{position:"relative",aspectRatio:"1",overflow:"hidden",background:"var(--color-gray-100)"},children:[l&&e.jsx("img",{src:l,alt:a,loading:"lazy",style:{width:"100%",height:"100%",objectFit:"cover",transition:"transform var(--transition-slow)",transform:s?"scale(1.04)":"none"}}),T&&e.jsx("div",{style:{position:"absolute",top:"var(--space-3)",left:"var(--space-3)"},children:e.jsxs($,{variant:"deal",size:"sm",children:["-",Math.round(n),"%"]})}),e.jsxs("div",{style:{position:"absolute",top:"var(--space-3)",right:"var(--space-3)",display:"flex",flexDirection:"column",gap:"var(--space-2)",opacity:s?1:0,transform:s?"translateX(0)":"translateX(8px)",transition:"opacity var(--transition-base), transform var(--transition-base)"},children:[e.jsx(S,{active:b,onClick:U,label:"Lista de desejos",children:e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:b?"currentColor":"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:ae})})}),e.jsx(S,{onClick:K,label:"Adicionar ao carrinho",children:e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"8",cy:"21",r:"1"}),e.jsx("circle",{cx:"19",cy:"21",r:"1"}),e.jsx("path",{d:"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"})]})})]})]}),e.jsxs("div",{style:{padding:"var(--space-4)",display:"flex",flexDirection:"column",gap:"var(--space-2)",flex:1},children:[e.jsx("span",{style:{fontSize:"var(--text-xs)",fontWeight:"var(--font-medium)",color:"var(--color-accent)",textTransform:"uppercase",letterSpacing:"0.05em"},children:t}),e.jsx("h3",{style:{fontFamily:"var(--font-body)",fontSize:"var(--text-sm)",fontWeight:"var(--font-semibold)",color:"var(--color-gray-800)",lineHeight:"var(--leading-tight)",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"},children:a}),e.jsx(ee,{rating:c,size:13}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"var(--space-2)",marginTop:"auto"},children:[e.jsx("span",{style:{fontFamily:"var(--font-display)",fontSize:"var(--text-base)",fontWeight:"var(--font-bold)",color:"var(--color-primary-800)"},children:j(o)}),T&&i&&e.jsx("span",{style:{fontSize:"var(--text-sm)",color:"var(--color-gray-400)",textDecoration:"line-through"},children:j(i)})]})]})]})}v.__docgenInfo={description:`ProductCard — o tile de produto símbolo da loja.
Imagem quadrada, badge de promoção, ações em hover (favorito + carrinho),
eyebrow de categoria, título truncado, avaliação por estrelas, preço com original.`,methods:[],displayName:"ProductCard",props:{title:{defaultValue:{value:"'Produto'",computed:!1},required:!1},category:{defaultValue:{value:"'categoria'",computed:!1},required:!1},price:{defaultValue:{value:"0",computed:!1},required:!1},discountPercentage:{defaultValue:{value:"0",computed:!1},required:!1},rating:{defaultValue:{value:"0",computed:!1},required:!1},wishlisted:{defaultValue:{value:"false",computed:!1},required:!1}}};const{expect:y,fn:r,userEvent:Y,within:x}=__STORYBOOK_MODULE_TEST__,ie={title:"Design System/ProductCard",component:v,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{title:{control:"text"},category:{control:"text"},price:{control:"number"},originalPrice:{control:"number"},discountPercentage:{control:{type:"range",min:0,max:90,step:1}},rating:{control:{type:"range",min:0,max:5,step:.5}},wishlisted:{control:"boolean"}},args:{title:"Fones Bluetooth Pro com Cancelamento de Ruído",category:"Eletrônicos",price:159.92,originalPrice:199.9,discountPercentage:20,rating:4.5,thumbnail:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format&fit=crop",wishlisted:!1,onAddToCart:r(),onToggleWishlist:r()},decorators:[a=>e.jsx("div",{style:{width:260},children:e.jsx(a,{})})]},d={},p={args:{onAddToCart:r()},play:async({args:a,canvasElement:t})=>{const o=x(t);await Y.click(o.getByRole("button",{name:"Adicionar ao carrinho"})),await y(a.onAddToCart).toHaveBeenCalledTimes(1)}},u={args:{onToggleWishlist:r()},play:async({args:a,canvasElement:t})=>{const o=x(t);await Y.click(o.getByRole("button",{name:"Lista de desejos"})),await y(a.onToggleWishlist).toHaveBeenCalledTimes(1)}},m={play:async({canvasElement:a})=>{const t=x(a);await y(t.getByText("-20%")).toBeInTheDocument()}},g={args:{title:"Relógio Inteligente Series 8",category:"Acessórios",price:1299,originalPrice:void 0,discountPercentage:0,rating:4,thumbnail:"https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80&auto=format&fit=crop"}},h={args:{wishlisted:!0}},f={decorators:[a=>e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 240px)",gap:24},children:e.jsx(a,{})})],render:()=>[{id:1,title:"Tênis Esportivo Runner Air",category:"Calçados",price:237.53,originalPrice:329.9,discountPercentage:28,rating:5,thumbnail:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop"},{id:2,title:"Teclado Mecânico Sem Fio RGB",category:"Eletrônicos",price:389,discountPercentage:0,rating:5,thumbnail:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80&auto=format&fit=crop"},{id:3,title:"Mochila Antifurto para Notebook",category:"Acessórios",price:186.92,originalPrice:219.9,discountPercentage:15,rating:4.5,thumbnail:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&auto=format&fit=crop"}].map(t=>e.jsx(v,{...t,onAddToCart:r(),onToggleWishlist:r()},t.id))};var C,B,P;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:"{}",...(P=(B=d.parameters)==null?void 0:B.docs)==null?void 0:P.source}}};var A,k,R;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    onAddToCart: fn()
  },
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Adicionar ao carrinho'
    }));
    await expect(args.onAddToCart).toHaveBeenCalledTimes(1);
  }
}`,...(R=(k=p.parameters)==null?void 0:k.docs)==null?void 0:R.source}}};var E,W,q;u.parameters={...u.parameters,docs:{...(E=u.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    onToggleWishlist: fn()
  },
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Lista de desejos'
    }));
    await expect(args.onToggleWishlist).toHaveBeenCalledTimes(1);
  }
}`,...(q=(W=u.parameters)==null?void 0:W.docs)==null?void 0:q.source}}};var D,L,M;m.parameters={...m.parameters,docs:{...(D=m.parameters)==null?void 0:D.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('-20%')).toBeInTheDocument();
  }
}`,...(M=(L=m.parameters)==null?void 0:L.docs)==null?void 0:M.source}}};var _,H,I;g.parameters={...g.parameters,docs:{...(_=g.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    title: 'Relógio Inteligente Series 8',
    category: 'Acessórios',
    price: 1299,
    originalPrice: undefined,
    discountPercentage: 0,
    rating: 4,
    thumbnail: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80&auto=format&fit=crop'
  }
}`,...(I=(H=g.parameters)==null?void 0:H.docs)==null?void 0:I.source}}};var O,z,F;h.parameters={...h.parameters,docs:{...(O=h.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    wishlisted: true
  }
}`,...(F=(z=h.parameters)==null?void 0:z.docs)==null?void 0:F.source}}};var N,V,G;f.parameters={...f.parameters,docs:{...(N=f.parameters)==null?void 0:N.docs,source:{originalSource:`{
  decorators: [Story => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 240px)',
    gap: 24
  }}><Story /></div>],
  render: () => {
    const items = [{
      id: 1,
      title: 'Tênis Esportivo Runner Air',
      category: 'Calçados',
      price: 237.53,
      originalPrice: 329.9,
      discountPercentage: 28,
      rating: 5,
      thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop'
    }, {
      id: 2,
      title: 'Teclado Mecânico Sem Fio RGB',
      category: 'Eletrônicos',
      price: 389,
      discountPercentage: 0,
      rating: 5,
      thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80&auto=format&fit=crop'
    }, {
      id: 3,
      title: 'Mochila Antifurto para Notebook',
      category: 'Acessórios',
      price: 186.92,
      originalPrice: 219.9,
      discountPercentage: 15,
      rating: 4.5,
      thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&auto=format&fit=crop'
    }];
    return items.map(p => <ProductCard key={p.id} {...p} onAddToCart={fn()} onToggleWishlist={fn()} />);
  }
}`,...(G=(V=f.parameters)==null?void 0:V.docs)==null?void 0:G.source}}};const ce=["OnSale","AddToCart","ToggleWishlist","ShowsDiscountBadge","NoDiscount","Wishlisted","Grid"];export{p as AddToCart,f as Grid,g as NoDiscount,d as OnSale,m as ShowsDiscountBadge,u as ToggleWishlist,h as Wishlisted,ce as __namedExportsOrder,ie as default};
