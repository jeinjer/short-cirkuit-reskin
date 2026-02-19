import React from 'react';

const BackgroundFX = () => (
  <>
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20 pointer-events-none" />
    <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#030303] opacity-80 pointer-events-none" />
  </>
);

export default BackgroundFX;