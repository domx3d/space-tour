import { planetsInfo } from "./Data";

class TextBox {
  constructor() {
    this.element = document.querySelector('.element');
    this.planetName =  document.getElementById('planetName');
    this.fact1 =  document.getElementById('fact1');
    this.fact2 =  document.getElementById('fact2');
    this.fact3 =  document.getElementById('fact3');
    this.opacity = { value: 0 };
  }

  setTextBox(section, planetNames) {

    // set planet name
    this.planetName.innerText = planetNames[section+4];
    
    // set facts
    this.fact1.innerText =
      planetsInfo[planetNames[section+4]].facts[0];
    this.fact2.innerText =
      planetsInfo[planetNames[section+4]].facts[1];
    this.fact3.innerText =
      planetsInfo[planetNames[section+4]].facts[2];
  }
}

export default TextBox;

