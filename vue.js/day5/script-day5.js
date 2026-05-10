/* 
# Today's Goals

[X] Part 1 - Introduce Run Types
    [X] Step 1 - Add type property to runs
    [X] Step 2 - Update starter data
    [X] Step 3 - Update add/edit form
    [X] Step 4 - Persist run types through localStorage
    [X] Step 5 - Render run type in UI

--- Pause Point 1 ---

[X] Part 2 - Introduce Computed Run Metrics
    [X] Step 1 - Create isPersonalRecord()
    [X] Step 2 - Create getFastestRunAtDistance()
    [X] Step 3 - Add “PR” indicator to cards
    [X] Step 4 - Add computed UI labels
    [X] Step 5 - Separate raw data vs derived data

[X] Part 3 - UI State Improvements
    [X] Step 1 - Show active filter label
    [X] Step 2 - Show active sort label
    [X] Step 3 - Create centralized render settings
    [X] Step 4 - Refactor render pipeline
    [X] Step 5 - Introduce “single source of truth” thinking

--- Pause Point 2 ---

[ ] Part 4 - Custom Notes System
    [ ] Step 1 - Add notes property to runs
    [ ] Step 2 - Add notes textarea to form
    [ ] Step 3 - Render notes in run cards
    [ ] Step 4 - Persist notes through localStorage
    [ ] Step 5 - Handle optional/empty notes cleanly

[ ] Part 5 - Form UX Improvements
    [ ] Step 1 - Add dynamic submit button text
    [ ] Step 2 - Add “Cancel Edit” button
    [ ] Step 3 - Clear edit state safely
    [ ] Step 4 - Prevent accidental duplicate edits
    [ ] Step 5 - Introduce UI state management concepts

--- Pause Point 3 ---

[ ] Part 6 - Rendering Architecture Refactor
    [ ] Step 1 - Extract buildRunCardHtml()
    [ ] Step 2 - Extract metrics rendering
    [ ] Step 3 - Separate data processing from rendering
    [ ] Step 4 - Introduce render pipeline thinking
    [ ] Step 5 - Prepare for component-based architecture

Today's Stretch Goals

[ ] Stretch Goal #1 - Collapsible Run Cards
[ ] Stretch Goal #2 - Search Runs by Title
[ ] Stretch Goal #3 - Multi-Filter Support
[ ] Stretch Goal #4 - Ascending / Descending Sort Toggle
[ ] Stretch Goal #5 - Export Runs as JSON
[ ] Stretch Goal #6 - Import Runs from JSON

Long-Term Goals

[X] Add Run Event type
    - Race
    - Training
	- Handled via Day 5, Part 1
[X] Add calculated "PR" indicators to Run Cards
    - Course PR (based on title?)
    - Race Length PR (based on distance)
	- Handled via Day 5, Part 2
[ ] Switch to modal window for Add/Edit runs
[ ] Automatically sort by date, but add ability to sort by other headers
    - Handled in Day 4, Part 4
[ ] Add SSO integration
    - Store run entries with username
[ ] Indicate Filtered List
    - If a filter is active, indicate in the UI
[ ] Indicate Sorted List
    - If a sort is active, indicate in the UI
[ ] Allow custom notes
    - Work with SSO integration
    - Allow user to add custom notes, storing in hash table
        - This would be stored with profile
        - Read on run load, rendering a new named field in the details view
        - Edit complications
*/
const runs = [];
const starterRuns = [
	{
		id: 'c162e6e5-6288-4444-b5da-c7ae562ca0f5',
		title: '5K for the Cure',
		type: 'race',
		date: new Date(2026, 4, 1),
		distance: 3.1,
		duration: 30
	},
	{
		id: '9e2fba33-3027-4a62-88ed-29158a641f87',
		title: 'Tim "Tool Man" Taylor\'s 10K',
		type: 'race',
		date: new Date(2026, 4, 2),
		distance: 6.2,
		duration: 60
	},
	{
		id: '235431db-3988-4c57-a3cf-b619dfe2db3c',
		title: 'Holly Flax\'s Half Marathon',
		type: 'race',
		date: new Date(2025, 5, 1),
		distance: 13.1,
		duration: 120
	},
	{
		id: '5a9c01d0-5b75-4226-a3b0-091a45e7d2f4',
		title: 'Danny Tanner\'s Full (House) Full Marathon',
		type: 'race',
		date: new Date(2026, 3, 3),
		distance: 26.2,
		duration: 240
	},
	{
		id: '5a9c01d0-5b75-4226-a3b0-091a45e7d2f4',
		title: 'Short Training Run',
		type: 'training',
		date: new Date(2026, 5, 3),
		distance: 5.25,
		duration: 120
	},
];

function addRun({ id, title, type, date, distance, duration } = {}) {
	// maybe add constructor for requests lacking an ID?
	console.log(`Adding run ${title}...`);
	if( id === '' ){
		const newRun = {
			id: crypto.randomUUID(),
			title: title,
			type: type,
			date: date,
			distance: distance,
			duration: duration
		};
		runs.push(newRun);
	}
	else{
		const targetRun = runs.find( run => run.id === id )
		targetRun.title = title
		targetRun.type = type
		targetRun.date = date
		targetRun.distance = distance
		targetRun.duration = duration
	}
	saveRuns();
}
function removeRunById(id) {
	console.log(`Removing run ${id}...`);
	const index = runs.findIndex(run => run.id === id)
	if (index !== -1) {
		runs.splice(index, 1);
	}
	saveRuns();
}
function saveRuns(){
	localStorage.setItem(
		'runs',
		JSON.stringify( runs )
	);
}
function saveSetting( { settingName, settingValue } = {} ){
	localStorage.setItem(
		settingName,
		settingValue
	);
}
function loadRuns(){
	const storedRuns = localStorage.getItem( 'runs' );
	if( storedRuns === null ){
		starterRuns.forEach(
			run =>{
				runs.push( run );
			}
		);
		saveRuns();
		return;
	}
	const parsedRuns = JSON.parse( storedRuns );
	runs.length = 0;
	parsedRuns.forEach(
		run => {
			runs.push({
				...run,
				date: new Date( run.date )
			})
		}
	);
}
function loadSetting({ control, settingName } = {}){
	const storedSettingValue = localStorage.getItem( settingName );
	if( storedSettingValue !== null ){
		renderSettings[settingName] = storedSettingValue;
		control.value = storedSettingValue;
	}
}
function addRandomRun() {
	//console.log('Building random run...');
	const today = new Date();
	const titleArray = [ 'Radically Random', 'Insanely Impromptu', 'Happily Haphazard', 'Seriously Spontaneous', 'Utterly Unscheduled' ]
	const typeArray = [ 'race', 'training' ];
	addRun({
		id: '',
		title: `${ titleArray[Math.floor(Math.random() * titleArray.length)] } Run`,
		type: typeArray[Math.floor(Math.random() * typeArray.length)],
		date: new Date( today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() ),
		distance: (Math.floor(Math.random() * 10) + 1),
		duration: (Math.floor(Math.random() * 60) + 15)
	})
}
function clearAllRuns(){
	runs.length = 0;
	saveRuns();
	renderApp();
}
function appInit(){
	loadRuns();
	renderApp();
}
function isPersonalRecord( run ){
	const fastestRun = getFastestRunAtDistance( run.distance );
	return fastestRun.id === run.id;
}
function getFastestRunAtDistance( distance ){
	const matchingRuns = runs.filter( run => run.distance === distance );
	if( matchingRuns.length <2 ){
		return false;
	}
	return matchingRuns.reduce(
		(prev, curr) => {
			return calculatePace( curr )
				< calculatePace( prev )
				? curr
				: prev;
		}
	);
}
function isPersonalRecordByProperty( thisRun, propertyName ){
	const matchingRuns = runs.filter( 
		run => run[propertyName] === (thisRun[propertyName])
	);
	if( matchingRuns.length <2 ){
		return false;
	}
	const fastestRun = matchingRuns.reduce(
		(prev, curr) => {
			return calculatePace( curr )
				< calculatePace( prev )
				? curr
				: prev;
		}
	);
	return thisRun.id === fastestRun.id ? true : false;
}
function getRunLabels( run ){
	if( run.distance >= 13.1 ){
		return 'Long Run';
	}
	if( run.type === 'race' ){
		return 'Race';
	}
	return 'Training';
}
function formatDate( date ) {
	return `
		${ date.getFullYear() }-${(date.getMonth() + 1)
		.toString()
		.padStart(2, '0')}-${date.getDate()
		.toString()
		.padStart(2, '0')}
	`;
}
function formatNumber( number ){
	return number.toFixed(2);
}
function getTotals() {
	//console.log('Calculating totals...');
	const result = {
		totalCount: runs.length,
		totalDistance: runs.reduce((sum, run) => { return sum + run.distance }, 0),
		totalDuration: runs.reduce((sum, run) => { return sum + run.duration }, 0)
	};
	return result;
}
function printRuns() {
	//console.log('Printing all runs...');
	runs.forEach(
		run => {
			console.log(`ID: ${run.id}, Title: ${ run.title }, Type: ${ run.type }, Date: ${ formatDate( run.date ) }, Distance: ${run.distance} mi, Duration: ${run.duration} minutes`);
		}
	);
}
function calculateAverageDistance() {
	//console.log('Calculating average distance...');
	const totals = getTotals()
	return (totals.totalDistance / totals.totalCount);
}
function getLongRuns() {
	//console.log('Calculating long runs...');
	return runs.filter(
		run => run.distance > 7
	);
}
function getLongestDurationRun() {
	//console.log('Calculating longest duration run...');
	return runs.reduce(
		(prev, curr) => {
			return (prev.duration > curr.duration) ? prev : curr;
		}
	);
}
function getShortestDurationRun() {
	//console.log('Calculating shortest duration run...');
	return runs.reduce(
		(prev, curr) => {
			return (curr.duration > prev.duration) ? prev : curr;
		}
	);
}
function getSlowestPaceRun() {
	//console.log('Calculating slowest pace run...');
	return runs.reduce(
		(prev, curr) => {
			return (calculatePace(prev) > calculatePace(curr)) ? prev : curr
		}
	);
}
function getFastestPaceRun() {
	//console.log('Calculating fastest pace run...');
	return runs.reduce(
		(prev, curr) => {
			return (calculatePace(curr) > calculatePace(prev)) ? prev : curr
		}
	);
}
function getRunById(id) {
	console.log(`Getting run ${id}...`);
	return runs.find(run => run.id === id);
}
function getRunsThisYear() {
	//console.log('Calculating runs this year...');
	return runs.filter(
		run => run.date.getFullYear() === (today.getFullYear())
	);
}
function getRunsThisMonth() {
	//console.log('Calculating runs this month...');
	return runs.filter(
		run => run.date.getFullYear() === (today.getFullYear())
			&& run.date.getMonth() === (today.getMonth())
	);
}
function calculatePace(run) {
	//console.log('Calculating pace...');
	return run.duration / run.distance;
}

const today = new Date();
const runListElement = document.querySelector('#run-list')
const totalsUiElement = document.querySelector('#totalsUi')
const addRunBtn = document.querySelector('#add-run-btn')
let count = 1;

addRunBtn.addEventListener('click', function () {
	//console.log(`add-run-btn clicked ${count++} times`)
	addRandomRun();
	renderApp();
}
);
function renderTotals() {
	//console.log('Rendering totals...');
	const totals = getTotals();
	let html = ''
	if (totals.totalCount > 0) {
		html = `
			<div class="run-card-aside">
				<h3>Totals</h3>
				<p>
					Total races: ${totals.totalCount}<br />
					Total distance: ${ formatNumber( totals.totalDistance ) }<br />
					Total duration: ${ formatNumber( totals.totalDuration ) }<br />
				</p>
			</div>
			<div class="run-card-aside">
				<h3>Metrics</h3>
				<p>
					Fastest Pace: ${getFastestPaceRun().title}<br />
					Slowest Pace: ${getSlowestPaceRun().title}<br />
					Longest Duration: ${getLongestDurationRun().title}<br />
					Shortest Duration: ${getShortestDurationRun().title}<br />
				</p>
			</div>
		`
	}
	else {
		html = 'No records are available'
	}
	totalsUiElement.innerHTML = html;
}
function compareRuns(a, b, property) {
	if (property === 'title') {
		return a.title.localeCompare(b.title);
	}
	return a[property] - b[property];
}
function renderRuns( { sortProperty = 'date', filterProperty = 'All' } = {} ) {
	//console.log('Rendering runs...');
	let html = '';
	const filteredRuns = getFilteredRuns( filterProperty );
	const sortedRuns = filteredRuns.toSorted(
		(a, b) => compareRuns(a, b, sortProperty)
	);
	if( sortedRuns.length < 1 ){
		html = `
			<div class="run-card">
				No runs match this filter.
			</div>
		`;
	}
	else{
		sortedRuns.forEach(
			run => {
				html += `
					<div class="run-card">
						<div class="run-card-aside">
							<h3>${ run.title }</h3>
							<p>
								Date: ${ formatDate( run.date ) }<br />
								Type: ${ run.type }<br />
								Duration: ${ formatNumber( run.duration ) } min<br />
								Distance: ${ formatNumber( run.distance ) } mi<br />
								Average Pace: ${ formatNumber( calculatePace( run ) ) } min per mi<br />
							</p>
							<p>
								${ isPersonalRecordByProperty( run, 'title' ) ? '<strong> [Course PR] </strong><br />' : '' }
								${ isPersonalRecordByProperty( run, 'distance' ) ? '<strong> [Distance PR] </strong>' : '' }
								${ isPersonalRecordByProperty( run, 'pace' ) ? '<strong> [Pace PR] </strong>' : '' }
							<p>
						</div>
						<div class="run-card-aside small">
							<button class="deleteRunButton" data-id="${ run.id }">
								Delete
							</button>
							<br />
							<button class="editRunButton" data-id="${ run.id }">
								Edit
							</button>
						</div>
					</div>
				`
			}
		);
	}
	runListElement.innerHTML = html;
	const deleteButtons = document.querySelectorAll('.deleteRunButton')
	deleteButtons.forEach(
		button => {
			button.addEventListener(
				'click', function () {
					const id = button.dataset.id;
					const targetRun = getRunById( id );
					if( !(confirm( `Are you sure you want to delete ${ targetRun.title } ?`) )){
						return;
					}
					removeRunById(id);
					renderApp();
				}
			)
		}
	);
	const editButtons = document.querySelectorAll('.editRunButton')
	editButtons.forEach(
		button => {
			button.addEventListener(
				'click', function(){
					const id = button.dataset.id;
					// populate form with info from run, then edit vs. recreating
					const form = document.forms['add-run-form'];
					const targetRun = runs.find( run => run.id === id )
					form['id'].value = targetRun.id;
					form['title'].value = targetRun.title;
					form['type'].value = targetRun.type;
					form['date'].valueAsDate = new Date( targetRun.date );
					form['distance'].value = targetRun.distance;
					form['duration'].value = targetRun.duration;
				}
			)
		}
	);
}
function validateField(input, value, type) {
	let isValid = true;
	switch (type) {
		case 'number':
			isValid = value >= 1;
			break;
		case 'text':
			isValid = value.trim() !== '';
			break;
		case 'date':
			isValid = value.trim() !== '';
			break;
	}
	isValid
		? input.classList.remove('invalid')
		: input.classList.add('invalid')
	return isValid;
}
function renderApp() {
	loadSetting({
		control: filterRunsSelect,
		settingName: 'filterProperty'
	});
	loadSetting({
		control: sortRunsSelect,
		settingName: 'sortProperty'
	});
	//renderRuns({ filterProperty: filterRunsSelect.value, sortProperty: sortRunsSelect.value });
	renderRuns( renderSettings );
	renderTotals();
}
function getFilteredRuns( filterValue ) {
	switch(filterValue) {
		case 'long':
			return getLongRuns();
		case 'thisYear':
			return getRunsThisYear();
		case 'thisMonth':
			return getRunsThisMonth();
		default:
			return runs;
	}
}

const addRunForm = document.querySelector('#add-run-form')
addRunForm.addEventListener(
	'submit',
	function (event) {
		console.log('Form submitted');
		event.preventDefault();
		const form = event.target;
		let formIsValid = true;
		Array.from( form.elements ).forEach(
			element => {
				if( element.tagName !== 'INPUT' || element.name === 'id' ){ return; }
				const isValid = validateField(element, element.value, element.type);
				if (!isValid) {
					formIsValid = false;
				}
			}
		);
		if (!formIsValid) {
			alert('Error in fields');
			return;
		}
		const formData = new FormData(form);
		const values = Object.fromEntries(formData.entries());
		const date = new Date( values.date );
		addRun({
			id: values.id,
			title: values.title,
			type: values.type,
			date: new Date( date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() ),
			distance: parseFloat(values.distance),
			duration: parseFloat(values.duration)
		});
		form.reset();
		renderApp();
	}
);

const renderSettings = {
	filterProperty: 'all',
	sortProperty: 'date'
}

const filterRunsSelect = document.querySelector('#filter-runs');
const sortRunsSelect = document.querySelector('#sort-runs');
const applyRenderOptionsButton = document.querySelector('#apply-render-options');
applyRenderOptionsButton.addEventListener(
	'click',
	function(){
		renderSettings.filterProperty = filterRunsSelect.value
		renderSettings.sortProperty = sortRunsSelect.value
		renderRuns( renderSettings );
		saveSetting({ 
			settingName: 'filterProperty',
			settingValue: filterRunsSelect.value 
		});
		saveSetting({
			settingName: 'sortProperty',
			settingValue: sortRunsSelect.value
		});
	}
);

const clearAllRunsButton = document.querySelector( '#clear-all-runs' );
clearAllRunsButton.addEventListener(
	'click',
	function(){
		if( confirm( 'Clear all runs?' ) ){
			clearAllRuns();
		}
		else{
			return;
		}
	}
);

appInit();
