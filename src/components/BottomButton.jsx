import "./BottomButton.scss";

// props: {icon, title="按钮"}
const BottomButton = (props) => {
  const { icon, title = "按钮", color, operateFunc } = props;
  return (
    <div onClick={operateFunc} className={`button-wrapper ${color}`}>
      <img src={icon} alt="buttonIcon" className="icon" />
      <span className="buttonTitle">{title}</span>
    </div>
  );
};

export default BottomButton;
