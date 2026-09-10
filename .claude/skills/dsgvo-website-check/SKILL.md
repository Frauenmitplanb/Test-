---
name: dsgvo-website-check
description: >
  Führe einen vollständigen DSGVO- und Datenschutz-Check einer Website durch. Verwende diesen Skill immer dann, wenn jemand eine Website auf Datenschutzkonformität, DSGVO-Konformität, rechtliche Absicherung oder Abmahnsicherheit prüfen lassen möchte – auch wenn er nur fragt "Ist meine Website legal?", "Was fehlt bei meiner Website?", "Kann ich so eine Website launchen?", "Ist mein Impressum korrekt?", "Brauche ich einen Cookie-Banner?" oder ähnliches. Der Skill deckt alle relevanten deutschen und europäischen Rechtsgrundlagen ab: DSGVO, TDDDG (ehemals TTDSG), DDG (ehemals TMG), UWG. Ausgabe ist ein strukturierter Prüfbericht mit Ampel-Bewertung (✅ OK / ⚠️ Nachbesserung / ❌ Verstoß) und konkreten Handlungsempfehlungen.
---

# DSGVO Website-Check Skill

## Übersicht

Dieser Skill befähigt Claude, eine Website systematisch auf Datenschutz- und Rechtskonformität zu prüfen. Das Ergebnis ist ein strukturierter Prüfbericht, der sofort umsetzbare Maßnahmen liefert.

**Rechtsgrundlagen (Stand 2025):**
- DSGVO (Datenschutz-Grundverordnung, EU 2016/679)
- TDDDG (Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz, seit 14.05.2024, ersetzt TTDSG)
- DDG (Digitale-Dienste-Gesetz, seit 14.05.2024, ersetzt TMG)
- EinwV (Einwilligungsverwaltungsverordnung, in Kraft seit 01.04.2025)
- DSK Orientierungshilfe Digitale Dienste v1.2 (November 2024)
- UWG (Wettbewerbsrecht, Abmahnrisiko)

---

## Vorgehensweise

### Schritt 1: Kontext erfassen

Bevor du prüfst, kläre folgende Punkte (sofern nicht bereits aus dem Gespräch bekannt):

1. **Website-URL oder Beschreibung** – Worum handelt es sich? (Blog, Coach-Website, Shop, SaaS, Landingpage, Funnel…)
2. **Eingesetzte Tools/Dienste** – Welche externen Dienste werden genutzt? (Analytics, Fonts, Pixel, Newsletter, Payment, Formular-Tools, CRM, Hosting…)
3. **Zielgruppe** – Werden auch Minderjährige angesprochen? EU-weit? International?
4. **Betreiber** – Privatperson, Freelancer, GmbH, Einzelunternehmer?

Wenn eine URL genannt wird: Halte Ausschau nach öffentlich sichtbaren Hinweisen (Datenschutzerklärung, Impressum, Cookie-Banner, eingebundene externe Skripte).

---

### Schritt 2: Systematische Prüfung durchführen

Prüfe jeden der folgenden **10 Hauptbereiche** und gib jeweils eine Ampel-Bewertung:

- ✅ **OK** – Anforderung erfüllt
- ⚠️ **Nachbesserung** – Vorhanden, aber unvollständig oder fehlerhaft
- ❌ **Verstoß** – Fehlt oder klar rechtswidrig
- ℹ️ **Nicht prüfbar** – Keine Info vorhanden

---

## Prüfbereiche

### 1. IMPRESSUM (DDG § 5 / ehemals TMG)

**Pflichtangaben für gewerbliche/professionelle Websites:**
- Vollständiger Name / Firmenname (wie im Handelsregister)
- Vollständige Anschrift (kein Postfach)
- Kontaktmöglichkeit: E-Mail-Adresse (Pflicht), Telefonnummer (empfohlen)
- Bei Kapitalgesellschaften (GmbH, AG): Handelsregisternummer, Registergericht, alle Geschäftsführer/Vorstände
- Bei UG: Zweck des Unternehmens
- Umsatzsteuer-ID (USt-IdNr.) oder Steuernummer, wenn steuerpflichtig
- Bei freien Berufen: zuständige Aufsichtsbehörde, Kammer, Berufsbezeichnung, einschlägige Berufsordnung
- Erreichbarkeit: Von jeder Seite in max. 2 Klicks (z.B. via Footer-Link)
- Kein Cookie-Banner darf Impressum-Link verdecken

**Häufige Fehler:**
- Nur Postfach statt Straße
- Fehlende E-Mail (nur Kontaktformular reicht NICHT)
- Impressum nicht auf jeder Unterseite erreichbar
- Unvollständige Angaben bei GmbH

---

### 2. DATENSCHUTZERKLÄRUNG (DSGVO Art. 13, 14)

**Pflichtinhalte gemäß Art. 13 DSGVO:**
- Name und Kontaktdaten des Verantwortlichen
- Kontaktdaten Datenschutzbeauftragter (falls vorhanden/pflichtgemäß)
- Verarbeitungszwecke und Rechtsgrundlage für JEDE Datenverarbeitung (Art. 6 Abs. 1 lit. a–f)
- Berechtigte Interessen (bei Verwendung von Art. 6 Abs. 1 lit. f)
- Empfänger oder Kategorien von Empfängern (Drittanbieter!)
- Drittstaatentransfers (z.B. USA) inkl. Schutzmaßnahmen (SCC, Angemessenheitsbeschluss)
- Speicherdauer oder Kriterien zur Festlegung der Dauer
- Betroffenenrechte: Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragbarkeit
- Recht auf Widerruf einer Einwilligung
- Beschwerderecht bei Datenschutzbehörde (zuständige Aufsichtsbehörde benennen)
- Hinweis ob Bereitstellung der Daten gesetzlich/vertraglich vorgeschrieben ist
- Automatisierte Entscheidungsfindung / Profiling (falls vorhanden)

**Für jeden eingesetzten Dienst dokumentieren:**
- Hosting-Anbieter (z.B. IONOS, Hetzner, Netlify, Vercel, GitHub Pages)
- Analytics (Google Analytics, Matomo, Plausible, etc.)
- Fonts (Google Fonts lokal vs. remote)
- Social Media Buttons / Pixel (Facebook/Meta Pixel, Pinterest, TikTok)
- E-Mail-Marketing (Mailchimp, ActiveCampaign, Brevo, etc.)
- Zahlungsanbieter (Stripe, PayPal, Digistore24, CopeCart)
- Formulare (Typeform, Tally, CF7, etc.)
- Kalender-/Buchungstools (Calendly, Acuity, TidyCal)
- Chat-Widgets, Heatmaps, Session-Recording-Tools
- CDN-Dienste, externe JavaScript-Bibliotheken
- YouTube/Vimeo eingebettete Videos

**Formale Anforderungen:**
- Von jeder Seite in max. 2 Klicks erreichbar (besser: 1 Klick via Footer)
- Klare, verständliche Sprache (kein reines Juristendeutsch)
- Muss individuell angepasst sein – generische Vorlagen ohne Anpassung reichen nicht
- Muss aktuell gehalten werden (bei Änderung der eingesetzten Tools anpassen)

---

### 3. COOKIE-BANNER & CONSENT MANAGEMENT (TDDDG § 25, DSGVO Art. 6/7)

**Grundregel (§ 25 Abs. 1 TDDDG):**
Jede Speicherung von oder jeder Zugriff auf Informationen im Endgerät des Nutzers erfordert eine vorherige, informierte und freiwillige Einwilligung – es sei denn, es greift eine der engen Ausnahmen.

**Ausnahmen ohne Einwilligung (§ 25 Abs. 2 TDDDG):**
- Technisch unbedingt notwendige Cookies (Warenkorb-Session, Login-Status, Sprachauswahl, CSRF-Token)
- Speicherung ausschließlich zur Übertragung einer Nachricht

**IMMER einwilligungspflichtig:**
- Analytics-Tools (Google Analytics, Matomo mit UID, etc.)
- Marketing-/Werbe-Cookies
- Tracking-Pixel (Meta Pixel, Google Ads, TikTok Pixel)
- A/B-Testing-Tools
- Heatmap-/Session-Recording-Tools
- YouTube/Vimeo eingebettete Videos (wenn sie Cookies setzen)
- Google Tag Manager (lädt andere einwilligungspflichtige Dienste)
- Social Media Buttons mit direktem Datentransfer
- Externe Fonts, die IP-Adressen übertragen (Google Fonts remote)

**Anforderungen an den Cookie-Banner (DSK OH Digitale Dienste v1.2, Nov. 2024):**
- „Ablehnen" muss auf der ERSTEN Ebene genauso prominent sein wie „Akzeptieren"
- Gleichwertige Darstellung: gleiche Schriftgröße, gleiche Farbe, gleicher Aufwand (1 Klick)
- Kein „Dark Pattern": Keine versteckten Ablehnungsoptionen auf zweiter Ebene
- Kein vorausgefülltes Opt-in für nicht-notwendige Kategorien
- Granulare Kategorien (technisch notwendig / Statistik / Marketing) empfohlen
- Einwilligung muss protokolliert/dokumentiert werden (Consent-Log)
- Einwilligung kann jederzeit widerrufen werden (sichtbarer Link z.B. im Footer)
- Einwilligungen sollten alle 12 Monate erneuert werden
- Cookie-Banner darf Impressum- und Datenschutz-Links nicht verdecken
- Neue EinwV (seit 01.04.2025): PIMS (Personal Information Management Services) können Cookie-Banner künftig ersetzen

**Bußgeldrisiko bei Verstoß:**
- Bis zu 300.000 € nach TDDDG
- Zusätzlich bis zu 20 Mio. € / 4% Jahresumsatz nach DSGVO

---

### 4. EXTERNE DIENSTE MIT DATENTRANSFER IN DRITTSTAATEN

**Besonderes Risiko: USA-Dienste**
Seit Schrems II (2020) und dem neuen EU-US Data Privacy Framework (DPF, seit Juli 2023) gilt:
- US-Anbieter, die dem DPF beigetreten sind, können unter bestimmten Umständen genutzt werden
- Prüfen ob Anbieter DPF-zertifiziert ist: [data.gov/dpf](https://www.privacyshield.gov/ps/search)
- Alternativ: Standardvertragsklauseln (SCC) + Transfer Impact Assessment (TIA)
- In jedem Fall: In Datenschutzerklärung dokumentieren

**Kritische Dienste prüfen:**
- Google Analytics → einwilligungspflichtig, DPF-zertifiziert, aber IP-Anonymisierung empfohlen
- Google Fonts (remote) → IP-Übertragung an Google-Server in USA → lokal einbinden!
- Meta Pixel → einwilligungspflichtig, DPF-zertifiziert
- Mailchimp → einwilligungspflichtig, DPF-zertifiziert
- Calendly → Datentransfer USA, in DSE dokumentieren
- YouTube → einwilligungspflichtig, erweiterten Datenschutzmodus nutzen

**Lösung für Google Fonts:**
Immer lokal einbinden (Schriftarten herunterladen und selbst hosten). Das verhindert automatische IP-Übertragung an Google-Server und damit den DSGVO-Verstoß.

---

### 5. KONTAKTFORMULARE & FORMULARE (DSGVO Art. 6, 13)

**Anforderungen:**
- Datenschutzhinweis direkt am Formular (Link zur DSE genügt + kurzer Hinweis)
- Nur notwendige Pflichtfelder (Datensparsamkeit, Art. 5 Abs. 1 lit. c)
- Keine Pflicht-Checkboxen für die Datenverarbeitung bei Kontaktformularen (berechtigtes Interesse Art. 6 Abs. 1 lit. f)
- ABER: Pflicht-Checkbox für Newsletter-Anmeldung (Einwilligung Art. 6 Abs. 1 lit. a)
- Kein vorausgefülltes Häkchen
- SSL-Verschlüsselung (HTTPS) Pflicht bei Formularen
- Verarbeiter-Hinweis wenn Drittanbieter-Tool (z.B. Typeform) verwendet wird

**Newsletter-spezifisch:**
- Double-Opt-In zwingend empfohlen (und de facto Pflicht zur Nachweisbarkeit)
- Einwilligung protokollieren (Zeitstempel, IP, verwendete Formulierung)
- Abmeldemöglichkeit in jeder E-Mail
- Keine gekoppelte Einwilligung (z.B. kein „Ich kaufe und willige damit in Newsletter ein")

---

### 6. SSL-VERSCHLÜSSELUNG & TECHNISCHE SICHERHEIT (DSGVO Art. 32)

**Pflicht:**
- HTTPS für alle Seiten und Unterseiten
- Gültiges SSL-Zertifikat (nicht abgelaufen)
- HTTP-Anfragen müssen auf HTTPS weitergeleitet werden
- Bei Formularen mit personenbezogenen Daten: Absolute Pflicht

**Empfohlen (DSGVO Art. 32 – Technische und Organisatorische Maßnahmen / TOM):**
- Regelmäßige Software-Updates (CMS, Plugins, Themes)
- Starke Passwörter / 2FA für Admin-Zugang
- Regelmäßige Backups
- Schutz vor CSRF, XSS, SQL-Injection
- Begrenzung von Login-Versuchen

---

### 7. HOSTING & AUFTRAGSVERARBEITUNG (DSGVO Art. 28)

**Anforderungen:**
- Mit dem Hosting-Anbieter muss ein Auftragsverarbeitungsvertrag (AVV) geschlossen worden sein
- Die meisten namhaften Hoster stellen diesen automatisch bereit oder auf Anfrage
- Hosting in der EU / im EWR bevorzugt – sonst Drittstaatentransfer-Dokumentation nötig
- GitHub Pages: Datentransfer in USA (Microsoft), AVV über GitHub-AGB, in DSE erwähnen
- Netlify, Vercel: US-Anbieter, DPF-zertifiziert, AVV vorhanden, in DSE erwähnen

**Verzeichnis von Verarbeitungstätigkeiten (VVT):**
- Pflicht ab 250 Mitarbeiter ODER wenn Verarbeitung nicht nur gelegentlich / Risiko für Betroffene
- Empfohlen für alle Unternehmen als Best Practice
- Nicht öffentlich zugänglich, aber Aufsichtsbehörden müssen Einsicht erhalten können

---

### 8. SOCIAL MEDIA & EINBINDUNGEN (DSGVO, TDDDG)

**Direkte Social-Media-Buttons (Like-Button etc.):**
- Übertragen sofort Daten an Dritte → einwilligungspflichtig
- Lösung: Shariff-Lösung (Zwei-Klick-Prinzip) oder einfache Text-Links ohne Skript

**Eingebettete Videos (YouTube, Vimeo):**
- Standard-Einbindung: Setzt Cookies ohne Einwilligung → Verstoß
- YouTube: Erweiterten Datenschutzmodus nutzen (`youtube-nocookie.com`) – reduziert Tracking, ersetzt aber nicht den Cookie-Banner
- Besser: Video erst nach Einwilligung laden (2-Klick-Lösung via CMP)

**Instagram-Feeds, Google Maps:**
- Einwilligungspflichtig
- Alternatives Google Maps: OpenStreetMap nutzen (kein Google-Tracking)

---

### 9. BETROFFENENRECHTE (DSGVO Art. 15–22)

**Folgende Rechte müssen ausübbar sein und in DSE erklärt werden:**
- Recht auf Auskunft (Art. 15): Was wird gespeichert?
- Recht auf Berichtigung (Art. 16): Falsche Daten korrigieren
- Recht auf Löschung / „Recht auf Vergessenwerden" (Art. 17)
- Recht auf Einschränkung der Verarbeitung (Art. 18)
- Recht auf Datenübertragbarkeit (Art. 20)
- Widerspruchsrecht (Art. 21): Insbesondere bei Direktmarketing
- Recht auf Widerruf einer Einwilligung (jederzeit, ohne Begründung)
- Beschwerderecht bei der Datenschutzbehörde (zuständige Landesbehörde benennen)

**Praxistipp:**
- Kontaktmöglichkeit für Betroffenenanfragen klar benennen (E-Mail)
- Antwortfrist: max. 1 Monat (DSGVO Art. 12)

---

### 10. WEITERE RECHTLICHE ASPEKTE (BRANCHENSPEZIFISCH)

**Online-Shops / E-Commerce:**
- AGB (keine DSGVO-Pflicht, aber empfohlen)
- Widerrufsbelehrung (BGB § 355 ff.) – 14 Tage Widerrufsrecht
- Preisangabenverordnung (PAngV): Bruttopreise, Versandkosten
- Zahlungsarten klar kommunizieren

**Coaches / Berater / Kursanbieter:**
- AGB für Kursverkäufe / Coaching-Verträge empfohlen
- Digitale Inhalte: Widerrufsrecht kann unter Voraussetzungen ausgeschlossen werden (muss aber korrekt kommuniziert werden)
- Affiliate-Links: Kennzeichnungspflicht (UWG – „Werbung" / „*Affiliate-Link")

**Newsletter / E-Mail-Marketing:**
- UWG § 7: Kein unverlangt zugesandter Werbeemail-Versand
- Double-Opt-In mit Protokollierung
- Absender klar erkennbar
- Abmeldemöglichkeit in jeder Mail

**Barrierefreiheit (BFSG ab 28.06.2025):**
- Ab 28. Juni 2025 gilt das Barrierefreiheitsstärkungsgesetz (BFSG) für private Unternehmen
- Betrifft: E-Commerce-Websites, Apps, digitale Dienste (B2C)
- Anforderungen: WCAG 2.1 AA (Kontraste, Alt-Texte, Tastaturnavigation, etc.)
- Ausnahme: Kleinstunternehmen (<10 MA UND <2 Mio. € Jahresumsatz)

---

## Ausgabeformat des Prüfberichts

Erstelle den Bericht in folgender Struktur:

```
# DSGVO Website-Check: [Website-Name/URL]
Stand: [Datum] | Rechtslage: DSGVO, TDDDG, DDG (Stand 2025)

## Zusammenfassung
[2–3 Sätze Gesamteinschätzung + Priorität der Maßnahmen]

## Prüfübersicht
| Bereich | Status | Priorität |
|---|---|---|
| Impressum | ✅/⚠️/❌ | Hoch/Mittel/Niedrig |
| Datenschutzerklärung | ... | ... |
| Cookie-Banner/Consent | ... | ... |
| Externe Dienste/Drittstaaten | ... | ... |
| Formulare | ... | ... |
| SSL/Technische Sicherheit | ... | ... |
| Hosting/AVV | ... | ... |
| Social Media/Einbindungen | ... | ... |
| Betroffenenrechte | ... | ... |
| Weitere (Branche) | ... | ... |

## Detailbefunde

### [Bereich] [Status-Emoji]
**Befund:** [Was wurde festgestellt?]
**Problem:** [Was genau ist das rechtliche Problem?]
**Maßnahme:** [Konkrete Handlungsempfehlung]
**Priorität:** [Hoch = Abmahnrisiko / Mittel = Bußgeldrisiko / Niedrig = Best Practice]

[Wiederholen für jeden Bereich mit Befund]

## Nächste Schritte (priorisiert)
1. [Sofortmaßnahme 1]
2. [Sofortmaßnahme 2]
...

## Rechtlicher Hinweis
Dieser Check ist eine technische und informatorische Einschätzung und ersetzt keine Rechtsberatung durch einen Anwalt oder Datenschutzbeauftragten. Bei konkreten Rechtsfragen empfiehlt sich die Konsultation eines IT-Rechtsanwalts oder zertifizierten Datenschutzberaters.
```

---

## Wichtige Hinweise für Claude

1. **Nur prüfen was bekannt ist.** Wenn keine URL oder Details vorliegen, befunde als „ℹ️ Nicht prüfbar" markieren und konkret nachfragen was geprüft werden soll.

2. **Immer Rechtsquelle nennen.** Jeden Befund mit der relevanten Rechtsgrundlage belegen (z.B. „DSGVO Art. 13", „TDDDG § 25 Abs. 1", „DDG § 5").

3. **Nicht rechtsberatend formulieren.** Immer auf den Hinweis hinweisen, dass dies keine Rechtsberatung ist – besonders bei komplexen oder grenzwertigen Fällen.

4. **Aktuelle Rechtslage berücksichtigen:**
   - TTDSG → jetzt TDDDG (seit 14.05.2024)
   - TMG → jetzt DDG (seit 14.05.2024)
   - EinwV in Kraft seit 01.04.2025 (PIMS-Grundlage)
   - DSK Orientierungshilfe Digitale Dienste v1.2 (Nov. 2024) ist maßgeblich für Cookie-Banner

5. **Praxisorientiert bleiben.** Konkrete Tools, Lösungen und Handlungsschritte nennen, nicht nur abstrakte Rechtspflichten.

6. **Für weitere Tiefen-Details:** Lies die Referenz-Dateien im `references/`-Ordner:
   - `references/drittstaatentransfer.md` – USA-Dienste, DPF, SCC
   - `references/cookie-banner-checkliste.md` – Detaillierte Banner-Anforderungen
   - `references/haeufige-tools.md` – DSGVO-Status gängiger Website-Tools

---

## Schnell-Referenz: Häufige Verstöße in Deutschland 2024/2025

| Verstoß | Häufigkeit | Risiko |
|---|---|---|
| Google Fonts remote eingebunden | Sehr häufig | Abmahnung |
| Cookie-Banner ohne Ablehnen-Option auf Ebene 1 | Sehr häufig | Bußgeld |
| Analytics ohne Einwilligung | Häufig | Bußgeld |
| Meta Pixel ohne Einwilligung | Häufig | Bußgeld |
| Datenschutzerklärung veraltet / fehlende Tools | Sehr häufig | Bußgeld |
| Kein/unvollständiges Impressum | Häufig | Abmahnung |
| Kein AVV mit Hoster | Mittel | Bußgeld |
| Fehlender Datenschutzhinweis am Formular | Mittel | Bußgeld |
| YouTube Standard-Einbindung (mit Cookies) | Häufig | Bußgeld |
| Newsletter ohne Double-Opt-In | Mittel | UWG-Abmahnung |
