import React from "react";
import { FC } from "react";

const Skeleton: FC<{nColumnas :number}> = ({nColumnas}) => {
  return (
    <div className="skeleton-container">
      {Array.from({ length: nColumnas }, (_, index) => (
        <div className="skeleton-box" key={index} />
      ))}
      <p>Loading...</p>
    </div>
  );
};

export default Skeleton;
