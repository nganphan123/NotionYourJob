interface LogoProps {
  width?: number;
  height?: number;
}
export default function Logo(props: LogoProps) {
  return (
    <img
      src={require("../../images/logo.svg")}
      width={props.width ?? 50}
      height={props.height ?? 25}
    />
  );
}
