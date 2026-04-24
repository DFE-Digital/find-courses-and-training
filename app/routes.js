//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

// Helper: if the user came from Check your answers via a Change link, send them
// back there after saving; otherwise continue to the next step in the journey.
const redirectOrReturn = (req, res, normalPath) => {
  res.redirect(req.query.returnTo === 'check-answers' ? '/Guided_Search/Check_your_answers' : normalPath)
}

// Clear all session data when returning to the homepage or find courses landing page.
const clearSession = (req, res, next) => {
  req.session.data = {}
  next()
}

router.get('/FCAT_Homepage', clearSession)
router.get('/FindCoursesandTraining', clearSession)

// Receives the Search button from Check your answers.
// Sets a flag so the results page knows to open filters by default, then redirects to the GET handler.
router.post('/Search_results', function (req, res) {
  req.session.data['fromGuidedSearch'] = true
  res.redirect('/Search_results')
})

// Renders the search results page.
// Maps session data from the guided search journey into the filter values the
// template expects (e.g. expands 'Level 1 or 2' into two separate filter options,
// normalises sector label differences). Also reads and clears the fromGuidedSearch
// flag so filters only open automatically on the first load from the guided journey.
router.get('/Search_results', function (req, res) {
  const d = req.session.data
  const toArray = v => [].concat(v || []).filter(Boolean)

  // Normalise sector values to match the labels used in the results filter
  const sectors = toArray(d['sector']).map(s => {
    if (s.includes('Agriculture')) return 'Agriculture, environmental and animal care'
    if (s.includes('Legal')) return 'Legal, finance and accounting'
    if (s.includes('Sales')) return 'Sales, marketing and procurement'
    return s
  })

  // Expand each guided search qualification choice into the individual filter
  // options that appear on the results page
  const qualifications = []
  toArray(d['qualification']).forEach(q => {
    if (q.includes('skills and experience')) qualifications.push('Gain skills and experience (without a qualification)')
    if (q.includes('Entry level')) qualifications.push('Entry level (like entry level functional skills)')
    if (q.includes('Level 1 or 2')) { qualifications.push('Level 1 (like first certificate)'); qualifications.push('Level 2 (like GCSEs)') }
    if (q.includes('Level 3')) qualifications.push('Level 3 (like A levels)')
    if (q.includes('Level 4 to 8')) {
      qualifications.push('Level 4 (like higher national certificate)')
      qualifications.push('Level 5 (like diplomas)')
      qualifications.push('Level 6 (like degrees)')
      qualifications.push('Level 7 (like masters degree)')
      qualifications.push('Level 8 (like a PhD)')
    }
  })

  // Map the numeric distance value stored in session to the label shown in the filter dropdown
  const distanceMap = { '2': 'Up to 2 miles', '5': 'Up to 5 miles', '10': 'Up to 10 miles', '15': 'Up to 15 miles', '30': 'Up to 30 miles', 'anywhere': 'Search anywhere in England' }

  const fromGuidedSearch = !!d['fromGuidedSearch']
  delete req.session.data['fromGuidedSearch']

  res.render('Search_results', {
    distanceFilter: distanceMap[d['distance']] || '',
    sectors,
    qualifications,
    age: d['age'] || '',
    appsOrSBC: d['apps-or-sbc'] || '',
    fromGuidedSearch
  })
})

// Saves the user's location and moves to the Distance step (or back to Check your answers).
router.post('/Guided_Search/Location', function (req, res) {
  req.session.data['location'] = req.body['location'] || ''
  redirectOrReturn(req, res, '/Guided_Search/Distance')
})

// Saves the user's travel distance and moves to the Interests step (or back to Check your answers).
router.post('/Guided_Search/Distance', function (req, res) {
  req.session.data['distance'] = req.body['distance'] || ''
  redirectOrReturn(req, res, '/Guided_Search/Interests')
})

// Saves up to three search interest keywords and moves to the Qualification Level step
// (or back to Check your answers).
router.post('/Guided_Search/Interests', function (req, res) {
  req.session.data['interest1'] = req.body['interest1'] || ''
  req.session.data['interest2'] = req.body['interest2'] || ''
  req.session.data['interest3'] = req.body['interest3'] || ''
  redirectOrReturn(req, res, '/Guided_Search/Qualification_Level')
})

// Builds and renders the Check your answers summary list from session data.
router.get('/Guided_Search/Check_your_answers', function (req, res) {
  const d = req.session.data
  const toArray = v => [].concat(v || []).filter(Boolean)
  const change = (href, label) => ({ items: [{ href: href + '?returnTo=check-answers', text: 'Change', visuallyHiddenText: label }] })

  const rows = [
    { key: { text: 'Location' }, value: { text: d['location'] || 'Not answered' }, actions: change('/Guided_Search/Location', 'location') },
    { key: { text: 'Travel distance' }, value: { text: d['distance'] || 'Not answered' }, actions: change('/Guided_Search/Distance', 'travel distance') },
    { key: { text: 'Search terms' }, value: { text: [d['interest1'], d['interest2'], d['interest3']].filter(Boolean).join(', ') || 'Not answered' }, actions: change('/Guided_Search/Interests', 'search terms') },
    { key: { text: 'Qualification level' }, value: { text: toArray(d['qualification']).join(', ') || 'Not answered' }, actions: change('/Guided_Search/Qualification_Level', 'qualification level') },
    { key: { text: 'Age' }, value: { text: d['age'] || 'Not answered' }, actions: change('/Guided_Search/Age', 'age') }
  ]

  res.render('Guided_Search/Check_your_answers', { summaryRows: rows })
})

// Saves the selected sectors and moves to the Age step (or back to Check your answers).
router.post('/Guided_Search/Sectors', function (req, res) {
  req.session.data['sector'] = req.body['sector'] || []
  redirectOrReturn(req, res, '/Guided_Search/Age')
})

// Saves the user's age and moves to Check your answers (or back to it if returning via Change).
router.post('/Guided_Search/Age', function (req, res) {
  req.session.data['age'] = req.body['age'] || ''
  redirectOrReturn(req, res, '/Guided_Search/Check_your_answers')
})

// Saves the user's apprenticeship/Skills Bootcamp preference.
// If returning from Check your answers, always goes back there.
// Otherwise: 'Yes or not sure' goes to Sectors; 'No' skips Sectors and goes to Age.
router.post('/Guided_Search/Apps_or_SBC', function (req, res) {
  req.session.data['apps-or-sbc'] = req.body['apps-or-sbc']
  const answer = req.session.data['apps-or-sbc']
  if (req.query.returnTo === 'check-answers') {
    res.redirect('/Guided_Search/Check_your_answers')
  } else {
    res.redirect(answer === 'Yes or not sure' ? '/Guided_Search/Sectors' : '/Guided_Search/Age')
  }
})

// Saves the selected qualification levels and always moves to Age.
router.post('/Guided_Search/Qualification_Level', function (req, res) {
  req.session.data['qualification'] = req.body['qualification'] || []
  redirectOrReturn(req, res, '/Guided_Search/Age')
})
