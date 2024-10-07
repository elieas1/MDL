import React from "react";

type Props = {
  spaceTop?: number;
  spaceBottom?: number;
  spaceLeft?: number;
  showLine?: boolean;
};

const EmptySpace = ({
  spaceBottom = 0,
  spaceTop = 0,
  spaceLeft = 0,
  showLine = false,
}: Props) => {
  const getStyle = () => ({
    paddingTop: spaceTop,
    paddingBottom: spaceBottom,
    paddingLeft: spaceLeft,
    borderBottom: showLine ? "1px solid #7878fe" : "null",
    opacity: 0.2,
  });

  return <div style={getStyle()} />;
};

export default EmptySpace;
