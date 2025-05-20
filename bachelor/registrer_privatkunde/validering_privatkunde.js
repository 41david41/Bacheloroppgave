// Vent til hele HTML-dokumentet er lastet før koden kjøres
document.addEventListener("DOMContentLoaded", () => {
  // Hent skjemaelementet med ID "bedriftForm"
  const form = document.getElementById("bedriftForm");

  // Definer feltene som skal valideres
  // Hvert objekt inneholder:
  // - name: navn på input-feltet (matcher HTML "name"-attributt)
  // - requiredMsg: melding hvis feltet er tomt
  // - regex (valgfritt): mønster for ekstra validering
  // - patternMsg: melding hvis mønsteret ikke stemmer
  const felter = [
    { name: "fornavn", requiredMsg: "Fyll inn fornavn" },
    { name: "etternavn", requiredMsg: "Fyll inn etternavn" },
    { name: "epost", regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, requiredMsg: "Fyll inn e-post", patternMsg: "Ugyldig e-postadresse" },
    { name: "telefon", regex: /^\d{8}$/, requiredMsg: "Fyll inn telefonnummer", patternMsg: "Telefonnummer må være 8 sifre" },
    { name: "adresse1", requiredMsg: "Fyll inn adresse" },
    { name: "postnr", regex: /^\d{4}$/, requiredMsg: "Fyll inn postnummer", patternMsg: "Postnummer må være 4 sifre" },
    { name: "sted", requiredMsg: "Fyll inn sted" }
  ];

  // Gå gjennom alle felter og legg til valideringshendelser
  felter.forEach(({ name, regex, requiredMsg, patternMsg }) => {
    const input = document.querySelector(`input[name="${name}"]`);      // Finn input-feltet
    const error = document.getElementById(`${name}Error`);              // Finn feilmeldingselement
    if (!input || !error) return;                                       // Hopp over hvis noen mangler

    // Funksjon for å vise feilmelding ved ugyldig input
    const visFeil = () => {
      const verdi = input.value.trim();                                 // Fjern mellomrom fra input
      error.textContent = "";                                           // Nullstill tidligere feilmelding

      if (!verdi) {
        error.textContent = requiredMsg;                                // Tomt felt
      } else if (regex && !regex.test(verdi)) {
        error.textContent = patternMsg;                                 // Regex matcher ikke
      }
    };

    // Kjør validering når brukeren skriver og klikker ut av feltet
    input.addEventListener("input", visFeil);
    input.addEventListener("blur", visFeil);
  });

  // Når skjemaet forsøkes sendt inn
  form.addEventListener("submit", (e) => {
    e.preventDefault();                                                 // Stopp innsending midlertidig

    let ugyldig = false;

    // Gå gjennom alle felter og valider på nytt
    felter.forEach(({ name, regex, requiredMsg, patternMsg }) => {
      const input = document.querySelector(`input[name="${name}"]`);
      const error = document.getElementById(`${name}Error`);
      const verdi = input.value.trim();

      error.textContent = "";                                           // Nullstill feilmelding

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
