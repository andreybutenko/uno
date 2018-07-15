function computeFraction(i, total) {
  if(total == 1) {
    return 1 / 2;
  }
  else if(total == 2) {
    return (i + 1) / 3;
  }
  else if(total != 2) {
    return i / (total - 1); // subtract 1 because arrays are 0-indexed while math is 1-indexed
  }
}

export default {
  // Get position of opponent detail box along the radius of a semi-circle given:
  //   i: the index of current opponent
  //   total: total number of enemy players to place
  getOpponentDetailStyle(i, total) {
    const frac =  computeFraction(i, total);
    const radians = frac * Math.PI;

    return {
      left: 'calc(50% * ' + -1 * Math.cos(radians) + ' + 50%)',
      top: 'calc(50vh * ' + -1 * Math.sin(radians) + ' + 50vh)',
      transform: 'translateX(-' + (frac * 150) + 'px)'
    }
  },

  // Get position and rotation of opponent hand along the radius of a semi-circle given:
  //   i: the index of current opponent
  //   total: total number of enemy players to place
  getOpponentHandStyle(i, total) {
    const frac =  computeFraction(i, total);
    const radians = frac * Math.PI;

    return {
      left: 'calc(50% * ' + -1 * Math.cos(radians) + ' + 50% + ' + (-400 * (frac - 0.5))  + 'px)',
      top: 'calc(50vh * ' + -1 * Math.sin(radians) + ' + 50vh + 200px)',
      transform: 'rotate(' + (0.5 * Math.PI + radians) + 'rad) scale(0.25) translateX(-' + ((1 - frac) * 100) + '%)'
    }
  }
}
