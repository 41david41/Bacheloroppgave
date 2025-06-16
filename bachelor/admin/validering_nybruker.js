document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bedriftForm");
  
    const felter = [
      { name: "brukernavn", 
        
        requiredMsg: "Fyll inn brukernavn",
        patternMsg: "Ugyldig e-postadresse" },
        
      { name: "fornavn", requiredMsg: "Fyll inn fornavn" },

      { name: "etternavn", requiredMsg: "Fyll inn etternavn" },

      { name: "telefon",
        regex: /^\d{8}$/,
        requiredMsg: "Fyll inn telefonnummer",
        patternMsg: "Telefonnummer må være 8 sifre"},

      { name: "epost",
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        requiredMsg: "Fyll inn e-post",
        patternMsg: "Ugyldig e-postadresse"},

      { name: "bekreft_epost",
        requiredMsg: "Bekreft e-postadresse" },

      { name: "passord",
        requiredMsg: "Fyll inn passord",
        regex: /^.{6,}$/,

        patternMsg: "Passord må være minst 6 tegn" },
      { name: "bekreft_passord",
        requiredMsg: "Bekreft passord" },
    ];
  
    // Legg til valideringsfelter for feilmelding under hvert input
    felter.forEach(({ name }) => {
      const input = document.querySelector(`input[name="${name}"]`);
      if (input) {
        let errorElem = document.createElement("div");
        errorElem.id = `${name}Error`;
        errorElem.style.color = "red";
        errorElem.style.fontSize = "0.8rem";
        input.parentNode.appendChild(errorElem);
      }
    });
  
    // Egendefinert valideringsfunksjon
    const validerFelt = ({ name, regex, requiredMsg, patternMsg }) => {
      const input = document.querySelector(`input[name="${name}"]`);
      const error = document.getElementById(`${name}Error`);
      if (!input || !error) return false;
  
      const verdi = input.value.trim();
      error.textContent = "";
  
      if (!verdi) {
        error.textContent = requiredMsg;
        return false;
      } else if (regex && !regex.test(verdi)) {
        error.textContent = patternMsg;
        return false;
      }
  
      return true;
    };
  
    // Når skjemaet sendes inn
    form.addEventListener("submit", (e) => {
      let ugyldig = false;
  
      felter.forEach(felt => {
        if (!validerFelt(felt)) ugyldig = true;
      });
  
      // Ekstra: Sjekk at epost og bekreft_epost matcher
      const epost = document.querySelector(`input[name="epost"]`);
      const bekreftEpost = document.querySelector(`input[name="bekreft_epost"]`);
      const bekreftEpostError = document.getElementById("bekreft_epostError");
      if (epost && bekreftEpost && bekreftEpostError) {
        if (epost.value.trim() !== bekreftEpost.value.trim()) {
          bekreftEpostError.textContent = "E-postene stemmer ikke overens";
          ugyldig = true;
        }
      }
  
      // Ekstra: Sjekk at passord og bekreft_passord matcher (kun hvis passordfeltet finnes)
      const passord = document.querySelector(`input[name="passord"]`);
      const bekreftPassord = document.querySelector(`input[name="bekreft_passord"]`);
      const bekreftPassordError = document.getElementById("bekreft_passordError");
      if (passord && bekreftPassord && bekreftPassordError) {
        if (passord.value !== bekreftPassord.value) {
          bekreftPassordError.textContent = "Passordene stemmer ikke overens";
          ugyldig = true;
        }
      }
  
      if (ugyldig) {
        e.preventDefault(); // Hindrer innsending
      }
    });
  
    // Kjør validering i sanntid
    felter.forEach((felt) => {
      const input = document.querySelector(`input[name="${felt.name}"]`);
      if (input) {
        input.addEventListener("input", () => validerFelt(felt));
        input.addEventListener("blur", () => validerFelt(felt));
      }
    });
  });
  