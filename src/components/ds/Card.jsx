// src/components/ds/Card.jsx — cartão genérico do Design System.
// Peça reutilizável montada por composição: além do uso simples (props `title`
// e `actions` + `children`), expõe os subcomponentes Card.Header / Card.Body /
// Card.Footer para montar layouts mais ricos a partir de outras peças.

const VARIANTS = {
  solid: { background: '#fff', border: '1px solid var(--color-gray-100)', boxShadow: 'var(--shadow-sm)' },
  subtle: { background: 'var(--color-gray-50)', border: '1px solid var(--color-gray-100)' },
  dashed: { background: '#fff', border: '1px dashed var(--color-gray-200)' },
};

/**
 * Card — caixa branca padrão da loja (fundo, borda, raio e sombra do tema).
 *
 * @param {string} [title]   Título opcional; quando presente, renderiza um Card.Header automático.
 * @param {ReactNode} [actions] Ações alinhadas à direita do título (ex.: botão "Editar").
 * @param {'solid'|'subtle'|'dashed'} [variant='solid'] Estilo da moldura.
 * @param {number|string} [padding=24] Espaçamento interno (número = px, ou shorthand CSS).
 * @param {string} [titleSize='var(--text-lg)'] Tamanho do título do header automático.
 * @param {ElementType} [as='section'] Tag/elemento raiz (ex.: 'aside').
 */
export function Card({
  title,
  actions,
  variant = 'solid',
  padding = 24,
  titleSize = 'var(--text-lg)',
  as: Tag = 'section',
  style,
  children,
  ...props
}) {
  return (
    <Tag
      style={{ borderRadius: 'var(--radius-lg)', padding, ...VARIANTS[variant], ...style }}
      {...props}
    >
      {(title || actions) && (
        <CardHeader actions={actions} titleSize={titleSize}>{title}</CardHeader>
      )}
      {children}
    </Tag>
  );
}

/** Card.Header — linha de título com ações opcionais à direita. */
export function CardHeader({ children, actions, titleSize = 'var(--text-lg)', style }) {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18, ...style }}
    >
      <h2 style={{ fontSize: titleSize, color: 'var(--color-gray-900)', margin: 0 }}>{children}</h2>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{actions}</div>}
    </div>
  );
}

/** Card.Body — área de conteúdo livre do cartão. */
export function CardBody({ children, style }) {
  return <div style={style}>{children}</div>;
}

/** Card.Footer — rodapé separado por uma linha (ações, totais, etc.). */
export function CardFooter({ children, style }) {
  return (
    <div
      style={{ borderTop: '1px solid var(--color-gray-100)', marginTop: 18, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 12, ...style }}
    >
      {children}
    </div>
  );
}

// Composição: permite o uso `<Card.Header>` / `<Card.Body>` / `<Card.Footer>`.
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
