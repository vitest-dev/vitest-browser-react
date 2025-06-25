export function HelloWorld({ name = 'World' }: { name?: string }): React.ReactElement {
  return <div>{`Hello ${name}`}</div>
}
