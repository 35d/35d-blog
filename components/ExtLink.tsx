const ExtLink = (props) => {
  return (
    <a {...props} rel="noopener" target={props.target || '_blank'}>
      <span className="mr-1">{props.children}</span>
      <img src="/img/external_for_dark.svg" className="w-4 inline-block pb-[2px]" alt="" />
    </a>
  )
}

export default ExtLink
