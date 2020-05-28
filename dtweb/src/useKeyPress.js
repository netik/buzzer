// useKeyPress Hook
import { useState, useEffect } from 'react';

// Hook
function useKeyPress(targetKey, preventDefault) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // Add event listeners
  useEffect(() => {

    // If pressed key is our target key then set to true
    function downHandler(event) {
      console.log(event);
      if (event.key === targetKey) {
        setKeyPressed(true);
        if (preventDefault) {
          event.preventDefault();
        }
      }
    }

    // If released key is our target key then set to false
    const upHandler = (event) => {
      if (event.key === targetKey) {
        setKeyPressed(false);
        if (preventDefault) {
          event.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey, preventDefault]); // rerun the effect if the targetKey changes

  return keyPressed;
}

export default useKeyPress;
