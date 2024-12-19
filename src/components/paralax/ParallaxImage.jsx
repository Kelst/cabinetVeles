import { animated, useSpring } from "@react-spring/web";
import { useState } from "react";

const ParallaxImage = () => {
    const [hovered, setHovered] = useState(false); 
  
    const { transform } = useSpring({
      transform: `translate3d(${hovered ? 20 : 0}px, 0, 0)`,
    });
  
    return (
      <animated.div
        src="your_image_url.jpg"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transform,
          // Add any additional styles you need
        }}
      >
        </animated.div>
    );
  };
  
  export default ParallaxImage;
  