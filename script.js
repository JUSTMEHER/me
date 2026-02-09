window.addEventListener("load", () => {

  const sound = document.getElementById("jetSound");

  if (sound) {
    sound.volume = 0.45;
    sound.play().catch(()=>{});
  }

  setTimeout(() => {
    document.getElementById("loader").style.opacity = 0;
  }, 2700);

  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
  }, 3300);

});
