// Vent til hele HTML-dokumentet er ferdig lastet før vi kjører koden
document.addEventListener("DOMContentLoaded", () => {
  // Hent skjemaet med ID "bedriftForm"
  const form = document.getElementById("bedriftForm");

  // Liste over input-felter som skal valideres, med:
  // - regex (valgfritt)
  // - requiredMsg: melding hvis feltet er tomt
  // - patternMsg: melding hvis regex ikke matcher
  const felter = [
    { name: "orgnr", regex: /^\d{9}$/, requiredMsg: "Fyll inn organisasjonsnummer", patternMsg: "Må være 9 sifre" },
    { name: "navn", requiredMsg: "Fyll inn navn på borettslaget" },
    { name: "styreleder", requiredMsg: "Fyll inn navn på styreleder" },
    { name: "adresse1", requiredMsg: "Fyll inn adresse" },
    { name: "postnr", regex: /^\d{4}$/, requiredMsg: "Fyll inn postnummer", patternMsg: "Må være 4 sifre" },
    { name: "sted", requiredMsg: "Fyll inn sted" },
    { name: "epost", regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, requiredMsg: "Fyll inn e-post", patternMsg: "Ugyldig e-post" },
    { name: "telefon", regex: /^\d{8}$/, requiredMsg: "Fyll inn telefonnummer", patternMsg: "Må være 8 sifre" },
    { name: "kontaktperson", requiredMsg: "Fyll inn kontaktperson" },
    { name: "kontaktpersonTlf", regex: /^\d{8}$/, requiredMsg: "Fyll inn kontaktpersonens telefonnummer", patternMsg: "Må være 8 sifre" }
  ];

  // Gå gjennom hvert felt og legg til hendelser for validering
  felter.forEach(({ name, regex, requiredMsg, patternMsg }) => {
    // Finn input-felt og feilmeldingsdiv
    const input = document.querySelector(`input[name="${name}"]`);
    const error = document.getElementById(`${name}Error`);
    
    // Hvis input eller error-div mangler, hopp over dette feltet
    if (!input || !error) return;

    // Funksjon som viser riktig feilmelding for feltet
    const visFeil = () => {
      const verdi = input.value.trim(); // Fjern mellomrom
      error.textContent = ""; // Nullstill tidligere feilmelding

      if (!verdi) {
        error.textContent = requiredMsg; // Tomt felt
      } else if (regex && !regex.test(verdi)) {
        error.textContent = patternMsg; // Regex matcher ikke
      }
    };

    // Kjør validering mens bruker skriver og når bruker klikker ut av feltet
    input.addEventListener("input", visFeil);
    input.addEventListener("blur", visFeil);
  });

  // Når brukeren prøver å sende inn skjemaet
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Stopp skjemaet fra å sende før validering
    let ugyldig = false;

    // Gå gjennom alle felter og valider igjen
    felter.forEach(({ name, regex, requiredMsg, patternMsg }) => {
      const input = document.querySelector(`input[name="${name}"]`);
      const error = document.getElementById(`${name}Error`);
      const verdi = input.value.trim();

      error.textContent = ""; // Nullstill tidligere feilmelding

      if (!verdi) {
        error.textContent = requiredMsg;
        ugyldig = true;
      } else if (regex && !regex.test(verdi)) {
        error.textContent = patternMsg;
        ugyldig = true;
      }
    });

    // Hvis ingen feil – send inn skjemaet manuelt
    if (!ugyldig) {
      form.submit();
    }
  });
});
