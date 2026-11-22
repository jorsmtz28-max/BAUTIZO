(() => {

  "use strict";

  const cielo = document.getElementById("cieloEstrellas");

  if (!cielo) return;

  // No generar animaciones si el usuario las ha desactivado.
  const movimientoReducido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (movimientoReducido.matches) return;

  // Crear estrellas una sola vez.
  function crearEstrellas() {

    const fragmento = document.createDocumentFragment();

    const cantidad = window.innerWidth < 600 ? 20 : 36;
    const grupos = window.innerWidth < 600 ? 6 : 10;

    // Estrellas individuales.
    for (let i = 0; i < cantidad; i++) {

      const estrella = document.createElement("div");

      estrella.className = "estrella";

      const tamano = 7 + Math.random() * 13;
      const duracion = 7 + Math.random() * 8;
      const flotacion = 3 + Math.random() * 4;
      const brillo = 1.5 + Math.random() * 2;

      estrella.style.left = Math.random() * 100 + "%";
      estrella.style.top = Math.random() * 100 + "%";

      estrella.style.setProperty("--tamano", tamano + "px");
      estrella.style.setProperty("--duracion", duracion + "s");
      estrella.style.setProperty("--flotacion", flotacion + "s");
      estrella.style.setProperty("--brillo", brillo + "s");
      estrella.style.setProperty(
        "--retraso",
        -(Math.random() * 10) + "s"
      );

      fragmento.appendChild(estrella);
    }

    // Grupos de estrellas.
    for (let i = 0; i < grupos; i++) {

      const grupo = document.createElement("div");

      grupo.className = "grupo-estrellas";

      grupo.style.left = Math.random() * 95 + "%";
      grupo.style.top = Math.random() * 95 + "%";
      grupo.style.animationDelay =
        -(Math.random() * 12) + "s";

      fragmento.appendChild(grupo);
    }

    cielo.replaceChildren(fragmento);
  }

  // Primera generación.
  crearEstrellas();

  // Solo regenerar cuando cambia el tamaño de dispositivo
  // de móvil a escritorio o viceversa.
  let esMovil = window.innerWidth < 600;
  let temporizador;

  window.addEventListener("resize", () => {

    clearTimeout(temporizador);

    temporizador = setTimeout(() => {

      const nuevoEstado = window.innerWidth < 600;

      if (nuevoEstado !== esMovil) {
        esMovil = nuevoEstado;
        crearEstrellas();
      }

    }, 300);

  }, { passive: true });

})();

/* Estrellas adicionales en cada sección de la invitación. */
document.addEventListener("DOMContentLoaded", () => {
  const secciones = document.querySelectorAll(".decorada-estrellas");
  const posiciones = [
    ["3%", "12%"], ["8%", "34%"], ["4%", "61%"], ["10%", "84%"],
    ["92%", "10%"], ["96%", "32%"], ["90%", "58%"], ["95%", "82%"],
    ["22%", "8%"], ["78%", "88%"]
  ];
  const colores = ["#ff5bc8", "#68e7ff", "#b99aff", "#fff0ad"];

  secciones.forEach((seccion, indice) => {
    if (seccion.querySelector(".decoraciones-laterales")) return;
    const capa = document.createElement("div");
    capa.className = "decoraciones-laterales";
    capa.setAttribute("aria-hidden", "true");

    posiciones.forEach(([x, y], i) => {
      const estrella = document.createElement("span");
      const tipo = (i + indice) % 3;
      estrella.className = "decoracion-estrella" + (tipo === 1 ? " contorno" : tipo === 2 ? " cruz" : "");
      estrella.style.setProperty("--x", x);
      estrella.style.setProperty("--y", y);
      estrella.style.setProperty("--tam", (13 + ((i * 7 + indice * 5) % 23)) + "px");
      estrella.style.setProperty("--dur", (1.8 + ((i + indice) % 4) * .55) + "s");
      estrella.style.setProperty("--flotar", (3.5 + ((i * 2 + indice) % 4)) + "s");
      estrella.style.setProperty("--delay", (-(i * .37 + indice * .25)) + "s");
      estrella.style.setProperty("--color", colores[(i + indice) % colores.length]);
      capa.appendChild(estrella);
    });
    seccion.prepend(capa);
  });

  /* El sobre inicia la música después de la primera interacción. */
  const intro = document.getElementById("introSobre");
  const audio = document.getElementById("musicaFondo");
  const botonMusica = document.getElementById("controlMusica");

  const reproducir = () => {
    if (!audio) return;
    audio.volume = 0.42;
    const intento = audio.play();
    if (intento && typeof intento.catch === "function") intento.catch(() => {});
  };

  const abrirSobre = () => {
    if (!intro || intro.classList.contains("cerrado")) return;
    intro.classList.add("abriendo");
    reproducir();
    window.setTimeout(() => {
      intro.classList.add("cerrado");
      document.getElementById("inicio")?.scrollIntoView({ behavior: "smooth" });
    }, 850);
  };

  if (intro) {
    intro.addEventListener("click", abrirSobre);
    intro.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        abrirSobre();
      }
    });
  }

  if (botonMusica && audio) {
    botonMusica.addEventListener("click", async () => {
      if (audio.paused) {
        try {
          await audio.play();
          botonMusica.classList.add("reproduciendo");
          botonMusica.setAttribute("aria-label", "Pausar música");
        } catch (error) {
          botonMusica.classList.remove("reproduciendo");
        }
      } else {
        audio.pause();
        botonMusica.classList.remove("reproduciendo");
        botonMusica.setAttribute("aria-label", "Activar música");
      }
    });
    audio.addEventListener("play", () => botonMusica.classList.add("reproduciendo"));
    audio.addEventListener("pause", () => botonMusica.classList.remove("reproduciendo"));
  }
});


// Música de fondo: se activa después de que el invitado toque el botón.
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("musicaFondo");
  const button = document.getElementById("botonMusica");
  if (!audio || !button) return;

  audio.volume = 0.4;
  button.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
        button.classList.add("activo");
        button.setAttribute("aria-label", "Pausar música");
      } catch (error) {
        button.classList.remove("activo");
      }
    } else {
      audio.pause();
      button.classList.remove("activo");
      button.setAttribute("aria-label", "Reproducir música");
    }
  });

  audio.addEventListener("play", () => button.classList.add("activo"));
  audio.addEventListener("pause", () => button.classList.remove("activo"));
});
