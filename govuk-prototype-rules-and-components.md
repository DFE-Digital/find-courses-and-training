# GOV.UK Prototype Rules and Components Checklist

This guide is for the FCaT prototype in this repository. The project uses:

- `govuk-prototype-kit` 13.20.0
- `govuk-frontend` 6.1.0
- GOV.UK Frontend Nunjucks macros in `app/views/layouts/main.html`

Use this file as the working checklist before adding or changing prototype pages.

## Core Rules

- Use the GOV.UK Prototype Kit for prototypes only. Do not treat prototype code as production code or publish it as a live public service.
- If the prototype is shared online, protect it with a password so users do not mistake it for a real service.
- Prefer GOV.UK Design System components, patterns and styles before creating custom HTML, Sass or JavaScript.
- Use Nunjucks macros from GOV.UK Frontend where possible. They include accessible markup and consistent classes.
- Keep each page focused on the user task. Avoid extra explanatory content that is not needed to complete the journey.
- Use GOV.UK typography, spacing, grid, links, buttons, form groups and utility classes.
- Do not override GOV.UK component behaviour unless there is a clear researched need.
- Test pages on desktop and mobile widths.
- Test keyboard navigation and visible focus states.
- Keep JavaScript progressive. The page should still make sense if JavaScript fails.

## Current Project Structure

- Layouts live in `app/views/layouts/`.
- Main shared layout is `app/views/layouts/main.html`.
- Homepage layout is `app/views/layouts/fcat-homepage.html`.
- Main Sass file is `app/assets/sass/application.scss`.
- Routes live in `app/routes.js`.
- Prototype data defaults live in `app/data/session-data-defaults.js`.
- Public image references resolve from `/public/images/`.

## Components Already Imported

The shared layout imports these GOV.UK macros:

- `govukAccordion`
- `govukBackLink`
- `govukBreadcrumbs`
- `govukButton`
- `govukCharacterCount`
- `govukCheckboxes`
- `govukCookieBanner`
- `govukDateInput`
- `govukDetails`
- `govukErrorMessage`
- `govukErrorSummary`
- `govukExitThisPage`
- `govukFieldset`
- `govukFileUpload`
- `govukFooter`
- `govukHeader`
- `govukHint`
- `govukInput`
- `govukInsetText`
- `govukLabel`
- `govukNotificationBanner`
- `govukPagination`
- `govukPanel`
- `govukPasswordInput`
- `govukPhaseBanner`
- `govukRadios`
- `govukSelect`
- `govukServiceNavigation`
- `govukSkipLink`
- `govukSummaryList`
- `govukTable`
- `govukTabs`
- `govukTag`
- `govukTaskList`
- `govukTextarea`
- `govukWarningText`
- `dfeCard`
- `mojAlert`
- `mojBadge`
- `mojBanner`
- `mojButtonMenu`
- `mojDatePicker`
- `mojFilter`
- `mojHeader`
- `mojIdentityBar`
- `mojMessages`
- `mojMultiFileUpload`
- `mojNotificationBadge`
- `mojOrganisationSwitcher`
- `mojPageHeaderActions`
- `mojPagination`
- `mojPrimaryNavigation`
- `mojSearch`
- `mojSideNavigation`
- `mojSubNavigation`
- `mojTicketPanel`
- `mojTimeline`


Before hand-coding a component, check whether one of these macros can be used.

## Component Rules

### Page Layout

- Wrap normal page content in `govuk-width-container`.
- Use `govuk-main-wrapper` for standard page main content.
- Use `govuk-grid-row` and `govuk-grid-column-*` for two-thirds, one-third and full-width layouts.
- Keep one `main` landmark per page. If the shared layout provides `<main id="main-content">`, do not add another nested `<main>`.

### Header, Service Navigation and Footer

- Use the GOV.UK header and service navigation consistently from the shared layout.
- Keep the service name stable across the journey.
- Use the GOV.UK footer macro for footer links and metadata.
- Keep the phase banner visible while the service is in beta or prototype testing.

### Back Links

- Use `govukBackLink`.
- Prefer a real URL for the previous step where possible.
- Avoid `javascript:history.back()` for journeys where the previous page matters or where a user might land directly on a page.

### Buttons

- Use `govukButton`.
- Use primary buttons only for the main action.
- Use secondary buttons for lower-priority actions such as clearing filters.
- Avoid styling links to look like buttons unless they are a clear navigation action supported by the button component.

### Inputs

- Use `govukInput` for text input fields where possible.
- Every input must have a visible label or a clear visually hidden label.
- Add hint text through the component where it helps the user answer.
- Add autocomplete attributes where known and useful.
- Use error messages and an error summary when validating input.

### Radios

- Use `govukRadios` for single-choice questions.
- Make the legend the page heading on simple question pages:

```njk
{{ govukRadios({
  name: "example",
  fieldset: {
    legend: {
      text: "Question text",
      isPageHeading: true,
      classes: "govuk-fieldset__legend--l"
    }
  },
  items: [
    { value: "yes", text: "Yes" },
    { value: "no", text: "No" }
  ]
}) }}
```

### Checkboxes

- Use `govukCheckboxes` for multi-select filters and questions.
- Use small checkboxes only in dense filter panels.
- Give every checkbox group a meaningful fieldset legend. Use `govuk-visually-hidden` only when a nearby heading already gives the group a clear accessible name.

### Selects

- Use `govukSelect` for select fields.
- Do not use a select when there are only a few options and radios would be easier.
- Keep placeholder text clear, for example `Select distance`.

### Details

- Use `govukDetails` for secondary information the user may need, such as transcripts or supporting details.
- Do not hide information inside details if it is essential to complete the task.

### Inset Text

- Use `govukInsetText` for important contextual information.
- Do not use inset text for warnings. Use warning text or notification banner patterns where appropriate.

### Summary Cards and Summary Lists

- Use summary lists for key-value information such as course details.
- Use summary cards for grouped records or result cards when the card title is meaningful.
- Keep rows scannable. Long paragraphs inside summary list values can become hard to compare.

### Pagination

- Use `govukPagination` for result pages.
- Preserve search and filter parameters in pagination links when the prototype supports filtering.

## Patterns to Follow

- For step-by-step guided search pages, use one question per page.
- Use a real form submission for journey steps so answers persist in `data`.
- Include a check answers page before showing results if users need to review choices.
- Use clear page titles that match the primary question or task.
- Use error summary at the top of the page and inline error messages beside fields when validation is added.
- Use links that describe the destination. Avoid vague link text such as `click here`.
- Add `opens in a new tab` text for links that open new tabs.

## Sass and Styling Rules

- Start with GOV.UK classes and spacing utilities.
- Use custom Sass only for FCaT-specific layout, imagery or National Careers Service visual treatment that GOV.UK Frontend does not provide.
- Use GOV.UK colour variables and approved palette values.
- Keep focus states visible. Do not remove outlines.
- Avoid fixed heights unless needed for imagery. Prefer responsive sizing.
- Check custom components at mobile widths.
- If custom cards remain necessary, keep headings, links and clickable areas accessible.

## Accessibility Checklist

- One `h1` per page.
- Heading levels move in order.
- One `main` landmark per page.
- Skip link points to `#main-content`.
- Form controls have labels and matching `for` and `id` attributes.
- Button text describes the action.
- Images that are decorative use empty alt text.
- Informative images have useful alt text.
- Links opening new tabs say so in the link text.
- Hidden panels update `aria-expanded` and `hidden` together.
- Autocomplete widgets have keyboard support, clear focus handling and useful announcements.
- Colour is not the only way information is communicated.
- Content and controls work at 200% zoom and common mobile widths.

## Current Prototype Watch-outs

- `app/views/FCAT_Homepage.html` extends a homepage layout and also includes a nested `<main>`. Check that the final rendered page has only one main landmark.
- Several pages use `href: "javascript:history.back()"`. Use explicit previous-step URLs where possible.
- Some controls are hand-coded with GOV.UK classes, for example text inputs and buttons in search pages. Prefer macros for new work.
- Filter expand/collapse controls in `Search_results.html` borrow accordion classes but are custom buttons. If this becomes complex, consider using the GOV.UK accordion component or keep the custom behaviour thoroughly tested.
- Custom card classes such as `dfe-card`, `ncs-card-with-image` and `fcat-homepage__feature-card` should be checked for keyboard focus, heading order and mobile layout.
- The homepage uses hand-coded `details` markup. Prefer `govukDetails` for new details components.

## Pre-release Checklist

- Run the prototype locally with `npm run dev`.
- Open the main journeys:
  - `/FCAT_Homepage`
  - `/FindCoursesandTraining`
  - `/Quick_search`
  - `/Guided_Search/Guided_search_start`
  - `/Search_results`
- Check desktop and mobile layouts.
- Navigate the journey using only the keyboard.
- Confirm all form labels, legends and links make sense out of context.
- Confirm no page has duplicate `id` values.
- Confirm no page has more than one `main` landmark.
- Confirm external links that open in a new tab include `rel="noopener noreferrer"`.
- Confirm images load from `/public/images/` or an agreed trusted CDN.
- Confirm no secrets, API keys or private data are committed.

## Useful Official References

- GOV.UK Prototype Kit: https://prototype-kit.service.gov.uk/docs/
- GOV.UK Prototype Kit principles: https://prototype-kit.service.gov.uk/docs/principles
- Use components from the Design System: https://prototype-kit.service.gov.uk/docs/make-first-prototype/use-components
- GOV.UK Design System components: https://design-system.service.gov.uk/components
- GOV.UK Service Manual, making prototypes: https://www.gov.uk/service-manual/design/making-prototypes
