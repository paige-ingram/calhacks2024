import type { FC } from "react";

export type HumeLogoProps = React.HTMLAttributes<HTMLDivElement>;

const HumeLogo: FC<HumeLogoProps> = (props) => {
  return (
    <div {...props} style={{ position: 'relative', top: '-40px' }}> {/* Adjust the top value to move the logo higher */}
      <img src="/halo_logo.png" alt="Halo Logo" width="106" height="25" />
    </div>
  );
};

export default HumeLogo;
