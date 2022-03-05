import React, { useRef ,useEffect, forwardRef, useImperativeHandle } from "react";
import { gsap } from "gsap";
import './App.css';

function Box({ children }) {
  return <div className="box">{children}</div>;
}

function Container({ children }) {
  return <div><Box>{children}</Box></div>;
}

const Circle = forwardRef(({ size, delay }, ref) => {
  const el = useRef();
    
  useImperativeHandle(ref, () => {           
    
    // return our API
    return {
      moveTo(x, y) {
        gsap.to(el.current, { x, y, delay });
      }
    };
  }, [delay]);
  
  return <div className={`circle ${size}`} ref={el}></div>;
});

function App() {
  const circleRefs = useRef([]);
  const el = useRef();
  const q = gsap.utils.selector(el);

  // reset on re-renders
  circleRefs.current = [];

  useEffect(() => {
    // Target any descendant with the class of .box - no matter how far down the descendant tree. Uses el.current.querySelectorAll() internally
    gsap.to(q(".box"), {
      x: 500,
      stagger: 0.33,
      repeat: -1,
      repeatDelay: 1,
      yoyo: true
    });

    // eslint-disable-next-line no-restricted-globals
    circleRefs.current.forEach(ref => ref.moveTo(innerWidth / 2, innerHeight / 2));
    
    const onMove = ({ clientX, clientY }) => {      
      circleRefs.current.forEach(ref => ref.moveTo(clientX, clientY));
    };
    
    window.addEventListener("pointermove", onMove);
    
    return () => window.removeEventListener("pointermove", onMove);

  }, [q]);

  const addCircleRef = ref => {
    if (ref) {
      circleRefs.current.push(ref);
    }    
  };

  return (
    <>
      <div className="app" ref={el}>
        <Box>Box</Box>
        <Container>Container</Container>
        <Box>Box</Box>

        <Circle size="sm" ref={addCircleRef} delay={0} />
        <Circle size="md" ref={addCircleRef} delay={0.1} />
        <Circle size="lg" ref={addCircleRef} delay={0.2} />
      </div>
    </>
  );
}

export default App;
