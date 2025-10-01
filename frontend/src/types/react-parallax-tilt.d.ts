declare module 'react-parallax-tilt' {
  import * as React from 'react';

  export interface TiltProps extends React.HTMLAttributes<HTMLDivElement> {
    glareEnable?: boolean;
    glareColor?: string;
    glarePosition?: string;
    glareBorderRadius?: string;
    tiltMaxAngleX?: number;
    tiltMaxAngleY?: number;
    scale?: number;
    transitionSpeed?: number;
    gyroscope?: boolean;
    children?: React.ReactNode;
  }

  const Tilt: React.FC<TiltProps>;
  export default Tilt;
}
