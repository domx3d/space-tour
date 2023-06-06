

function resizeRendererToDisplaySize(renderer, sizes) {
  const canvas = renderer.domElement;
  sizes.width = canvas.clientWidth;
  sizes.height = canvas.clientHeight;
  const needResize = canvas.width !== sizes.width || canvas.height !== sizes.height;
  if (needResize) {
      renderer.setSize(sizes.width, sizes.height, false);
  }
  return needResize;
}


export {resizeRendererToDisplaySize}