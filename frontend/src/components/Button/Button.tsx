type ButtonSize = "xs" | "s" | "m" | "l" | "xl";
type ButtonKind = "primary" | "secondary" | "success" | "warning" | "danger";

interface ButtonProps {
  size: ButtonSize;
  kind: ButtonKind;
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}

export default function Button({
  size,
  kind,
  isDisabled = false,
  isLoading = false,
  onClick,
}: ButtonProps) {
  switch (size) {
    case "xs":
      break;
    case "s":
      break;
    case "m":
      break;
    case "l":
      break;
    case "xl":
      break;
    default:
      break;
  }

  switch (kind) {
    case "primary":
      break;
    case "secondary":
      break;
    case "success":
      break;
    case "warning":
      break;
    case "danger":
      break;
    default:
      break;
  }

  return (
    <button
      className={`btn ${size} ${kind}`}
      disabled={isDisabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? "Loading..." : "Click me"}
    </button>
  );
}
