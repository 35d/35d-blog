const ExtLink = (props) => {
  return (
    <a {...props} rel="noopener" target={props.target || '_blank'}>
      {props.children}
    </a>
  )
}

export default ExtLink
