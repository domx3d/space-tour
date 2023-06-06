

class ButtonManager {
  constructor() {
    
    this.returnButton = document.getElementById( 'returnButton' );
    this.nightModeBtn = document.getElementById("nightMode");
    this.leftArrow = document.getElementById( 'left-arrow' );
    this.rightArrow = document.getElementById( 'right-arrow' );
  }

  setVisibility(newSec) {
    this.returnButton.style.visibility = (newSec == 0) ? "hidden" : 'visible';
    this.nightModeBtn.style.visibility = (newSec != 0) ? "hidden" : 'visible';
    this.leftArrow.style.visibility = (newSec == -4) ? "hidden" : 'visible';
    this.rightArrow.style.visibility = (newSec == 5) ? "hidden" : 'visible'; 
  }
}

export default ButtonManager;